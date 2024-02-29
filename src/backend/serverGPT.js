require("dotenv").config();
const OpenAI = require("openai");
const fsPromises = require("fs").promises;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const WebSocket = require('ws'); // importing web socket as ws
const path = require('path');

const app = express();
const port = 3001;
const port2 = 3002;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Setting up the WebSocket Server:
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const fileUpload = require('express-fileupload');
app.use(fileUpload()); // Middleware


// #########################################################################################################
// <<<< FILE UPLOAD END-POINT (SAVES TO '../uploads/' DIRECTORY) >>>>
// #########################################################################################################
app.post('/upload-file', (req, res) => {
  if (req.files === null) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, '..','uploads',file.name); // saving to "../uploads/"" dir

  file.mv(uploadPath, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// #########################################################################################################
// <<<< RECEIVES SELECTED COURSE CODE BY USER >>>>
// #########################################################################################################
let selectedCourseCode = ''; // stores user selected course code

app.post('/selected-course', (req, res) => {
  console.log('Received: ', req.body);
  if (req === null) {
    return res.status(400).send('No message received.');
  }
  selectedCourseCode = req.body.selectedCourseCodeTemp;
    console.log(`You are inquiring about course code: ${selectedCourseCode}. Processing your request..`);
    res.send(`Received course code: ${selectedCourseCode}`)
  });

  // #########################################################################################################
  // <<<< RECEIVES USER ID >>>>
  // #########################################################################################################
  let theUserID = ''; // stores user selected course code

  app.post('/user-id', (req, res) => {
    console.log('Received: ', req.body);
    if (req === null) {
      return res.status(400).send('No message received.');
    }
    theUserID = req.body.userID;
      console.log(`Received user ID: ${theUserID}. Processing your request..`);
      res.send(`Received user ID: ${theUserID}`)
    });

// #########################################################################################################
// <<<< MAIN WEB-SOCKET LOGIC TO ASK ASSISTANT/UPLOAD FILES TO ASSISTANT >>>>
// #########################################################################################################

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    console.log('received: %s', message);
    const { action, userQuestion, userFile } = JSON.parse(message); // Parse the message as JSON
    try {
        let assistantId;
        let assistantDetails;
        const assistantFilePath = `../assistants/assistant-${selectedCourseCode}-${theUserID}}.json`;

    try { // Check if the assistant.json file exists
      const assistantData = await fsPromises.readFile(
        assistantFilePath,
        "utf8"
      );
      assistantDetails = JSON.parse(assistantData);
      assistantId = assistantDetails.assistantId;
      console.log("\nExisting assistant detected.\n");
      ws.send(JSON.stringify({ message: "LiveTA is processing your request..\n" }));

    } catch (error) {
      // If file does not exist or there is an error in reading it, create a new assistant
      console.log("No existing assistant detected, creating new.\n");
      //ws.send(JSON.stringify({ message: "No existing assistant detected, creating new.\n" }));
      const assistantConfig = {
        name: `${selectedCourseCode}-LiveTA`,
        instructions:
          "You're an AI teacher assistant, helping university professors and students with their needs.",
        tools: [{ type: "retrieval" }], // configure the retrieval tool to retrieve files in the future
        model: "gpt-4-1106-preview",
      };
      const assistant = await openai.beta.assistants.create(assistantConfig);
      assistantDetails = { assistantId: assistant.id, ...assistantConfig };
      
      await fsPromises.writeFile( // Save the assistant details to assistant.json
        assistantFilePath,
        JSON.stringify(assistantDetails, null, 2)
      );
      assistantId = assistantDetails.assistantId;
    }
    //console.log(`Hello there, I'm your personal assistant. You gave me these instructions:\n${assistantDetails.instructions}\n`);
    //ws.send(JSON.stringify({ message: `Hello there, I'm your personal assistant. You gave me these instructions:\n${assistantDetails.instructions}\n` }));

    const thread = await openai.beta.threads.create(); // Create a thread using the assistantId

    // ############################# USER INPUT PROCESSING #############################
    if (action === "2" && userFile) { 
    const fileName = userFile;
    const file = await openai.files.create({ // upload the file to the assistant
        file: fs.createReadStream(`../uploads/${fileName}`),
        purpose: "assistants",
    });

    let existingFileIds = assistantDetails.file_ids || []; // get all file IDs in assistant

    await openai.beta.assistants.update(assistantId, { // Add new file ID to assistant
        file_ids: [...existingFileIds, file.id],
    });

    assistantDetails.file_ids = [...existingFileIds, file.id]; // update local assistantDetails variable
    await fsPromises.writeFile( // save assistantDetails to backend/assistant.json
        assistantFilePath,
        JSON.stringify(assistantDetails, null, 2)
    );

    console.log("File uploaded and successfully added to the assistant database.\n");
    ws.send(JSON.stringify({ message: "File uploaded and successfully added to the assistant database.\n" }));
    }

    // <<<<< CHAT WITH ASSISTANT ACTION >>>>>
    if (action === "1" && userQuestion) {
        await openai.beta.threads.messages.create(thread.id, { // Pass question to existing thread
        role: "user",
        content: userQuestion,
        });

        const run = await openai.beta.threads.runs.create(thread.id, { // running the assistant thread
        assistant_id: assistantId,
        });

        let runStatus = await openai.beta.threads.runs.retrieve( // get run status when in progress
        thread.id,
        run.id
        );

        while (runStatus.status !== "completed") { // checking if runStatus is completed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        if (["failed", "cancelled", "expired"].includes(runStatus.status)) { // checks for errors in runStatus
            console.log(
            `Run status is '${runStatus.status}'. Unable to complete the request.`
            );
            break; // Exit the loop if the status indicates a failure or cancellation
        }
        }

        const messages = await openai.beta.threads.messages.list(thread.id); // fetch recent assistant msg.
        const lastMessageForRun = messages.data // fetch last msg for current thread
        .filter(
            (message) =>
            message.run_id === run.id && message.role === "assistant"
        )
        .pop();

        if (lastMessageForRun) { // if its an assistant msg, then log it
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
        ws.send(JSON.stringify({ message: `${lastMessageForRun.content[0].text.value}\n` }));
        } else if (
        !["failed", "cancelled", "expired"].includes(runStatus.status)
        ) {
        console.log("No response received from the assistant."); // o/w log this
        ws.send(JSON.stringify({ message: "No response received from the assistant." }));
        }
    }
        readline.close(); // close the readline

    } catch (error) {
            console.error(error);
        }

  });

  // You can also handle other events like 'close'
});

// #########################################################################################################
// #########################################################################################################

app.listen(port2, () => { // listening on port 2
  console.log(`REST server running on port ${port2}`);
});

// Listen on the HTTP server, not the Express app
server.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});

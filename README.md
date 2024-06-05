# EduGPT-Assist: AI-Powered Educational Platform
EduGPT is an innovative educational platform enhanced with ChatGPT Assistants, designed to revolutionize learning experiences. At its core, a Python Flask backend manages the MongoDB database, handling all educational platform operations, while a separate JavaScript backend interacts with the OpenAI API to manage the ChatGPT Assistants.

## How to Run the Application Locally ##
To set up and run SmartLearnAI on your local machine, follow these steps:

**1) Install Node.js:** Ensure Node.js is installed on your system. If not, download and install it from Node.js official website.

**2) Set up the project:**
- Create a new npm project in a directory of your choice.
- Clone this GitHub repository.
- Replace the "src" directory of your new npm project with the "src" directory from this repository.
  
**3) Install dependencies:** Navigate to the root directory of the project and run npm install to install all required dependencies.
  
**4) Start the application:**
- Launch the application with npm start.
- This command will start the JavaScript backend. Ensure the server starts without errors.

**5) Configure environment variables:**
- Navigate to src/backend and create a .env file if it doesn't exist.
- Add your OpenAI API key to the .env file with the format OPENAI_API_KEY=YOUR_API_KEY_HERE.
  
**6) Run backend servers:**
- Execute python flaskServer.py to start the Flask server.
- Ensure both Flask and Node.js servers are running simultaneously.
  
**7) Access the platform:**
- Register an account on the platform as either a student or a teacher by following the registration instructions on the welcome page.
- Once registered, log in to explore the educational platform and utilize its features.

For any issues during installation or running the servers, please refer to the troubleshooting section or open an issue on this repository.

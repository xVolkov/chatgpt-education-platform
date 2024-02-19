from bson import json_util
from flask import Flask, request, jsonify, send_file
from flask.cli import load_dotenv
from flask_cors import CORS
import hashlib
import uuid
from openai import OpenAI
import openai
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.binary import Binary
from werkzeug.utils import secure_filename
import os
import io
# File Processing
import magic
from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import pytesseract
from openai import OpenAI

app = Flask(__name__)
CORS(app)

OpenAI_KEY = OpenAI(api_key="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")

mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['capstone']
users_collection = db['users']
courses_collection = db['courses']
files_collection = db['files']
chats_collection = db['chats']
chat_sessions_collection = db['chatsessions']

def hash_password(password):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt

def verify_password(stored_password, provided_password):
    password, salt = stored_password.split(':')
    return password == hashlib.sha256(salt.encode() + provided_password.encode()).hexdigest()

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    doc = Document(file)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])

def extract_text_from_image(file):
    image = Image.open(file)
    return pytesseract.image_to_string(image)

# OpenAI GPT Assistant Section
def create_assistant():
    client = OpenAI()
    my_assistant = client.beta.assistants.create(
        instructions="You're an AI teacher assistant, helping university professors and university students with their needs.",
        name="AI Teacher Assistant",
        tools=[{"type": "retrieval"}],
        model="gpt-4-1106-preview",
    )
    print(my_assistant)
    
def create_assistant_file():
    client = OpenAI()
    
    # Opening a file
    fileName = input("Type the file name")
    file = client.files.create(
        file=open(f"../uploads/{fileName}", "rb"),
        purpose="assistants"
    )
    
    assistant_file = client.beta.assistants.files.create(
        file = file,
        assistant_id="liveTA",
        file_id="file-abc123"
    )
    print(assistant_file)
    
def list_assistants():
    client = OpenAI()
    my_assistants = client.beta.assistants.list(
        order="desc",
        limit="20",
    )
    print(my_assistants.data)

@app.route('/register', methods=['POST'])
def register_user():
    user_data = request.json
    try:
        if users_collection.find_one({"email": user_data['email']}):
            return jsonify({"message": "User already exists"}), 409
        user_data['password'] = hash_password(user_data['password'])
        user_data['userID'] = str(uuid.uuid4())
        user_data['_id'] = str(ObjectId())
        users_collection.insert_one(user_data)
        return jsonify({"message": "Registered successfully"}), 201
    except:
        print("Error in registering a user")

@app.route('/user/<userID>', methods=['GET'])
def get_user(userID):
    user = users_collection.find_one({"userID": userID})
    if user:
        # You might want to exclude sensitive data from the response
        return jsonify({"firstName": user["firstName"]}), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Student Login endpoint
@app.route('/login-student', methods=['POST'])
def login_student():
    user_data = request.json
    user = users_collection.find_one({"email": user_data['email']})

    if not user or user.get('userType') != 'Student':
        return jsonify({"message": "User not found or access denied"}), 404

    if verify_password(user['password'], user_data['password']):
        print(str(user['userID']))
        return jsonify({"message": "Login successful", "userID": str(user['userID'])}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Teacher Login endpoint
@app.route('/login-teacher', methods=['POST'])
def login_teacher():
    user_data = request.json
    user = users_collection.find_one({"email": user_data['email']})

    if not user or user.get('userType') != 'Teacher':
        return jsonify({"message": "User not found or access denied"}), 404

    if verify_password(user['password'], user_data['password']):
        print(str(user['userID']))
        return jsonify({"message": "Login successful", "userID": str(user['userID'])}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/add-course', methods=['POST'])
def add_course():
    course_data = request.json
    course_data['_id'] = str(ObjectId())
    course_data['courseID'] = str(uuid.uuid4())
    try:
        courses_collection.insert_one(course_data)
        return jsonify({"message": "Course added successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Error adding course: " + str(e)}), 500


@app.route('/get-course-codes', methods=['GET'])
def get_course_codes():
    teacher_id = request.args.get('teacherID')
    if not teacher_id:
        return jsonify({"message": "Teacher ID not provided"}), 400
    courses = courses_collection.find({"teacherID": teacher_id}, {"courseCode": 1})
    course_codes = [course['courseCode'] for course in courses]
    return jsonify({"courseCodes": course_codes}), 200

@app.route('/get-course-details', methods=['GET'])
def get_course_details():
    course_code = request.args.get('code')
    course = courses_collection.find_one({"courseCode": course_code})
    if course:
        course['_id'] = str(course['_id'])  # Convert ObjectId to string
        return jsonify(course), 200
    else:
        return jsonify({"message": "Course not found"}), 404

@app.route('/update-course', methods=['POST'])
def update_course():
    updated_course_data = request.json
    course_code = updated_course_data['courseCode']
    try:
        courses_collection.update_one({"courseCode": course_code}, {"$set": updated_course_data['courseDetails']})
        return jsonify({"message": "Course updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error updating course: " + str(e)}), 500

@app.route('/courses', methods=['GET'])
def get_courses():
    courses = list(courses_collection.find({}))
    for course in courses:
        course['_id'] = str(course['_id'])
    return jsonify(courses), 200

@app.route('/upload-file', methods=['POST'])
def upload_files():
    try:
        course_code = request.form['courseCode']
        user_id = request.form['userID']
        file_type = request.form['fileType']
        file_extension = request.form['fileExtension']
        file_name = request.form['fileName']

        file = request.files['file'] # one file at a time
        
        # Save the file
        file_id = str(uuid.uuid4()) # Generate a new course ID or find the correct one based on your logic
        save_file(file, file_id, course_code, user_id, file_type, file_extension, file_name)
        
        return jsonify({'message': 'File uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# New function to save files
def save_file(file, file_id, course_code, user_id, file_type, file_extension, file_name):
    # Convert file to binary
    file_binary = Binary(file.read())
    
    # Insert file metadata along with the binary content into the database
    file_metadata = {
        'fileID': file_id,
        'courseCode': course_code,
        'teacherID': user_id,
        'fileType': file_type,
        'fileExtension': file_extension,
        'fileName': file_name,
        'fileContent': file_binary
    }
    files_collection.insert_one(file_metadata)
    
@app.route('/get-course-files', methods=['GET'])
def get_course_files():
    course_code = request.args.get('courseCode')
    files = list(files_collection.find({"courseCode": course_code}))
    # Convert ObjectId to string for each file
    for file in files:
        file['_id'] = str(file['_id'])
    # Serialize the list of files to JSON using json_util
    files_json = json_util.dumps(files)
    return files_json, 200, {'Content-Type': 'application/json'}

@app.route('/delete-file', methods=['POST'])
def delete_file():
    file_id = request.json['fileID']
    files_collection.delete_one({"_id": ObjectId(file_id)})
    return jsonify({"message": "File deleted successfully"}), 200

@app.route('/download-file', methods=['GET'])
def download_file():
    file_id = request.args.get('fileID')
    file = files_collection.find_one({"_id": ObjectId(file_id)})
    if file:
        # Extract file metadata
        file_name = file['fileName']
        file_content = file['fileContent']
        
        # Create a BytesIO object with the file content
        file_stream = io.BytesIO(file_content)
        
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=file_name
        )
    return jsonify({"message": "File not found"}), 404

@app.route('/chat-with-bot', methods=['POST'])
def chat_with_bot():
    data = request.json
    print(data)
    user_message = data['input']
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role":"user",
                    "content":user_message
                }
            ],
            model = "gpt-3.5-turbo"
        )
        print('DEBUG')
        bot_response = response.choices[0].message.content
        print(bot_response)
        return jsonify({'response': bot_response})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/chatbot-upload', methods=['POST'])
def handle_file_upload():
    file = request.files['file']
    file_type = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)  # Reset file pointer to the beginning

    if 'pdf' in file_type:
        text = extract_text_from_pdf(file)
    elif 'wordprocessingml.document' in file_type:
        text = extract_text_from_docx(file)
    elif 'image' in file_type:
        text = extract_text_from_image(file)
    elif 'text/plain' in file_type:
        text = file.read().decode('utf-8')  # Assuming UTF-8 encoding for text files
    else:
        # Handle other file types or throw an error
        return jsonify({'error': 'Unsupported file type'}), 400

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": text}
            ],
            model="gpt-3.5-turbo"
        )
        bot_response = response.choices[0].message.content
        return jsonify({'response': bot_response})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_chats', methods=['GET'])
def fetch_chats():
    chats = list(chats_collection.find({}, {'_id': 0}))  # Exclude the MongoDB default _id field
    return json_util.dumps({'chats': chats}), 200

if __name__ == '__main__':
    app.run(debug=True)
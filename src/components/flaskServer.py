from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import hashlib
import os
import uuid

app = Flask(__name__)
CORS(app)

users_filename = 'users.json'

# Load users from the JSON file or create an empty list if the file doesn't exist or is empty
if os.path.exists(users_filename) and os.path.getsize(users_filename) > 0:
    with open(users_filename, 'r') as f:
        users = json.load(f)
else:
    users = []

# Simple function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Function to check credentials for teacher logins
def check_credentials_teacher(email, password):
    with open(users_filename, "r") as file:
        users = json.load(file)
        hashed_password = hash_password(password)
        for user in users:
            if user["email"] == email and user["password"] == hashed_password and user["userType"] == "Teacher":
                return True
    return False

# Function to check credentials for student logins
def check_credentials_student(email, password):
    with open(users_filename, "r") as file:
        users = json.load(file)
        hashed_password = hash_password(password)
        for user in users:
            if user["email"] == email and user["password"] == hashed_password and user["userType"] == "Student":
                return True
    return False

# Account registration function to handle both Teacher and Student user registrations
@app.route('/register', methods=['POST'])
def register_user():
    # Extract JSON data from the request
    data = request.json

    # Extract user details
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    university = data.get('university')
    email = data.get('email')
    password = data.get('password')
    userType = data.get('userType')
    userID = str(uuid.uuid4()) # generating a unique user id

    # Validate and process data:
    # Check if the user with the same email already exists
    for user in users:
        if user["email"] == email:
            return jsonify({"message": "User with provided email already exists!"}), 400
        
    hashed_password = hash_password(password) # hash the password so it is not stored in clear text

    # Save the new user
    new_user = {
        'firstName': first_name,
        'lastName': last_name,
        'university': university,
        'email': email,
        'password': hashed_password,
        'userType': userType,
        'userID': userID,
    }
    # print(new_user) # <<<DEBUG>>> prints the new user data about to be saved to users.json
    try:
        users.append(new_user)
         # Write the updated users list back to the file
        with open(users_filename, 'w') as f:
            json.dump(users, f, indent=4)
        return jsonify({"message": "User registered successfully"}), 201
    except:
        print(f"could not append user data to .json file")

# Account login function to handle both Teacher and Student logins
@app.route('/login-teacher', methods=['POST'])
def login_teacher():
    data = request.json
    if check_credentials_teacher(data['email'], data['password']):
        if data['userType'] == "Teacher":
            print(data)
            return jsonify({'success': True})
    else:
        return jsonify({"message": "Incorrect email/password!"}), 400
        #return jsonify({'success': False}), 401
    
# Account login function to handle both Teacher and Student logins
@app.route('/login-student', methods=['POST'])
def login_student():
    data = request.json
    if check_credentials_student(data['email'], data['password']):
        if data['userType'] == "Student":
            print(data)
            return jsonify({'success': True})
    else:
        return jsonify({"message": "Incorrect email/password!"}), 400
        #return jsonify({'success': False}), 401

if __name__ == '__main__':
    app.run(debug=True)
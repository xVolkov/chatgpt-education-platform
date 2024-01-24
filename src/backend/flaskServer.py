from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import uuid
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['capstone']
users_collection = db['users']
courses_collection = db['courses']

def hash_password(password):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt

def verify_password(stored_password, provided_password):
    password, salt = stored_password.split(':')
    return password == hashlib.sha256(salt.encode() + provided_password.encode()).hexdigest()

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
    #courses = courses_collection.find({}, {"courseCode": 1})
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

if __name__ == '__main__':
    app.run(debug=True)

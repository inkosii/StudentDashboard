from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
from datetime import datetime, timedelta
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Add CORS support

# Predefined student data
students = {
    '12345678': 'Emily Sky',
    '987654321': 'Blake Well',
    '000000129': 'Timothy Samwell',
    '111111123': 'Jacob Blanks',
    '22222234': 'Amanda Fruitville',
    '33333345': 'Owen Bliss'
}

# Store passwords with expiration times
passwords = {}

# Helper function to generate a random password
def generate_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

@app.route('/generate-password')
def generate_password_route():
    student_number = request.args.get('studentNumber')
    if not student_number or student_number not in students:
        return jsonify({'success': False, 'message': 'Valid student number is required.'})
    
    # Generate a password and store it with an expiration time
    password = generate_password()
    expiration_time = datetime.now() + timedelta(minutes=2)
    passwords[student_number] = {'password': password, 'expires': expiration_time}
    
    return jsonify({'success': True, 'password': password})

@app.route('/verify-password', methods=['POST'])
def verify_password():
    data = request.json
    student_number = data.get('studentNumber')
    password = data.get('password')
    
    if not student_number or not password:
        return jsonify({'success': False, 'message': 'Student number and password are required.'})
    
    # Check if password is valid and not expired
    record = passwords.get(student_number)
    if record and record['password'] == password and datetime.now() < record['expires']:
        # Password is valid
        # Save attendance to an Excel file
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        attendance_data = {
            'Student Number': student_number,
            'Name': students[student_number],
            'Timestamp': now
        }
        df = pd.DataFrame([attendance_data])
        
        # Check if the attendance.xlsx file exists
        file_exists = os.path.exists('attendance.xlsx')
        
        try:
            # Append data to an existing file or create a new one
            with pd.ExcelWriter('attendance.xlsx', mode='a', engine='openpyxl', if_sheet_exists='overlay') as writer:
                df.to_excel(writer, sheet_name='Attendance', index=False, header=not file_exists)
        except Exception as e:
            return jsonify({'success': False, 'message': f'Error saving attendance: {str(e)}'})
        
        return jsonify({'success': True, 'message': 'Password is valid. Attendance recorded.'})
    else:
        # Password is invalid or expired
        return jsonify({'success': False, 'message': 'Invalid or expired password.'})

if __name__ == '__main__':
    app.run(debug=True)

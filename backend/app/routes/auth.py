import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from app.models.users import Users
from app.models.notification import Notifications
from app import bcrypt,mail
from flask_cors import CORS
import datetime
import jwt
from itsdangerous import URLSafeTimedSerializer as Serializer, SignatureExpired
from flask_mail import Message
import uuid

load_dotenv()
auth = Blueprint('auth', __name__)
CORS(auth)

users_model = Users()
notifications_model= Notifications()

@auth.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    phone = data.get('phone')
    image = data.get('image')
    user = users_model.get_user_by_email(email)
    if user:
        return jsonify({'error': 'Email already exists'}), 400
    
    new_user = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'phone': phone,
        'image': image,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    users_model.add_user(new_user)
    user_id = users_model.get_user_by_email(email)['id']

    notification = {
        'id': str(uuid.uuid4()),  # Generate a unique ID
        'user_id': user_id,
        'on_sms_setting': True,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    notifications_model.add_notification(notification)

    return jsonify({'message': 'You are now registered and can log in'}), 201


@auth.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password_candidate = data.get('password')
    user = users_model.get_user_by_email(email)
    if user:
        if bcrypt.check_password_hash(user['password'], password_candidate):
            token = jwt.encode({
                'user_id': user['id']
            }, os.getenv('SECRET_KEY'), algorithm='HS256')
            return jsonify({'message': 'You are now logged in', 'token': token}), 200
        else:
            return jsonify({'error': 'Invalid login'}), 401
    else:
        return jsonify({'error': 'Email not found, please register first'}), 404


@auth.route('/api/request_reset_password', methods=['POST'])
def request_reset_password():
    data = request.get_json()
    email = data.get('email')
    user = users_model.get_user_by_email(email)
    if not user:
        return jsonify({'error': 'Email not found'}), 404
    # Generate a reset token
    s = Serializer(os.getenv('SECRET_KEY'))
    token = s.dumps(email, salt='password-reset-salt')
    # Send the reset token to the user's email
    send_reset_email(email, token)
    return jsonify({'message': 'Password reset token sent'}), 200

def send_reset_email(email, token):
    reset_url = f"{os.getenv('BASE_URL')}/new-password/{token}"
    msg = Message('Password Reset Request', recipients=[email])
    msg.body = f'''To reset your password, visit the following link:
{reset_url}
If you did not make this request, please ignore this email.
'''
    mail.send(msg)


@auth.route('/api/reset_password/<token>', methods=['POST'])
def reset_password(token):
    s = Serializer(os.getenv('SECRET_KEY'))
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except SignatureExpired:
        return jsonify({'error': 'The reset token is expired.'}), 400
    except:
        return jsonify({'error': 'Invalid reset token.'}), 400

    data = request.get_json()
    new_password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    
    user = users_model.get_user_by_email(email)
    if user:
        users_model.update_user_password(email, hashed_password)
        return jsonify({'message': 'Your password has been updated!'}), 200
    else:
        return jsonify({'error': 'User not found.'}), 404

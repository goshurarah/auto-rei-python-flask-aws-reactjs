import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from botocore.exceptions import ClientError
from app.models.users import Users
from flask_cors import CORS
import jwt
import boto3

load_dotenv()
profile = Blueprint('profile', __name__)
CORS(profile)

users_model = Users()

s3_client = boto3.client('s3', region_name='us-east-1')
bucket_name = os.getenv('S3_BUCKET_NAME')

@profile.route('/api/user_profile', methods=['GET'])
def get_user_name():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        user = users_model.get_user_by_id(user_id)
        if user:
            return jsonify({
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
                'name': user['first_name'] + ' ' + user['last_name'],
                'phone': user['phone'],
                'image': user['image']
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@profile.route('/api/user-profile', methods=['PUT'])
def update_user_profile():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        
        update_data = request.json
        valid_keys = {'first_name', 'last_name', 'email', 'phone'}
        update_data = {k: v for k, v in update_data.items() if k in valid_keys}
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400

        updated_profile  = users_model.update_user_profile(user_id, update_data)
        
        if updated_profile:
            return jsonify(updated_profile), 200
        else:
            return jsonify({'error': 'Failed to update user profile'}), 500
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@profile.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected for uploading'}), 400

        # Generate a unique file name
        file_extension = file.filename.split('.')[-1]
        file_name = f"users/{user_id}.{file_extension}"

        # Upload the file to S3
        try:
            s3_client.upload_fileobj(file, bucket_name, file_name)
        except ClientError as e:
            return jsonify({'error': e.response['Error']['Message']}), 500

        # # Generate a presigned URL to access the uploaded image
        # try:
        #     image_url = s3_client.generate_presigned_url(
        #         'get_object',
        #         Params={'Bucket': bucket_name, 'Key': file_name},
        #         ExpiresIn=36000000000000  # URL expiration time in seconds
        #     )
        # except ClientError as e:
        #     return jsonify({'error': e.response['Error']['Message']}), 500
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        # Update the user's profile with the image name
        update_data = {'image': image_url}
        success = users_model.update_user_profile(user_id, update_data)
        
        if success:
            return jsonify({'message': 'File uploaded successfully', 'imageUrl': image_url}), 200
        else:
            return jsonify({'error': 'Failed to update user profile with image name'}), 500
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

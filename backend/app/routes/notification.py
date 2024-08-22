import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
from app.models.notification import Notifications
import jwt
from flask_mail import Message
from datetime import datetime
from botocore.exceptions import ClientError

load_dotenv()
notifications = Blueprint('notifications', __name__)
CORS(notifications)

notifications_model = Notifications()

@notifications.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        saved_lists = notifications_model.get_notifications_by_user_id(user_id)
        
        return jsonify(saved_lists), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400 


@notifications.route('/api/notifications/<string:id>', methods=['PUT'])
def update_auto_offer_setting_by_id(id):
    try:
        data = request.json
        
        offer = notifications_model.get_notification_by_id(id)
        if not offer:
            return jsonify({"error": "Notification not found"}), 404
        
        updated_offer = notifications_model.update_notification(id, data)
        if updated_offer:
            return jsonify({'message': 'Updated Notifications Successfully'}), 201
        else:
            return jsonify({"error": "Failed to notification offer"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
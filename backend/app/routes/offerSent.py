import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
import pdfrw
import requests
from app import bcrypt,mail
from app.models.offerSent import OffersSent
from app.models.properties import Properties
import jwt
from flask_mail import Message
import json
from datetime import datetime

load_dotenv()
offerSent = Blueprint('offerSent', __name__)
CORS(offerSent)

offersSent_model = OffersSent()
properties_model = Properties()


@offerSent.route('/api/send-offer', methods=['POST'])
def send_offer():
    token = request.headers.get('Authorization').split(' ')[1]
    decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
    user_id = decoded_token['user_id']
    data = request.get_json()
    property_id = data.get('property_id')
    property_address = data.get('property_address')
    offer_sent_date = datetime.utcnow().isoformat()
    filename=data.get('filename')

    try:
        # Add offer details to DynamoDB
        offer = offersSent_model.add_offer_sent(property_id, property_address, user_id, offer_sent_date,filename)
        
        return jsonify(offer), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@offerSent.route('/api/send-offer', methods=['GET'])
def get_send_offers():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        send_offers = offersSent_model.get_offerSent_by_user_id(user_id)
        
        return jsonify(send_offers), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400 
    
@offerSent.route('/api/send-offer-properties', methods=['GET'])
def get_saved_lists_properties():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 15))

        property_ids = offersSent_model.get_property_ids_by_user_id(user_id)
        properties_data, total_properties, total_pages = properties_model.get_properties_by_ids_with_pagination(property_ids, page, per_page)

        response_data = {
            'current_page': page,
            'properties': properties_data,
            'total_pages': total_pages
        }
        
        return jsonify(response_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
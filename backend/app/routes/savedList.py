import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
from app.models.savedLists import SavedLists
from app.models.properties import Properties
import jwt

load_dotenv()
savedList = Blueprint('savedList', __name__)
CORS(savedList)

savedLists_model = SavedLists()
properties_model = Properties()

@savedList.route('/api/saved-lists', methods=['POST'])
def add_saved_list():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        data = request.json

        # Call the add_savedList method and get the created object
        created_object = savedLists_model.add_savedList(
            user_id=user_id,
            property_id=data.get('property_id'),
            property_address=data.get('property_address'),
        )
        
        if created_object:
            # Return the created object in the response
            return jsonify(created_object), 201
        else:
            return jsonify({'error': 'Failed to create saved list'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

@savedList.route('/api/saved-lists', methods=['GET'])
def get_saved_lists():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        saved_lists = savedLists_model.get_savedLists_by_user_id(user_id)
        
        return jsonify(saved_lists), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400 
    
@savedList.route('/api/saved-lists-properties', methods=['GET'])
def get_saved_lists_properties():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 15))

        property_ids = savedLists_model.get_property_ids_by_user_id(user_id)
        properties_data, total_properties, total_pages = properties_model.get_properties_by_ids_with_pagination(property_ids, page, per_page)

        response_data = {
            'current_page': page,
            'properties': properties_data,
            'total_pages': total_pages
        }
        
        return jsonify(response_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@savedList.route('/api/saved-lists/<string:id>', methods=['DELETE'])
def delete_saved_list(id):
    try:
        success = savedLists_model.delete_saved_list(id)
        if success:
            return jsonify({"message": "Property Deleted Successfully From Saved List"}), 200
        else:
            return jsonify({"error": "No item found to delete"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

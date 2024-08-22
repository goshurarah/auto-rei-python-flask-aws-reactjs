import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
from botocore.exceptions import ClientError
from app.models.saveFilter import SaveFilters
import jwt

load_dotenv()
saveFilter = Blueprint('saveFilter', __name__)
CORS(saveFilter)

saveFilters_model = SaveFilters()

@saveFilter.route('/api/saved-filters', methods=['GET'])
def get_saved_filters():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        filters = saveFilters_model.get_saved_filters_by_user_id(user_id)
        if filters:
            return jsonify(filters), 200
        else:
            return jsonify({"message": "No saved filters found for this user"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@saveFilter.route('/api/saved-filters/<string:id>', methods=['GET'])
def get_filer_by_id(id):
    try:
        filter = saveFilters_model.get_filter_by_id(id)
        if filter:
            return jsonify(filter), 200
        else:
            return jsonify({"error": "filter not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
        
@saveFilter.route('/api/saved-filters/<string:id>', methods=['PUT'])
def update_filter_by_id(id):
    try:
        data = request.json
        
        filter = saveFilters_model.get_filter_by_id(id)
        if not filter:
            return jsonify({"error": "Filter not found"}), 404
        
        updated_filter = saveFilters_model.update_filter(id, data)
        if updated_filter:
            return jsonify({'message': 'Updated Filter Successfully'}), 201
        else:
            return jsonify({"error": "Failed to update filter"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400      
    
# @saveFilter.route('/api/saved_filters', methods=['GET'])
# def get_all_saved_filters():
#     filters = saveFilters_model.get_all_saved_filters()
#     return jsonify(filters)
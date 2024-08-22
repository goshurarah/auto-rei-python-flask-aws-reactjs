import os
import boto3
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from app.models.properties import Properties
from homeharvest import scrape_property
from flask_cors import CORS
import math
from decimal import Decimal
from datetime import datetime
import jwt
import pandas as pd
import csv
import requests

load_dotenv()
properties = Blueprint('properties', __name__)
CORS(properties)

properties_model = Properties()

def replace_nan_with_none(data):
    if isinstance(data, dict):
        return {k: (None if (isinstance(v, float) and math.isnan(v)) else v) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_nan_with_none(item) for item in data]
    return data

def replace_empty_with_none(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if value == '<empty>':
                item[key] = None
    elif isinstance(item, list):
        return [replace_empty_with_none(sub_item) for sub_item in item]
    return item

def convert_floats_to_decimals(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, float):
                data[key] = Decimal(str(value))
            elif isinstance(value, dict) or isinstance(value, list):
                convert_floats_to_decimals(value)
    elif isinstance(data, list):
        for index, value in enumerate(data):
            if isinstance(value, float):
                data[index] = Decimal(str(value))
            elif isinstance(value, dict) or isinstance(value, list):
                convert_floats_to_decimals(value)
    return data
def clean_payload(payload):
    """
    Remove fields with null, empty, zero, or whitespace-only string values, and empty arrays from the payload.
    Recursively clean nested dictionaries.
    """
    def clean(value):
        if isinstance(value, dict):
            return {k: clean(v) for k, v in value.items() if v not in [None, '', ' ', 0, []]}
        return value

    return {k: clean(v) for k, v in payload.items() if v not in [None, '', ' ', 0, []]}

@properties.route('/api/properties-scrape', methods=['GET'])
def get_properties_scrape():
    try:
        properties_df = scrape_property(
            location=os.getenv('LOCATION'),
            listing_type=os.getenv('LISTING_TYPE'),
            past_days=os.getenv('PAST_DAYS')
        )
        data = properties_df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties', methods=['POST'])
def add_properties():
    try:
        properties_df = scrape_property(
            location=os.getenv('LOCATION'),
            listing_type=os.getenv('LISTING_TYPE'),
            past_days=os.getenv('PAST_DAYS'),
        )
        data = properties_df.to_dict(orient='records')

        new_properties = []

        for item in data:
            item = replace_nan_with_none(item)
            item = replace_empty_with_none(item)
            item = convert_floats_to_decimals(item)
            alt_photos_string = item.get('alt_photos', '')
            alt_photos_list = [url.strip() for url in alt_photos_string.split(',')] if alt_photos_string else []

            # Split agent and broker names
            agent_name = item.get('agent', '') or ''
            broker_name = item.get('broker', '') or ''

            agent_name_parts = agent_name.split() if agent_name else []
            broker_name_parts = broker_name.split() if broker_name else []

            agent_first_name = agent_name_parts[0] if agent_name_parts else ''
            agent_last_name = ' '.join(agent_name_parts[1:]) if len(agent_name_parts) > 1 else ''

            broker_first_name = broker_name_parts[0] if broker_name_parts else ''
            broker_last_name = ' '.join(broker_name_parts[1:]) if len(broker_name_parts) > 1 else ''

            property_data = {
                'agent_first_name': agent_first_name,
                'agent_last_name': agent_last_name,
                'agent_email': item.get('agent_email'),
                'assessed_value': item.get('assessed_value'),
                'broker_first_name': broker_first_name,
                'broker_last_name': broker_last_name,
                'broker_phone': item.get('broker_phone'),
                'broker_website': item.get('broker_website'),
                'fips_code': item.get('fips_code'), 
                'hoa_fee': item.get('hoa_fee'),
                'nearby_schools': item.get('nearby_schools'),
                'location': f"{item.get('street')}, {item.get('city')}, {item.get('state')} {item.get('zip_code')}".lower(),
                'is_property_detail': False,
                'alt_photos': alt_photos_list,
                'beds': item.get('beds'),
                'city': item.get('city'),
                'county': item.get('county'),
                'days_on_mls': item.get('days_on_mls'),
                'full_baths': item.get('full_baths'),
                'full_street_address': item.get('full_street_line'),
                'half_baths': item.get('half_baths'),
                'last_sold_date': item.get('last_sold_date'),
                'latitude': item.get('latitude'),
                'list_date': item.get('list_date'),
                'list_price': item.get('list_price'),
                'estimated_value': item.get('estimated_value'),
                'longitude': item.get('longitude'),
                'lot_sqft': item.get('lot_sqft'),
                'mls': item.get('mls'),
                'mls_id': item.get('mls_id'),
                'neighborhoods': item.get('neighborhoods'),
                'parking_garage': item.get('parking_garage'),
                'price_per_sqft': item.get('price_per_sqft'),
                'primary_photo': item.get('primary_photo'),
                'sold_price': item.get('sold_price'),
                'sqft': item.get('sqft'),
                'state': item.get('state'),
                'status': item.get('status'),
                'stories': item.get('stories'),
                'street': item.get('street'),
                'style': item.get('style'),
                'unit': item.get('unit'),
                'year_built': item.get('year_built'),
                'zip_code': item.get('zip_code'),
                'created_at': datetime.utcnow().isoformat()
            }

            existing_property = properties_model.query_properties_by_mls_id(item.get('mls_id'))
            if not existing_property:
                new_properties.append(property_data)

        properties_model.add_properties_batch(new_properties)

        return jsonify({'message': 'Properties added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 50
        properties_data, total_properties = properties_model.get_properties(page, per_page)

        total_pages = total_properties // per_page + (1 if total_properties % per_page > 0 else 0)

        return jsonify({
            'properties': properties_data,
            'total_pages': total_pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @properties.route('/api/properties', methods=['GET'])
# def get_properties():
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = 50
#         properties_data, total_properties, total_pages = properties_model.get_properties(page, per_page)

#         return jsonify({
#             'properties': properties_data,
#             'total_pages': total_pages,
#             'current_page': page
#         }), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@properties.route('/api/properties-sequential', methods=['GET'])
def get_paginated_properties():
    try:
        # Get query parameters for pagination
        current_page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        last_evaluated_key = request.args.get('last_evaluated_key', None)

        # Decode the last_evaluated_key if provided
        if last_evaluated_key:
            last_evaluated_key = eval(last_evaluated_key)  # convert from string back to dict

        # Retrieve paginated data
        properties_data, new_last_evaluated_key, total_pages = properties_model.get_paginated_properties(limit, last_evaluated_key)

        # Calculate total pages (this is an approximation, actual total pages would require a count operation)
        total_pages = current_page + 1 if new_last_evaluated_key else current_page

        # Response
        return jsonify({
            'properties': properties_data,
            'current_page': current_page,
            'total_pages': total_pages,
            'last_evaluated_key': (new_last_evaluated_key) if new_last_evaluated_key else None
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
@properties.route('/api/properties-range', methods=['GET'])
def get_properties_with_range():
    current_page = int(request.args.get('page', 1))
    end_range = current_page * 50
    start_range = end_range - 49

    start_pos = start_range
    end_pos = end_range

    # return [start_pos, end_pos]

    try:
        # Retrieve the properties from the specified range
        properties_data, total_pages = properties_model.get_properties_in_range(start_pos, end_pos)
        
        return jsonify({
            'properties': properties_data,
            'total_pages': total_pages,
            'current_page': current_page
        }), 200
    except Exception as e:
        app.logger.error(f"Error retrieving properties: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
@properties.route('/api/properties/<string:id>', methods=['GET'])
def get_property_by_id(id):
    try:
        property = properties_model.get_property_by_id(id)

        if property is None:
            return jsonify({'error': 'Property not found'}), 404
    
        return jsonify(property), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties/filter', methods=['POST'])
def filter_properties():
    try:
        filters = clean_payload(request.json)
        page = request.args.get('page', 1, type=int)
        per_page = 50

        filtered_properties, total_properties = properties_model.filter_properties(filters, page, per_page)

        if not filtered_properties:
            try:
                url = os.getenv('PROPERTY_SEARCH_URL')
                headers = {
                    "accept": "application/json",
                    "x-user-id": "UniqueUserIdentifier",
                    "content-type": "application/json",
                    "x-api-key": os.getenv('X_API_KEY')
                }

                external_response = requests.post(url, json=filters, headers=headers)
                external_response.raise_for_status()  # Raise an HTTPError for bad responses
                external_data = external_response.json()
                reapi_properties = external_data.get('data', [])
                
                if not reapi_properties:
                    return jsonify({'message': 'Reapi properties not found'}), 404
                

                new_properties = []
                for item in reapi_properties:
                    item = replace_nan_with_none(item)
                    item = replace_empty_with_none(item)
                    item = convert_floats_to_decimals(item)
                    property_data = {
                        'propertyId': item.get('propertyId', ''),
                        'alt_photos': item.get('alt_photos', []),
                        'absenteeOwner': item.get('absenteeOwner', ''),
                        'adjustableRate': item.get('adjustableRate', ''),
                        'address': item.get('address', {}).get('address', ''),
                        'city': item.get('address', {}).get('city', ''),
                        'county': item.get('address', {}).get('county', ''),
                        'state': item.get('address', {}).get('state', ''),
                        'street': item.get('address', {}).get('street', ''),
                        'zip_code': item.get('address', {}).get('zip', ''),
                        'location': f"{item.get('address', {}).get('street', '')}, {item.get('address', {}).get('city', '')}, {item.get('address', {}).get('state', '')} {item.get('address', {}).get('zip', '')}".lower(),
                        'is_property_detail': False,
                        'apn': item.get('apn', ''),
                        'assessedImprovementValue': item.get('assessedImprovementValue', 0),
                        'assessedLandValue': item.get('assessedLandValue', 0),
                        'assessedValue': item.get('assessedValue', 0),
                        'equityPercent': item.get('equityPercent', 0),
                        'estimatedEquity': item.get('estimatedEquity', 0),
                        'estimated_value': item.get('estimatedValue', 0),
                        'latitude': item.get('latitude', 0),
                        'longitude': item.get('longitude', 0),
                        'lot_sqft': item.get('lotSquareFeet', 0),
                        'sold_price': item.get('lastSaleAmount', ''),
                        'last_sold_date': item.get('lastSaleDate', ''),
                        'lenderName': item.get('lenderName', ''),
                        'listingAmount': item.get('listingAmount', ''),
                        'loanTypeCode': item.get('loanTypeCode', ''),
                        'mlsActive': item.get('mlsActive', False),
                        'mlsCancelled': item.get('mlsCancelled', False),
                        'days_on_mls': item.get('mlsDaysOnMarket', 0),
                        'list_date': item.get('mlsListingDate', ''),
                        'list_price': item.get('mlsListingPrice', 0),
                        'mlsSold': item.get('mlsSold', False),
                        'neighborhood': item.get('neighborhood', {}).get('name', ''),
                        'garage': item.get('garage', False),
                        'price_per_sqft': item.get('pricePerSquareFoot', 0),
                        'sqft': item.get('squareFeet', 0),
                        'stories': item.get('stories', 0),
                        'year_built': item.get('yearBuilt', 0),
                        'airConditioningAvailable': item.get('airConditioningAvailable', False),
                        'assumable': item.get('assumable', False),
                        'auction': item.get('auction', False),
                        'auctionDate': item.get('auctionDate', None),
                        'basement': item.get('basement', False),
                        'full_baths': item.get('bathrooms', 0),
                        'beds': item.get('bedrooms', 0),
                        'cashBuyer': item.get('cashBuyer', False),
                        'corporateOwned': item.get('corporateOwned', False),
                        'death': item.get('death', False),
                        'deck': item.get('deck', False),
                        'deckArea': item.get('deckArea', 0),
                        'documentType': item.get('documentType', ''),
                        'documentTypeCode': item.get('documentTypeCode', ''),
                        'equity': item.get('equity', False),
                        'floodZone': item.get('floodZone', False),
                        'forSale': item.get('forSale', False),
                        'foreclosure': item.get('foreclosure', False),
                        'freeClear': item.get('freeClear', False),
                        'highEquity': item.get('highEquity', False),
                        'inStateAbsenteeOwner': item.get('inStateAbsenteeOwner', False),
                        'inherited': item.get('inherited', False),
                        'investorBuyer': item.get('investorBuyer', False),
                        'judgment': item.get('judgment', False),
                        'landUse': item.get('landUse', ''),
                        'lastMortgage1Amount': item.get('lastMortgage1Amount', None),
                        'lenderName': item.get('lenderName', ''),
                        'listingAmount': item.get('listingAmount', ''),
                        'loanTypeCode': item.get('loanTypeCode', ''),
                        'maturityDateFirst': item.get('maturityDateFirst', ''),
                        'medianIncome': item.get('medianIncome', ''),
                        'mlsFailed': item.get('mlsFailed', False),
                        'mlsPending': item.get('mlsPending', False),
                        'status': item.get('mlsStatus', ''),
                        'negativeEquity': item.get('negativeEquity', False),
                        'openMortgageBalance': item.get('openMortgageBalance', 0),
                        'outOfStateAbsenteeOwner': item.get('outOfStateAbsenteeOwner', False),
                        'owner1FirstName': item.get('owner1FirstName', ''),
                        'owner1LastName': item.get('owner1LastName', ''),
                        'owner2FirstName': item.get('owner2FirstName', ''),
                        'owner2LastName': item.get('owner2LastName', ''),
                        'ownerOccupied': item.get('ownerOccupied', False),
                        'patio': item.get('patio', False),
                        'patioArea': item.get('patioArea', 0),
                        'pool': item.get('pool', False),
                        'poolArea': item.get('poolArea', 0),
                        'preForeclosure': item.get('preForeclosure', False),
                        'priorOwnerIndividual': item.get('priorOwnerIndividual', False),
                        'priorOwnerMonthsOwned': item.get('priorOwnerMonthsOwned', ''),
                        'priorSaleAmount': item.get('priorSaleAmount', ''),
                        'privateLender': item.get('privateLender', False),
                        'propertyType': item.get('propertyType', ''),
                        'propertyUse': item.get('propertyUse', ''),
                        'propertyUseCode': item.get('propertyUseCode', ''),
                        'pre_foreclosure_recordingDate': item.get('recordingDate', ''),
                        'rentAmount': item.get('rentAmount', ''),
                        'reo': item.get('reo', False),
                        'roomsCount': item.get('roomsCount', 0),
                        'suggestedRent': item.get('suggestedRent', ''),
                        'unit': item.get('unitsCount', 0),
                        'vacant': item.get('vacant', False),
                        'yearsOwned': item.get('yearsOwned', 0),
                        'created_at': datetime.utcnow().isoformat()
                    }
                    new_properties.append(property_data)

                properties_model.add_properties_batch(new_properties)
                # return jsonify(reapi_properties), 201

                return jsonify({'message': 'Realestate properties added successfully'}), 201

            except requests.exceptions.HTTPError as http_err:
                # Return the error response from the external API
                return jsonify({'error': external_response.json()}), external_response.status_code
            except requests.exceptions.RequestException as req_err:
                # Return a generic error message for other request exceptions
                return jsonify({'error': str(req_err)}), 500

        total_pages = total_properties // per_page + (1 if total_properties % per_page > 0 else 0)

        return jsonify({
            'properties': filtered_properties,
            'total_pages': total_pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties-detail/<string:id>', methods=['POST'])
def detail_properties(id):
    try:
        property = clean_payload(request.json)
        propertyID=id

        propertyData = properties_model.get_property_by_id(propertyID)
        is_property_detail=propertyData.get('is_property_detail')

        if is_property_detail is False:
            url = os.getenv('PROPERTY_DETAIL_URL')
            headers = {
                "accept": "application/json",
                "x-user-id": "UniqueUserIdentifier",
                "content-type": "application/json",
                "x-api-key": os.getenv('X_API_KEY')
            }

            external_response = requests.post(url, json=property, headers=headers)
            external_response.raise_for_status()
            external_data = external_response.json()
            reapi_properties = external_data.get('data', [])

            if not reapi_properties:
                return jsonify({'message': 'Reapi properties detail not found'}), 404
            
            reapi_properties = replace_nan_with_none(reapi_properties)
            reapi_properties = replace_empty_with_none(reapi_properties)
            reapi_properties = convert_floats_to_decimals(reapi_properties)

            if reapi_properties:
                property_details = reapi_properties
                attributes = {
                    'cashSale': property_details.get('cashSale'),
                    'comps': property_details.get('comps'),
                    'currentMortgages': property_details.get('currentMortgages'),
                    'deathTransfer': property_details.get('deathTransfer'),
                    'deedInLieu': property_details.get('deedInLieu'),
                    'demographics': property_details.get('demographics'),
                    'estimatedMortgageBalance': property_details.get('estimatedMortgageBalance'),
                    'estimatedMortgagePayment': property_details.get('estimatedMortgagePayment'),
                    'foreclosureInfo': property_details.get('foreclosureInfo'),
                    'lastSale': property_details.get('lastSale'),
                    'lastSalePrice': property_details.get('lastSalePrice'),
                    'lastUpdateDate': property_details.get('lastUpdateDate'),
                    'lien': property_details.get('lien'),
                    'loanTypeCodeFirst': property_details.get('loanTypeCodeFirst'),
                    'loanTypeCodeSecond': property_details.get('loanTypeCodeSecond'),
                    'lotInfo': property_details.get('lotInfo'),
                    'mlsHasPhotos': property_details.get('mlsHasPhotos'),
                    'mlsHistory': property_details.get('mlsHistory'),
                    'mobileHome': property_details.get('mobileHome'),
                    'mortgageHistory': property_details.get('mortgageHistory'),
                    'ownerInfo': property_details.get('ownerInfo'),
                    'priorId': property_details.get('priorId'),
                    'propertyInfo': property_details.get('propertyInfo'),
                    'quitClaim': property_details.get('quitClaim'),
                    'reapiAvm': property_details.get('reapiAvm'),
                    'saleHistory': property_details.get('saleHistory'),
                    'schools': property_details.get('schools'),
                    'sheriffsDeed': property_details.get('sheriffsDeed'),
                    'spousalDeath': property_details.get('spousalDeath'),
                    'taxInfo': property_details.get('taxInfo'),
                    'taxLien': property_details.get('taxLien'),
                    'trusteeSale': property_details.get('trusteeSale'),
                    'warrantyDeed': property_details.get('warrantyDeed'),
                    'is_property_detail': True
                }

                attributes = {k: v for k, v in attributes.items() if v is not None}

                update_response = properties_model.update_property(propertyID, attributes)

                if not update_response:
                    return jsonify({'message': 'Failed to update reapi property'}), 500

            return jsonify({'message': 'Successfully updated property'}), 201
        return jsonify({'message': 'Not hit property detail api'}), 201

    except requests.exceptions.HTTPError as http_err:
        # Return the error response from the external API
        return jsonify({'error': external_response.json()}), external_response.status_code
    except requests.exceptions.RequestException as req_err:
        # Return a generic error message for other request exceptions
        return jsonify({'error': str(req_err)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

@properties.route('/api/properties/save-filter', methods=['POST'])
def save_filter_properties():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        filters = request.json

        save_filter_response = properties_model.save_filter_properties(user_id, filters)
        
        if isinstance(save_filter_response, str):
            return jsonify({'error': save_filter_response}), 400

        return jsonify({
            'message': 'Filter saved successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@properties.route('/api/property-field-names', methods=['GET'])
def get_property_field_names():
    try:
        field_names = properties_model.get_property_field_names()
        return jsonify(field_names), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




# File data upload into db
CSV_FILE_PATH ='C:/Users/Huraira Akbar/Desktop/insertPart1.csv'
CHUNK_SIZE = 10000

def clean_header(header):
    """Convert header to lowercase and remove spaces."""
    return header.lower().replace(' ', '_')
def combine_media_urls(row):
    """Combine mediaurl fields into a single alt_photos field."""
    media_urls = [row[f'mediaurl_{i}'] for i in range(1, 101) if f'mediaurl_{i}' in row and pd.notna(row[f'mediaurl_{i}']) and row[f'mediaurl_{i}'] != 'NaN']
    row['alt_photos'] = media_urls
    for i in range(1, 101):
        field_name = f'mediaurl_{i}'
        if field_name in row:
            del row[field_name]
    return row
def add_location_field(row):
    """Add location field with concatenated street, city, and zip_code."""
    street = row.get('street', '')
    city = row.get('city', '')
    zip_code = row.get('zip_code', '')
    location = f"{street} {city} {zip_code}".lower()
    row['location'] = location
    return row
@properties.route('/api/file-data', methods=['POST'])
def get_data():
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({'error': 'File not found'}), 404

    try:
        for chunk in pd.read_csv(CSV_FILE_PATH, chunksize=CHUNK_SIZE):
            chunk.columns = [clean_header(col) for col in chunk.columns]  # Clean headers
            for index, row in chunk.iterrows():
                try:
                    cleaned_row = {clean_header(col): value for col, value in row.items()}
                    cleaned_row = combine_media_urls(cleaned_row)  # Combine mediaurl fields
                    cleaned_row = add_location_field(cleaned_row)  # Add location field
                    cleaned_row = replace_nan_with_none(cleaned_row)  # Replace NaN with None
                    cleaned_row = replace_empty_with_none(cleaned_row)  # Replace '<empty>' with None
                    cleaned_row = convert_floats_to_decimals(cleaned_row)  # Convert floats to Decimal
                    if 'id' in cleaned_row:
                        cleaned_row['id'] = str(cleaned_row['id'])
                        cleaned_row['mls_id'] = str(cleaned_row['mls_id'])
                        cleaned_row['city'] = str(cleaned_row['city'])
                        cleaned_row['list_date'] = str(cleaned_row['list_date'])

                    result = properties_model.add_file_data_into_db(cleaned_row)
                    if 'error' in result:
                            return jsonify({'error': f'Error inserting row {index}: {result["error"]}'}), 500

                except Exception as row_exception:
                    return jsonify({'error': f'Error processing row {index}: {str(row_exception)}'}), 500

        return jsonify("Properties Inserted Successfully")

    except Exception as e:
        return jsonify({'error': f'Error reading CSV: {str(e)}'}), 500
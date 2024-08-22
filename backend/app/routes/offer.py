import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
import pdfrw
import requests
from app import bcrypt,mail
from app.models.offers import Offers
from app.models.offerSent import OffersSent
from app.models.users import Users
from app.models.properties import Properties
import jwt
from flask_mail import Message
import json
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
import decimal

load_dotenv()
offer = Blueprint('offer', __name__)
CORS(offer)

offers_model = Offers()
offersSent_model = OffersSent()
users_model = Users()
properties_model = Properties()

s3_client = boto3.client('s3', region_name='us-east-1')
bucket_name = os.getenv('S3_BUCKET_NAME')
sqs_client = boto3.client('sqs', region_name='us-east-1')
sqs_queue_url = os.getenv('SQS_QUEUE_URL')
stepfunctions_client = boto3.client('stepfunctions', region_name='us-east-1')
state_machine_arn = 'arn:aws:states:us-east-1:211125572390:stateMachine:MyStateMachine-uhxvlltq3'

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)

@offer.route('/api/send-multiple-offers', methods=['POST'])
def send_multiple_offers():
    try:
        data = request.json
        property_ids = data.get('property_ids', [])
        offer_template = data.get('offer_template', {})
        if not property_ids or not offer_template:
            return jsonify({"error": "property_ids and offer_template are required"}), 400
        # Retrieve properties by IDs
        properties = properties_model.get_properties_by_ids(property_ids)
        if not properties:
            return jsonify({"error": "No properties found for the given IDs"}), 404
        # Create the message payload
        message_payload = {
            'offer_template': offer_template,
            'properties': properties
        }
        # Send the payload to SQS
        response = sqs_client.send_message(
            QueueUrl=sqs_queue_url,
            MessageBody=json.dumps(message_payload, cls=DecimalEncoder),
            MessageAttributes={
                'Topic': {
                    'DataType': 'String',
                    'StringValue': 'properties'
                }
            }
        )
        # Trigger state machine execution
        response = stepfunctions_client.start_execution(
            stateMachineArn=state_machine_arn
        )

        # if response.get('executionArn'):
        #     return jsonify({'message': 'Offers sent to SQS queue successfully and state machine triggered'}), 200
        # else:
        #     return jsonify({'error': 'Failed to trigger state machine execution'}), 500
        
        return jsonify({'message': 'Offers sent to SQS queue successfully and state machine triggered'}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@offer.route('/api/send-single-offer', methods=['POST'])
def send_single_offer():
    try:
        data = request.json
        combined_data = {**data['sendOfferFormData'], **data['property']}
        # print(combined_data)
        input_pdf_path = 'AutoRei.pdf'
        output_pdf_path = 'Filled-Template.pdf'
        ANNOT_KEY = '/Annots'
        ANNOT_FIELD_KEY = '/T'
        ANNOT_FIELD_VALUE_KEY = '/V'
        SUBTYPE_KEY = '/Subtype'
        WIDGET_SUBTYPE_KEY = '/Widget'

        template_pdf = pdfrw.PdfReader(input_pdf_path)
        annotations = template_pdf.pages[0][ANNOT_KEY]

        for annotation in annotations:
            if annotation[SUBTYPE_KEY] == WIDGET_SUBTYPE_KEY:
                field_name = annotation.get(ANNOT_FIELD_KEY)
                if field_name:
                    field_name = field_name[1:-1]
                    if field_name in combined_data.keys():
                        annotation.update(
                            pdfrw.PdfDict(V=combined_data[field_name])
                        )

        template_pdf.Root.AcroForm.update(pdfrw.PdfDict(NeedAppearances=pdfrw.PdfObject('true')))

        # Save the new PDF
        pdfrw.PdfWriter().write(output_pdf_path, template_pdf)

        # Upload the PDF to S3
        s3_file_name = f'offers/{datetime.utcnow().isoformat()}_{os.path.basename(output_pdf_path)}'
        s3_client.upload_file(output_pdf_path, bucket_name, s3_file_name)

        # Send the email
        msg = Message(
        'Offer Email Subject',
        sender=os.getenv('MAIL_DEFAULT_SENDER'),
        recipients=[os.getenv('MAIL_DEFAULT_RECEIVER')]
        )
        msg.body = '''Dear [Seller Name],

I hope this message finds you well. I am very interested in your property located at [Property Address]. After carefully considering its features and location, I would like to extend a compelling offer to purchase it.

I believe this offer will meet your expectations and ensure a smooth and swift transaction. I look forward to discussing this opportunity further.

Best regards,
[Your Name]
'''


        # Attach the PDF file
        with open(output_pdf_path, 'rb') as fp:
            msg.attach(output_pdf_path, 'application/pdf', fp.read())

        # Attach the combined data as a JSON file
        combined_data_json = json.dumps(combined_data, indent=4)
        msg.attach('combined_data.json', 'application/json', combined_data_json)

        mail.send(msg)

        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        property_id = data['property'].get('id')
        property_address = data['property'].get('location')
        offer_sent_date = datetime.utcnow().isoformat()

        offer = offersSent_model.add_offer_sent(property_id, property_address, user_id, offer_sent_date, s3_file_name)
        
        if offer:
            return jsonify(offer)
        else:
            return jsonify({'error': 'Failed to send offer'}), 500


    except Exception as e:
        return jsonify({"error": str(e)}), 400

@offer.route('/api/auto-offer-send-setting', methods=['POST'])
def auto_offer_setting():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        data = request.json
        user = users_model.get_user_by_id(user_id)
        
        offers_model.create_offer(
            list_price_percent=data.get('list_price_percent'),
            offer_expiration_days=data.get('offer_expiration_days'),
            closing_days=data.get('closing_days'),
            escrow_deposit=data.get('escrow_deposit'),
            inspection_period_days=data.get('inspection_period_days'),
            terms_conditions=data.get('terms_conditions'),
            email_subject=data.get('email_subject'),
            email_body=data.get('email_body'),
            template_name=data.get('template_name'),
            save_filter=data.get('save_filter'),
            crm_web_hook=data.get('crm_web_hook'),
            earnest_money_deposit=data.get('earnest_money_deposit'),
            user_id=user_id,
            user_email=user['email']
        )
        
        return jsonify({'message': 'Auto Offer Send Setting Save Successfully'}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@offer.route('/api/auto-offer-send-setting', methods=['GET'])
def get_auto_offer_settings():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']

        offers = offers_model.get_offers_by_user_id(user_id)
        
        return jsonify({'offers': offers}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400    


@offer.route('/api/auto-offer-send-setting/<string:id>', methods=['GET'])
def get_auto_offer_setting_by_id(id):
    try:
        offer = offers_model.get_offer_by_id(id)
        if offer:
            return jsonify(offer), 200
        else:
            return jsonify({"error": "Offer not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@offer.route('/api/auto-offer-send-setting/<string:id>', methods=['PUT'])
def update_auto_offer_setting_by_id(id):
    try:
        data = request.json
        
        offer = offers_model.get_offer_by_id(id)
        if not offer:
            return jsonify({"error": "Offer not found"}), 404
        
        updated_offer = offers_model.update_offer(id, data)
        if updated_offer:
            return jsonify({'message': 'Updated Auto Offer Send Setting Successfully'}), 201
        else:
            return jsonify({"error": "Failed to update offer"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400        
    

@offer.route('/api/auto-offer-send-setting/<string:id>', methods=['DELETE'])
def delete_auto_offer_setting_by_id(id):
    try:
        success = offers_model.delete_offer_by_id(id)
        if success:
            return jsonify({"message": "Auto Offer Send Setting Deleted"}), 200
        else:
            return jsonify({"error": "No item found to delete"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400



# def send_to_sqs(filters, topic, queue_url):
#     try:
#         entries = []
#         for filter_item in filters:
#             address = filter_item.get('address', 'No address found')
#             entry = {
#                 'Id': str(filter_item.get('id')),  # Use a unique identifier for each message
#                 'MessageBody': address,
#                 'MessageAttributes': {
#                     'Topic': {
#                         'DataType': 'String',
#                         'StringValue': topic
#                     }
#                 }
#             }
#             entries.append(entry)
#         # Send messages in batches of up to 10
#         for batch in [entries[i:i+10] for i in range(0, len(entries), 10)]:
#             response = sqs.send_message_batch(QueueUrl=queue_url, Entries=batch)
#             for successful in response['Successful']:
#                 logger.info(f"Sent message ID: {successful['MessageId']}")
#             if 'Failed' in response:
#                 for failed in response['Failed']:
#                     logger.error(f"Failed to send message: {failed['MessageId']}, Error: {failed['Code']}, {failed['Message']}")
#                     # Handle failed messages as needed
#     except Exception as e:
#         raise SQSError(f"Error sending messages to SQS: {e}") from e
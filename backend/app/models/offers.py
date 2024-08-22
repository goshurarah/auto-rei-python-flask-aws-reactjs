import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
import uuid

class Offers:
    def __init__(self):
        self.table_name = 'offers'
        self.dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        self.create_table()
        self.table = self.dynamodb.Table(self.table_name)

    def create_table(self):
        existing_tables = [table.name for table in self.dynamodb.tables.all()]
        if self.table_name not in existing_tables:
            self.dynamodb.create_table(
                TableName=self.table_name,
                KeySchema=[
                    {'AttributeName': 'id', 'KeyType': 'HASH'},
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'id', 'AttributeType': 'S'},
                    {'AttributeName': 'user_id', 'AttributeType': 'S'}
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                },
                GlobalSecondaryIndexes=[
                    {
                        'IndexName': 'user_id-index',
                        'KeySchema': [
                            {'AttributeName': 'user_id', 'KeyType': 'HASH'},
                        ],
                        'Projection': {
                            'ProjectionType': 'ALL'
                        },
                        'ProvisionedThroughput': {
                            'ReadCapacityUnits': 5,
                            'WriteCapacityUnits': 5
                        }
                    }
                ]
            ).wait_until_exists()

    def create_offer(self, user_id, user_email, list_price_percent, offer_expiration_days, closing_days, escrow_deposit, inspection_period_days, terms_conditions, email_subject, email_body, template_name, save_filter, crm_web_hook, earnest_money_deposit):
        try:
            offer_id = str(uuid.uuid4())
            response = self.table.put_item(
                Item = {
                    'id': offer_id,
                    'user_id': user_id,
                    'user_email': user_email,
                    'list_price_percent': list_price_percent or 'null',
                    'offer_expiration_days': offer_expiration_days or 'null',
                    'closing_days': closing_days or 'null',
                    'escrow_deposit': escrow_deposit or 'null',
                    'inspection_period_days': inspection_period_days or 'null',
                    'terms_conditions': terms_conditions or 'null',
                    'email_subject': email_subject or 'null',
                    'email_body': email_body or 'null',
                    'template_name': template_name or 'null',
                    'save_filter': save_filter or 'null',
                    'crm_web_hook': crm_web_hook or 'null',
                    'earnest_money_deposit': earnest_money_deposit or 'null',
                    'created_at': datetime.utcnow().isoformat()
                }
            )
            return response
        except ClientError as e:
            print(f"Failed to create offer: {e.response['Error']['Message']}")
            return None

    def get_offers_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id)
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to query offers: {e.response['Error']['Message']}")
            return []

    def get_offer_by_id(self, offer_id):
        try:
            response = self.table.get_item(
                Key={
                    'id': offer_id
                }
            )
            return response.get('Item', None)
        except ClientError as e:
            print(f"Failed to get offer: {e.response['Error']['Message']}")
            return None 

    def update_offer(self, offer_id, update_data):
        try:
            update_expression = "SET " + ", ".join(f"{k} = :{k}" for k in update_data.keys())
            expression_attribute_values = {f":{k}": v for k, v in update_data.items()}
            
            response = self.table.update_item(
                Key={
                    'id': offer_id
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW"
            )
            return response.get('Attributes', None)
        except ClientError as e:
            print(f"Failed to update offer: {e.response['Error']['Message']}")
            return None
        
    def delete_offer_by_id(self, offer_id):
        try:
            response = self.table.delete_item(
                Key={
                    'id': offer_id
                },
                ConditionExpression="attribute_exists(id)",
                ReturnValues="ALL_OLD"
            )
            if 'Attributes' in response:
                return True
            else:
                return False
        except ClientError as e:
            if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                return False
            else:
                raise e
        
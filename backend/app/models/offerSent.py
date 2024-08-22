import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
import uuid

class OffersSent:
    def __init__(self):
        self.table_name = 'offersSent'
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

    def add_offer_sent(self, property_id, property_address, user_id, offer_sent_date, filename):
        offer_id = str(uuid.uuid4())
        offer_item = {
            'id': offer_id,
            'property_id': property_id,
            'property_address': property_address,
            'user_id': user_id,
            'offer_sent_date': offer_sent_date,
            'filename': filename
        }
        try:
            self.table.put_item(Item=offer_item)
        except ClientError as e:
            print(e.response['Error']['Message'])
            return None
        else:
            return offer_item
        
    def get_offerSent_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id)
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to query sent offers: {e.response['Error']['Message']}")
            return []
        
    def get_property_ids_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id),
                ProjectionExpression='property_id'
            )
            property_ids = [item['property_id'] for item in response.get('Items', [])]
            return property_ids
        except ClientError as e:
            print(f"Failed to sent offers: {e.response['Error']['Message']}")
            return []
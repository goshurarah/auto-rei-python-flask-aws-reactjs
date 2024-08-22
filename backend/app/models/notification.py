import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
import uuid

class Notifications:
    def __init__(self):
        self.table_name = 'notifications'
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

    def add_notification(self, notification):
        try:
            self.table.put_item(Item=notification)
        except Exception as e:
            print(f"An error occurred while adding notification: {e}")

    def get_notifications_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id)
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to query notifications: {e.response['Error']['Message']}")
            return []
        
    def get_notification_by_id(self, notification_id):
        try:
            response = self.table.get_item(
                Key={
                    'id': notification_id
                }
            )
            return response.get('Item', None)
        except ClientError as e:
            print(f"Failed to get notification: {e.response['Error']['Message']}")
            return None
        
    def update_notification(self, notification_id, update_data):
        try:
            update_expression = "SET " + ", ".join(f"{k} = :{k}" for k in update_data.keys())
            expression_attribute_values = {f":{k}": v for k, v in update_data.items()}
            
            response = self.table.update_item(
                Key={
                    'id': notification_id
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW"
            )
            return response.get('Attributes', None)
        except ClientError as e:
            print(f"Failed to update notification: {e.response['Error']['Message']}")
            return None
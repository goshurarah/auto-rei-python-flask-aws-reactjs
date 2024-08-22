import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
import uuid

class SavedLists:
    def __init__(self):
        self.table_name = 'savedLists'
        self.properties_table_name = 'properties'        
        self.dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        self.create_table()
        self.table = self.dynamodb.Table(self.table_name)
        self.properties_table  = self.dynamodb.Table(self.properties_table_name)

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

    def add_savedList(self, user_id, property_id, property_address):
        try:
            saved_list_id = str(uuid.uuid4())
            created_at = datetime.utcnow().isoformat()
            new_saved_list = {
                'id': saved_list_id,
                'user_id': user_id,
                'property_id': property_id or 'null',
                'property_address': property_address or 'null',
                'created_at': created_at
            }
            self.table.put_item(Item=new_saved_list)
            return new_saved_list
        except ClientError as e:
            print(f"Failed to create saved list: {e.response['Error']['Message']}")
            return None

    def get_savedLists_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id)
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to query saved lists: {e.response['Error']['Message']}")
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
            print(f"Failed to query saved lists: {e.response['Error']['Message']}")
            return []

    def delete_saved_list(self, saved_list_id):
        try:
            response = self.table.delete_item(
                Key={
                    'id': saved_list_id
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
                raise e  # Raise the exception to be handled by the calling function
        
        
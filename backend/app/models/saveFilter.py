import boto3
from boto3.dynamodb.conditions import Key, Attr, And
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

class SaveFilters:
    def __init__(self):
        self.table_name = 'saveFilters'
        self.dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        self.table = self.dynamodb.Table(self.table_name)
        self.create_table()

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

    def save_filter(self, user_id, filters):
        try:
            # Check for duplicate filterName
            existing_filters = self.table.scan(
                FilterExpression=Attr('user_id').eq(user_id) & Attr('filterName').eq(filters.get('filterName'))
            )

            if existing_filters['Items']:
                return (f"Filter with name {filters.get('filterName')} already exists.")

            saved_filter_id = str(uuid.uuid4())
            item = {
                'id': saved_filter_id,
                'user_id': user_id,
                'filterName': filters.get('filterName'),
                'created_at': datetime.utcnow().isoformat()
            }

            # Dynamically add other fields from the filters payload
            for key, value in filters.items():
                if key not in item: 
                    item[key] = value

            self.table.put_item(Item=item)
            return [], 0
        except Exception as e:
            print(f"An error occurred while saving the filter: {e}")
            return str(e)
        
    def get_filter_by_id(self, filter_id):
        try:
            response = self.table.get_item(
                Key={
                    'id': filter_id
                }
            )
            return response.get('Item', None)
        except ClientError as e:
            print(f"Failed to get filter: {e.response['Error']['Message']}")
            return None 

    def update_filter(self, filter_id, update_data):
        try:
            update_expression = "SET " + ", ".join(f"#{k} = :{k}" for k in update_data.keys())
            expression_attribute_values = {f":{k}": v for k, v in update_data.items()}
            expression_attribute_names = {f"#{k}": k for k in update_data.keys()}

            response = self.table.update_item(
                Key={
                    'id': filter_id
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ExpressionAttributeNames=expression_attribute_names,
                ReturnValues="ALL_NEW"
            )
            return response.get('Attributes', None)
        except ClientError as e:
            raise Exception(f"Failed to update filter: {e.response['Error']['Message']}")

    def get_saved_filters_by_user_id(self, user_id):
        try:
            response = self.table.query(
                IndexName='user_id-index',
                KeyConditionExpression=Key('user_id').eq(user_id)
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to query saved lists: {e.response['Error']['Message']}")
            return []
        
    def get_all_saved_filters(self):
        try:
            response = self.table.scan()
            return response.get('Items', [])
        except ClientError as e:
            print(f"Failed to scan saved filters: {e.response['Error']['Message']}")
            return []
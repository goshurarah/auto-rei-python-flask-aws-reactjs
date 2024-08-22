import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
import uuid

class Users:
    def __init__(self):
        self.table_name = 'users'
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
                    {'AttributeName': 'email', 'AttributeType': 'S'},
                ],
                GlobalSecondaryIndexes=[
                    {
                        'IndexName': 'email-index',
                        'KeySchema': [
                            {'AttributeName': 'email', 'KeyType': 'HASH'},
                        ],
                        'Projection': {
                            'ProjectionType': 'ALL'
                        },
                        'ProvisionedThroughput': {
                            'ReadCapacityUnits': 10,
                            'WriteCapacityUnits': 10,
                        }
                    }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 10,
                    'WriteCapacityUnits': 10,
                }
            ).wait_until_exists()

    def add_user(self, user_data):
        # Generate a UUID for the id attribute
        user_data['id'] = str(uuid.uuid4())
        self.table.put_item(Item=user_data)

    def get_user_by_email(self, email):
        response = self.table.query(
            IndexName='email-index',
            KeyConditionExpression=Key('email').eq(email)
        )
        if response['Items']:
            return response['Items'][0]
        else:
            return None

    def get_user_by_id(self, user_id):
        response = self.table.get_item(
            Key={'id': user_id}
        )
        return response.get('Item')

    def update_user_password(self, email, new_password):
        try:
            # Retrieve the user to get the primary key (id)
            response = self.table.query(
                IndexName='email-index',
                KeyConditionExpression=Key('email').eq(email)
            )
            if response['Items']:
                user_id = response['Items'][0]['id']
                self.table.update_item(
                    Key={'id': user_id},
                    UpdateExpression='SET #password = :val',
                    ExpressionAttributeNames={'#password': 'password'},
                    ExpressionAttributeValues={':val': new_password}
                )
            else:
                print("User not found")
                return None
        except ClientError as e:
            print(e.response['Error']['Message'])
            return None
        
    def update_user_profile(self, user_id, update_data):
        try:
            update_expression = "SET " + ", ".join(f"#{k} = :{k}" for k in update_data.keys())
            expression_attribute_names = {f"#{k}": k for k in update_data.keys()}
            expression_attribute_values = {f":{k}": v for k, v in update_data.items()}
            
            self.table.update_item(
                Key={'id': user_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values
            )
            response = self.table.get_item(Key={'id': user_id})
            updated_profile = response.get('Item')
            return updated_profile
        except ClientError as e:
            print(e.response['Error']['Message'])
            return None

    def get_user_profile(self, user_id):
            return self.get_user_by_id(user_id)
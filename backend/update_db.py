import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
import uuid
import datetime
# Initialize AWS DynamoDB with credentials
boto3.setup_default_session(
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name=''
)

# def update_existing_records():
#     try:
#         dynamodb = boto3.resource('dynamodb')
#         table = dynamodb.Table('users')

#         response = table.scan()
#         items = response['Items']
        
#         updated_count = 0

#         for item in items:
#             if 'phone' not in item or item['phone'] is not None:
#                 table.update_item(
#                     Key={'id': item['id']},
#                     UpdateExpression="SET #phone = :null",
#                     ExpressionAttributeNames={
#                         "#phone": "phone"
#                     },
#                     ExpressionAttributeValues={
#                         ":null": None
#                     }
#                 )
#                 updated_count += 1

#         print(f"Successfully updated {updated_count} items.")
    
#     except NoCredentialsError:
#         print("Error: AWS credentials not found.")
#     except PartialCredentialsError:
#         print("Error: Incomplete AWS credentials.")
#     except ClientError as e:
#         print(f"ClientError: {e.response['Error']['Message']}")
#     except Exception as e:
#         print(f"An unexpected error occurred: {str(e)}")


# def update_existing_records():
#     try:
#         dynamodb = boto3.resource('dynamodb')
#         users_table = dynamodb.Table('users')
#         notifications_table = dynamodb.Table('notifications')

#         response = users_table.scan()
#         users = response['Items']


#         for user in users:
#             user_id = user['id']
#             print(user_id)
            
#             notification = {
#                 'id': str(uuid.uuid4()),
#                 'user_id': user_id,
#                 'on_sms_setting': True,
#                 'created_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
#             }
            
#             try:
#                 notifications_table.put_item(Item=notification)
#                 print(f"Inserted notification for user_id: {user_id}")
#             except ClientError as e:
#                 error_message = e.response['Error']['Message']
                
    
#     except NoCredentialsError:
#         print("Error: AWS credentials not found.")
#     except PartialCredentialsError:
#         print("Error: Incomplete AWS credentials.")
#     except ClientError as e:
#         print(f"ClientError: {e.response['Error']['Message']}")
#         print("Full Error:", e)
#     except Exception as e:
#         print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    update_existing_records()

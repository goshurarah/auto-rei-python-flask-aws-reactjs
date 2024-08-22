import os
from dotenv import load_dotenv
from flask import Flask
from flask_mail import Mail
from flask_bcrypt import Bcrypt
import boto3

load_dotenv()
mail = Mail()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL') == 'True'
    app.config['MAIL_MAX_EMAILS'] = os.getenv('MAIL_MAX_EMAILS')
    app.config['MAIL_ASCII_ATTACHMENTS'] = os.getenv('MAIL_ASCII_ATTACHMENTS')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')


    # app.config['MAIL_SERVER'] = os.getenv('MAILGUN_SMTP_SERVER')
    # app.config['MAIL_PORT'] = int(os.getenv('MAILGUN_SMTP_PORT'))
    # app.config['MAIL_USERNAME'] = os.getenv('MAILGUN_SMTP_LOGIN')
    # app.config['MAIL_PASSWORD'] = os.getenv('MAILGUN_SMTP_PASSWORD')
    # app.config['MAIL_USE_TLS'] = True  # Use TLS
    # app.config['MAIL_USE_SSL'] = False  # Do not use SSL
    # app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

    mail.init_app(app)
    bcrypt.init_app(app)

    # Initialize AWS DynamoDB with credentials
    boto3.setup_default_session(
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION_NAME')
    )

    from .routes.properties import properties as properties_blueprint
    from .routes.auth import auth as auth_blueprint
    from .routes.profile import profile as profile_blueprint
    from .routes.offer import offer as offer_blueprint
    from .routes.savedList import savedList as savedList_blueprint
    from .routes.saveFilters import saveFilter as saveFilter_blueprint
    from .routes.offerSent import offerSent as offerSent_blueprint
    # from .routes.schedularTracking import schedularTracking as schedularTracking_blueprint
    # from .routes.crmOffersTracking import crmOffersTracking as crmOffersTracking_blueprint
    from .routes.notification import notifications as notifications_blueprint
    app.register_blueprint(properties_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(profile_blueprint)
    app.register_blueprint(offer_blueprint)
    app.register_blueprint(savedList_blueprint)
    app.register_blueprint(saveFilter_blueprint)
    app.register_blueprint(offerSent_blueprint)
    # app.register_blueprint(schedularTracking_blueprint)
    # app.register_blueprint(crmOffersTracking_blueprint)
    app.register_blueprint(notifications_blueprint)

    return app

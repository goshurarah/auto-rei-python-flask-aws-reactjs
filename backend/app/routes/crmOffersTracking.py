import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
from app.models.crmOffersTracking import CrmOffersTracking
import jwt

load_dotenv()
crmOffersTracking = Blueprint('CrmOffersTracking', __name__)
CORS(crmOffersTracking)

crmOffersTracking_model = CrmOffersTracking()

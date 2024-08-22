import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from flask_cors import CORS
from app.models.schedularTracking import SchedularTracking
import jwt

load_dotenv()
schedularTracking = Blueprint('schedularTracking', __name__)
CORS(schedularTracking)

schedularTracking_model = SchedularTracking()

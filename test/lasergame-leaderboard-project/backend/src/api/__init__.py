from flask import Blueprint

api = Blueprint('api', __name__)

from .leaderboard import *  # Import leaderboard routes and functions
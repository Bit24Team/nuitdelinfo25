from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from api.leaderboard import leaderboard_bp
import os

app = Flask(__name__)

# Load configuration from environment variables or a config file
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///leaderboard.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Register the leaderboard blueprint
app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')

@app.route('/')
def index():
    return "Welcome to the Laser Game Leaderboard API!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(host='0.0.0.0', port=5000)
from flask import Blueprint, request, jsonify
from ..db.models import db, LeaderboardEntry

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    entries = LeaderboardEntry.query.order_by(LeaderboardEntry.score.desc()).limit(10).all()
    return jsonify([{'name': entry.name, 'score': entry.score} for entry in entries])

@leaderboard_bp.route('/leaderboard', methods=['POST'])
def post_score():
    data = request.json
    name = data.get('name', 'Anonymous')
    score = data.get('score', 0)

    new_entry = LeaderboardEntry(name=name, score=score)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Score added successfully!'}), 201
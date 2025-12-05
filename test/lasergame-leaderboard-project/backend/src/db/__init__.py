from .models import db, LeaderboardEntry

def init_db():
    db.create_all()
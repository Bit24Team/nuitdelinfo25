from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class LeaderboardEntry(Base):
    __tablename__ = 'leaderboard'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    score = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<LeaderboardEntry(name={self.name}, score={self.score})>"
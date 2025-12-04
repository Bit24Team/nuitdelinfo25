import os

class Config:
    DEBUG = False
    TESTING = False
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///lasergame.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = os.getenv('DEV_DATABASE_URI', 'sqlite:///dev_lasergame.db')

class TestingConfig(Config):
    TESTING = True
    DATABASE_URI = os.getenv('TEST_DATABASE_URI', 'sqlite:///test_lasergame.db')

class ProductionConfig(Config):
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///lasergame.db')
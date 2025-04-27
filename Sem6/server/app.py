from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from config import Config

# Import controllers
from controllers.auth_controller import auth_bp
from controllers.community_controller import community_bp
from controllers.chat_controller import chat_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# Setup MongoDB connection
if not app.config.get('MONGODB_URI'):
    raise ValueError("MONGODB_URI configuration is missing")

try:
    mongo_client = MongoClient(app.config['MONGODB_URI'])
    db = mongo_client.get_database()
    print(f"Connected to MongoDB Atlas: {db.name}")
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {e}")
    raise

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(community_bp, url_prefix='/api/communities')
app.register_blueprint(chat_bp, url_prefix='/api/chats')

# Make db accessible to routes
@app.before_request
def before_request():
    app.db = db

if __name__ == '__main__':
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
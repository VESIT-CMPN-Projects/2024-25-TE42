from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from models import User
from utils.auth_utils import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({"error": "Missing required fields"}), 400
        
        username = data['username']
        email = data['email']
        password = data['password']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password strength
        if not validate_password(password):
            return jsonify({"error": "Password must be at least 8 characters with letters, numbers and special characters"}), 400
        
        # Check if email already exists
        existing_user = User.get_user_by_email(current_app.db, email)
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Check if username already exists
        existing_username = User.get_user_by_username(current_app.db, username)
        if existing_username:
            return jsonify({"error": "Username already taken"}), 409
        
        # Create user
        user = User.create_user(current_app.db, username, email, password)
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "user": {
                "id": str(user['_id']),
                "username": user['username'],
                "email": user['email']
            }
        }), 201
        
    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({"error": "Server error during registration"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password']):
            return jsonify({"error": "Missing email or password"}), 400
        
        email = data['email']
        password = data['password']
        
        # Find user by email
        user = User.get_user_by_email(current_app.db, email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Verify password
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": str(user['_id']),
                "username": user['username'],
                "email": user['email']
            }
        }), 200
        
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"error": "Server error during login"}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get user from database
        user = User.get_user_by_id(current_app.db, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Format response
        return jsonify({
            "id": str(user['_id']),
            "username": user['username'],
            "email": user['email'],
            "bio": user.get('bio', ''),
            "profile_pic": user.get('profile_pic'),
            "communities": [str(c) for c in user.get('communities', [])],
            "created_at": user.get('created_at').isoformat() if 'created_at' in user else None
        }), 200
        
    except Exception as e:
        print(f"Error in get_profile: {e}")
        return jsonify({"error": "Server error retrieving profile"}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get user from database (to confirm existence)
        user = User.get_user_by_id(current_app.db, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        
        # Fields that can be updated
        allowed_fields = ['bio', 'profile_pic']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # Update user
        success = User.update_user(current_app.db, user_id, update_data)
        if not success:
            return jsonify({"error": "Failed to update profile"}), 500
        
        # Get updated user
        updated_user = User.get_user_by_id(current_app.db, user_id)
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "id": str(updated_user['_id']),
                "username": updated_user['username'],
                "email": updated_user['email'],
                "bio": updated_user.get('bio', ''),
                "profile_pic": updated_user.get('profile_pic')
            }
        }), 200
        
    except Exception as e:
        print(f"Error in update_profile: {e}")
        return jsonify({"error": "Server error updating profile"}), 500
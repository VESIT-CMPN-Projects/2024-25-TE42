from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from models import Community, User

community_bp = Blueprint('community', __name__)

@community_bp.route('/', methods=['POST'])
@jwt_required()
def create_community():
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['name', 'description']):
            return jsonify({"error": "Missing name or description"}), 400
        
        name = data['name']
        description = data['description']
        
        # Check if community name already exists
        existing_community = Community.get_community_by_name(current_app.db, name)
        if existing_community:
            return jsonify({"error": "Community name already exists"}), 409
        
        # Create community
        community = Community.create_community(current_app.db, name, description, user_id)
        
        return jsonify({
            "message": "Community created successfully",
            "community": {
                "id": str(community['_id']),
                "name": community['name'],
                "description": community['description'],
                "creator_id": str(community['creator_id']),
                "members_count": len(community['members']),
                "created_at": community['created_at'].isoformat()
            }
        }), 201
        
    except Exception as e:
        print(f"Error in create_community: {e}")
        return jsonify({"error": "Server error creating community"}), 500

@community_bp.route('/', methods=['GET'])
@jwt_required()
def get_communities():
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get communities where user is a member
        communities = Community.get_user_communities(current_app.db, user_id)
        
        # Format response
        formatted_communities = []
        for community in communities:
            formatted_communities.append({
                "id": str(community['_id']),
                "name": community['name'],
                "description": community['description'],
                "creator_id": str(community['creator_id']),
                "members_count": len(community['members']),
                "is_admin": ObjectId(user_id) in community.get('admins', []),
                "created_at": community['created_at'].isoformat()
            })
        
        return jsonify({"communities": formatted_communities}), 200
        
    except Exception as e:
        print(f"Error in get_communities: {e}")
        return jsonify({"error": "Server error retrieving communities"}), 500

@community_bp.route('/<community_id>', methods=['GET'])
@jwt_required()
def get_community(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is a member
        if ObjectId(user_id) not in community['members']:
            return jsonify({"error": "You are not a member of this community"}), 403
        
        # Format response
        return jsonify({
            "id": str(community['_id']),
            "name": community['name'],
            "description": community['description'],
            "creator_id": str(community['creator_id']),
            "members_count": len(community['members']),
            "is_admin": ObjectId(user_id) in community.get('admins', []),
            "created_at": community['created_at'].isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error in get_community: {e}")
        return jsonify({"error": "Server error retrieving community"}), 500

@community_bp.route('/<community_id>', methods=['PUT'])
@jwt_required()
def update_community(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is an admin
        if ObjectId(user_id) not in community.get('admins', []):
            return jsonify({"error": "You are not an admin of this community"}), 403
        
        data = request.get_json()
        
        # Fields that can be updated
        allowed_fields = ['name', 'description']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # If updating name, check if new name already exists
        if 'name' in update_data and update_data['name'] != community['name']:
            existing_community = Community.get_community_by_name(current_app.db, update_data['name'])
            if existing_community:
                return jsonify({"error": "Community name already exists"}), 409
        
        # Update community
        success = Community.update_community(current_app.db, community_id, update_data)
        if not success:
            return jsonify({"error": "Failed to update community"}), 500
        
        # Get updated community
        updated_community = Community.get_community_by_id(current_app.db, community_id)
        
        return jsonify({
            "message": "Community updated successfully",
            "community": {
                "id": str(updated_community['_id']),
                "name": updated_community['name'],
                "description": updated_community['description'],
                "creator_id": str(updated_community['creator_id']),
                "members_count": len(updated_community['members']),
                "is_admin": ObjectId(user_id) in updated_community.get('admins', []),
                "updated_at": updated_community['updated_at'].isoformat()
            }
        }), 200
        
    except Exception as e:
        print(f"Error in update_community: {e}")
        return jsonify({"error": "Server error updating community"}), 500

@community_bp.route('/<community_id>/members', methods=['POST'])
@jwt_required()
def add_member(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Validate required fields
        if 'user_id' not in data:
            return jsonify({"error": "Missing user_id"}), 400
        
        member_id = data['user_id']
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is an admin
        if ObjectId(user_id) not in community.get('admins', []):
            return jsonify({"error": "You are not an admin of this community"}), 403
        
        # Check if member exists
        member = User.get_user_by_id(current_app.db, member_id)
        if not member:
            return jsonify({"error": "User not found"}), 404
        
        # Check if user is already a member
        if ObjectId(member_id) in community['members']:
            return jsonify({"error": "User is already a member of this community"}), 409
        
        # Add member to community
        success = Community.add_member(current_app.db, community_id, member_id)
        if not success:
            return jsonify({"error": "Failed to add member to community"}), 500
        
        return jsonify({"message": "Member added successfully"}), 200
        
    except Exception as e:
        print(f"Error in add_member: {e}")
        return jsonify({"error": "Server error adding member"}), 500

@community_bp.route('/<community_id>/members/<member_id>', methods=['DELETE'])
@jwt_required()
def remove_member(community_id, member_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is an admin or if user is removing themselves
        is_admin = ObjectId(user_id) in community.get('admins', [])
        is_self_remove = user_id == member_id
        
        if not (is_admin or is_self_remove):
            return jsonify({"error": "You do not have permission to remove this member"}), 403
        
        # Cannot remove the creator
        if str(community['creator_id']) == member_id and not is_self_remove:
            return jsonify({"error": "Cannot remove the community creator"}), 403
        
        # Check if member exists
        member = User.get_user_by_id(current_app.db, member_id)
        if not member:
            return jsonify({"error": "User not found"}), 404
        
        # Check if user is a member
        if ObjectId(member_id) not in community['members']:
            return jsonify({"error": "User is not a member of this community"}), 404
        
        # Remove member from community
        success = Community.remove_member(current_app.db, community_id, member_id)
        if not success:
            return jsonify({"error": "Failed to remove member from community"}), 500
        
        return jsonify({"message": "Member removed successfully"}), 200
        
    except Exception as e:
        print(f"Error in remove_member: {e}")
        return jsonify({"error": "Server error removing member"}), 500

@community_bp.route('/<community_id>/members', methods=['GET'])
@jwt_required()
def get_members(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is a member
        if ObjectId(user_id) not in community['members']:
            return jsonify({"error": "You are not a member of this community"}), 403
        
        # Get all members
        members = []
        for member_id in community['members']:
            member = User.get_user_by_id(current_app.db, member_id)
            if member:
                members.append({
                    "id": str(member['_id']),
                    "username": member['username'],
                    "profile_pic": member.get('profile_pic'),
                    "is_admin": member_id in community.get('admins', []),
                    "is_creator": member_id == community['creator_id']
                })
        
        return jsonify({"members": members}), 200
        
    except Exception as e:
        print(f"Error in get_members: {e}")
        return jsonify({"error": "Server error retrieving members"}), 500
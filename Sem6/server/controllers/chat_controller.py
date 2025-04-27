from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from models import Chat, Community, Message, User

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/community/<community_id>', methods=['POST'])
@jwt_required()
def create_chat(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Validate required fields
        if 'name' not in data:
            return jsonify({"error": "Missing chat name"}), 400
        
        name = data['name']
        is_group = data.get('is_group', False)
        participants = data.get('participants', [])
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is a member of the community
        if ObjectId(user_id) not in community['members']:
            return jsonify({"error": "You are not a member of this community"}), 403
        
        # Validate participants are members of the community
        valid_participants = []
        for p_id in participants:
            try:
                participant_obj_id = ObjectId(p_id)
                if participant_obj_id in community['members']:
                    valid_participants.append(p_id)
            except:
                pass
        
        # Create chat
        chat = Chat.create_chat(
            current_app.db,
            community_id,
            name,
            user_id,
            is_group=is_group,
            participants=valid_participants
        )
        
        return jsonify({
            "message": "Chat created successfully",
            "chat": {
                "id": str(chat['_id']),
                "name": chat['name'],
                "is_group": chat['is_group'],
                "community_id": str(chat['community_id']),
                "creator_id": str(chat['creator_id']),
                "participants_count": len(chat['participants']),
                "created_at": chat['created_at'].isoformat()
            }
        }), 201
        
    except Exception as e:
        print(f"Error in create_chat: {e}")
        return jsonify({"error": "Server error creating chat"}), 500

@chat_bp.route('/community/<community_id>', methods=['GET'])
@jwt_required()
def get_community_chats(community_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get community
        community = Community.get_community_by_id(current_app.db, community_id)
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if user is a member of the community
        if ObjectId(user_id) not in community['members']:
            return jsonify({"error": "You are not a member of this community"}), 403
        
        # Get chats
        chats = Chat.get_community_chats(current_app.db, community_id)
        
        # Filter chats where user is a participant
        user_chats = []
        for chat in chats:
            if ObjectId(user_id) in chat['participants']:
                # Get latest message
                latest_messages = Message.get_chat_messages(current_app.db, str(chat['_id']), limit=1)
                latest_message = None
                if latest_messages:
                    msg = latest_messages[0]
                    sender = User.get_user_by_id(current_app.db, msg['sender_id'])
                    sender_name = sender['username'] if sender else "Unknown"
                    latest_message = {
                        "id": str(msg['_id']),
                        "content": msg['content'],
                        "sender_name": sender_name,
                        "created_at": msg['created_at'].isoformat()
                    }
                
                user_chats.append({
                    "id": str(chat['_id']),
                    "name": chat['name'],
                    "is_group": chat['is_group'],
                    "community_id": str(chat['community_id']),
                    "creator_id": str(chat['creator_id']),
                    "participants_count": len(chat['participants']),
                    "created_at": chat['created_at'].isoformat(),
                    "latest_message": latest_message
                })
        
        return jsonify({"chats": user_chats}), 200
        
    except Exception as e:
        print(f"Error in get_community_chats: {e}")
        return jsonify({"error": "Server error retrieving chats"}), 500

@chat_bp.route('/<chat_id>', methods=['GET'])
@jwt_required()
def get_chat(chat_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get chat
        chat = Chat.get_chat_by_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Check if user is a participant
        if ObjectId(user_id) not in chat['participants']:
            return jsonify({"error": "You are not a participant in this chat"}), 403
        
        # Get community
        community = Community.get_community_by_id(current_app.db, chat['community_id'])
        
        # Get participants info
        participants = []
        for p_id in chat['participants']:
            participant = User.get_user_by_id(current_app.db, p_id)
            if participant:
                participants.append({
                    "id": str(participant['_id']),
                    "username": participant['username'],
                    "profile_pic": participant.get('profile_pic')
                })
        
        return jsonify({
            "id": str(chat['_id']),
            "name": chat['name'],
            "is_group": chat['is_group'],
            "community_id": str(chat['community_id']),
            "community_name": community['name'] if community else "Unknown",
            "creator_id": str(chat['creator_id']),
            "participants": participants,
            "created_at": chat['created_at'].isoformat(),
            "updated_at": chat['updated_at'].isoformat() 
        }), 200
        
    except Exception as e:
        print(f"Error in get_chat: {e}")
        return jsonify({"error": "Server error retrieving chat"}), 500

@chat_bp.route('/<chat_id>/messages', methods=['POST'])
@jwt_required()
def create_message(chat_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Validate required fields
        if 'content' not in data:
            return jsonify({"error": "Missing message content"}), 400
        
        content = data['content']
        
        # Get chat
        chat = Chat.get_chat_by_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Check if user is a participant
        if ObjectId(user_id) not in chat['participants']:
            return jsonify({"error": "You are not a participant in this chat"}), 403
        
        # Create message
        message = Message.create_message(current_app.db, chat_id, user_id, content)
        
        # Get sender info
        sender = User.get_user_by_id(current_app.db, user_id)
        
        return jsonify({
            "message": "Message sent successfully",
            "chat_message": {
                "id": str(message['_id']),
                "chat_id": str(message['chat_id']),
                "sender_id": str(message['sender_id']),
                "sender_name": sender['username'] if sender else "Unknown",
                "content": message['content'],
                "created_at": message['created_at'].isoformat()
            }
        }), 201
        
    except Exception as e:
        print(f"Error in create_message: {e}")
        return jsonify({"error": "Server error sending message"}), 500

@chat_bp.route('/<chat_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get pagination parameters
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        # Get chat
        chat = Chat.get_chat_by_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Check if user is a participant
        if ObjectId(user_id) not in chat['participants']:
            return jsonify({"error": "You are not a participant in this chat"}), 403
        
        # Get messages
        messages = Message.get_chat_messages(current_app.db, chat_id, limit=limit, skip=skip)
        
        # Mark messages as read
        for msg in messages:
            if ObjectId(user_id) not in msg.get('read_by', []):
                Message.mark_as_read(current_app.db, str(msg['_id']), user_id)
        
        # Format messages
        formatted_messages = []
        for msg in messages:
            sender = User.get_user_by_id(current_app.db, msg['sender_id'])
            formatted_messages.append({
                "id": str(msg['_id']),
                "chat_id": str(msg['chat_id']),
                "sender_id": str(msg['sender_id']),
                "sender_name": sender['username'] if sender else "Unknown",
                "content": msg['content'],
                "read_by": [str(uid) for uid in msg.get('read_by', [])],
                "created_at": msg['created_at'].isoformat()
            })
        
        return jsonify({
            "messages": formatted_messages,
            "pagination": {
                "limit": limit,
                "skip": skip,
                "has_more": len(messages) == limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error in get_messages: {e}")
        return jsonify({"error": "Server error retrieving messages"}), 500

@chat_bp.route('/<chat_id>/participants', methods=['POST'])
@jwt_required()
def add_participant(chat_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        # Validate required fields
        if 'user_id' not in data:
            return jsonify({"error": "Missing user_id"}), 400
        
        participant_id = data['user_id']
        
        # Get chat
        chat = Chat.get_chat_by_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Check if user is the creator or in a group chat
        if str(chat['creator_id']) != user_id and not chat['is_group']:
            return jsonify({"error": "Only the chat creator can add participants to private chats"}), 403
        
        # Get community
        community = Community.get_community_by_id(current_app.db, chat['community_id'])
        if not community:
            return jsonify({"error": "Community not found"}), 404
        
        # Check if the participant is a member of the community
        if ObjectId(participant_id) not in community['members']:
            return jsonify({"error": "User is not a member of this community"}), 400
        
        # Check if user is already a participant
        if ObjectId(participant_id) in chat['participants']:
            return jsonify({"error": "User is already a participant in this chat"}), 409
        
        # Add participant
        success = Chat.add_participant(current_app.db, chat_id, participant_id)
        if not success:
            return jsonify({"error": "Failed to add participant to chat"}), 500
        
        return jsonify({"message": "Participant added successfully"}), 200
        
    except Exception as e:
        print(f"Error in add_participant: {e}")
        return jsonify({"error": "Server error adding participant"}), 500

@chat_bp.route('/<chat_id>/participants/<participant_id>', methods=['DELETE'])
@jwt_required()
def remove_participant(chat_id, participant_id):
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Get chat
        chat = Chat.get_chat_by_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Check if user is the creator or self-removing
        is_creator = str(chat['creator_id']) == user_id
        is_self_remove = user_id == participant_id
        
        if not (is_creator or is_self_remove):
            return jsonify({"error": "You don't have permission to remove this participant"}), 403
        
        # Cannot remove the creator
        if str(chat['creator_id']) == participant_id and not is_self_remove:
            return jsonify({"error": "Cannot remove the chat creator"}), 403
        
        # Check if participant is in the chat
        if ObjectId(participant_id) not in chat['participants']:
            return jsonify({"error": "User is not a participant in this chat"}), 404
        
        # Remove participant
        success = Chat.remove_participant(current_app.db, chat_id, participant_id)
        if not success:
            return jsonify({"error": "Failed to remove participant from chat"}), 500
        
        return jsonify({"message": "Participant removed successfully"}), 200
        
    except Exception as e:
        print(f"Error in remove_participant: {e}")
        return jsonify({"error": "Server error removing participant"}), 500
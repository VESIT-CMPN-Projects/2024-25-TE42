from bson import ObjectId
from datetime import datetime
from pymongo import MongoClient, ASCENDING, DESCENDING
from werkzeug.security import generate_password_hash

class Database:
    def __init__(self, mongo_uri):
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_database()
        self.setup_collections()
        self.create_indexes()
    
    def setup_collections(self):
        # Create collections if they don't exist
        if "users" not in self.db.list_collection_names():
            self.db.create_collection("users")
        
        if "communities" not in self.db.list_collection_names():
            self.db.create_collection("communities")
        
        if "chats" not in self.db.list_collection_names():
            self.db.create_collection("chats")
        
        if "messages" not in self.db.list_collection_names():
            self.db.create_collection("messages")
    
    def create_indexes(self):
        # Create indexes for better query performance
        self.db.users.create_index([("email", ASCENDING)], unique=True)
        self.db.users.create_index([("username", ASCENDING)], unique=True)
        
        self.db.communities.create_index([("name", ASCENDING)], unique=True)
        self.db.communities.create_index([("members", ASCENDING)])
        
        self.db.chats.create_index([("community_id", ASCENDING)])
        self.db.chats.create_index([("participants", ASCENDING)])
        
        self.db.messages.create_index([("chat_id", ASCENDING)])
        self.db.messages.create_index([("created_at", DESCENDING)])

# User Schema
class User:
    @staticmethod
    def create_user(db, username, email, password):
        user = {
            "username": username,
            "email": email,
            "password": generate_password_hash(password),
            "profile_pic": None,
            "bio": "",
            "communities": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = db.users.insert_one(user)
        user["_id"] = result.inserted_id
        return user

    @staticmethod
    def get_user_by_id(db, user_id):
        return db.users.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def get_user_by_email(db, email):
        return db.users.find_one({"email": email})
    
    @staticmethod
    def get_user_by_username(db, username):
        return db.users.find_one({"username": username})
    
    @staticmethod
    def update_user(db, user_id, update_data):
        update_data["updated_at"] = datetime.utcnow()
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

# Community Schema
class Community:
    @staticmethod
    def create_community(db, name, description, creator_id):
        community = {
            "name": name,
            "description": description,
            "creator_id": ObjectId(creator_id),
            "members": [ObjectId(creator_id)],
            "admins": [ObjectId(creator_id)],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = db.communities.insert_one(community)
        community["_id"] = result.inserted_id
        
        # Add community to user's communities
        db.users.update_one(
            {"_id": ObjectId(creator_id)},
            {"$push": {"communities": result.inserted_id}}
        )
        
        return community
    
    @staticmethod
    def get_community_by_id(db, community_id):
        return db.communities.find_one({"_id": ObjectId(community_id)})
    
    @staticmethod
    def get_community_by_name(db, name):
        return db.communities.find_one({"name": name})
    
    @staticmethod
    def get_user_communities(db, user_id):
        return list(db.communities.find({"members": ObjectId(user_id)}))
    
    @staticmethod
    def update_community(db, community_id, update_data):
        update_data["updated_at"] = datetime.utcnow()
        result = db.communities.update_one(
            {"_id": ObjectId(community_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def add_member(db, community_id, user_id):
        result = db.communities.update_one(
            {"_id": ObjectId(community_id)},
            {
                "$addToSet": {"members": ObjectId(user_id)},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        if result.modified_count > 0:
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"communities": ObjectId(community_id)}}
            )
        return result.modified_count > 0
    
    @staticmethod
    def remove_member(db, community_id, user_id):
        result = db.communities.update_one(
            {"_id": ObjectId(community_id)},
            {
                "$pull": {"members": ObjectId(user_id)},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        if result.modified_count > 0:
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"communities": ObjectId(community_id)}}
            )
        return result.modified_count > 0

# Chat Schema
class Chat:
    @staticmethod
    def create_chat(db, community_id, name, creator_id, is_group=False, participants=None):
        if participants is None:
            participants = [ObjectId(creator_id)]
        else:
            participants = [ObjectId(pid) for pid in participants]
            if ObjectId(creator_id) not in participants:
                participants.append(ObjectId(creator_id))
        
        chat = {
            "community_id": ObjectId(community_id),
            "name": name,
            "is_group": is_group,
            "creator_id": ObjectId(creator_id),
            "participants": participants,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = db.chats.insert_one(chat)
        chat["_id"] = result.inserted_id
        return chat
    
    @staticmethod
    def get_chat_by_id(db, chat_id):
        return db.chats.find_one({"_id": ObjectId(chat_id)})
    
    @staticmethod
    def get_community_chats(db, community_id):
        return list(db.chats.find({"community_id": ObjectId(community_id)}))
    
    @staticmethod
    def get_user_chats(db, user_id):
        return list(db.chats.find({"participants": ObjectId(user_id)}))
    
    @staticmethod
    def add_participant(db, chat_id, user_id):
        result = db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$addToSet": {"participants": ObjectId(user_id)},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0
    
    @staticmethod
    def remove_participant(db, chat_id, user_id):
        result = db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$pull": {"participants": ObjectId(user_id)},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0

# Message Schema
class Message:
    @staticmethod
    def create_message(db, chat_id, sender_id, content):
        message = {
            "chat_id": ObjectId(chat_id),
            "sender_id": ObjectId(sender_id),
            "content": content,
            "read_by": [ObjectId(sender_id)],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = db.messages.insert_one(message)
        message["_id"] = result.inserted_id
        
        # Update chat's updated_at
        db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        
        return message
    
    @staticmethod
    def get_chat_messages(db, chat_id, limit=50, skip=0):
        return list(
            db.messages.find({"chat_id": ObjectId(chat_id)})
            .sort("created_at", DESCENDING)
            .skip(skip)
            .limit(limit)
        )
    
    @staticmethod
    def mark_as_read(db, message_id, user_id):
        result = db.messages.update_one(
            {"_id": ObjectId(message_id)},
            {"$addToSet": {"read_by": ObjectId(user_id)}}
        )
        return result.modified_count > 0
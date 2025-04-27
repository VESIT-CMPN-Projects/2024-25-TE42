# Flask Community Chat Application

A Flask-based API for a community chat application with MongoDB Atlas integration.

## Features

- User authentication (register, login, profile management)
- Community management (create, update, member management)
- Chat functionality (create chats, send messages, add participants)
- MongoDB Atlas integration with PyMongo
- JWT-based authentication

## Setup

1. Clone the repository
2. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/community_chat
   JWT_SECRET_KEY=your-secret-key-change-in-production
   DEBUG=True
   PORT=5000
   HOST=0.0.0.0
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   python app.py
   ```

## Project Structure

```
/flask_community_chat
│── /config.py            # Configuration settings
│── /app.py               # Main application entry point
│── /models.py            # Database models and schemas
│── /controllers/         # API controllers
│     ├── auth_controller.py
│     ├── community_controller.py
│     ├── chat_controller.py
│── /utils/               # Utility functions
│     ├── auth_utils.py
│── /requirements.txt     # Project dependencies
│── /README.md            # Project documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login
- `GET /api/auth/profile`: Get user profile
- `PUT /api/auth/profile`: Update user profile

### Communities

- `POST /api/communities/`: Create a new community
- `GET /api/communities/`: Get user's communities
- `GET /api/communities/<community_id>`: Get community details
- `PUT /api/communities/<community_id>`: Update community
- `POST /api/communities/<community_id>/members`: Add member to community
- `DELETE /api/communities/<community_id>/members/<member_id>`: Remove member from community
- `GET /api/communities/<community_id>/members`: Get community members

### Chats

- `POST /api/chats/community/<community_id>`: Create a new chat
- `GET /api/chats/community/<community_id>`: Get community chats
- `GET /api/chats/<chat_id>`: Get chat details
- `POST /api/chats/<chat_id>/messages`: Send a message
- `GET /api/chats/<chat_id>/messages`: Get chat messages
- `POST /api/chats/<chat_id>/participants`: Add participant to chat
- `DELETE /api/chats/<chat_id>/participants/<participant_id>`: Remove participant from chat
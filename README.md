# Real-Time Chat Application

A full-stack real-time chat application built with Node.js, Express, Socket.IO, React, and MongoDB.

## Features

- ✅ Real-time messaging using Socket.IO
- ✅ User authentication (basic login)
- ✅ Chat history persistence with MongoDB
- ✅ Online users list
- ✅ Typing indicators
- ✅ Responsive design for mobile and desktop
- ✅ User join/leave notifications
- ✅ Modern and clean UI
- ✅ **Light/Dark theme toggle** for comfortable viewing
- ✅ **Clear chat** and **restore chat** controls
- ✅ **Delete and restore individual messages**
- ✅ **Tooltips** for enhanced usability
- ✅ **Date separators** and grouped messages for readability
- ✅ **Mobile-friendly sidebar and input controls**

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally on port 27017)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd real-time-chat
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Start the Backend Server

```bash
cd backend
npm start
# or for development with auto-restart
npm run dev
```

The backend server will start on `http://localhost:5000`

### 6. Start the Frontend Application

```bash
cd frontend
npm start
```

The React application will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a username to join the chat
3. Start sending messages in real-time!
4. See other users typing indicators and online status
5. View chat history that persists between sessions
6. **Switch between light and dark themes** using the theme toggle button in the header
7. **Clear the chat** using the clear chat button (with confirmation dialog)
8. **Restore deleted chats** using the restore button
9. **Delete individual messages** (with undo/restore option)
10. **Hover over icons and buttons** to see tooltips for guidance
11. **Enjoy a responsive UI** that adapts to mobile and desktop screens

## Project Structure

````
real-time-chat/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── models/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Chat.js
│   │   │   └── Chat.css
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md

## API Endpoints

- `GET /api/messages` - Get chat history
- `GET /api/online-users` - Get list of online users

## Socket.IO Events

### Client to Server:

- `user_login` - User joins the chat
- `send_message` - Send a new message
- `typing` - User starts typing
- `stop_typing` - User stops typing

### Server to Client:

- `new_message` - New message received
- `user_joined` - User joined notification
- `user_left` - User left notification
- `user_typing` - User typing indicator
- `user_stop_typing` - User stopped typing
- `online_users` - Updated online users list

## Technologies Used

### Backend:

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

### Frontend:

- **React** - UI library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
````

### Frontend Development

```bash
cd frontend
npm start    # React development server with hot reload
```

## Deployment

### Backend Deployment

1. Set environment variables (PORT, MONGODB_URI)
2. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

# Frontend - Real-Time Chat Application

This is the React frontend for the Real-Time Chat Application. It provides a modern, responsive, and feature-rich chat interface.

## Key Features

- **Real-time chat** with Socket.IO
- **User login** and online users sidebar
- **Light/Dark theme toggle** (top right corner)
- **Clear chat** and **restore chat** controls
- **Delete and restore individual messages**
- **Typing indicators**
- **Date separators** and grouped messages
- **Tooltips** for buttons and actions
- **Responsive design** for mobile and desktop

## UI Controls

- **Theme Toggle:** Click the sun/moon icon in the header to switch between light and dark mode.
- **Clear Chat:** Click the trash/bin icon to clear all messages (with confirmation dialog).
- **Restore Chat:** If chat is cleared, use the restore button to bring messages back.
- **Delete Message:** Click the delete icon on a message to remove it (with undo/restore option).
- **Tooltips:** Hover over icons and buttons for helpful tooltips.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/components/Chat.js` & `Chat.css`: Main chat UI and styles
- `src/components/Login.js` & `Login.css`: Login screen
- `src/App.js`: App entry point

## Customization

You can further customize the chat UI by editing the CSS in `src/components/Chat.css`.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). For advanced configuration, see the [CRA documentation](https://facebook.github.io/create-react-app/docs/getting-started).

//NOTE - When sending Broadcast from Frontend
UI → socket.emit()
        ↓
Socket.IO server
        ↓
Telegram bot
        ↓
Users


---------------
For media broadcasting, the dashboard supports both public URLs and direct file uploads. Uploaded files are streamed to the backend and sent as binary buffers via the Telegram Bot API, allowing Telegram to host the media without requiring public asset URLs.

-----------------

The backend initializes Socket.IO first, then injects it into the Telegram bot for real-time events. The Express app is created afterward with bot dependency injection to avoid circular dependencies.

------------------------

The dashboard provides a local preview layer for broadcast messages. Media previews are generated using object URLs for uploaded files and direct rendering for URLs, while actual delivery is handled separately via Socket.IO or REST uploads.

--------------------
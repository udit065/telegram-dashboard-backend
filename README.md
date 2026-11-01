# 📡 Telegram Bot Dashboard (Backend)

The API and bot server behind the [Telegram Bot Dashboard](https://github.com/udit065/telegram-dashboard-frontend). It receives messages from a Telegram bot, saves them in MongoDB, streams them to the dashboard in real time, and sends replies and broadcasts back through the Telegram Bot API.

## Features
- **Telegram bot** using `node-telegram-bot-api` that saves users and incoming messages
- **Real-time events** over Socket.IO, pushed to the dashboard as messages arrive
- **Replies** from the dashboard to a single user
- **Broadcasts** of text, photos and videos to all users. Uploaded files are streamed to Telegram as binary buffers, so the media doesn't need a public URL.
- **Stats API** for message, user, replied and unreplied counts
- **Capped history**: the oldest messages are deleted once there are more than 500, so storage stays flat on free tiers

## Tech stack
Node.js · Express · MongoDB / Mongoose · Socket.IO · node-telegram-bot-api · Multer

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/messages` | Message history |
| POST | `/reply` | Reply to a user |
| GET | `/stats` | Dashboard counts |
| POST | `/upload/photo` | Broadcast an uploaded photo |
| POST | `/upload/video` | Broadcast an uploaded video |

## Architecture
```
Dashboard UI ──socket.emit()──▶ Socket.IO server ──▶ Telegram bot ──▶ Users
Users ──▶ Telegram bot ──▶ MongoDB + Socket.IO ──▶ Dashboard UI (live)
```
Socket.IO is set up first and then injected into the bot. The Express app is created after that, with the bot passed in, which avoids circular dependencies.

## Run locally
```bash
npm install
# create .env with:
#   BOT_TOKEN=<Telegram bot token from @BotFather>
#   MONGO_URI=<MongoDB connection string>
#   ADMIN_ID=<your Telegram chat id>
#   CLIENT_URL=http://localhost:3000
#   PORT=5000
npm run dev
```

## Author
**Udit Yadav** · [GitHub](https://github.com/udit065) · [LinkedIn](https://www.linkedin.com/in/udit-yadav065)

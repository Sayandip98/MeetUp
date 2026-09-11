<div align="center">

# 🎥 Meet-up

**A full-stack video conferencing platform built with the MERN stack, Socket.io, and WebRTC.**

Real-time video calls, screen sharing, live chat, and host-controlled meeting rooms — built from scratch to understand how apps like Zoom and Google Meet actually work under the hood.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P-333333?logo=webrtc&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-blue)

</div>

---

## ✨ Features

| | |
|---|---|
| 🔐 **Authentication** | JWT-based register/login with protected routes |
| 📅 **Meetings** | Create instant meetings or join with a shareable code |
| 📹 **Live Video & Audio** | Peer-to-peer WebRTC — media never touches the server |
| 🖥️ **Screen Sharing** | Swap your camera feed for your screen mid-call |
| 💬 **Real-time Chat** | Persisted per meeting, synced instantly across all participants |
| 🛡️ **Host Controls** | Waiting room with admit/deny, mute and remove participants |
| 👤 **Profile Management** | Update your name and upload an avatar via Cloudinary |
| 🚦 **Rate Limiting** | Brute-force protection on auth, general API throttling |

---

## 🛠️ Tech Stack

**Frontend** — React (Vite) · React Router · Axios · Socket.io-client · Native WebRTC APIs · Plain CSS

**Backend** — Node.js · Express · MongoDB (Mongoose) · Socket.io · JWT · bcryptjs · Multer · Cloudinary · express-rate-limit

---

## 📁 Project Structure

```
Meet-up/
├── backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose schemas (User, Meeting, Message)
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth guard, error handler, rate limiters, file upload
│   ├── socket/          # Socket.io connection, room/chat/WebRTC/participant handlers
│   ├── services/        # Business logic layer
│   ├── utils/           # Token generation, meeting ID generation, room tracking
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/             # Route-level views
        ├── components/
        │   ├── auth/          # Login/Register forms
        │   ├── meeting/       # Video grid, controls, chat, participants, etc.
        │   ├── layout/        # Header, Sidebar
        │   └── common/        # Reusable Button, Loader, Navbar, ProtectedRoute
        ├── context/           # AuthContext, MeetingContext
        ├── hooks/             # useAuth, useSocket, useWebRTC, useMediaStream, useScreenShare
        ├── services/          # Axios API wrappers
        ├── socket/            # Socket.io client + shared event constants
        ├── utils/             # Validators, constants, meeting helpers
        └── styles/            # Global + per-page CSS
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js v18+
- MongoDB (local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com) account *(optional — only needed for avatar uploads)*

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/meetup

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

Verify it's running: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit **http://localhost:5173**

---

## ☁️ Deployment

Deploying this app means hosting **three** separate pieces: the database, the backend API + Socket.io server, and the frontend. Here's the recommended path.

### 1. Database — MongoDB Atlas

Local MongoDB won't be reachable from a deployed backend. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), whitelist all IPs (`0.0.0.0/0`) for simplicity, and copy the connection string — you'll use it as `MONGO_URI`.

### 2. Backend — Render (or Railway)

Socket.io needs a **persistent Node process**, which rules out serverless platforms like Vercel for the backend. [Render](https://render.com) and [Railway](https://railway.app) both offer straightforward free/low-cost Node hosting with WebSocket support.

**On Render:**

1. Push your `backend/` folder to a GitHub repo.
2. Create a new **Web Service** on Render, connect the repo.
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render's dashboard (same keys as your local `.env`):

   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | from your Cloudinary dashboard |
   | `CLIENT_URL` | *(fill in after deploying the frontend — see below)* |
   | `NODE_ENV` | `production` |

5. Deploy. Render will give you a URL like `https://meetup-backend.onrender.com`.

### 3. Frontend — Vercel or Netlify

**On Vercel:**

1. Push your `frontend/` folder to a GitHub repo (or a subfolder of the same repo).
2. Import the project at [vercel.com](https://vercel.com), set the **root directory** to `frontend` if it's a monorepo.
3. Add an environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://meetup-backend.onrender.com/api` |

4. Deploy. Vercel will give you a URL like `https://meetup.vercel.app`.

**On Netlify:** the process is nearly identical — import the repo, set the build command to `npm run build`, publish directory to `dist`, and add the same `VITE_API_URL` environment variable under Site Settings → Environment Variables.

### 4. Connect Them

Go back to your **backend's** Render environment variables and set:

```env
CLIENT_URL=https://meetup.vercel.app
```

Redeploy the backend so the updated CORS origin takes effect. Your frontend and backend are now fully connected in production.

> ⚠️ **HTTPS is required** for camera/mic access on any domain other than `localhost`. Both Render and Vercel/Netlify provide HTTPS automatically, so this is handled for you once deployed.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | – | Create an account |
| `POST` | `/api/auth/login` | – | Log in, returns a JWT |
| `GET` | `/api/meetings` | ✅ | List your meetings |
| `POST` | `/api/meetings` | ✅ | Create a meeting |
| `GET` | `/api/meetings/:meetingId` | ✅ | Get meeting details |
| `GET` | `/api/users/profile` | ✅ | Get your profile |
| `PUT` | `/api/users/profile` | ✅ | Update your name |
| `PUT` | `/api/users/profile/avatar` | ✅ | Upload an avatar image |

## 🔌 Socket Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Request to join a meeting room |
| `room-joined` | Server → Client | Confirms join, sends participants + host flag |
| `waiting-for-approval` | Server → Client | Non-host placed in the waiting room |
| `admit-participant` / `deny-participant` | Client → Server | Host approves/rejects a waiting user |
| `user-joined` / `user-left` | Server → Client | Room presence updates |
| `webrtc-offer` / `webrtc-answer` / `webrtc-ice-candidate` | Bidirectional | WebRTC signaling relay |
| `send-message` / `new-message` | Bidirectional | Real-time chat |
| `mute-participant` / `force-muted` | Host → Target | Host mutes a participant |
| `remove-participant` / `removed-from-meeting` | Host → Target | Host removes a participant |

---

## ⚠️ Known Limitations

- **STUN only, no TURN server** — calls may fail behind strict corporate firewalls/NAT. Add a TURN provider (Twilio, Metered) for production reliability.
- **Peer-to-peer mesh topology** — every participant connects directly to every other. Works well for small calls, but doesn't scale efficiently much past 4–6 people; a production-scale app would use an SFU media server instead.

---

<div align="center">

Built as a learning project to understand real-time systems, WebRTC, and full-stack architecture from the ground up.

</div>
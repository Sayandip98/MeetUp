<div align="center">

# 🎥 Meet-up

### A full-stack video conferencing platform — built from scratch to understand real-time systems.

Peer-to-peer video calls, live chat, screen sharing, and host-moderated rooms — powered by a custom MERN backend, Socket.io signaling, and native WebRTC. No third-party video SDK. No shortcuts.

[**🚀 Live Demo**](https://meet-up-psi-henna.vercel.app) &nbsp;·&nbsp; [**🔧 API / Backend**](https://meet-up-uwat.onrender.com/api/health) &nbsp;·&nbsp; [**📂 Source Code**](#)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P-333333?logo=webrtc&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

---

## 💡 Why This Project

Most "clone" projects wrap a video SDK (like Agora or Twilio) and call it done. This one doesn't. Every layer — the signaling server, the peer connection handshake, the room presence system, the host permission model — is hand-built, to actually understand *how* real-time video conferencing works rather than just consume an API that hides it.

That meant solving real problems most tutorials skip:
- Designing a signaling protocol on top of raw Socket.io events
- Getting WebRTC's offer/answer/ICE-candidate exchange right for a **multi-peer mesh**, not just a 1:1 call
- Building server-side permission enforcement (a malicious client calling a "remove participant" event should never work unless the server independently verifies host status)
- Debugging real distributed-systems issues — race conditions from React's Strict Mode double-invoking effects, CORS across dev/prod origins, stale in-memory state — the kind of bugs that don't show up until multiple real clients are actually connected

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | JWT-based auth, bcrypt password hashing, protected routes on both API and socket layers |
| 📅 **Meeting Management** | Create instant meetings or join via a shareable, human-readable code |
| 📹 **Live Video & Audio** | True peer-to-peer WebRTC — video/audio never passes through the server |
| 🖥️ **Screen Sharing** | Live track-swapping on active peer connections, no renegotiation needed |
| 💬 **Real-time Chat** | Persisted to MongoDB, broadcast instantly via Socket.io rooms |
| 🛡️ **Host Controls** | Waiting room with admit/deny, force-mute, and remove — enforced server-side, not just hidden in the UI |
| 👤 **Profile Management** | Editable display name, avatar upload via Cloudinary |
| 🚦 **Production Hardening** | Rate limiting on auth endpoints, centralized error handling, CORS-locked API |

---

## 🏗️ Architecture

```
┌─────────────┐         REST (Axios)          ┌──────────────┐
│             │ ──────────────────────────────▶│              │
│   React     │                                 │   Express    │
│  (Vercel)   │◀────────────────────────────────│   (Render)   │
│             │                                 │              │
└──────┬──────┘                                 └──────┬───────┘
       │                                                │
       │           Socket.io (signaling)                │
       │◀──────────────────────────────────────────────▶│
       │                                                │
       │                                          ┌──────▼───────┐
       │                                          │   MongoDB    │
       │                                          │   Atlas      │
       │                                          └──────────────┘
       │
       │        WebRTC (direct peer-to-peer, post-handshake)
       │◀───────────────────────────────────────▶  Other Client
```

**The key architectural decision:** REST handles anything persistent and stateless (auth, meeting records, profile data). Socket.io handles anything real-time and ephemeral (room presence, WebRTC signaling, chat delivery, host commands). Actual video/audio bypasses the server entirely once peers are connected — the server's role is strictly matchmaking, never media relay.

---

## 🛠️ Tech Stack

**Frontend**
- React 18 (Vite) — component architecture, custom hooks for media/socket/WebRTC lifecycle management
- React Router — protected routes, dynamic meeting URLs
- Axios — interceptor-based JWT attachment
- Socket.io-client — real-time bidirectional events
- Native `RTCPeerConnection` / `getUserMedia` / `getDisplayMedia` APIs — no WebRTC wrapper library
- Plain CSS with a custom design token system (no framework dependency)

**Backend**
- Node.js + Express — layered architecture (routes → controllers → services → models)
- MongoDB + Mongoose — schema validation, population, indexed lookups
- Socket.io — namespaced event handlers for room, chat, WebRTC signaling, and participant management
- JWT + bcryptjs — stateless auth, salted password hashing
- Multer + Cloudinary — in-memory file handling, cloud image storage
- express-rate-limit — tiered rate limiting (strict on auth, general on the rest of the API)

**Infrastructure**
- MongoDB Atlas (database) · Render (API + WebSocket server) · Vercel (static frontend)

---

## 📁 Project Structure

```
Meet-up/
├── backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Request handlers (HTTP layer only)
│   ├── models/          # Mongoose schemas: User, Meeting, Message
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth guard, error handler, rate limiters, uploads
│   ├── socket/          # Connection, room, chat, WebRTC signaling, participant handlers
│   ├── services/        # Business logic (HTTP-agnostic)
│   ├── utils/           # Token/ID generation, in-memory room tracking
│   ├── app.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/             # Route-level views
        ├── components/
        │   ├── auth/          # Login / Register forms
        │   ├── meeting/       # Video grid, controls, chat, participants
        │   ├── layout/        # Header, Sidebar
        │   └── common/        # Button, Loader, Navbar, ProtectedRoute
        ├── context/           # AuthContext, MeetingContext (global state)
        ├── hooks/             # useAuth, useSocket, useWebRTC, useMediaStream, useScreenShare
        ├── services/          # Axios API layer
        ├── socket/            # Socket client + shared event constants
        ├── utils/             # Validators, constants, helpers
        └── styles/            # Design-token-based CSS
```

---

## 🚀 Running Locally

### Prerequisites
Node.js 18+, MongoDB (local or Atlas), a free Cloudinary account (optional, for avatars).

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, etc.
npm run dev
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

Visit `http://localhost:5173`.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | – | Create an account |
| `POST` | `/api/auth/login` | – | Authenticate, returns JWT |
| `GET` | `/api/meetings` | ✅ | List the current user's meetings |
| `POST` | `/api/meetings` | ✅ | Create a new meeting |
| `GET` | `/api/meetings/:meetingId` | ✅ | Fetch meeting details |
| `GET` | `/api/users/profile` | ✅ | Fetch current user's profile |
| `PUT` | `/api/users/profile` | ✅ | Update display name |
| `PUT` | `/api/users/profile/avatar` | ✅ | Upload avatar (multipart) |

## 🔌 Socket Event Protocol

| Event | Direction | Purpose |
|---|---|---|
| `join-room` | → Server | Request entry to a meeting |
| `room-joined` | ← Server | Confirms entry, sends peer list + host flag |
| `waiting-for-approval` | ← Server | Non-host routed to the waiting room |
| `admit-participant` / `deny-participant` | → Server | Host resolves a waiting request |
| `user-joined` / `user-left` | ← Server | Room presence updates |
| `webrtc-offer` / `webrtc-answer` / `webrtc-ice-candidate` | ⇄ | Peer connection handshake relay |
| `send-message` / `new-message` | ⇄ | Real-time chat |
| `mute-participant` / `force-muted` | Host → Target | Server-enforced remote mute |
| `remove-participant` / `removed-from-meeting` | Host → Target | Server-enforced ejection |

---

## 🧠 Engineering Highlights

- **Server-verified permissions, not client-trusted ones.** Every host-only socket action (`admit`, `mute`, `remove`) is checked against `socket.isHost` — a flag derived from the database's `meeting.host` field at join time, not something the client can spoof.
- **Correct WebRTC mesh handshake asymmetry.** Newly-joining peers initiate offers to everyone already present; existing peers only respond — avoiding duplicate or conflicting connection attempts in a multi-party call.
- **Debugged real concurrency bugs**, including a React Strict Mode double-socket-connection race condition and an off-by-one in room-membership broadcasting that caused a client to see itself listed as a separate participant.
- **Layered backend architecture** — controllers never touch Mongoose directly; all business logic lives in a service layer, making the codebase testable and the HTTP layer thin.

---

## ⚠️ Known Limitations

- **STUN only, no TURN server** — connections may fail behind strict corporate NAT/firewalls. A production deployment would add a TURN provider (Twilio, Metered).
- **Peer-to-peer mesh topology** — scales well for small groups but not efficiently past 4–6 participants; a larger-scale system would introduce an SFU media server.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute with attribution.

---

<div align="center">

**Built by [Your Name]** — [LinkedIn](#) · [GitHub](#) · [Portfolio](#)

</div>

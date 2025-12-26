DevGram (devgram_web)
A React + TypeScript front-end for a social/chat application (DevGram).
This repository contains the web client built with Vite, React 19, TypeScript, TailwindCSS + DaisyUI and Socket.IO client integration for real-time chat and presence.

Note: This frontend expects a separate backend API (see "Backend / API" below). The front-end uses cookies for authentication (axios withCredentials = true), and uses a BASE_URL that defaults to the deployed backend if not running on localhost.

Table of contents

Project overview
Features
Tech stack & dependencies
Project structure
Routes & pages
Important components & Redux slices
API / Backend expectations
Socket events (real-time chat & presence)
Environment & configuration
Local development
Build & deploy
Testing / debugging tips
Known issues & TODO
Contributing
Project overview

The app provides:
Authentication (login/signup)
Profile editing
Feed
Connections & requests management
Real-time chat between users with delivery/seen indicators
Online presence tracking
A premium page placeholder
Features

Authentication forms (login & signup)
Main feed and profile editing page
Connections/requests browsing and management
Real-time 1:1 chat with pagination, delivered/seen states
Online/offline presence status & live updates
Redux for client state management
Tech stack & notable dependencies

React 19 + TypeScript
Vite as the dev/build tool
Redux Toolkit + react-redux
react-router-dom (v7)
axios for HTTP
socket.io-client for real-time functionality
TailwindCSS + DaisyUI for styling, Font Awesome for icons
Key dependencies (from package.json)

react, react-dom
@reduxjs/toolkit, react-redux
react-router-dom
axios
socket.io-client
tailwindcss, daisyui
@vitejs/plugin-react, vite, typescript
Project structure (relevant files)

src/
App.tsx — application routing and provider setup
main.tsx — entry
index.css, App.css — styling
components/
body.tsx — main layout / shell (contains the Outlet for pages)
login.tsx — login / signup forms
profile.tsx — minimal profile component route
feed.tsx — feed page component
connections.tsx — list of connections
requests.tsx — requests page
chat.tsx — chat UI + pagination + socket interactions
editProfile.tsx — profile editing form
nav-bar.tsx — navigation
premium.tsx — premium page
userCard.tsx — user card used across lists
online-status-tracker.tsx — mounts socket for presence tracking
footer.tsx — footer
utils/
appStore.ts — redux store configuration (combines slices)
userSlice.ts — user authentication / user info
feedSlice.ts — feed state
connectionSlice.ts — connections
requestSlice.ts — friend/connection requests
onlineUsersSlice.ts — online user ids storage
socket.ts — socket initialization helper
socketClient.ts — socket client getter (used across components)
constants.ts — BASE_URL constant (switches between localhost and deployed URL)
Routes (App.tsx)

/ — Body layout; default inner route shows Feed
/login — Login / Signup page
/profile — Profile page
/connections — Connections page
/requests — Requests page
/premium — Premium page
/chat/:targetUserId — Chat page for user with id = targetUserId
Important implementation notes (from code)

BASE_URL (src/utils/constants.ts)
If running on localhost, it points to http://localhost:8080
Otherwise it points to https://devgram-6l12.onrender.com
Authentication uses cookies: axios requests use { withCredentials: true } so the backend must set cookies and allow credentials.
The login/signup flow:
POST ${BASE_URL}/login with { emailId, password } (withCredentials)
POST ${BASE_URL}/signup with { firstName, lastName, emailId, password } (withCredentials)
Both endpoints return user data which is dispatched into Redux via addUser.
Chat fetching:
GET ${BASE_URL}/chat/${targetUserId}?page=${page}&limit=10 returns { chat, pagination } where chat.messages is an array of messages.
POST ${BASE_URL}/chat/${chatId}/markSeen with { messageId } to mark a message seen.
User fetch:
GET ${BASE_URL}/user/${targetUserId} returns target user data in response.data.data.
Socket usage:
The client emits and listens to socket events for real-time messaging and presence. See "Socket events" below.
Socket events (client-side expectations)

Emit events sent by client:
"joinChat" — payload: { firstName, userId, targetUserId } (called when chat opens)
"sendMessage" — payload: { firstName, lastName, userId, targetUserId, text }
"messageDelivered" — payload: { targetUserId, currentUserId, messageId, chatId } (sent when user is at bottom of chat view to mark delivered)
Client listens to:
"messageReceived" — payload example: { firstName, lastName, text, messageId, chatId, senderId, createdAt } — appended to messages array
"messageSeen" — payload: { messageId } — used to show "Seen" footer
"errorMessage" — payload: { code, message }
Presence:
online-status-tracker mounts socket and updates online users in Redux (exact socket events depend on backend implementation but the front-end expects a list of online user IDs in onlineUsersSlice)
Backend / API expectations (summary)

Must support cookie-based sessions (withCredentials)
Must enable CORS with credentials when frontend served from different origin:
Access-Control-Allow-Origin: (frontend origin)
Access-Control-Allow-Credentials: true
Endpoints used by the client (inferred from code):
POST /login -> returns user object
POST /signup -> returns user object
GET /user/:userId -> returns { data: user }
GET /chat/:targetUserId?page=&limit= -> returns { chat, pagination } with chat._id and chat.messages with senderId (object), text, _id, createdAt, seenBy
POST /chat/:chatId/markSeen -> body { messageId } to mark read/seen
Additional endpoints used by other components (connections, requests, feed, profile edit) — expected to exist on backend (not fully listed here; check backend implementation).
Environment & configuration

BASE_URL is defined in src/utils/constants.ts and auto-selects depending on hostname. For development you can either:
Keep the constant as-is and run the backend on http://localhost:8080, OR
Replace with an env-driven approach (recommended) using .env and modify constants to read from process.env (or import.meta.env.VITE_*, per Vite).
Because the client uses Cookies (withCredentials: true), ensure backend sets session cookies with proper attributes (SameSite, Secure for HTTPS) and CORS allows credentials.
Local development (quick start)

Clone git clone https://github.com/Hareesh7036/devgram_web.git
Install cd devgram_web npm ci or npm install
Run dev server npm run dev
Vite will start and the app will be available (by default) at http://localhost:5173 (or another Vite port).
Backend
Run the backend API at http://localhost:8080 (or update BASE_URL in src/utils/constants.ts to the backend location).
Open browser and visit:
http://localhost:5173/
Build for production npm run build
Preview production build npm run preview
Scripts (from package.json)

dev -> vite
build -> tsc -b && vite build
lint -> eslint .
preview -> vite preview
Deployment

There's a vercel.json in the repo; Vercel is one target. The CONSTANT currently points to "https://devgram-6l12.onrender.com" as the deployed backend; adjust production config as needed.
Make sure to set appropriate environment variables on your hosting platform if you change BASE_URL to use env vars.
Ensure backend and frontend deployed origins are configured correctly for cookies + CORS.
Testing & debugging tips

If login/signup fails, inspect network requests and cookies:
Make sure backend responds with correct cookie (Set-Cookie) and CORS headers include credentials.
Chat:
If messages are not received, ensure socket.io server is running and both server and client are compatible versions.
Use browser console to see socket events emitted/received (chat.tsx logs messageReceived).
Pagination:
Chat uses page & limit query params. If messages don't load older messages, verify backend pagination object includes pagination.hasMore and chat.messages.
Known issues / TODO (based on code review)

No environment-driven BASE_URL currently (hard-coded conditional in constants.ts). Consider moving to Vite env variables (import.meta.env).
Limited form validation on signup/login (client-side). Add field validation and better error handling UX.
Some components are heavy and could be split for improved readability.
Data-types and interfaces could be defined in shared types file (some typing is inline / any).
Ensure compatibility with React 19 — verify dependencies and peer compatibility (React 19 may require specific library versions).
Tests are not present. Add unit/integration tests.
Contributing

Fork -> branch -> PR. Please follow code style (ESLint config included).
If adding features, update README and add instructions for new env vars.
Notes for maintainers

The app uses cookies. When testing from localhost while backend runs on localhost:8080, cookies will be set correctly. If the backend is hosted on a different domain, ensure cookies are configured with SameSite=None; Secure and that backend sends proper CORS headers.
Frontend expects specific backend routes and JSON shapes (see "Backend / API expectations" above). Confirm backend contract when integrating.
License

No license file present. Add a LICENSE file if you want to publish with a license.

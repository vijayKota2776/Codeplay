# CodePlay – Interactive Coding Learning Platform

GitHub: https://github.com/vijayKota2776/Codeplay  
Live: https://codeplay-one.vercel.app/

## Overview

CodePlay is an interactive coding learning platform built with the MERN stack.  
Learners can take coding courses, write and run code directly in the browser, get instant feedback, track their progress, and work inside full React labs powered by Docker containers.[web:222][web:225]

## Core Features

- Take coding courses with an embedded browser IDE.
- Solve exercises with auto‑grading and server‑side code execution.
- Track progress per course with XP, badges, and streaks.
- Join coding challenges and view leaderboards.
- Peer reviews on submissions and discussion forums per topic.
- Admin panel to create and manage courses, topics, and labs.
- Docker‑based labs that spin up isolated React dev environments.

## Tech Stack

**Backend**

- Node.js, Express  
- MongoDB with Mongoose  
- JWT‑based authentication (email/password)  
- Docker integration for per‑user lab containers

**Frontend**

- React, React Router  
- Tailwind CSS  
- Vite/CRA tooling  
- React Context + custom hooks for auth, courses, labs

**Tooling**

- ESLint & Prettier (optional)  
- React DevTools, Browser DevTools

## Repository Structure

text
# CodePlay – Interactive Coding Learning Platform

GitHub: https://github.com/vijayKota2776/Codeplay  
Live: https://codeplay-one.vercel.app/

## Overview

CodePlay is an interactive coding learning platform built with the MERN stack.  
Learners can take coding courses, write and run code directly in the browser, get instant feedback, track their progress, and work inside full React labs powered by Docker containers.[web:222][web:225]

## Core Features

- Take coding courses with an embedded browser IDE.
- Solve exercises with auto‑grading and server‑side code execution.
- Track progress per course with XP, badges, and streaks.
- Join coding challenges and view leaderboards.
- Peer reviews on submissions and discussion forums per topic.
- Admin panel to create and manage courses, topics, and labs.
- Docker‑based labs that spin up isolated React dev environments.

## Tech Stack

**Backend**

- Node.js, Express  
- MongoDB with Mongoose  
- JWT‑based authentication (email/password)  
- Docker integration for per‑user lab containers

**Frontend**

- React, React Router  
- Tailwind CSS  
- Vite/CRA tooling  
- React Context + custom hooks for auth, courses, labs

**Tooling**

- ESLint & Prettier (optional)  
- React DevTools, Browser DevTools

## Repository Structure

codeplay/
backend/
config/
controllers/
middleware/
models/
routes/
.env # local env (not committed)
package.json
server.js # Express entry point

frontend/
public/
package.json
postcss.config.js
tailwind.config.js
src/
index.js
App.jsx
api.js
index.css
components/
pages/
utils/
context/
hooks/
layouts/

text

## Backend API (High‑Level)

- **Auth** – `POST /api/register`, `POST /api/login`, `GET /api/me`
- **Dashboard** – `GET /api/dashboard`, `GET /api/leaderboard`
- **Courses** – `GET /api/courses`, `GET /api/courses/:id`, `POST /api/courses` (admin)
- **Submissions** – `POST /api/submissions`, `GET /api/submissions/me`, `GET /api/submissions/exercise/:exerciseId`
- **Progress** – `POST /api/progress/update`, `GET /api/progress/:courseId`
- **Reviews** – `POST /api/submissions/:id/reviews`, `GET /api/submissions/:id/reviews`
- **IDE** – `POST /api/ide/run` (execute JS code server‑side)
- **Labs** – `POST /api/labs`, `GET /api/labs/:labId/files`, `PUT /api/labs/:labId/files`, `POST /api/labs/:labId/files`

## Getting Started

### Prerequisites

- Node.js and npm  
- MongoDB instance (local or cloud)  
- Docker (for labs feature, optional for basic run)

### Backend Setup

cd backend
npm install

create .env with:
MONGO_URI=...
JWT_SECRET=...
PORT=4000
npm start

text

### Frontend Setup

cd frontend
npm install
npm run dev # or npm start depending on tooling

text

- Frontend: http://localhost:3000  
- Backend: http://localhost:4000  

Update `src/api.js` to point to the correct backend URL if needed.


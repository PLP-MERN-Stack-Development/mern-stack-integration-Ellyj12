## MERN Blog — MERN Stack Integration Assignment



A practical MERN (MongoDB, Express, React, Node) blog application used for  demonstrating full-stack integration. The project contains a React + Vite front-end (in `Client/`) and an Express + MongoDB back-end (in `server/`).

## Why this project is useful

- Demonstrates a full-stack workflow: separate client and server codebases with a REST API.
- Covers common features needed in production apps: authentication (JWT), file uploads, CRUD operations, and middleware patterns.
- Good starter code for learning or extending into a portfolio project.

## Key features

- RESTful API with Express and Mongoose
- User registration and login (JWT-based)
- Create/Read/Update/Delete blog posts
- Image uploads served from `/uploads`
- Client built with React + Vite (dev server runs on port 5173)

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- React + Vite
- JSON Web Tokens for auth
- multer for file uploads

## Quick start (developer)

Prerequisites

- Node.js and npm (or yarn)
- MongoDB (local or Atlas)

1) Clone and install dependencies

```powershell
# from repository root
npm install

# install client deps
cd Client; npm install; cd ..
```

2) Environment variables

Create a `.env` file for the server. The server expects environment variables (its config loads `server/config/.env` via `dotenv`). Example values:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/mydb
JWT_SECRET=change_this_to_a_secure_random_string
PORT=5000
NODE_ENV=development
```

Save this under `server/config/.env` or set the variables in your shell.

3) Run the server

```powershell
# from repository root
# start server directly
node server/server.js

# or with nodemon (installed in the repo dependencies)
npx nodemon server/server.js
```

By default the server listens on `PORT` (default 5000). The server file sets CORS origin to `http://localhost:5173` (the Vite dev server).

4) Run the client (development)

```powershell
cd Client
npm run dev
```

Vite will serve the front-end at `http://localhost:5173` by default.

## Environment & configuration notes

- Server entry: `server/server.js` (connects to `process.env.MONGODB_URI`, uses `process.env.JWT_SECRET`, default port 5000)
- API base routes:
  - `POST /api/auth/register` — register new user
  - `POST /api/auth/login` — obtain JWT
  - `GET|POST|PUT|DELETE /api/posts` — CRUD for posts
  - `GET /api/categories` — categories

For API details and examples, please consult the code under `server/routes/` and the React client in `Client/src/`.

## Project layout (key folders)

- `Client/` — React + Vite front-end
- `server/` — Express back-end, routes, controllers, models
- `uploads/` — stored uploads served by the server
- `Week4-Assignment.md` — assignment instructions and checklist

## Development tips

- Use your MongoDB Atlas connection string for `MONGODB_URI` during development.
- The client expects the API to be available at `http://localhost:5000` (unless you change the server `PORT`). Update client API base URLs in `Client/src/hooks/api.jsx` or wherever requests are made if needed.


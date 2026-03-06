# One-Time Secure File Sharing Website

Full-stack implementation of a one-time file sharing platform:

- React + Vite + Tailwind frontend
- Express + MongoDB backend
- JWT authentication
- Multer-based local file uploads
- 16-digit access codes that expire after the first successful access

## Project Structure

```text
client/   React frontend
server/   Express API + MongoDB models
```

## Setup

1. Create a server env file from [server/.env.example](/c:/Users/It%20Computer%20Point/Downloads/block%20chain%20technology/server/.env.example).
2. Add your MongoDB connection string and a JWT secret to `server/.env`.
3. Optional: create `client/.env` from [client/.env.example](/c:/Users/It%20Computer%20Point/Downloads/block%20chain%20technology/client/.env.example) if your API will not run on the same host.
4. Install dependencies:

```bash
npm install
```

5. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

Backend runs on `http://localhost:4000`.

## Main Features

- Register and login with JWT-based auth
- Upload a file from the dashboard
- Generate a unique 16-digit access code per upload
- Let anyone access the file from the home page without logging in
- Mark the file as used after the first successful access
- Show file status as `unused`, `used`, or `expired`
- Delete uploaded files from the dashboard
- Optional time-based expiry using `CODE_EXPIRY_HOURS`

## Environment Variables

Server variables:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `MAX_FILE_SIZE_MB`
- `CODE_EXPIRY_HOURS`
- `UPLOAD_DIR`

Client variables:

- `VITE_API_URL`

## Build Validation

```bash
npm run build
```

This builds the frontend and validates the server source tree.

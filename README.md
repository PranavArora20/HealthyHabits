# HealthyHabits – Full‑Stack Health & Fitness App

Deployed:
- Backend (Render): [healthyhabits-1.onrender.com](https://healthyhabits-1.onrender.com)
- Frontend (Vercel): [healthy-habits-pi.vercel.app](https://healthy-habits-pi.vercel.app/)

Both deployments are live. The backend root responds with a simple status JSON (for health checks), e.g.:
```json
{"message":"HealthyHabits API","status":"ok"}
```

## Overview
HealthyHabits helps users build and track healthier routines: log activities and sleep, track meals with nutrition data, set goals, create and join challenges with leaderboards, manage habits and reminders, and engage with the community.

## Tech Stack
- Frontend: Vite + React, React Router, Tailwind CSS, Recharts (charts)
- Backend: Node.js, Express, Mongoose (MongoDB Atlas)
- Auth: JWT (access + refresh tokens)
- Queue/Jobs: node-cron (for reminder checks)
- Mail: Nodemailer (email reminders)
- External API: Spoonacular (nutrition parsing)

## Key Features
- Authentication: Register/Login with JWT access + refresh tokens
- Activities: Log workouts and calories; instant summary
- Sleep: Log hours + quality; aggregated stats (avg/min/max/total)
- Nutrition: Log a meal (ingredients string) → nutrition data via Spoonacular
- Goals: Create goals (calories, sleep, water, steps, custom); auto progress update
- Habits: Create/mark habits, streak calculation, optional reminders
- Challenges: Create/join challenges, progress updates, leaderboards, badges
- Reminders: CRUD user reminders (workout, meal, water, sleep, habit, custom)
- Community: Public groups, posts, likes, comments
- Visuals: Dashboard cards + charts (Recharts)

## API (selected)
Base URL: `https://healthyhabits-1.onrender.com`

Auth
- POST `/api/auth/register` → { accessToken, refreshToken }
- POST `/api/auth/login` → { accessToken, refreshToken }
- POST `/api/auth/refresh` → { accessToken }

Activities
- POST `/api/activities` (auth)
- GET `/api/activities` (auth)

Sleep
- POST `/api/sleep` (auth)
- GET `/api/sleep` (auth)
- GET `/api/sleep/stats` (auth)

Nutrition
- POST `/api/nutrition/log` (auth) → parses ingredients via Spoonacular
- GET `/api/nutrition` (auth)

Goals
- POST `/api/goals` (auth)
- GET `/api/goals` (auth)
- PUT `/api/goals/:id/progress` (auth)
- DELETE `/api/goals/:id` (auth)

Habits
- POST `/api/habits` (auth)
- GET `/api/habits` (auth)
- POST `/api/habits/:id/mark` (auth)
- DELETE `/api/habits/:id` (auth)

Challenges
- POST `/api/challenges` (auth)
- POST `/api/challenges/:id/join` (auth)
- POST `/api/challenges/:id/progress` (auth)
- GET `/api/challenges/:id/leaderboard` (auth)
- GET `/api/challenges/mine` (auth)

Reminders
- POST `/api/reminders` (auth)
- GET `/api/reminders` (auth)
- PUT `/api/reminders/:id` (auth)
- DELETE `/api/reminders/:id` (auth)

Community
- GET `/api/community/groups` (auth)
- POST `/api/community/groups` (auth)
- POST `/api/community/groups/:id/join` (auth)
- GET `/api/community/groups/:id/posts` (auth)
- POST `/api/community/posts` (auth)
- POST `/api/community/posts/:id/like` (auth)
- POST `/api/community/posts/:id/comment` (auth)

Health/Root
- GET `/` → { message, status }
- GET `/api/health` → { message: "HealthyHabits API running" }

> 404s return `{ message: "Route not found", path: <url> }`.

## External API
- Spoonacular Parse Ingredients (used in Nutrition):
  - Endpoint: `POST https://api.spoonacular.com/recipes/parseIngredients`
  - Form field: `ingredientList` (string)
  - Params: `apiKey`, `includeNutrition=true`

## Environment Variables (Backend)
- `MONGO_URI` (or `MONGODB_URI`) → MongoDB Atlas connection string
- `JWT_SECRET_KEY` → access token secret
- `JWT_REFRESH_SECRET_KEY` → refresh token secret
- `SPOONACULAR_API_KEY` → for nutrition API
- Optional: `NODE_ENV=production`

## Running Locally
Backend
```bash
cd Backend
npm install
# .env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET_KEY=dev-secret
JWT_REFRESH_SECRET_KEY=dev-refresh
SPOONACULAR_API_KEY=<your-key>

npm run dev
```
The server logs the connected host and DB name.

Frontend
```bash
cd Frontend
npm install
# .env
VITE_API_URL=http://localhost:5000/api

npm run dev
```
Open http://localhost:5173

## Deployment Notes
- Backend (Render):
  - Root Directory: `Backend`
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Health Check Path: `/api/health` or `/`
  - Ensure env vars are set (Atlas, JWT, Spoonacular). Root path returns status JSON, e.g. [healthyhabits-1.onrender.com](https://healthyhabits-1.onrender.com).

- Frontend (Vercel):
  - Root: `Frontend`
  - Build Command: `npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL` → your backend URL, e.g. `https://healthyhabits-1.onrender.com/api`
  - Deployed at: [healthy-habits-pi.vercel.app](https://healthy-habits-pi.vercel.app/)

## Screens & UX Highlights
- Public Home with animated welcome
- Auth pages with Tailwind + dark mode
- Dashboard with summary cards & charts
- Dark‑mode friendly inputs/dropdowns across all pages
- Mobile‑friendly header with active link highlighting

## Testing
- Backend: Jest + Supertest example provided for health route (`src/tests/health.test.js`).

## Scripts
Backend `package.json`
- `dev`: nodemon server
- `start`: node server
- `test`: jest

Frontend `package.json`
- `dev`: vite
- `build`: vite build
- `preview`: vite preview

## License
MIT (c) HealthyHabits authors

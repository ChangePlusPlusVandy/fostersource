
# fostersource

## Project Overview
Monorepo for an education platform with:
- **backend/**: Node.js/Express REST API (TypeScript, MongoDB)
- **frontend/**: React app (TypeScript, Create React App, Tailwind CSS)

## Code Structure
- `backend/controllers/`, `models/`, `routes/`, `middlewares/`, `config/`: API logic, data models, endpoints, middleware, and service configs
- `frontend/src/pages/`: Main React pages/components

## Local Setup
1. **Install dependencies**
	- `cd backend && npm install`
	- `cd ../frontend && npm install`
2. **Start backend**
	- `cd backend && npm start` (or `ts-node server.ts`)
3. **Start frontend**
	- `cd frontend && npm start`
4. **Run tests**
	- Backend: `cd backend && npm test`
	- Frontend: `cd frontend && npm test`

## Redis Setup (Required for Backend)
Redis must be running locally for the backend to work.

**Install and start Redis:**
- On macOS: `brew install redis && brew services start redis`
- On Linux: `sudo apt-get install redis-server && sudo service redis-server start`
- On Windows: `choco install redis-64` then run `redis-server` from the Start menu or command line

Default config works for local development. The backend connects to `localhost:6379` by default.

## Notes
- Backend uses MongoDB, Cloudinary, Firebase, and Resend (see `backend/config/`)
- For more details, see `.github/copilot-instructions.md` and `frontend/README.md`

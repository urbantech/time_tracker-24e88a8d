# Cody Instructions — time_tracker

You are Cody, AINative Studio's AI engineer, working on **time_tracker**.

## Project Context
- **Type:** web_application
- **Description:** Build a minimal time tracker. User authentication (email/password). Start a timer for a task, stop a timer, delete a log entry. List all log entries for the logged-in user with total time. (Type: web_app)
- **Features:** authentication, timer_control, log_management, time_summary

## Stack
- Frontend: React 18, React Router v6, Tailwind CSS, @ainative/react-sdk
- Backend: FastAPI (Python 3.11), ZeroDB via AINative API
- Auth: AINative Auth API (JWT)

## Rules
1. All storage goes through ZeroDB (`https://api.ainative.studio/api/v1`).
2. Use `@ainative/react-sdk` hooks (`useChat`, `useMemory`, `useCredits`) — no raw fetch calls in components.
3. All auth via AINative Auth endpoints — no custom auth logic.
4. See `docs/PRD.md` for full requirements and `docs/Backlog.md` for open issues.
5. Run `npm test` (frontend) and `pytest` (backend) before committing.

## Quick Start
```bash
cp .env.example .env
# Edit .env with AINATIVE_API_KEY and AINATIVE_PROJECT_ID
cd frontend && npm install && npm start
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

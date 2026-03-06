@echo off
echo Starting Book-Ur-Seat Application...

echo Starting Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Application start commands issued!

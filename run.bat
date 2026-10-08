@echo off
echo ========================================================
echo        Fireflies.ai Clone - Launching Fullstack Platform
echo ========================================================
echo.

echo [1/3] Checking and seeding SQLite database...
cd backend
python seed.py
if %ERRORLEVEL% NEQ 0 (
    echo Failed to seed database.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Starting FastAPI Backend on port 8000...
start "Fireflies Backend (FastAPI)" cmd /k "python -m uvicorn main:app --reload --port 8000"

echo.
echo [3/3] Starting Next.js Frontend on port 3000...
cd ..\frontend
start "Fireflies Frontend (Next.js)" cmd /k "npm.cmd run dev"

echo.
echo ========================================================
echo  Platform is starting!
echo  - Frontend: http://localhost:3000
echo  - Backend API: http://localhost:8000
echo  - Swagger Docs: http://localhost:8000/docs
echo ========================================================

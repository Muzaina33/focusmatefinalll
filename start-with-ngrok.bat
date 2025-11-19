@echo off
echo ========================================
echo FocusMate - Ngrok Setup Helper
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Ngrok not found!
    echo.
    echo Please download ngrok from: https://ngrok.com/download
    echo Extract it to a folder and add to PATH, or run from ngrok folder
    echo.
    pause
    exit /b 1
)

echo [OK] Ngrok found
echo.

REM Check if backend and frontend exist
if not exist "backend\app\main.py" (
    echo [ERROR] Backend not found. Are you in the project root?
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo [ERROR] Frontend not found. Are you in the project root?
    pause
    exit /b 1
)

echo [OK] Project structure verified
echo.

echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo.
echo This script will help you start FocusMate with Ngrok.
echo You need to open 4 separate terminal windows:
echo.
echo Terminal 1: Backend Server
echo Terminal 2: Frontend Server  
echo Terminal 3: Ngrok Backend Tunnel
echo Terminal 4: Ngrok Frontend Tunnel
echo.
echo ========================================
echo.

echo What would you like to do?
echo.
echo 1. Start Backend Server (Terminal 1)
echo 2. Start Frontend Server (Terminal 2)
echo 3. Start Ngrok Backend Tunnel (Terminal 3)
echo 4. Start Ngrok Frontend Tunnel (Terminal 4)
echo 5. Show my current Ngrok URLs
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto ngrok_backend
if "%choice%"=="4" goto ngrok_frontend
if "%choice%"=="5" goto show_urls
if "%choice%"=="6" goto end

echo Invalid choice!
pause
exit /b 1

:backend
echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
goto end

:frontend
echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.
cd frontend
npm run dev -- --host
goto end

:ngrok_backend
echo.
echo ========================================
echo Starting Ngrok Backend Tunnel...
echo ========================================
echo.
echo IMPORTANT: Copy the HTTPS URL that appears!
echo Example: https://abc123.ngrok.io
echo.
echo You'll need this for frontend/.env
echo.
pause
ngrok http 8000
goto end

:ngrok_frontend
echo.
echo ========================================
echo Starting Ngrok Frontend Tunnel...
echo ========================================
echo.
echo IMPORTANT: Copy the HTTPS URL that appears!
echo Example: https://xyz789.ngrok.io
echo.
echo You'll need this for backend/.env
echo.
pause
ngrok http 5173
goto end

:show_urls
echo.
echo ========================================
echo Your Ngrok URLs
echo ========================================
echo.
echo Check your Ngrok terminal windows for URLs like:
echo.
echo Backend:  https://abc123.ngrok.io
echo Frontend: https://xyz789.ngrok.io
echo.
echo These URLs should be in:
echo - frontend/.env (VITE_API_URL and VITE_WS_URL)
echo - backend/.env (FRONTEND_URL)
echo.
echo After updating .env files, restart backend and frontend!
echo.
pause
goto end

:end
echo.
echo Goodbye!

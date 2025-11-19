@echo off
REM FocusMate Deployment Pre-Check Script (Windows)
REM Run this before deploying to catch common issues

echo.
echo ================================
echo FocusMate Deployment Pre-Check
echo ================================
echo.

REM Check if we're in the right directory
if not exist "docker-compose.yml" (
    echo [ERROR] Run this script from the project root directory
    exit /b 1
)

echo [OK] Project root directory confirmed
echo.

REM Check backend files
echo Checking Backend...
if not exist "backend\requirements.txt" (
    echo [ERROR] Missing backend\requirements.txt
    exit /b 1
)

if not exist "backend\app\main.py" (
    echo [ERROR] Missing backend\app\main.py
    exit /b 1
)

echo [OK] Backend files present
echo.

REM Check frontend files
echo Checking Frontend...
if not exist "frontend\package.json" (
    echo [ERROR] Missing frontend\package.json
    exit /b 1
)

if not exist "frontend\vite.config.ts" (
    echo [ERROR] Missing frontend\vite.config.ts
    exit /b 1
)

echo [OK] Frontend files present
echo.

REM Check for .env files
echo Checking Environment Configuration...

if exist "backend\.env" (
    echo [OK] Backend .env exists
    findstr /C:"SECRET_KEY" backend\.env >nul
    if %errorlevel% equ 0 (
        echo   [OK] SECRET_KEY configured
    ) else (
        echo   [WARNING] SECRET_KEY not found in backend\.env
    )
) else (
    echo [WARNING] backend\.env not found ^(copy from .env.example^)
)

if exist "frontend\.env" (
    echo [OK] Frontend .env exists
    findstr /C:"VITE_API_URL" frontend\.env >nul
    if %errorlevel% equ 0 (
        echo   [OK] VITE_API_URL configured
    ) else (
        echo   [WARNING] VITE_API_URL not found in frontend\.env
    )
    
    findstr /C:"VITE_WS_URL" frontend\.env >nul
    if %errorlevel% equ 0 (
        echo   [OK] VITE_WS_URL configured
    ) else (
        echo   [WARNING] VITE_WS_URL not found in frontend\.env
    )
) else (
    echo [WARNING] frontend\.env not found ^(copy from .env.example^)
)

echo.

REM Check dependencies
echo Checking Dependencies...

where python >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo [OK] Python installed: %%i
) else (
    echo [ERROR] Python not found
)

where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js installed: %%i
) else (
    echo [ERROR] Node.js not found
)

where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm installed: %%i
) else (
    echo [ERROR] npm not found
)

echo.
echo ================================
echo [OK] Pre-check complete!
echo.
echo Next steps:
echo 1. Review any warnings above
echo 2. Follow DEPLOYMENT_GUIDE.md for deployment instructions
echo 3. Use DEPLOYMENT_CHECKLIST.md to track progress
echo.

pause

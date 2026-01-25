@echo off
title EduTrack 24/7 Server

echo.
echo ========================================
echo        EduTrack 24/7 Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if MongoDB is running
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not installed locally.
    echo Using MongoDB Atlas - ensure MONGO_URI is set in backend/.env
    echo.
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Build frontend for production
echo 🔨 Building frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

REM Start backend server
echo 🖥️  Starting backend server...
cd ..\backend
start "EduTrack Backend" cmd /k "npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend server
echo 🌐 Starting frontend server...
cd ..\frontend\build
start "EduTrack Frontend" cmd /k "python -m http.server 8080"

echo.
echo ✅ EduTrack deployed successfully!
echo.
echo 🌐 Frontend: http://localhost:8080
echo 🖥️  Backend: http://localhost:5000
echo 📊 API: http://localhost:5000/api
echo.
echo 🎯 Admin Access: Ctrl+Shift+A
echo 👤 Student Registration: Available on frontend
echo.
echo ========================================
echo        Servers are running 24/7
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul

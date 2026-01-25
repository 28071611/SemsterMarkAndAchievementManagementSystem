@echo off
title EduTrack Deployment with MongoDB Atlas

echo.
echo ========================================
echo   EduTrack Deployment with MongoDB Atlas
echo ========================================
echo.

echo 🌐 Connecting to your MongoDB Atlas...
echo Host: edutrack.2m3.mongodb.net
echo Database: edutrack
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

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

REM Start backend server with MongoDB Atlas
echo 🖥️  Starting backend server with MongoDB Atlas...
cd ..\backend
start "EduTrack Backend" cmd /k "node server.js"

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

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
echo 🗄️  MongoDB: edutrack.2m3.mongodb.net/edutrack
echo.
echo 🎯 Admin Access: Ctrl+Shift+A
echo 👤 Student Registration: Available on frontend
echo.
echo ========================================
echo        Servers are running 24/7
echo ========================================
echo.
echo ⚠️  NOTE: If MongoDB connection fails, please:
echo 1. Go to MongoDB Atlas dashboard
echo 2. Add your IP to the whitelist
echo 3. Ensure network access is allowed
echo.
echo Press any key to exit this window...
pause >nul

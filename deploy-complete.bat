@echo off
title EduTrack Complete Deployment

echo.
echo ========================================
echo     EduTrack Complete Deployment
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not installed locally.
    echo.
    echo Options:
    echo 1. Install MongoDB Community Server (Recommended)
    echo 2. Use MongoDB Atlas (Cloud)
    echo 3. Continue with mock data (Testing only)
    echo.
    set /p choice="Choose option (1-3): "
    
    if "%choice%"=="1" (
        echo 📥 Downloading MongoDB...
        echo Please visit: https://www.mongodb.com/try/download/community
        echo Install MongoDB and restart this script.
        pause
        exit /b 1
    ) else if "%choice%"=="2" (
        echo 🌐 Using MongoDB Atlas...
        echo Please update backend/.env with your Atlas connection string
        echo Current: mongodb://127.0.0.1:27017/edutrack
        pause
    ) else if "%choice%"=="3" (
        echo 🧪 Using mock data for testing...
        echo Note: Data will not persist between restarts
    ) else (
        echo Invalid choice. Exiting.
        pause
        exit /b 1
    )
) else (
    echo ✅ MongoDB found:
    mongod --version
)

echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🔨 Building frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

echo 🗄️  Starting MongoDB (if installed)...
start "MongoDB" cmd /k "mongod --dbpath ./data/db"

echo ⏳ Waiting for MongoDB to start...
timeout /t 10 /nobreak >nul

echo 🖥️  Starting backend server...
cd ..\backend
start "EduTrack Backend" cmd /k "node server.js"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🌐 Starting frontend server...
cd ..\frontend\build
start "EduTrack Frontend" cmd /k "python -m http.server 8080"

echo.
echo ✅ EduTrack deployed successfully!
echo.
echo 🌐 Frontend: http://localhost:8080
echo 🖥️  Backend: http://localhost:5000
echo 📊 API: http://localhost:5000/api
echo 🗄️  MongoDB: mongodb://localhost:27017/edutrack
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

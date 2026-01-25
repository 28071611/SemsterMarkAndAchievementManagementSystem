#!/bin/bash

# EduTrack Deployment Script
# This script deploys the EduTrack application

echo "🚀 Starting EduTrack Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally. Using MongoDB Atlas..."
    echo "Please update MONGO_URI in backend/.env with your Atlas connection string"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend for production
echo "🔨 Building frontend for production..."
npm run build

# Start backend server
echo "🖥️  Starting backend server..."
cd ../backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend server
echo "🌐 Starting frontend server..."
cd ../frontend/build
python -m http.server 8080 &
FRONTEND_PID=$!

echo "✅ EduTrack deployed successfully!"
echo "🌐 Frontend: http://localhost:8080"
echo "🖥️  Backend: http://localhost:5000"
echo "📊 API: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop the servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID

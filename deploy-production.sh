#!/bin/bash

# EduTrack Production Deployment Script
echo "🚀 Starting EduTrack Production Deployment..."

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf frontend/build
rm -rf backend/node_modules
docker-compose down -v
docker system prune -f

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Test API connectivity
echo "🧪 Testing API connectivity..."
curl -f http://localhost:5000/api/test || echo "❌ API not responding"

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost/api"
echo "📊 MongoDB: localhost:27017"

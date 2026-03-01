#!/bin/bash

echo "🌍 Deploying EduTrack to Global Access..."

# Step 1: Build Frontend
echo "🏗️ Building frontend for production..."
cd frontend
npm run build
cd ..

# Step 2: Deploy to Firebase Hosting
echo "🚀 Deploying frontend to Firebase..."
firebase deploy --only hosting

# Step 3: Deploy Backend to Render (Manual Step)
echo "📋 Backend Deployment Instructions:"
echo "1. Go to https://render.com"
echo "2. Connect your GitHub repository"
echo "3. Create a new Web Service"
echo "4. Use the 'render.yaml' configuration"
echo "5. Set environment variables:"
echo "   - MONGO_URI: Your MongoDB Atlas connection string"
echo "   - NODE_ENV: production"
echo "   - PORT: 5000"

# Step 4: Provide Access Information
echo ""
echo "🎉 Deployment Information:"
echo "📱 Frontend URL: https://edutrack-7063e.web.app"
echo "🔧 Backend URL: https://edutrack-api.onrender.com"
echo "🗄️ Database: MongoDB Atlas (Global Access)"
echo ""
echo "🌐 Your EduTrack application is now accessible from anywhere in the world!"
echo "📧 Share these URLs with your users:"

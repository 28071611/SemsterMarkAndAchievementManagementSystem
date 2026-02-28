# 🚀 Firebase Hosting Deployment Guide

Follow these steps to deploy your EduTrack frontend to Firebase Hosting.

## Prerequisites
1. **Node.js installed** (which you already have).
2. **Firebase Account**: Sign up at [firebase.google.com](https://firebase.google.com/).
3. **Firebase Project**: Create a new project in the Firebase Console.

---

## 🛠️ Step 1: Install Firebase CLI
If you haven't already, install the Firebase command-line tools:
```powershell
npm install -g firebase-tools
```

## 🔑 Step 2: Login to Firebase
Authenticate the CLI with your Google account:
```powershell
firebase login
```

## 📦 Step 3: Build the Frontend
Generate the production build of your React application:
```powershell
cd frontend
npm run build
cd ..
```

## 🚀 Step 4: Deploy
Deploy the `frontend/build` folder to Firebase:
```powershell
firebase deploy
```

---

## 📝 Configuration Details
- **Public Directory**: `frontend/build`
- **SPA Rewrite**: All requests are redirected to `index.html` (handled by `firebase.json`).
- **Backend URL**: Configured in `frontend/.env.production` to point to Render.
- **Search Optimization**: SEO meta tags, `robots.txt`, and `sitemap.xml` are already configured for Google indexing.
- **Data Persistence**: Data is stored in MongoDB Atlas (configured via Render Environment Variables) ensuring global access and safety.

## ⚠️ Troubleshooting
- **Build Failures**: Ensure all dependencies are installed (`npm install` in `frontend`).
- **Login Issues**: If `firebase login` fails in certain environments, use `firebase login --no-localhost`.
- **Project Not Found**: Update the project ID in `.firebaserc` if it differs from `edutrack-38472`.

# Render Backend Deployment Guide

## 🚀 **Step 2: Deploy to Render (5 minutes)**

### **Option A: Quick Deploy (Recommended)**
1. **Go to**: https://render.com
2. **Click**: "Sign up" or "Login"
3. **Choose**: Continue with GitHub
4. **Dashboard**: Click "New +"
5. **Select**: "Web Service"
6. **Connect**: Connect GitHub Repository
7. **Configure**:
   - Name: `edutrack-api`
   - Region: Closest to your users
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

### **Environment Variables (Render)**
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://edutrack:edutrack123@edutrack.2m3.mongodb.net/edutrack?retryWrites=true&w=majority
JWT_SECRET=edutrack_secret
```

### **Option B: Direct Upload**
1. **Zip** the `c:\edutrack\backend` folder
2. **Upload** to Render dashboard
3. **Configure** environment variables
4. **Deploy**

### **Expected Result**
✅ Backend deployed at: https://edutrack-api.onrender.com
✅ API endpoint: https://edutrack-api.onrender.com/api

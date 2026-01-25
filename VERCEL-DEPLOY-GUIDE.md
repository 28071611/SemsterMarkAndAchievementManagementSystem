# Vercel Frontend Deployment Guide

## 🚀 **Step 1: Deploy to Vercel (5 minutes)**

### **Option A: Quick Deploy (Recommended)**
1. **Go to**: https://vercel.com
2. **Click**: "Sign up" or "Login"
3. **Choose**: Continue with GitHub
4. **Import**: Click "Import Project"
5. **Select**: Connect to Git Repository
6. **Choose**: Upload folder (if no Git)
7. **Upload**: Your `c:\edutrack\frontend\build` folder
8. **Settings**:
   - Framework Preset: React
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### **Option B: CLI Deploy**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd c:\edutrack\frontend
vercel --prod
```

### **Environment Variables (Vercel)**
```
REACT_APP_API_URL=https://edutrack-api.onrender.com/api
NODE_ENV=production
```

### **Expected Result**
✅ Frontend deployed at: https://edutrack.vercel.app

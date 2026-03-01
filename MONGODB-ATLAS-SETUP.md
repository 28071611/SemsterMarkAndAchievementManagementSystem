# MongoDB Atlas Setup Guide for Global Access

## 🌐 Setting up MongoDB Atlas

### 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project named "EduTrack"

### 2. Create a Cluster
1. Click "Build a Cluster"
2. Choose "M0 Sandbox" (FREE)
3. Select a cloud provider and region (closest to your users)
4. Cluster name: `edutrack-cluster`
5. Click "Create Cluster"

### 3. Configure Network Access
1. Go to "Network Access" → "IP Access List"
2. Add IP: `0.0.0.0/0` (allows access from anywhere)
3. Add your current IP for development

### 4. Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Username: `edutrack-admin`
3. Password: Generate a strong password
4. Permissions: "Read and write to any database"

### 5. Get Connection String
1. Go to "Clusters" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version 4.0 or later
4. Copy the connection string

### 6. Update Backend Environment
Replace in your connection string:
- `<username>` with `edutrack-admin`
- `<password>` with your generated password
- `<dbname>` with `edutrack`

Final format:
```
mongodb+srv://edutrack-admin:YOUR_PASSWORD@edutrack-cluster.xxxxx.mongodb.net/edutrack?retryWrites=true&w=majority
```

## 🔧 Backend Configuration

### Update backend/.env
```env
MONGO_URI=mongodb+srv://edutrack-admin:YOUR_PASSWORD@edutrack-cluster.xxxxx.mongodb.net/edutrack?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### Import Data to Atlas
```bash
cd backend
node import_students.js
```

## 🚀 Benefits of MongoDB Atlas
- **Global Access**: Accessible from anywhere in the world
- **Free Tier**: 512MB storage, sufficient for development
- **Automatic Backups**: Built-in backup and recovery
- **Scalability**: Easy scaling as your application grows
- **Security**: Enterprise-grade security features

## 📱 Connection Testing
Test the connection with:
```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://edutrack-admin:YOUR_PASSWORD@edutrack-cluster.xxxxx.mongodb.net/edutrack')
.then(() => console.log('✅ Atlas Connected'))
.catch(err => console.error('❌ Connection Error:', err));
"
```

# EduTrack - Production Deployment Guide

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- MongoDB (if not using Docker)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd edutrack
```

### 2. Environment Configuration
Create environment files:
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB credentials

# Frontend environment (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env.production
```

### 3. Deploy with Docker
```bash
# Make deploy script executable (Linux/Mac)
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh
```

Or manually:
```bash
docker-compose up -d --build
```

## 🌐 Access Points

- **Frontend**: http://localhost (via Nginx)
- **Backend API**: http://localhost/api
- **Direct Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

## 📋 Services

### Docker Services
- **nginx**: Reverse proxy (Port 80)
- **frontend**: React app (Port 8080)
- **backend**: Node.js API (Port 5000)
- **mongodb**: Database (Port 27017)

### Environment Variables
```env
# Backend (.env)
MONGO_URI=mongodb://admin:edutrack123@mongodb:27017/edutrack?authSource=admin
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here

# Frontend (.env.production)
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔧 Development vs Production

### Development
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm start
```

### Production
```bash
docker-compose up -d
```

## 📊 Database Setup

### Option 1: Docker MongoDB (Recommended)
```bash
# Already included in docker-compose.yml
# Default credentials: admin/edutrack123
```

### Option 2: External MongoDB
Update `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
```

### Import Student Data
```bash
cd backend
node import_students.js
```

## 🔒 Security Features

- CORS protection
- Rate limiting
- Input validation
- Secure headers
- Nginx reverse proxy
- Environment variable configuration

## 🚦 Health Checks

```bash
# Check all services
docker-compose ps

# Test API
curl http://localhost:5000/api/test

# Check logs
docker-compose logs -f backend
```

## 🔄 Updates and Maintenance

### Update Application
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup Database
```bash
docker exec edutrack-mongodb mongodump --out /backup
```

### Reset Everything
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## 🌍 Network Deployment

### For External Access
1. Update `nginx.conf` with your domain
2. Add SSL certificates in `./ssl/` folder
3. Update CORS origins in `backend/server.js`
4. Set `REACT_APP_API_URL` to your domain

### Cloud Deployment
The project is ready for:
- **AWS ECS/EKS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Render.com**

## 📞 Support

For issues:
1. Check Docker logs: `docker-compose logs`
2. Verify environment variables
3. Ensure MongoDB is accessible
4. Check network connectivity

## 📝 Default Credentials

- **MongoDB**: admin/edutrack123
- **Admin Login**: Check `frontend/src/constants/constants.js`
- **Student Login**: Use imported data from `students_mongodb.json`

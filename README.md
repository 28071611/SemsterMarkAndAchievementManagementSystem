# 🎓 EduTrack - Student Achievement Management System

A comprehensive web-based platform for managing student academic records, semester marks, achievements, and CGPA calculations. Built with modern web technologies for educational institutions to streamline student performance tracking.

## 🌟 Features

### 📊 Academic Management
- **Student Profile Management**: Complete student information with profile pictures
- **Semester-wise Grade Tracking**: Track marks across 8 semesters
- **CGPA Calculation**: Automated CGPA computation based on semester performance
- **Arrears Tracking**: Monitor and manage course backlogs
- **Subject-wise Analysis**: Detailed breakdown of performance by subject

### 👥 User Roles
- **Admin Dashboard**: Enhanced administrative interface for managing all students
- **Student Portal**: Individual student login to view personal academic records
- **Data Import/Export**: Bulk student data management via JSON

### 🔐 Security Features
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- Rate limiting for API endpoints
- Password hashing with bcrypt
- Route protection middleware

### 📈 Performance Features
- Cluster mode support for high availability
- Compression middleware for faster responses
- Memory-efficient operations
- Health check endpoints

## 🚀 Deployment
For instructions on how to deploy this project for free on Render and MongoDB Atlas, please see the [Production Deployment Guide](.gemini/antigravity/brain/bbffcf9f-f43e-4891-9998-9e883063a9f7/DEPLOYMENT_GUIDE_PROD.md).

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with ES6+ modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Security**: express-rate-limit, CORS, compression

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: React Scripts (Create React App)

### DevOps
- Docker & Docker Compose support
- Multiple deployment configurations (Render, Vercel)
- Nginx reverse proxy setup
- Windows service scripts
- Auto-restart monitoring

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/28071611/SemsterMarkAndAchievementManagementSystem.git
cd SemsterMarkAndAchievementManagementSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/edutrack
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. MongoDB Setup
Make sure MongoDB is running on your system:
```bash
# Linux/Mac
mongod

# Windows
net start MongoDB
```

Refer to [MONGODB-SETUP-GUIDE.md](MONGODB-SETUP-GUIDE.md) for detailed MongoDB configuration.

### 5. Initialize Database (Optional)
Populate sample student data:
```bash
cd backend
node import_students.js
node populate_semesters.js
```

## ▶️ Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
Application runs on `http://localhost:3000`

### Production Mode

**Using Docker Compose:**
```bash
docker-compose up -d
```

**Using npm:**
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
# Serve the build folder using a static server
```

Refer to deployment guides:
- [README-DEPLOYMENT.md](README-DEPLOYMENT.md)
- [RENDER-DEPLOY-GUIDE.md](RENDER-DEPLOY-GUIDE.md)
- [VERCEL-DEPLOY-GUIDE.md](VERCEL-DEPLOY-GUIDE.md)

## 📁 Project Structure

```
EduTrack/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── ...
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & validation
│   ├── server.js         # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── AdminViewEnhanced.js
│   │   │   └── ...
│   │   ├── services/     # API services
│   │   │   └── api.js
│   │   └── App.js
│   ├── public/
│   └── package.json
├── students_mongodb.json # Sample student data
└── docker-compose.yml    # Docker configuration
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student information
- `POST /api/students` - Create new student

### Semesters
- `GET /api/students/:id/semesters` - Get all semester data
- `PUT /api/students/:id/semesters/:sem` - Update semester marks

## 📊 Database Schema

### Student Model
- Personal Information (name, roll number, department, etc.)
- Profile picture
- 8 Semesters with subject-wise marks
- CGPA calculation
- Arrears tracking
- Achievements

### User Model
- Username/Email
- Encrypted password
- Role (admin/student)
- Associated student record

See [MONGODB_ID_STRUCTURE.md](MONGODB_ID_STRUCTURE.md) and [MONGODB_COMPLETE_STORAGE.md](MONGODB_COMPLETE_STORAGE.md) for detailed schema documentation.

## 🧪 Testing

### Verify Backend APIs
```bash
cd backend
node test_api.js
```

### Verify Database Connection
```bash
cd backend
node verify_data.js
```

## 📝 Utility Scripts

- `calculate_cgpa.js` - Recalculate CGPA for all students
- `calculate_arrears.js` - Update arrears count
- `migrate_semesters.js` - Migrate semester data structure
- `import_students.js` - Bulk import student data
- `create_student.js` - Create individual student
- `update_student.js` - Update student records

## 🔧 Configuration Files

- `docker-compose.yml` - Docker multi-container setup
- `nginx.conf` - Nginx reverse proxy configuration
- `tailwind.config.js` - Tailwind CSS customization
- `.env` - Environment variables (not in repo)

## 📖 Documentation

- [COMPLETE_PROFILE_SYSTEM.md](COMPLETE_PROFILE_SYSTEM.md) - Profile management guide
- [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) - Pre-deployment checklist
- [GO-LIVE-GUIDE.md](GO-LIVE-GUIDE.md) - Production deployment guide
- [GLOBAL-URLS.md](GLOBAL-URLS.md) - URL configuration reference

## 🐳 Docker Deployment

```bash
# Build and run with MongoDB
docker-compose -f docker-compose-mongodb.yml up -d

# Build and run full stack
docker-compose up --build -d
```

## 🪟 Windows Service Setup

For 24/7 operation on Windows:
```bash
# Run as background service
.\start-24x7.bat

# Setup permanent Windows service
.\permanent-service.bat
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is developed as an educational management system. Please contact the repository owner for licensing information.

## 👨‍💻 Author

**Repository Owner**: 28071611

## 🙏 Acknowledgments

- Built for educational institutions to simplify student record management
- Inspired by modern web development best practices
- Uses industry-standard security and performance optimizations

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in the repository
- Review the deployment guides for common problems

---

**⭐ Star this repository if you find it helpful!**

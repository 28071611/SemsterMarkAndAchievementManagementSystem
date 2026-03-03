import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ ONLY ONCE
import semesterRoutes from "./routes/semesterRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1d',
  etag: true
}));

// Manual CORS Middleware (Aggressive)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get("/api/test", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    let studentCount = 0;
    let dbName = "Unknown";

    if (dbStatus === "Connected") {
      studentCount = await mongoose.connection.db.collection('students').countDocuments();
      dbName = mongoose.connection.db.databaseName;
    }

    res.json({
      status: "EduTrack API v1.0.3 Running",
      database: dbStatus,
      studentCount,
      dbName,
      env: process.env.NODE_ENV || 'production'
    });
  } catch (err) {
    res.json({
      status: "EduTrack API v1.0.3 Error",
      error: err.message,
      database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
  }
});

// Routes
app.use("/api/semesters", semesterRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Debug DB route
app.get("/api/debug-db", async (req, res) => {
  try {
    const counts = {
      students: await mongoose.connection.db.collection('students').countDocuments(),
      semesters: await mongoose.connection.db.collection('semesters').countDocuments(),
      projects: await mongoose.connection.db.collection('projects').countDocuments(),
      achievements: await mongoose.connection.db.collection('achievements').countDocuments(),
      dbName: mongoose.connection.db.databaseName,
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    };
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import fs from 'fs';
const __dirname = path.resolve();
const buildPath = path.join(__dirname, 'build');
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

if (isProduction) {
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
        res.sendFile(path.join(buildPath, 'index.html'));
      }
    });
  }
}

// DB + Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harishpblr2007_db_user:Harish2807@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

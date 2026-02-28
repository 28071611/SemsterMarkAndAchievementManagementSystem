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

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Connection', 'keep-alive');
  next();
});

app.use("/api/semesters", semesterRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/achievements", achievementRoutes);
// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.send("EduTrack API Running");
});

import fs from 'fs';

// Serve frontend static files
const __dirname = path.resolve();
const buildPath = path.join(__dirname, 'build');

// Detection for production (Render sets RENDER=true or NODE_ENV=production)
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

if (isProduction) {
  console.log(`🚀 Production Mode: Serving static files from ${buildPath}`);

  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
        res.sendFile(path.join(buildPath, 'index.html'));
      }
    });
  } else {
    console.error(`❌ Build folder NOT found at ${buildPath}`);
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.status(500).send("Server Error: Frontend build folder missing. Please check deployment logs.");
      }
    });
  }
} else {
  app.get("/", (req, res) => {
    res.send("EduTrack API is running (Development Mode).");
  });
}

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
      console.log(`🌐 Local access: http://localhost:${process.env.PORT}`);
      console.log(`🌐 Network access: http://0.0.0.0:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB Error:", err));

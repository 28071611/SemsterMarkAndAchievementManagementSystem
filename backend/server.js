import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Route Imports
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

dotenv.config();

const app = express();

// v1.1.1 FINAL SYNC (Priority #1)
app.get("/api/v111-sync", (req, res) => res.json({
  status: "v1.1.1 ACTIVE",
  deployedAt: new Date().toISOString(),
  info: "This is a pure API service for EduTrack Firebase Frontend"
}));

// Manual CORS - Ultra Permissive
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

// Health Check
app.get("/api/test", async (req, res) => {
  try {
    const isConn = mongoose.connection.readyState === 1;
    const studentCount = isConn ? await mongoose.connection.db.collection('students').countDocuments() : 0;
    res.json({
      status: "EduTrack API v1.1.0 Online",
      database: isConn ? "Connected" : "Disconnected",
      students: studentCount,
      dbName: isConn ? mongoose.connection.db.databaseName : "Checking..."
    });
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
});

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/achievements", achievementRoutes);

// Root Fallback
app.get("/", (req, res) => {
  res.send(`<h1>EduTrack API v1.1.0</h1><p>Status: Active</p><p>Backend is operational. Please visit the <a href="https://edutrack-7063e.web.app/">Dashboard</a></p>`);
});

// DB & Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harishpblr2007_db_user:Harish2807@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Atlas Connected (v1.1.0)"))
  .catch((err) => console.error("❌ Atlas Connection Error:", err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 v1.1.0 running on port ${PORT}`);
});

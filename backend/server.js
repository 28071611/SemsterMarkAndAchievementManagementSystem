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

// Serve frontend static files
const rootDir = process.cwd();
const isProduction = process.env.NODE_ENV === 'production';

// In production, serve the frontend build
if (isProduction || process.env.ALWAYS_SERVE_FRONTEND === 'true') {
  const possiblePaths = [
    path.join(rootDir, 'frontend', 'build'),
    path.join(rootDir, 'build'), // if build is at root
    path.join(rootDir, '..', 'frontend', 'build')
  ];

  possiblePaths.forEach(p => {
    app.use(express.static(p));
  });

  app.get('*', (req, res) => {
    // Exclude API and uploads
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return res.status(404).json({ message: "API route not found" });
    }

    // Try each possible path for index.html
    let served = false;
    for (const p of possiblePaths) {
      const indexPath = path.join(p, 'index.html');
      // res.sendFile is async, so we use the callback to try next
      if (!served) {
        res.sendFile(indexPath, (err) => {
          if (!err) {
            served = true;
          } else if (p === possiblePaths[possiblePaths.length - 1]) {
            // Last one failed, send error
            res.status(404).send("Frontend build not found. Please ensure the build command 'npm run build' was executed successfully.");
          }
        });
        break; // Stop loop and let the callback handle things (though res.sendFile isn't ideal here for a loop)
      }
    }
  });
} else {
  // Default root for non-production
  app.get("/", (req, res) => {
    res.send("EduTrack API is running (Development Mode). Front-end not served.");
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

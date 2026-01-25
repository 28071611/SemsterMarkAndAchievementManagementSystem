const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const path = require('path');
  const compression = require('compression');
  const rateLimit = require('express-rate-limit');

  // Load environment variables
  dotenv.config();

  const app = express();

  // Performance optimizations
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // Serve uploaded files with caching
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '1d', // Cache for 1 day
    etag: true
  }));

  // MongoDB connection with connection pooling
  mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 50, // Maintain up to 50 socket connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  });

  // Routes
  const studentRoutes = require("./routes/studentRoutes.js");
  const authRoutes = require("./routes/authRoutes.js");
  const semesterRoutes = require("./routes/semesterRoutes.js");
  const projectRoutes = require("./routes/projectRoutes.js");
  const courseRoutes = require("./routes/courseRoutes.js");
  const achievementRoutes = require("./routes/achievementRoutes.js");

  app.use("/api/students", studentRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/semesters", semesterRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/achievements", achievementRoutes);

  // Test route
  app.get("/", (req, res) => {
    res.json({ 
      status: "EduTrack API Running",
      worker: process.pid,
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      worker: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });
}

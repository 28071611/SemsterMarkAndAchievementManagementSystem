// MongoDB initialization script
db = db.getSiblingDB('edutrack');

// Create collections with indexes
db.createCollection('students');
db.createCollection('semesters');
db.createCollection('projects');
db.createCollection('courses');
db.createCollection('achievements');

// Create indexes for better performance
db.students.createIndex({ "registerNumber": 1 }, { unique: true });
db.students.createIndex({ "email": 1 });
db.semesters.createIndex({ "studentId": 1 });
db.projects.createIndex({ "studentId": 1 });
db.courses.createIndex({ "studentId": 1 });
db.achievements.createIndex({ "studentId": 1 });

// Insert initial admin user if needed
db.users.insertOne({
  username: "admin",
  password: "admin123", // In production, use hashed passwords
  role: "admin",
  createdAt: new Date()
});

print("Database initialized successfully");

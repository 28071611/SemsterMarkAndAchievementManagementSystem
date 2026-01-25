// MongoDB initialization script for EduTrack
db = db.getSiblingDB('edutrack');

// Create collections with validation
db.createCollection('students', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'registerNumber', 'email', 'department', 'year'],
      properties: {
        name: { bsonType: 'string', minLength: 1 },
        registerNumber: { bsonType: 'string', minLength: 1 },
        email: { bsonType: 'string', pattern: '^[^\s@]+@srishakthi\.ac\.in$' },
        department: { bsonType: 'string' },
        year: { bsonType: 'string' },
        currentSemester: { bsonType: 'int', minimum: 1, maximum: 8 },
        cgpa: { bsonType: 'double', minimum: 0, maximum: 10 }
      }
    }
  }
});

db.createCollection('semesters');
db.createCollection('projects');
db.createCollection('extracourses');
db.createCollection('achievements');

// Create indexes for better performance
db.students.createIndex({ registerNumber: 1 }, { unique: true });
db.students.createIndex({ email: 1 }, { unique: true });
db.semesters.createIndex({ studentId: 1, num: 1 }, { unique: true });
db.projects.createIndex({ studentId: 1 });
db.extracourses.createIndex({ studentId: 1 });
db.achievements.createIndex({ studentId: 1 });

// Create default admin user (if needed for future admin authentication)
db.admins.insertOne({
  username: 'admin',
  password: '$2a$10$example.hash.here', // This should be properly hashed
  role: 'admin',
  createdAt: new Date()
});

print('EduTrack database initialized successfully!');

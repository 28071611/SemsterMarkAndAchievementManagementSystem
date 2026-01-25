const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database for testing
const memoryDB = {
  students: [
    {
      _id: '1',
      name: 'John Doe',
      registerNumber: 'RA2111003010001',
      email: 'john@srishakthi.ac.in',
      department: 'CSE',
      year: '3',
      cgpa: 8.5,
      semesters: [
        {
          _id: 's1',
          num: 1,
          sgpa: 8.2,
          subjects: [
            { code: 'CS101', title: 'Programming Fundamentals', credits: 4, grade: 'A' },
            { code: 'CS102', title: 'Data Structures', credits: 4, grade: 'B+' }
          ]
        },
        {
          _id: 's2',
          num: 2,
          sgpa: 8.8,
          subjects: [
            { code: 'CS201', title: 'Algorithms', credits: 4, grade: 'A+' },
            { code: 'CS202', title: 'Database Systems', credits: 4, grade: 'A' }
          ]
        }
      ]
    },
    {
      _id: '2',
      name: 'Jane Smith',
      registerNumber: 'RA2111003010002',
      email: 'jane@srishakthi.ac.in',
      department: 'ECE',
      year: '3',
      cgpa: 9.2,
      semesters: [
        {
          _id: 's3',
          num: 1,
          sgpa: 9.0,
          subjects: [
            { code: 'EC101', title: 'Electronics Basics', credits: 4, grade: 'A+' },
            { code: 'EC102', title: 'Circuits', credits: 4, grade: 'A' }
          ]
        }
      ]
    }
  ],
  projects: [
    {
      _id: 'p1',
      name: 'E-commerce Website',
      description: 'Full-stack e-commerce platform with React and Node.js',
      studentId: '1',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      pdfFileName: 'ecommerce-project.pdf'
    },
    {
      _id: 'p2',
      name: 'IoT Smart Home',
      description: 'Smart home automation system using IoT sensors',
      studentId: '2',
      technologies: ['Arduino', 'IoT', 'Python', 'MQTT'],
      pdfFileName: 'iot-project.pdf'
    }
  ],
  courses: [
    {
      _id: 'c1',
      name: 'Machine Learning',
      provider: 'Coursera',
      description: 'Introduction to Machine Learning with Python',
      studentId: '1',
      skills: ['Python', 'ML', 'Data Science', 'TensorFlow'],
      certificateFileName: 'ml-certificate.pdf'
    },
    {
      _id: 'c2',
      name: 'Web Development',
      provider: 'Udemy',
      description: 'Complete web development bootcamp',
      studentId: '2',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      certificateFileName: 'web-dev-certificate.pdf'
    }
  ],
  achievements: [
    {
      _id: 'a1',
      title: 'Hackathon Winner',
      description: 'Won first place in college hackathon',
      studentId: '1',
      date: '2024-01-15',
      category: 'Competition'
    },
    {
      _id: 'a2',
      title: 'Best Project Award',
      description: 'Best final year project award',
      studentId: '2',
      date: '2024-02-20',
      category: 'Academic'
    }
  ]
};

// Helper function to populate student data
const populateStudentData = (data, studentField = 'studentId') => {
  return data.map(item => {
    const populatedItem = { ...item };
    if (typeof item[studentField] === 'string') {
      const student = memoryDB.students.find(s => s._id === item[studentField]);
      if (student) {
        populatedItem[studentField] = {
          _id: student._id,
          name: student.name,
          registerNumber: student.registerNumber
        };
      }
    }
    return populatedItem;
  });
};

// API Routes
app.get('/', (req, res) => {
  res.send("EduTrack API Running (Memory Mode)");
});

// Students
app.get('/api/students', (req, res) => {
  res.json(memoryDB.students);
});

app.get('/api/students/:registerNumber', (req, res) => {
  const student = memoryDB.students.find(s => s.registerNumber === req.params.registerNumber);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// Semesters
app.get('/api/semesters', (req, res) => {
  const allSemesters = memoryDB.students.flatMap(s => 
    s.semesters.map(sem => ({ ...sem, studentId: s._id }))
  );
  res.json(populateStudentData(allSemesters));
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json(populateStudentData(memoryDB.projects));
});

// Courses
app.get('/api/courses', (req, res) => {
  res.json(populateStudentData(memoryDB.courses));
});

// Achievements
app.get('/api/achievements', (req, res) => {
  res.json(populateStudentData(memoryDB.achievements));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("🚀 EduTrack API Running (Memory Mode)");
  console.log(`🖥️  Server running on port ${PORT}`);
  console.log(`🌐 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://0.0.0.0:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🧪 Using in-memory database for testing`);
});

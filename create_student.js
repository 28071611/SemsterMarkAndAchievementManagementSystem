// Create a new student record with all details
db.students.insertOne({
  name: 'Harish',
  registerNumber: '714024104076',
  email: 'harish@college.edu',
  phone: '+91 9876543210',
  department: 'Computer Science',
  year: '3rd Year',
  currentSemester: 1,
  cgpa: 10,
  semesters: [
    {
      num: 1,
      sgpa: 10,
      totalCredits: 3,
      subjects: [
        {
          code: 'cs101',
          title: 'Datastructures',
          credits: 3,
          grade: 'O'
        }
      ]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Show all student records
print("All student records:");
db.students.find().pretty();

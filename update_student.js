// Update existing student record with new fields
db.students.updateOne(
  { registerNumber: '714024104076' },
  {
    $set: {
      email: 'harish@college.edu',
      phone: '+91 9876543210',
      department: 'Computer Science',
      year: '3rd Year',
      currentSemester: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
);

// Verify the update
print("Updated student record:");
db.students.find({registerNumber: '714024104076'}).pretty();

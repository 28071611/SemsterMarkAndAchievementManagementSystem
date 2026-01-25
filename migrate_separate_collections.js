// Migration script to move data from nested arrays to separate collections
// Run this script in MongoDB shell: mongosh edutrack migrate_separate_collections.js

import { ObjectId } from 'mongodb';

// Get database
const db = db.getSiblingDB('edutrack');

console.log('Starting migration to separate collections...');

// Step 1: Migrate Semesters
console.log('Migrating semesters...');
const studentsWithSemesters = db.students.find({ semesters: { $exists: true, $ne: [] } });

studentsWithSemesters.forEach(student => {
  student.semesters.forEach(semester => {
    const semesterDoc = {
      studentId: student._id,
      num: semester.num,
      sgpa: semester.sgpa,
      totalCredits: semester.totalCredits,
      subjects: semester.subjects,
      createdAt: semester.createdAt || new Date(),
      updatedAt: semester.updatedAt || new Date()
    };
    
    db.semesters.insertOne(semesterDoc);
  });
});

// Step 2: Migrate Projects
console.log('Migrating projects...');
const studentsWithProjects = db.students.find({ projects: { $exists: true, $ne: [] } });

studentsWithProjects.forEach(student => {
  student.projects.forEach(project => {
    const projectDoc = {
      studentId: student._id,
      name: project.name,
      description: project.description,
      technologies: project.technologies || [],
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status || 'Planning',
      projectUrl: project.projectUrl,
      pdfUrl: project.pdfUrl,
      pdfFileName: project.pdfFileName,
      createdAt: project.createdAt || new Date(),
      updatedAt: project.updatedAt || new Date()
    };
    
    db.projects.insertOne(projectDoc);
  });
});

// Step 3: Migrate Extra Courses
console.log('Migrating extra courses...');
const studentsWithCourses = db.students.find({ extraCourses: { $exists: true, $ne: [] } });

studentsWithCourses.forEach(student => {
  student.extraCourses.forEach(course => {
    const courseDoc = {
      studentId: student._id,
      name: course.name,
      provider: course.provider,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      certificateUrl: course.certificateUrl,
      certificateFileName: course.certificateFileName,
      skills: course.skills || [],
      createdAt: course.createdAt || new Date(),
      updatedAt: course.updatedAt || new Date()
    };
    
    db.extraCourses.insertOne(courseDoc);
  });
});

// Step 4: Migrate Achievements
console.log('Migrating achievements...');
const studentsWithAchievements = db.students.find({ achievements: { $exists: true, $ne: [] } });

studentsWithAchievements.forEach(student => {
  student.achievements.forEach(achievement => {
    const achievementDoc = {
      studentId: student._id,
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      level: achievement.level,
      date: achievement.date,
      certificateUrl: achievement.certificateUrl,
      certificateFileName: achievement.certificateFileName,
      createdAt: achievement.createdAt || new Date(),
      updatedAt: achievement.updatedAt || new Date()
    };
    
    db.achievements.insertOne(achievementDoc);
  });
});

// Step 5: Remove nested arrays from student documents
console.log('Cleaning up student documents...');
db.students.updateMany(
  {},
  {
    $unset: {
      semesters: "",
      projects: "",
      extraCourses: "",
      achievements: ""
    }
  }
);

// Step 6: Create indexes for better performance
console.log('Creating indexes...');
db.semesters.createIndex({ studentId: 1, num: 1 }, { unique: true });
db.projects.createIndex({ studentId: 1 });
db.extraCourses.createIndex({ studentId: 1 });
db.achievements.createIndex({ studentId: 1 });

console.log('Migration completed successfully!');
console.log('Summary:');
console.log(`- Semesters migrated: ${db.semesters.countDocuments()}`);
console.log(`- Projects migrated: ${db.projects.countDocuments()}`);
console.log(`- Extra courses migrated: ${db.extraCourses.countDocuments()}`);
console.log(`- Achievements migrated: ${db.achievements.countDocuments()}`);
console.log(`- Student documents cleaned: ${db.students.countDocuments()}`);

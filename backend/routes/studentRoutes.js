import express from "express";
import Student from "../models/Student.js";
import Semester from "../models/Semester.js";
import Project from "../models/Project.js";
import ExtraCourse from "../models/ExtraCourse.js";
import Achievement from "../models/Achievement.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * GET all students (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/**
 * GET student by register number with all related data
 */
router.get("/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get all related data
    const [semesters, projects, extraCourses, achievements] = await Promise.all([
      Semester.find({ studentId: student._id }).sort({ num: 1 }),
      Project.find({ studentId: student._id }).sort({ createdAt: -1 }),
      ExtraCourse.find({ studentId: student._id }).sort({ createdAt: -1 }),
      Achievement.find({ studentId: student._id }).sort({ date: -1 })
    ]);

    // Combine student data with related collections
    const studentWithDetails = {
      ...student.toObject(),
      semesters,
      projects,
      extraCourses,
      achievements
    };

    res.json(studentWithDetails);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

/**
 * POST add/login student
 */
router.post("/", async (req, res) => {
  try {
    const { name, registerNumber, email, phone, department, year, currentSemester } = req.body;

    let student = await Student.findOne({ registerNumber });
    
    if (!student) {
      // Check if email already exists
      if (email) {
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: "Email already registered" });
        }
      }
      
      student = new Student({
        name,
        registerNumber,
        email,
        phone: phone || '',
        department,
        year,
        currentSemester: parseInt(currentSemester) || 1,
        cgpa: 0
      });
    } else {
      // Update existing student with additional info if provided
      if (email && !student.email) student.email = email;
      if (phone && !student.phone) student.phone = phone;
      if (department && !student.department) student.department = department;
      if (year && !student.year) student.year = year;
      if (currentSemester && !student.currentSemester) student.currentSemester = parseInt(currentSemester);
    }
    
    await student.save();
    res.json(student);
  } catch (err) {
    console.error('Error in student POST:', err);
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Failed to save student" });
  }
});

/**
 * PUT update student by register number (Admin only)
 */
router.put("/:registerNumber", async (req, res) => {
  try {
    const { name, email, phone, department, year } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { registerNumber: req.params.registerNumber },
      { name, email, phone, department, year },
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json(student);
  } catch (err) {
    console.error('Error updating student:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Failed to update student" });
  }
});

/**
 * POST register new student (full registration)
 */
router.post("/register", async (req, res) => {
  try {
    const { name, registerNumber, email, phone, department, year, currentSemester } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [
        { registerNumber },
        { email }
      ]
    });
    
    if (existingStudent) {
      if (existingStudent.registerNumber === registerNumber) {
        return res.status(400).json({ error: "Register number already registered" });
      }
      if (existingStudent.email === email) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }
    
    const student = new Student({
      name,
      registerNumber,
      email,
      phone: phone || '',
      department,
      year,
      currentSemester: parseInt(currentSemester) || 1,
      cgpa: 0
    });
    
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Error in student registration:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Failed to register student" });
  }
});

export default router;


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
 * GET dashboard statistics (Admin only)
 */
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const stats = await Student.aggregate([
      {
        $group: {
          _id: null,
          avgCgpa: { $avg: "$cgpa" },
          totalArrears: { $sum: "$arrears" },
          deptDistribution: { $push: "$department" }
        }
      }
    ]);

    const deptCounts = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.json({
      totalStudents,
      avgCgpa: stats[0]?.avgCgpa || 0,
      totalArrears: stats[0]?.totalArrears || 0,
      departmentDistribution: deptCounts
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

/**
 * GET search students with filters
 */
router.get("/search", async (req, res) => {
  try {
    const { q, department, year, hasArrears, minCgpa } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { registerNumber: { $regex: q, $options: "i" } }
      ];
    }

    if (department) query.department = department;
    if (year) query.year = year;
    if (hasArrears === 'true') query.arrears = { $gt: 0 };
    if (minCgpa) query.cgpa = { $gte: parseFloat(minCgpa) };

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

/**
 * POST bulk-delete students (Admin only)
 */
router.post("/bulk-delete", async (req, res) => {
  try {
    const { registerNumbers } = req.body;
    if (!Array.isArray(registerNumbers) || registerNumbers.length === 0) {
      return res.status(400).json({ error: "Invalid register numbers list" });
    }

    await Student.deleteMany({ registerNumber: { $in: registerNumbers } });
    res.json({ message: `Successfully deleted ${registerNumbers.length} students` });
  } catch (err) {
    res.status(500).json({ error: "Bulk delete failed" });
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


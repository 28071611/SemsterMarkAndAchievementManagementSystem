import express from "express";
import Semester from "../models/Semester.js";
import Student from "../models/Student.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * GET all semesters (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const semesters = await Semester.find().populate('studentId', 'name registerNumber');
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch semesters" });
  }
});

const GRADE_POINTS = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

/**
 * GET all semesters for a student
 */
router.get("/student/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const semesters = await Semester.find({ studentId: student._id }).sort({ num: 1 });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch semesters" });
  }
});

/**
 * POST add semester to student
 */
router.post("/student/:registerNumber", async (req, res) => {
  try {
    const { semesterData } = req.body;
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Calculate SGPA
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    semesterData.subjects.forEach(sub => {
      totalWeightedPoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
      totalCredits += sub.credits;
    });
    const sgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0;
    
    // Remove existing semester with same number if exists
    await Semester.deleteOne({ studentId: student._id, num: semesterData.num });
    
    // Create new semester
    const newSemester = new Semester({
      studentId: student._id,
      ...semesterData,
      sgpa,
      totalCredits
    });
    
    await newSemester.save();
    
    // Recalculate student's CGPA
    const allSemesters = await Semester.find({ studentId: student._id });
    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    
    allSemesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        cumulativePoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
        cumulativeCredits += sub.credits;
      });
    });
    
    student.cgpa = cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits) : 0;
    await student.save();
    
    res.json(newSemester);
  } catch (err) {
    console.error('Error adding semester:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Semester already exists for this student" });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST add semester (Admin only)
 */
router.post("/", async (req, res) => {
  try {
    const semesterData = req.body;
    
    // Calculate SGPA
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    semesterData.subjects.forEach(sub => {
      totalWeightedPoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
      totalCredits += sub.credits;
    });
    const sgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0;
    
    // Remove existing semester with same number if exists
    await Semester.deleteOne({ studentId: semesterData.studentId, num: semesterData.num });
    
    // Create new semester
    const newSemester = new Semester({
      ...semesterData,
      sgpa,
      totalCredits
    });
    
    await newSemester.save();
    
    // Recalculate student's CGPA
    const allSemesters = await Semester.find({ studentId: semesterData.studentId });
    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    
    allSemesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        cumulativePoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
        cumulativeCredits += sub.credits;
      });
    });
    
    const student = await Student.findById(semesterData.studentId);
    if (student) {
      student.cgpa = cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits) : 0;
      await student.save();
    }
    
    res.json(newSemester);
  } catch (err) {
    console.error('Error adding semester:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Semester already exists for this student" });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE semester
 */
router.delete("/:semesterId", async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.semesterId);
    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Recalculate student's CGPA
    const allSemesters = await Semester.find({ studentId: semester.studentId });
    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    
    allSemesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        cumulativePoints += (GRADE_POINTS[sub.grade] || 0) * sub.credits;
        cumulativeCredits += sub.credits;
      });
    });
    
    const student = await Student.findById(semester.studentId);
    student.cgpa = cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits) : 0;
    await student.save();
    
    res.json({ message: "Semester deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT update semester by ID (Admin only)
 */
router.put("/:id", async (req, res) => {
  try {
    const { num, subjects, sgpa } = req.body;
    
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      { num, subjects, sgpa },
      { new: true, runValidators: true }
    ).populate('studentId', 'name registerNumber');
    
    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }
    
    // Recalculate student's CGPA if semester data changed
    const student = await Student.findById(semester.studentId);
    if (student) {
      const allSemesters = await Semester.find({ studentId: semester.studentId });
      let totalPoints = 0;
      let totalCredits = 0;
      
      allSemesters.forEach(sem => {
        if (sem.sgpa && sem.subjects) {
          const semesterCredits = sem.subjects.reduce((sum, subj) => sum + subj.credits, 0);
          totalPoints += sem.sgpa * semesterCredits;
          totalCredits += semesterCredits;
        }
      });
      
      student.cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
      await student.save();
    }
    
    res.json(semester);
  } catch (err) {
    console.error('Error updating semester:', err);
    res.status(500).json({ error: "Failed to update semester" });
  }
});

export default router;

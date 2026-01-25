import express from "express";
import ExtraCourse from "../models/ExtraCourse.js";
import Student from "../models/Student.js";
import { uploadSinglePDF, getFileUrl, deleteFile } from "../middleware/upload.js";

const router = express.Router();

/**
 * GET all courses (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const courses = await ExtraCourse.find().populate('studentId', 'name registerNumber');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * GET all courses for a student
 */
router.get("/student/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const courses = await ExtraCourse.find({ studentId: student._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * POST add course to student with PDF upload
 */
router.post("/student/:registerNumber", uploadSinglePDF('certificateFile'), async (req, res) => {
  try {
    const { courseData } = req.body;
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Handle certificate PDF upload
    let certificateUrl = null;
    let certificateFileName = null;
    
    if (req.file) {
      certificateUrl = getFileUrl(req.file.filename, 'course');
      certificateFileName = req.file.originalname;
    }

    const newCourse = new ExtraCourse({
      studentId: student._id,
      ...JSON.parse(courseData),
      certificateUrl,
      certificateFileName
    });
    
    await newCourse.save();
    res.json(newCourse);
  } catch (err) {
    console.error('Error adding course:', err);
    if (req.file) {
      // Clean up uploaded file if there was an error
      deleteFile(req.file.filename, 'course');
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT update course with optional PDF upload
 */
router.put("/:courseId", uploadSinglePDF('certificateFile'), async (req, res) => {
  try {
    const { courseData } = req.body;
    const existingCourse = await ExtraCourse.findById(req.params.courseId);
    
    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Handle certificate PDF update
    let certificateUrl = existingCourse.certificateUrl;
    let certificateFileName = existingCourse.certificateFileName;
    
    if (req.file) {
      // Delete old certificate if exists
      if (existingCourse.certificateUrl && existingCourse.certificateFileName) {
        const oldFilename = existingCourse.certificateUrl.split('/').pop();
        deleteFile(oldFilename, 'course');
      }
      
      // Set new certificate info
      certificateUrl = getFileUrl(req.file.filename, 'course');
      certificateFileName = req.file.originalname;
    }

    const updatedCourse = await ExtraCourse.findByIdAndUpdate(
      req.params.courseId,
      { 
        ...JSON.parse(courseData), 
        certificateUrl,
        certificateFileName,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedCourse);
  } catch (err) {
    console.error('Error updating course:', err);
    if (req.file) {
      deleteFile(req.file.filename, 'course');
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE course
 */
router.delete("/:courseId", async (req, res) => {
  try {
    const course = await ExtraCourse.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete associated certificate file
    if (course.certificateUrl && course.certificateFileName) {
      const filename = course.certificateUrl.split('/').pop();
      deleteFile(filename, 'course');
    }
    
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

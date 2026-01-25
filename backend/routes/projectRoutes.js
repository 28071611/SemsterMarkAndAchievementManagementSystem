import express from "express";
import Project from "../models/Project.js";
import Student from "../models/Student.js";
import { uploadSinglePDF, getFileUrl, deleteFile } from "../middleware/upload.js";

const router = express.Router();

/**
 * GET all projects (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate('studentId', 'name registerNumber');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * GET all projects for a student
 */
router.get("/student/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const projects = await Project.find({ studentId: student._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * POST add project to student with PDF upload
 */
router.post("/student/:registerNumber", uploadSinglePDF('pdfFile'), async (req, res) => {
  try {
    const { projectData } = req.body;
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Handle PDF file upload
    let pdfUrl = null;
    let pdfFileName = null;
    
    if (req.file) {
      pdfUrl = getFileUrl(req.file.filename, 'project');
      pdfFileName = req.file.originalname;
    }

    const newProject = new Project({
      studentId: student._id,
      ...JSON.parse(projectData),
      pdfUrl,
      pdfFileName
    });
    
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    console.error('Error adding project:', err);
    if (req.file) {
      // Clean up uploaded file if there was an error
      deleteFile(req.file.filename, 'project');
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT update project with optional PDF upload
 */
router.put("/:projectId", uploadSinglePDF('pdfFile'), async (req, res) => {
  try {
    const { projectData } = req.body;
    const existingProject = await Project.findById(req.params.projectId);
    
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Handle PDF file update
    let pdfUrl = existingProject.pdfUrl;
    let pdfFileName = existingProject.pdfFileName;
    
    if (req.file) {
      // Delete old PDF if exists
      if (existingProject.pdfUrl && existingProject.pdfFileName) {
        const oldFilename = existingProject.pdfUrl.split('/').pop();
        deleteFile(oldFilename, 'project');
      }
      
      // Set new PDF info
      pdfUrl = getFileUrl(req.file.filename, 'project');
      pdfFileName = req.file.originalname;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { 
        ...JSON.parse(projectData), 
        pdfUrl,
        pdfFileName,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    if (req.file) {
      deleteFile(req.file.filename, 'project');
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE project
 */
router.delete("/:projectId", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete associated PDF file
    if (project.pdfUrl && project.pdfFileName) {
      const filename = project.pdfUrl.split('/').pop();
      deleteFile(filename, 'project');
    }
    
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

import express from "express";
import Achievement from "../models/Achievement.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * GET all achievements (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find().populate('studentId', 'name registerNumber');
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

/**
 * GET all achievements for a student
 */
router.get("/student/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const achievements = await Achievement.find({ studentId: student._id }).sort({ date: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

/**
 * POST add achievement to student
 */
router.post("/student/:registerNumber", async (req, res) => {
  try {
    const { achievementData } = req.body;
    const student = await Student.findOne({ registerNumber: req.params.registerNumber });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newAchievement = new Achievement({
      studentId: student._id,
      ...achievementData
    });
    
    await newAchievement.save();
    res.json(newAchievement);
  } catch (err) {
    console.error('Error adding achievement:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT update achievement
 */
router.put("/:achievementId", async (req, res) => {
  try {
    const { achievementData } = req.body;
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.achievementId,
      { ...achievementData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    
    res.json(achievement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE achievement
 */
router.delete("/:achievementId", async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    
    res.json({ message: "Achievement deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

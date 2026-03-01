import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Try regular User collection
    let user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.json({ token, role: 'user' });
    }

    // 2. Fallback to Student collection (Register Number as login)
    const Student = mongoose.model("Student");
    const student = await Student.findOne({ registerNumber: email });

    if (student) {
      // Allow login if password matches registerNumber (simplest for 250 students)
      if (password === student.registerNumber) {
        const token = jwt.sign(
          { id: student._id, isStudent: true },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res.json({ token, role: 'student', studentId: student._id });
      }

      return res.status(400).json({ message: "Invalid password for student" });
    }

    return res.status(400).json({ message: "User or Student not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CHANGE PASSWORD */
router.post("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Invalid current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


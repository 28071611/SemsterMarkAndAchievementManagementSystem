import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  num: { type: Number, required: true },
  sgpa: { type: Number, default: 0 },
  totalCredits: { type: Number, default: 0 },
  subjects: [{
    code: { type: String, required: true },
    title: { type: String, required: true },
    credits: { type: Number, required: true },
    grade: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure unique semester per student
semesterSchema.index({ studentId: 1, num: 1 }, { unique: true });

export default mongoose.model("Semester", semesterSchema);

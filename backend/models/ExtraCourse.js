import mongoose from "mongoose";

const extraCourseSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  certificateUrl: String,
  certificateFileName: String,
  skills: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for faster queries by student
extraCourseSchema.index({ studentId: 1 });

export default mongoose.model("ExtraCourse", extraCourseSchema);

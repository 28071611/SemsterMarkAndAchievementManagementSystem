import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Academic', 'Technical', 'Sports', 'Cultural', 'Competition', 'Other'],
    required: true
  },
  level: {
    type: String,
    enum: ['College', 'University', 'State', 'National', 'International'],
    required: true
  },
  date: { type: Date, required: true },
  certificateUrl: String,
  certificateFileName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for faster queries by student
achievementSchema.index({ studentId: 1 });

export default mongoose.model("Achievement", achievementSchema);

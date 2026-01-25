import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  projectUrl: String,
  pdfUrl: String,
  pdfFileName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for faster queries by student
projectSchema.index({ studentId: 1 });

export default mongoose.model("Project", projectSchema);

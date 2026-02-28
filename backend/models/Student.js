import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  umisNumber: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Computer Science',
      'Information Technology',
      'Electronics & Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Bio Technology',
      'Food Technology',
      'Agricultural Engineering',
      'Artificial Intelligence and Data Science',
      'Artificial Intelligence and Machine Learning',
      'Data Science'
    ]
  },
  year: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  currentSemester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  cgpa: {
    type: Number,
    default: 0,
  },
  arrears: {
    type: Number,
    default: 0
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual population for related collections
studentSchema.virtual('semesters', {
  ref: 'Semester',
  localField: '_id',
  foreignField: 'studentId'
});

studentSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'studentId'
});

studentSchema.virtual('achievements', {
  ref: 'Achievement',
  localField: '_id',
  foreignField: 'studentId'
});

studentSchema.virtual('extraCourses', {
  ref: 'ExtraCourse',
  localField: '_id',
  foreignField: 'studentId'
});

// Update the updatedAt field on save
studentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Student", studentSchema);

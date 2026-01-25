import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different file types
const projectDocsDir = path.join(uploadsDir, 'projects');
const courseCertsDir = path.join(uploadsDir, 'courses');
const achievementCertsDir = path.join(uploadsDir, 'achievements');

[projectDocsDir, courseCertsDir, achievementCertsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on file type or route
    if (req.originalUrl && req.originalUrl.includes('projects')) {
      cb(null, projectDocsDir);
    } else if (req.originalUrl && req.originalUrl.includes('courses')) {
      cb(null, courseCertsDir);
    } else if (req.originalUrl && req.originalUrl.includes('achievements')) {
      cb(null, achievementCertsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Single file upload middleware
export const uploadSinglePDF = (fieldName) => upload.single(fieldName);

// Multiple files upload middleware
export const uploadMultiplePDFs = (fieldName, maxCount = 1) => upload.array(fieldName, maxCount);

// Helper function to get file URL
export const getFileUrl = (filename, type = 'general') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const folder = type === 'project' ? 'projects' : type === 'course' ? 'courses' : type === 'achievement' ? 'achievements' : '';
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filename, type = 'general') => {
  const folder = type === 'project' ? 'projects' : type === 'course' ? 'courses' : type === 'achievement' ? 'achievements' : '';
  const filePath = path.join(uploadsDir, folder, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

export default upload;


import fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack';

// Define Minimal Models for Seeding
const StudentSchema = new mongoose.Schema({
    name: String,
    registerNumber: { type: String, unique: true },
    email: String,
    phone: String,
    department: String,
    year: String,
    currentSemester: Number,
    cgpa: Number,
    dob: String,
    gender: String,
    umisNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const SemesterSchema = new mongoose.Schema({
    registerNumber: String,
    num: Number,
    subjects: Array,
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
const Semester = mongoose.models.Semester || mongoose.model('Semester', SemesterSchema);

async function importData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB via Mongoose');

        // Read JSON file from root
        const jsonPath = path.join(__dirname, '..', 'students_mongodb.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const studentsData = JSON.parse(rawData);

        console.log(`📊 Found ${studentsData.length} students to import`);

        let successCount = 0;
        let errorCount = 0;

        for (const student of studentsData) {
            try {
                // 1. Prepare Student Data
                const studentDoc = {
                    name: student.name,
                    registerNumber: student.register_number,
                    email: `${student.register_number}@edutrack.com`,
                    phone: '',
                    department: "Computer Science",
                    year: "1st Year",
                    currentSemester: 1,
                    cgpa: student.cgpa || 0,
                    dob: student.dob,
                    gender: student.gender,
                    umisNumber: student.umis_number,
                    updatedAt: new Date()
                };

                // 2. Upsert Student
                const studentRecord = await Student.findOneAndUpdate(
                    { registerNumber: student.register_number },
                    studentDoc,
                    { upsert: true, new: true }
                );

                // 3. Create Semester Record if subjects exist
                if (student.subjects && student.subjects.length > 0) {
                    const semesterDoc = {
                        studentId: studentRecord._id, // Correct ObjectId
                        num: 1,
                        subjects: student.subjects.map(s => ({
                            code: s.subject_code,
                            title: s.subject_name,
                            credits: s.credits,
                            grade: s.grade
                        })),
                        updatedAt: new Date()
                    };
                    await Semester.findOneAndUpdate(
                        { studentId: studentRecord._id, num: 1 },
                        semesterDoc,
                        { upsert: true }
                    );
                }

                successCount++;
                if (successCount % 50 === 0) process.stdout.write('.');
            } catch (err) {
                console.error(`\n❌ Error processing ${student.register_number}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n\n✅ Import Completed:`);
        console.log(`- Success: ${successCount}`);
        console.log(`- Errors: ${errorCount}`);

    } catch (err) {
        console.error('❌ Fatal Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

importData();

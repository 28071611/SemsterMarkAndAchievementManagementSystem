
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack';

async function migrateSemesters() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB via Mongoose');

        const db = mongoose.connection.db;
        const studentsCollection = db.collection('students');
        const semestersCollection = db.collection('semesters');

        console.log('Starting migration of semesters...');

        // Find students with semesters array
        const studentsWithSemesters = await studentsCollection.find({
            semesters: { $exists: true, $ne: [] }
        }).toArray();

        console.log(`Found ${studentsWithSemesters.length} students with embedded semesters.`);

        if (studentsWithSemesters.length === 0) {
            console.log('No students to migrate.');
            return;
        }

        let migratedCount = 0;

        for (const student of studentsWithSemesters) {
            if (!student.semesters || !Array.isArray(student.semesters)) continue;

            for (const semester of student.semesters) {
                const semesterDoc = {
                    studentId: student._id, // Link to student
                    num: semester.num,
                    sgpa: semester.sgpa,
                    totalCredits: semester.totalCredits,
                    subjects: semester.subjects,
                    createdAt: semester.createdAt || new Date(),
                    updatedAt: semester.updatedAt || new Date()
                };

                // Insert into semesters collection
                // specific uniqueness check: studentId + num
                await semestersCollection.updateOne(
                    { studentId: student._id, num: semester.num },
                    { $set: semesterDoc },
                    { upsert: true }
                );
            }
            migratedCount++;
        }

        console.log(`Migrated semesters for ${migratedCount} students.`);

        // Remove nested arrays from student documents
        console.log('Cleaning up student documents...');
        await studentsCollection.updateMany(
            {},
            {
                $unset: {
                    semesters: ""
                }
            }
        );

        console.log('✅ Migration completed successfully!');

    } catch (err) {
        console.error('❌ Fatal Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

migrateSemesters();

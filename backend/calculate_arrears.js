
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (hardcoded fallback)
const MONGO_URI = 'mongodb://localhost:27017/edutrack';

async function calculateArrears() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const studentsCollection = db.collection('students');

        const students = await studentsCollection.find({}).toArray();
        console.log(`Processing ${students.length} students...`);

        let updatedCount = 0;
        let studentsWithArrears = 0;

        for (const student of students) {
            let arrearsCount = 0;

            // Check embedded semesters
            if (student.semesters && Array.isArray(student.semesters)) {
                for (const sem of student.semesters) {
                    if (sem.subjects && Array.isArray(sem.subjects)) {
                        for (const sub of sem.subjects) {
                            // Check for Arrear Grades
                            // User mentioned "UA". We also found "U" and "RA" in search.
                            // Standard FAIL grades: U, UA, RA, F, AB (Absent)
                            const failGrades = ['U', 'UA', 'RA', 'F', 'AB', 'I'];

                            if (failGrades.includes(sub.grade.toUpperCase())) {
                                arrearsCount++;
                            }
                        }
                    }
                }
            }

            await studentsCollection.updateOne(
                { _id: student._id },
                { $set: { arrears: arrearsCount } }
            );
            updatedCount++;
            if (arrearsCount > 0) studentsWithArrears++;
        }

        console.log(`✅ Updated Arrears for ${updatedCount} students.`);
        console.log(`📊 Total Students with Arrears: ${studentsWithArrears}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

calculateArrears();

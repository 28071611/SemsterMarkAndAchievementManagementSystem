
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (hardcoded fallback)
const MONGO_URI = 'mongodb://localhost:27017/edutrack';

async function populateSemesters() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const studentsCollection = db.collection('students');

        const students = await studentsCollection.find({}).toArray();
        console.log(`Processing ${students.length} students...`);

        let updatedCount = 0;

        for (const student of students) {
            let existingSemesters = student.semesters || [];
            let needsUpdate = false;

            // Map existing semester numbers
            const existingNums = new Set(existingSemesters.map(s => s.num));

            // Ensure semesters 1 to 8 exist
            for (let i = 1; i <= 8; i++) {
                if (!existingNums.has(i)) {
                    existingSemesters.push({
                        num: i,
                        sgpa: 0,
                        totalCredits: 0,
                        subjects: [], // Empty subjects for future/empty semesters
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                // Sort semesters by number
                existingSemesters.sort((a, b) => a.num - b.num);

                await studentsCollection.updateOne(
                    { _id: student._id },
                    { $set: { semesters: existingSemesters } }
                );
                updatedCount++;
            }
        }

        console.log(`✅ Populated 8 semesters for ${updatedCount} students.`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

populateSemesters();


import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (hardcoded fallback)
const MONGO_URI = 'mongodb+srv://harishpblr2007_db_user:Harish2807@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

async function calculateCGPA() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const studentsCollection = db.collection('students');

        const students = await studentsCollection.find({}).toArray();
        console.log(`Processing ${students.length} students...`);

        let updatedCount = 0;

        for (const student of students) {
            let totalPoints = 0;
            let totalCredits = 0;

            // Check semesters from separate collection
            const studentSemesters = await db.collection('semesters').find({ studentId: student._id }).toArray();
            for (const sem of studentSemesters) {
                if (sem.subjects && Array.isArray(sem.subjects)) {
                    for (const sub of sem.subjects) {
                        let points = sub.points;
                        if (points === undefined) {
                            switch (sub.grade) {
                                case 'O': points = 10; break;
                                case 'A+': points = 9; break;
                                case 'A': points = 8; break;
                                case 'B+': points = 7; break;
                                case 'B': points = 6; break;
                                case 'C': points = 5; break;
                                case 'P': points = 4; break;
                                case 'U': points = 0; break;
                                case 'F': points = 0; break;
                                default: points = 0;
                            }
                        }

                        totalPoints += (points * sub.credits);
                        totalCredits += sub.credits;
                    }
                }
            }

            const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

            await studentsCollection.updateOne(
                { _id: student._id },
                { $set: { cgpa: parseFloat(cgpa) } }
            );
            updatedCount++;
        }

        console.log(`✅ Updated CGPA for ${updatedCount} students.`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

calculateCGPA();

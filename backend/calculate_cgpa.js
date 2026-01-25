
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (hardcoded fallback)
const MONGO_URI = 'mongodb://localhost:27017/edutrack';

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

            // Check embedded semesters
            if (student.semesters && Array.isArray(student.semesters)) {
                for (const sem of student.semesters) {
                    if (sem.subjects && Array.isArray(sem.subjects)) {
                        for (const sub of sem.subjects) {
                            // Grade Points Map (Approximate based on typical system if not present)
                            // But wait, the JSON import had specific "points" in subject data?
                            // Let's check if points exist in the subject object.
                            // Based on import_students.js, we kept the structure. 
                            // The original JSON had "points" field. 
                            // But my import script only mapped: code, title, credits, grade.
                            // I might have missed "points"!
                            // Let's check if I can derive points from Grade.

                            let points = sub.points; // Check if it exists
                            if (points === undefined) {
                                // Map Grade to Points
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

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (hardcoded fallback)
const MONGO_URI = 'mongodb+srv://harishpblr2007_db_user:Harish2807@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

async function calculateSGPA() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const semestersCollection = db.collection('semesters');

        const semesters = await semestersCollection.find({}).toArray();
        console.log(`Processing ${semesters.length} semesters...`);

        let updatedCount = 0;

        for (const semester of semesters) {
            let totalPoints = 0;
            let totalCredits = 0;

            if (semester.subjects && Array.isArray(semester.subjects)) {
                for (const sub of semester.subjects) {
                    // Grade to Points mapping
                    let points = 0;
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

                    totalPoints += (points * sub.credits);
                    totalCredits += sub.credits;
                }
            }

            const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

            await semestersCollection.updateOne(
                { _id: semester._id },
                { $set: { sgpa: parseFloat(sgpa) } }
            );
            updatedCount++;

            console.log(`Updated SGPA for Student ${semester.studentId}, Semester ${semester.num}: ${sgpa}`);
        }

        console.log(`✅ Updated SGPA for ${updatedCount} semesters.`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

calculateSGPA();

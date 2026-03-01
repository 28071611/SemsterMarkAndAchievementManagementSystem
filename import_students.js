
import fs from 'fs';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack';
const DB_NAME = 'edutrack';

async function importData() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(DB_NAME);
        const studentsCollection = db.collection('students');
        const usersCollection = db.collection('users');

        // Read JSON file
        const rawData = fs.readFileSync('students_mongodb.json', 'utf8');
        const studentsData = JSON.parse(rawData);

        console.log(`📊 Found ${studentsData.length} students to import`);

        let successCount = 0;
        let errorCount = 0;

        for (const student of studentsData) {
            try {
                // 1. Prepare Student Data
                const studentDoc = {
                    name: student.name,
                    registerNumber: student.register_number, // Mapped from register_number
                    email: `${student.register_number}@edutrack.com`,
                    phone: '',
                    department: "Computer Science", // Default
                    year: "1st Year", // Default
                    currentSemester: 1,
                    cgpa: student.cgpa || 0,
                    dob: student.dob,
                    gender: student.gender,
                    umisNumber: student.umis_number,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // 2. Insert Student (Upsert)
                await studentsCollection.updateOne(
                    { registerNumber: student.register_number },
                    { $set: studentDoc },
                    { upsert: true }
                );

                // 3. Create Semester Record if subjects exist
                if (student.subjects && student.subjects.length > 0) {
                    const semesterDoc = {
                        registerNumber: student.register_number,
                        num: 1,
                        subjects: student.subjects.map(s => ({
                            code: s.subject_code,
                            title: s.subject_name,
                            credits: s.credits,
                            grade: s.grade
                        })),
                        updatedAt: new Date()
                    };
                    await db.collection('semesters').updateOne(
                        { registerNumber: student.register_number, num: 1 },
                        { $set: semesterDoc },
                        { upsert: true }
                    );
                }

                // 4. Skip User collection as per "no other data" request
                // Login will work via fallback in authRoutes.js using student.registerNumber

                successCount++;
                if (successCount % 100 === 0) process.stdout.write('.');
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
        await client.close();
        console.log('🔌 Disconnected');
    }
}

importData();

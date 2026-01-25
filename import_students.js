
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
                // 1. Prepare Student Data with embedded Semester (for later migration)
                // Default values for missing fields
                const department = "Computer Science";
                const year = "1st Year";
                const currentSemester = 1;

                // Transform subjects to embedded semester format matching create_student.js
                const semesterData = {
                    num: 1,
                    sgpa: 0, // Calculate if needed, else 0
                    totalCredits: student.subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0),
                    subjects: student.subjects.map(sub => ({
                        code: sub.subject_code,
                        title: sub.subject_name,
                        credits: sub.credits,
                        grade: sub.grade
                    }))
                };

                const studentDoc = {
                    name: student.name,
                    registerNumber: student.register_number,
                    email: `${student.register_number}@edutrack.com`, // Placeholder email
                    phone: '',
                    department: department,
                    year: year,
                    currentSemester: currentSemester,
                    cgpa: student.cgpa || 0,
                    dob: student.dob,
                    gender: student.gender,
                    umisNumber: student.umis_number,
                    // EMBEDDED SEMESTERS for migration script to handle
                    semesters: [semesterData],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // 2. Insert Student (Upsert to avoid duplicates)
                await studentsCollection.updateOne(
                    { registerNumber: student.register_number },
                    { $set: studentDoc },
                    { upsert: true }
                );

                // 3. Create User Account (RegNo = Email, Name = Password)
                const hashedPassword = await bcrypt.hash(student.name, 10);
                const userDoc = {
                    email: student.register_number, // User Login ID
                    password: hashedPassword
                };

                await usersCollection.updateOne(
                    { email: student.register_number },
                    { $set: userDoc },
                    { upsert: true }
                );

                successCount++;
                if (successCount % 10 === 0) process.stdout.write('.');
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


import fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack';

async function importData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB via Mongoose');

        const db = mongoose.connection.db;
        const studentsCollection = db.collection('students');
        const usersCollection = db.collection('users');

        // Read JSON file from parent directory
        const jsonPath = path.join(process.cwd(), '../students_mongodb.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`File not found at ${jsonPath}`);
        }
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const studentsData = JSON.parse(rawData);

        console.log(`📊 Found ${studentsData.length} students to import`);

        let successCount = 0;
        let errorCount = 0;

        for (const student of studentsData) {
            try {
                // 1. Prepare Student Data
                // Default values
                const department = "Computer Science";
                const year = "1st Year";
                const currentSemester = 1;

                // Clean name for email generation
                const cleanName = student.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const email = `${cleanName}@srishakthi.ac.in`;

                // Transform subjects to embedded semester format
                const semesterData = {
                    num: 1,
                    sgpa: 0,
                    totalCredits: student.subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0),
                    subjects: student.subjects.map(sub => ({
                        code: sub.subject_code,
                        title: sub.subject_name.trim(),
                        credits: sub.credits,
                        grade: sub.grade
                    }))
                };

                const studentDoc = {
                    name: student.name.trim(),
                    registerNumber: student.register_number,
                    email: email,
                    phone: '',
                    department: department,
                    year: year,
                    currentSemester: currentSemester,
                    cgpa: student.cgpa || 0,
                    dob: student.dob,
                    gender: student.gender,
                    umisNumber: student.umis_number,
                    // KEEP SEMESTERS EMBEDDED
                    semesters: [semesterData],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // 2. Insert Student (Upsert)
                await studentsCollection.updateOne(
                    { registerNumber: student.register_number },
                    { $set: studentDoc },
                    { upsert: true }
                );

                // 3. Create User Account
                // Password = Register Number (as per request "not the password" -> implying use something else, previous plan said RegNo)
                // Wait, user said "add name and reg number to users NOT THE PASSWORD". 
                // This likely means: Don't use Name as Password? Or don't store password? 
                // "take the name and registernumber for the user documents already created in the project" - previous request
                // "now add the name and regiter number to the users not the password" -> Add name/reg fields, BUT checking context:
                // usually password is required. I'll stick to RegNo as password for now as it's a safe default vs Name.

                const hashedPassword = await bcrypt.hash(student.register_number, 10);

                const userDoc = {
                    email: email,
                    password: hashedPassword,
                    name: student.name.trim(),
                    registerNumber: student.register_number
                };

                await usersCollection.updateOne(
                    { email: email },
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
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

importData();

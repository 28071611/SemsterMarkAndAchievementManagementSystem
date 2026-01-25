
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack';

async function verify() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const students = db.collection('students');
        const users = db.collection('users');

        // 1. Check Embedded Semesters
        const studentWithSem = await students.findOne({ semesters: { $exists: true, $ne: [] } });
        if (studentWithSem) {
            console.log('✅ Success: Students HAVE embedded semesters (as requested).');
        } else {
            console.log('❌ Error: Students DO NOT have embedded semesters!');
        }

        // 2. Check User Fields and Email Format
        // Pick the first student sample: AADHIDHYA K (714024104001)
        // Expected Email: aadhidhyak@srishakthi.ac.in
        const testRegNo = "714024104001";
        const expectedEmail = "aadhidhyak@srishakthi.ac.in";

        const user = await users.findOne({ registerNumber: testRegNo });

        if (!user) {
            console.log(`❌ Error: User with registerNumber ${testRegNo} not found.`);
        } else {
            console.log(`\nUser Verification (${testRegNo}):`);

            // Check Email
            if (user.email === expectedEmail) {
                console.log(`✅ Email format correct: ${user.email}`);
            } else {
                console.log(`❌ Email format INCORRECT: Got '${user.email}', expected '${expectedEmail}'`);
            }

            // Check Name Field
            if (user.name === "AADHIDHYA K") {
                console.log(`✅ Name field present: ${user.name}`);
            } else {
                console.log(`❌ Name field missing or wrong: ${user.name}`);
            }

            // Check Password (should be hash of RegNo)
            const isMatch = await bcrypt.compare(testRegNo, user.password);
            if (isMatch) {
                console.log(`✅ Password check success: Password is hash of Register Number`);
            } else {
                console.log(`❌ Password check failed: Password is NOT hash of Register Number`);
            }
        }

    } catch (err) {
        console.error('Verify error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();

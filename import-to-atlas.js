// Import Student Data to MongoDB Atlas
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const ATLAS_CONNECTION_STRING = 'mongodb+srv://harishpblr2007_db_user:YOUR_PASSWORD@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

console.log('📥 Importing Student Data to MongoDB Atlas...');
console.log('==========================================');

if (ATLAS_CONNECTION_STRING.includes('YOUR_PASSWORD')) {
    console.log('❌ Please replace YOUR_PASSWORD with your actual database password');
    console.log('📝 Then run: node import-to-atlas.js');
    process.exit(1);
}

async function importToAtlas() {
    try {
        await mongoose.connect(ATLAS_CONNECTION_STRING);
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = mongoose.connection.db;
        
        // Read student data
        const studentsPath = path.join(process.cwd(), 'students_mongodb.json');
        const studentsData = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));
        
        console.log(`📊 Found ${studentsData.length} students to import`);
        
        // Clear existing data
        await db.collection('students').deleteMany({});
        await db.collection('semesters').deleteMany({});
        console.log('🧹 Cleared existing data');
        
        let importedStudents = 0;
        let importedSemesters = 0;
        
        // Import students and semesters
        for (const student of studentsData) {
            // Import student
            const studentDoc = {
                name: student.name,
                registerNumber: student.register_number,
                email: `${student.register_number}@edutrack.com`,
                phone: '',
                department: "Computer Science",
                year: "1st Year",
                currentSemester: 1,
                cgpa: student.cgpa || 0,
                dob: student.dob,
                gender: student.gender,
                umisNumber: student.umis_number,
                arrears: student.arrears || 0
            };
            
            const studentResult = await db.collection('students').insertOne(studentDoc);
            const studentId = studentResult.insertedId;
            
            // Import semesters
            if (student.semesters && Array.isArray(student.semesters)) {
                for (const semester of student.semesters) {
                    const semesterDoc = {
                        studentId: studentId,
                        num: semester.semester,
                        sgpa: 0, // Will be calculated
                        totalCredits: 0,
                        subjects: semester.subjects || []
                    };
                    
                    await db.collection('semesters').insertOne(semesterDoc);
                    importedSemesters++;
                }
            }
            
            importedStudents++;
            if (importedStudents % 50 === 0) {
                console.log(`📥 Imported ${importedStudents} students...`);
            }
        }
        
        console.log(`✅ Import completed!`);
        console.log(`👥 Students imported: ${importedStudents}`);
        console.log(`📚 Semesters imported: ${importedSemesters}`);
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected from Atlas');
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        await mongoose.disconnect();
    }
}

importToAtlas();

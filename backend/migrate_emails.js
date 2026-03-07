import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = 'mongodb+srv://harishpblr2007_db_user:Harish2807@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const studentSchema = new mongoose.Schema({
            name: String,
            email: String,
            registerNumber: String
        });

        const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

        const students = await Student.find({});
        console.log(`Found ${students.length} students.`);

        let updatedCount = 0;
        for (const student of students) {
            if (student.name) {
                let cleanName = student.name.trim().toLowerCase().replace(/\s+/g, '.');
                let baseEmail = `${cleanName}@srishakthi.ac.in`;
                let finalEmail = baseEmail;
                let suffix = 1;

                // Check for duplicates
                while (true) {
                    const existing = await Student.findOne({ email: finalEmail, _id: { $ne: student._id } });
                    if (!existing) break;
                    finalEmail = `${cleanName}${suffix}@srishakthi.ac.in`;
                    suffix++;
                }

                student.email = finalEmail;
                await student.save();
                updatedCount++;
                if (updatedCount % 50 === 0) console.log(`Updated ${updatedCount} students...`);
            }
        }

        console.log(`Successfully normalized ${updatedCount} emails.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();


const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
    console.log('🧪 Testing API Endpoints...');

    try {
        // 1. Test Base URL/Health
        // (Assuming /api/students is a good health check)

        // 2. Test Students
        console.log('\nFetching /students...');
        const res = await fetch(`${BASE_URL}/students`);
        console.log(`Status: ${res.status}`);

        if (res.ok) {
            const students = await res.json();
            console.log(`✅ Success: Fetched ${students.length} students`);
            if (students.length > 0) {
                console.log('Sample Data (First Student):', JSON.stringify(students[0], null, 2));
            } else {
                console.log('⚠️ Warning: Returned array is empty.');
            }
        } else {
            const text = await res.text();
            console.log(`❌ Failed: ${text}`);
        }

        // 3. Test Semesters
        console.log('\nFetching /semesters...');
        const resSem = await fetch(`${BASE_URL}/semesters`);
        console.log(`Status: ${resSem.status}`);
        if (resSem.ok) {
            const semesters = await resSem.json();
            console.log(`✅ Success: Fetched ${semesters.length} semesters`);
        } else {
            console.log(`❌ Failed: ${resSem.statusText}`);
        }

    } catch (err) {
        console.error('❌ Network Error:', err.message);
    }
}

testApi();

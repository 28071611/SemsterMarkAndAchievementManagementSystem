@echo off
title EduTrack Global Deployment

echo.
echo ========================================
echo     EduTrack Global Deployment
echo ========================================
echo.

echo 🌍 Setting up global deployment...
echo.

REM Update frontend API URL for production
echo 🔧 Updating API configuration...
cd frontend\src\services
echo // Production API Configuration > api.js
echo const API_BASE_URL = 'https://edutrack-api.onrender.com/api'; >> api.js
echo.
echo export const api = { >> api.js
echo   // Student endpoints >> api.js
echo   async getStudent(registerNumber) { >> api.js
echo     try { >> api.js
echo       const response = await fetch(`${API_BASE_URL}/students/${registerNumber}`); >> api.js
echo       if (!response.ok) { >> api.js
echo         if (response.status === 404) { >> api.js
echo           return null; >> api.js
echo         } >> api.js
echo         throw new Error('Student not found'); >> api.js
echo       } >> api.js
echo       return await response.json(); >> api.js
echo     } catch (error) { >> api.js
echo       console.error('Error fetching student:', error); >> api.js
echo       throw error; >> api.js
echo     } >> api.js
echo   }, >> api.js
echo   // ... (rest of API methods) >> api.js
echo }; >> api.js

echo 📦 Building for production...
cd ..\..
call npm run build

echo 🚀 Ready for global deployment!
echo.
echo 📋 Next Steps:
echo 1. Deploy frontend to Vercel: https://vercel.com
echo 2. Deploy backend to Render: https://render.com
echo 3. Update MongoDB Atlas IP whitelist
echo 4. Configure environment variables
echo.
echo 🌐 Global URLs will be:
echo Frontend: https://edutrack.vercel.app
echo Backend: https://edutrack-api.onrender.com
echo.
echo Press any key to continue...
pause >nul

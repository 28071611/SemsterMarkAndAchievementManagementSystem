@echo off
title EduTrack 24/7 Service
echo Starting EduTrack Permanent Service...
echo.

:restart
echo Starting Backend Server...
cd /d c:\edutrack\backend
start /B cmd /c "node server.js"

echo Starting Frontend Server...
cd /d c:\edutrack\frontend\build
start /B cmd /c "node simple-server.js"

echo Services started! Waiting 10 seconds for startup...
timeout /t 10 /nobreak >nul

:monitor
echo Checking services at %date% %time%
tasklist | findstr node.exe >nul
if %errorlevel%==1 (
    echo Services stopped! Restarting...
    goto restart
)

echo Services running... checking again in 60 seconds
timeout /t 60 /nobreak >nul
goto monitor

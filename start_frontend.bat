@echo off
title JanSetu AI - React Frontend (Port 5173)
echo ========================================================
echo       JANSETU AI - REACT + VITE FRONTEND
echo   One Platform. Every Citizen. Clear Next Steps.
echo ========================================================
echo.
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [!] Node modules not found. Running npm install...
    call npm install
)

echo [*] Starting Vite Frontend on http://localhost:5173 ...
echo.
call npm run dev
pause

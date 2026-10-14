@echo off
title JanSetu AI - Full-Stack Launcher
echo ========================================================
echo       JANSETU AI - ONE-CLICK FULL-STACK LAUNCHER
echo   One Platform. Every Citizen. Clear Next Steps.
echo ========================================================
echo.
echo [1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "JanSetu AI - Backend" cmd /c "%~dp0start_backend.bat"

timeout /t 3 /nobreak >nul

echo [2/3] Launching React Vite Frontend on http://localhost:5173 ...
start "JanSetu AI - Frontend" cmd /c "%~dp0start_frontend.bat"

timeout /t 2 /nobreak >nul

echo [3/3] Opening JanSetu AI in your default web browser...
start http://localhost:5173

echo.
echo ========================================================
echo   JanSetu AI is running!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://127.0.0.1:8000
echo   API Docs:  http://127.0.0.1:8000/docs
echo ========================================================
echo.
echo Keep the backend and frontend terminal windows open.
pause

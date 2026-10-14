@echo off
title JanSetu AI - FastAPI Backend (Port 8000)
echo ========================================================
echo       JANSETU AI - FASTAPI BACKEND SERVER
echo   One Platform. Every Citizen. Clear Next Steps.
echo ========================================================
echo.
cd /d "%~dp0backend"

if not exist "venv\Scripts\python.exe" (
    echo [!] Virtual environment not found. Setting up venv...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo [*] Starting FastAPI server on http://127.0.0.1:8000 ...
echo [*] Interactive Swagger API Docs: http://127.0.0.1:8000/docs
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

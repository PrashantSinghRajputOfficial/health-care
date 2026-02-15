@echo off
echo ========================================
echo  Smart Health System - Starting...
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo [1/3] Checking dependencies...
pip install -r requirements.txt --quiet

echo [2/3] Initializing system...
echo.

echo [3/3] Starting server...
echo.
echo ========================================
echo  Server running at: http://localhost:5000
echo ========================================
echo.
echo Demo Credentials:
echo   Patient: ABHA001 / password123
echo   Doctor:  ABHA002 / doctor123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py

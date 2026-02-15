@echo off
echo ========================================
echo Healthcare+ System Starting...
echo ========================================
echo.
echo Stopping any existing servers...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting Flask Server on Port 5000...
echo.
python app.py
pause

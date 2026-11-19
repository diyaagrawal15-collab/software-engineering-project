@echo off
echo ========================================================
echo   Starting Stress Evaluation and Management System
echo ========================================================
echo.
echo Starting Express Backend API on Port 5000...
start cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting React Vite Frontend on Port 5173...
start cmd /k "cd client && npm run dev"
echo.
echo ========================================================
echo   System launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api/health
echo ========================================================

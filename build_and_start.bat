@echo off
echo === Build ===
call npm run build
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo === Start ===
call npm start

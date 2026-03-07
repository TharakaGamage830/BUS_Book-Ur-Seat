@echo off
echo ===================================================
echo Welcome to Book-Ur-Seat!
echo This script will help you set up the application.
echo ===================================================

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo Checking for backend environment file...
if not exist ".env" (
    echo Creating backend environment file from template...
    copy .env.example .env
    echo Please make sure to update the .env file with your actual MongoDB URI if it differs from the default.
) else (
    echo Backend environment file already exists.
)

echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b %errorlevel%
)

echo.
cd ..
echo ===================================================
echo Setup complete!
echo You can now start the application by running:
echo run_app.bat
echo ===================================================
pause

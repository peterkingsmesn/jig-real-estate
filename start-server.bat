@echo off
echo Starting Philippines Rental Website...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server on port 3005...
echo Server will be available at: http://localhost:3005
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
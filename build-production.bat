@echo off
echo Building Philippines Rental Website for Production...
echo.
echo Installing dependencies...
call npm install
echo.
echo Building production version...
call npm run build
echo.
echo Build completed successfully!
echo.
echo To run the production server:
echo npm run start
echo.
pause
@echo off
echo === JIG 프로젝트 시작 스크립트 ===
echo.

:: MongoDB 체크
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB가 설치되어 있지 않습니다!
    echo MongoDB를 먼저 설치해주세요:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo MongoDB 설치 후 다시 실행해주세요.
    pause
    exit /b 1
)

:: MongoDB 시작
echo 📂 MongoDB 시작 중...
start "MongoDB" mongod

:: 잠시 대기
timeout /t 3 /nobreak >nul

:: 백엔드 서버 시작
echo 📦 백엔드 서버 시작 중...
cd backend

:: 패키지 설치 확인
if not exist "node_modules" (
    echo 백엔드 패키지 설치 중...
    call npm install
)

:: 시드 데이터 확인
echo.
echo 🌱 시드 데이터 생성 여부 확인
set /p seedData=처음 실행이라면 Y를 입력하세요 (Y/N): 
if /i "%seedData%"=="Y" (
    node src/scripts/seedData.js
)

:: 백엔드 서버 시작
echo 🚀 백엔드 서버 시작...
start "Backend Server" cmd /k npm run dev

:: 프론트엔드 서버 시작
echo 🎨 프론트엔드 서버 시작 중...
cd ../frontend

:: 패키지 설치 확인
if not exist "node_modules" (
    echo 프론트엔드 패키지 설치 중...
    call npm install
)

:: 프론트엔드 서버 시작
echo 🚀 프론트엔드 서버 시작...
start "Frontend Server" cmd /k npm run dev

echo.
echo ✅ 모든 서버가 시작되었습니다!
echo.
echo 📌 접속 정보:
echo - 웹사이트: http://localhost:3001
echo - API 서버: http://localhost:5000
echo - 관리자 로그인: admin@jig.com / admin123
echo.
echo 종료하려면 모든 창을 닫으세요.
echo.
pause
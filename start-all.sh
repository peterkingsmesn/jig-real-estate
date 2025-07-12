#!/bin/bash

echo "=== JIG 프로젝트 시작 스크립트 ==="
echo ""

# MongoDB 체크
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB가 설치되어 있지 않습니다!"
    echo "MongoDB를 먼저 설치해주세요:"
    echo "- Windows: https://www.mongodb.com/try/download/community"
    echo "- macOS: brew install mongodb-community"
    echo "- Linux: sudo apt-get install mongodb"
    exit 1
fi

# 백엔드 서버 시작
echo "📦 백엔드 서버 시작 중..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "백엔드 패키지 설치 중..."
    npm install
fi

# 시드 데이터 확인
echo "🌱 시드 데이터 생성 여부 확인 중..."
echo "처음 실행이라면 'y'를 입력하세요:"
read -p "시드 데이터를 생성하시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    node src/scripts/seedData.js
fi

# 백엔드 서버 백그라운드 실행
echo "🚀 백엔드 서버 시작..."
npm run dev &
BACKEND_PID=$!

# 프론트엔드 서버 시작
echo "🎨 프론트엔드 서버 시작 중..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "프론트엔드 패키지 설치 중..."
    npm install
fi

echo "🚀 프론트엔드 서버 시작..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 모든 서버가 시작되었습니다!"
echo ""
echo "📌 접속 정보:"
echo "- 웹사이트: http://localhost:3001"
echo "- API 서버: http://localhost:5000"
echo "- 관리자 로그인: admin@jig.com / admin123"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."

# 종료 시그널 처리
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# 프로세스 대기
wait
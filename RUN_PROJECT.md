# JIG 프로젝트 실행 가이드

## 빠른 시작 (Quick Start)

### 1단계: MongoDB 실행
```bash
# MongoDB가 설치되어 있어야 합니다
# Windows
mongod

# macOS/Linux
sudo mongod
```

### 2단계: 백엔드 서버 실행
```bash
# 터미널 1
cd backend
npm install
node src/scripts/seedData.js  # 처음 한 번만 실행 (샘플 데이터 생성)
npm run dev
```

### 3단계: 프론트엔드 실행
```bash
# 터미널 2
cd frontend
npm install
npm run dev
```

### 4단계: 웹사이트 접속
- 웹사이트: http://localhost:3001
- 관리자 로그인:
  - 이메일: admin@jig.com
  - 비밀번호: admin123

## 서버 상태 확인
- 백엔드 상태: http://localhost:5000/health
- API 문서: http://localhost:5000/api/v1/properties

## 종료 방법
각 터미널에서 `Ctrl + C`를 눌러 서버를 종료합니다.
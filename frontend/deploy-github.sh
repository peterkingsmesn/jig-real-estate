#!/bin/bash

# GitHub Pages 배포 스크립트

echo "GitHub Pages 배포 준비 중..."

# dist 폴더가 있는지 확인
if [ ! -d "dist" ]; then
    echo "빌드 중..."
    npm run build
fi

# gh-pages 브랜치로 배포
npx gh-pages -d dist

echo "배포 완료!"
echo "몇 분 후에 https://[GitHub사용자명].github.io/[저장소명] 에서 확인하세요"
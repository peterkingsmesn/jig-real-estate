require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');

const seedData = async () => {
  try {
    // 데이터베이스 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // 기존 데이터 삭제
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Existing data cleared');

    // 관리자 계정 생성
    const adminUser = await User.create({
      email: 'admin@jig.com',
      password: 'admin123',
      name: '관리자',
      role: 'super_admin',
      isActive: true
    });
    console.log('Admin user created:', adminUser.email);

    // 샘플 매물 데이터
    const sampleProperties = [
      {
        title: '마닐라 중심가 고급 콘도',
        description: '마카티 CBD 중심에 위치한 현대적인 1베드룸 콘도입니다. 모든 편의시설이 가까이 있으며, 대중교통 접근성이 뛰어납니다.',
        type: 'condo',
        region: 'Manila',
        address: 'Ayala Avenue, Makati City',
        price: 25000,
        currency: 'PHP',
        deposit: 50000,
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        floor: 15,
        furnished: true,
        amenities: ['에어컨', 'Wi-Fi', '주차장', '수영장', '헬스장', '보안시스템'],
        images: [
          {
            url: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Manila+Condo',
            thumbnailUrl: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Manila+Condo',
            alt: '마닐라 콘도 메인 이미지',
            order: 0,
            isMain: true
          }
        ],
        location: {
          latitude: 14.5547,
          longitude: 121.0244,
          address: 'Ayala Avenue, Makati City',
          city: 'Makati',
          province: 'Metro Manila'
        },
        contact: {
          phone: '+63 2 1234 5678',
          email: 'contact@jig.com',
          whatsapp: '+639171234567'
        },
        status: 'active',
        featured: true,
        translations: {
          ko: {
            title: '마닐라 중심가 고급 콘도',
            description: '마카티 CBD 중심에 위치한 현대적인 1베드룸 콘도입니다.'
          }
        }
      },
      {
        title: '세부 해변가 빌라',
        description: '아름다운 세부 해변가에 위치한 3베드룸 빌라입니다. 프라이빗 정원과 수영장이 있습니다.',
        type: 'house',
        region: 'Cebu',
        address: 'Mactan Island, Cebu',
        price: 45000,
        currency: 'PHP',
        deposit: 90000,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        furnished: false,
        amenities: ['에어컨', '주차장', '수영장', '정원', '발코니'],
        images: [
          {
            url: 'https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Cebu+Villa',
            thumbnailUrl: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Cebu+Villa',
            alt: '세부 빌라 메인 이미지',
            order: 0,
            isMain: true
          }
        ],
        location: {
          latitude: 10.3157,
          longitude: 123.8854,
          address: 'Mactan Island, Cebu',
          city: 'Lapu-Lapu',
          province: 'Cebu',
          landmark: 'Near Mactan Airport'
        },
        contact: {
          phone: '+63 32 1234 5678',
          email: 'cebu@jig.com'
        },
        status: 'active',
        featured: true
      },
      {
        title: '안헬레스 타운하우스',
        description: '클락 공항 근처의 편리한 2베드룸 타운하우스입니다. 게이트 커뮤니티 내에 위치합니다.',
        type: 'village',
        region: 'Angeles',
        address: 'Angeles City, Pampanga',
        price: 18000,
        currency: 'PHP',
        deposit: 36000,
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        furnished: true,
        amenities: ['에어컨', 'Wi-Fi', '주차장', '보안시스템'],
        images: [
          {
            url: 'https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Angeles+Townhouse',
            thumbnailUrl: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Angeles+Townhouse',
            alt: '안헬레스 타운하우스',
            order: 0,
            isMain: true
          }
        ],
        location: {
          latitude: 15.1449,
          longitude: 120.5887,
          address: 'Angeles City, Pampanga',
          city: 'Angeles',
          province: 'Pampanga'
        },
        contact: {
          phone: '+63 45 1234 5678',
          whatsapp: '+639181234567'
        },
        status: 'active'
      },
      {
        title: '다바오 모던 하우스',
        description: '다바오 시내에서 가까운 현대적인 3베드룸 단독주택입니다.',
        type: 'house',
        region: 'Davao',
        address: 'Davao City',
        price: 35000,
        currency: 'PHP',
        deposit: 70000,
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        furnished: false,
        amenities: ['에어컨', '주차장', '정원'],
        images: [
          {
            url: 'https://via.placeholder.com/800x600/96CEB4/FFFFFF?text=Davao+House',
            thumbnailUrl: 'https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Davao+House',
            alt: '다바오 하우스',
            order: 0,
            isMain: true
          }
        ],
        location: {
          latitude: 7.0707,
          longitude: 125.6087,
          address: 'Davao City',
          city: 'Davao',
          province: 'Davao del Sur'
        },
        contact: {
          email: 'davao@jig.com'
        },
        status: 'active'
      },
      {
        title: '바기오 스튜디오 아파트',
        description: '시원한 기후의 바기오에 위치한 아늑한 스튜디오입니다.',
        type: 'condo',
        region: 'Baguio',
        address: 'Session Road, Baguio City',
        price: 12000,
        currency: 'PHP',
        deposit: 24000,
        bedrooms: 0,
        bathrooms: 1,
        area: 30,
        floor: 5,
        furnished: true,
        amenities: ['Wi-Fi', '보안시스템'],
        images: [
          {
            url: 'https://via.placeholder.com/800x600/FFEAA7/000000?text=Baguio+Studio',
            thumbnailUrl: 'https://via.placeholder.com/400x300/FFEAA7/000000?text=Baguio+Studio',
            alt: '바기오 스튜디오',
            order: 0,
            isMain: true
          }
        ],
        location: {
          latitude: 16.4023,
          longitude: 120.5960,
          address: 'Session Road, Baguio City',
          city: 'Baguio',
          province: 'Benguet'
        },
        contact: {
          phone: '+63 74 1234 5678'
        },
        status: 'active'
      }
    ];

    // 매물 데이터 저장
    const properties = await Property.insertMany(sampleProperties);
    console.log(`${properties.length} properties created`);

    console.log('\n=== Seed data created successfully ===');
    console.log('Admin login credentials:');
    console.log('Email: admin@jig.com');
    console.log('Password: admin123');
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
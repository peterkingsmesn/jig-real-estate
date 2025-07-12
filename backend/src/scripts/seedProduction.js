// 프로덕션 시드 데이터 생성 스크립트
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');

// MongoDB URI 직접 설정 (환경 변수가 없을 경우를 위해)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jigadmin:red4193@cluster0.2onzoan.mongodb.net/jig-db?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
  try {
    // 데이터베이스 연결
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // 기존 데이터 확인
    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();

    console.log(`Current users: ${userCount}`);
    console.log(`Current properties: ${propertyCount}`);

    // 관리자 계정이 없으면 생성
    if (userCount === 0) {
      const adminUser = await User.create({
        email: 'admin@jig.com',
        password: 'admin123',
        name: '관리자',
        role: 'super_admin',
        isActive: true
      });
      console.log('Admin user created:', adminUser.email);
    }

    // 샘플 매물이 없으면 생성
    if (propertyCount === 0) {
      const sampleProperties = [
        {
          title: '마닐라 중심가 고급 콘도',
          description: '마카티 CBD 중심에 위치한 현대적인 1베드룸 콘도입니다.',
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
          amenities: ['에어컨', 'Wi-Fi', '주차장', '수영장'],
          images: [{
            url: 'https://via.placeholder.com/800x600',
            thumbnailUrl: 'https://via.placeholder.com/400x300',
            alt: '마닐라 콘도',
            order: 0,
            isMain: true
          }],
          location: {
            latitude: 14.5547,
            longitude: 121.0244,
            address: 'Ayala Avenue, Makati City',
            city: 'Makati',
            province: 'Metro Manila'
          },
          contact: {
            phone: '+63 2 1234 5678',
            email: 'contact@jig.com'
          },
          status: 'active',
          featured: true
        }
      ];

      await Property.insertMany(sampleProperties);
      console.log('Sample properties created');
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/philippines-portal');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('philippines-portal');
    const usersCollection = db.collection('users');
    
    // 관리자 계정 정보
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // 실제 운영 시 변경 필요
    
    // 기존 관리자 확인
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin already exists. Updating role to admin...');
      await usersCollection.updateOne(
        { email: adminEmail },
        { 
          $set: { 
            role: 'admin',
            updatedAt: new Date()
          } 
        }
      );
    } else {
      // 새 관리자 생성
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await usersCollection.insertOne({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        provider: 'credentials',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
      });
      
      console.log('Admin user created successfully!');
    }
    
    console.log(`
======================================
Admin account created/updated:
Email: ${adminEmail}
Password: ${adminPassword}
======================================

You can also make any OAuth user an admin by:
1. Login with Google/Facebook
2. Run: npm run make-admin <email>
    `);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
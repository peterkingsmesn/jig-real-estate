const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function makeAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: npm run make-admin <email>');
    process.exit(1);
  }
  
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/philippines-portal');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('philippines-portal');
    const usersCollection = db.collection('users');
    
    // 사용자 찾기
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // 관리자로 업데이트
    await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          role: 'admin',
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Successfully made ${email} an admin!`);
    
  } catch (error) {
    console.error('Error making admin:', error);
  } finally {
    await client.close();
  }
}

makeAdmin();
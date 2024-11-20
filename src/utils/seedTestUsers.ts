import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const testUsers = [
  {
    id: 'test1',
    nickname: 'Alice',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    telegram_id: 'test_alice_123',
  },
  {
    id: 'test2',
    nickname: 'Bob',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    telegram_id: 'test_bob_456',
  },
  {
    id: 'test3',
    nickname: 'Charlie',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    telegram_id: 'test_charlie_789',
  },
  {
    id: 'test4',
    nickname: 'Diana',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    telegram_id: 'test_diana_101',
  },
  {
    id: 'test5',
    nickname: 'Evan',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evan',
    telegram_id: 'test_evan_102',
  },
  {
    id: 'test6',
    nickname: 'Fiona',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona',
    telegram_id: 'test_fiona_103',
  },
  {
    id: 'test7',
    nickname: 'George',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George',
    telegram_id: 'test_george_104',
  },
  {
    id: 'test8',
    nickname: 'Hannah',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah',
    telegram_id: 'test_hannah_105',
  }
];

export const seedTestUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    
    for (const user of testUsers) {
      await setDoc(doc(usersRef, user.id), {
        nickname: user.nickname,
        image: user.image,
        telegram_id: user.telegram_id,
        createdAt: new Date().toISOString()
      });
      console.log(`Added test user: ${user.nickname}`);
    }
    
    console.log('Successfully added all test users!');
  } catch (error) {
    console.error('Error adding test users:', error);
  }
};

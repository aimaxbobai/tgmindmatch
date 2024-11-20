import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CenterAnimation } from '../components/CenterAnimation';
import { MatchedUser } from '../components/MatchedUser';
import { seedTestUsers } from '../utils/seedTestUsers';

interface MatchedUser {
  nickname: string;
  thoughtSimilarity: number;
}

export default function Home() {
  const { user, loading: userLoading, error } = useUser();
  const [currentThought, setCurrentThought] = useState('');
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const findSimilarMinds = async (thought: string) => {
    if (!thought.trim()) {
      setMatchedUsers([]);
      return;
    }

    setIsSearching(true);
    try {
      // В реальном приложении здесь будет более сложная логика сравнения мыслей
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('nickname', '!=', user?.nickname));
      const querySnapshot = await getDocs(q);
      
      const matches: MatchedUser[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Простая имитация расчета схожести мыслей
        const similarity = Math.random() * 100;
        if (similarity > 50) { // Показываем только пользователей с схожестью > 50%
          matches.push({
            nickname: userData.nickname,
            thoughtSimilarity: Math.round(similarity)
          });
        }
      });

      setMatchedUsers(matches.sort((a, b) => b.thoughtSimilarity - a.thoughtSimilarity));
    } catch (error) {
      console.error('Error finding similar minds:', error);
    }
    setIsSearching(false);
  };

  const handleAddTestUsers = async () => {
    await seedTestUsers();
    // После добавления тестовых пользователей обновим поиск
    if (currentThought) {
      findSimilarMinds(currentThought);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (currentThought) {
        findSimilarMinds(currentThought);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [currentThought]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-gray-600 font-medium">Loading your mindspace...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg text-red-600 bg-red-50 px-6 py-4 rounded-lg shadow-sm"
        >
          {error || 'Please restart the app'}
        </motion.p>
      </div>
    );
  }

  if (!user.nickname) {
    return <Navigate to="/nickname" replace />;
  }

  return (
    <div className="min-h-screen h-full w-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="flex-none w-full border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={user.image} alt="User" className="w-10 h-10 rounded-full shadow-sm" />
              <span className="text-lg font-semibold text-gray-800">{user.nickname}</span>
            </div>
            {/* Add Test Users Button - только для разработки */}
            <button
              onClick={handleAddTestUsers}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Add Test Users
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
          {/* Thought Input */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="Share your thought to find like-minded people..."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Results Area */}
          <div className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50 rounded-xl p-8 overflow-visible">
            {/* Center Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CenterAnimation isSearching={isSearching} />
            </div>

            {/* Matched Users */}
            <div className="relative w-full h-full">
              <AnimatePresence>
                {matchedUsers.map((match, index) => {
                  const angle = (index * 2 * Math.PI) / matchedUsers.length;
                  const distance = 200;
                  return (
                    <MatchedUser
                      key={match.nickname}
                      nickname={match.nickname}
                      similarity={match.thoughtSimilarity}
                      angle={angle}
                      distance={distance}
                      delay={index * 0.1}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

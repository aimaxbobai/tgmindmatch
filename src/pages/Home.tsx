import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
      // Сейчас просто имитируем поиск похожих пользователей
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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-none p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src={user.image} alt="User" className="w-10 h-10 rounded-full shadow-sm" />
          <span className="text-lg font-semibold text-gray-800">{user.nickname}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <textarea
              value={currentThought}
              onChange={(e) => {
                setCurrentThought(e.target.value);
                findSimilarMinds(e.target.value);
              }}
              placeholder="Share your thought to find like-minded people..."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <AnimatePresence>
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-4"
              >
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : matchedUsers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-700">People with similar mindset:</h3>
                {matchedUsers.map((match, index) => (
                  <motion.div
                    key={match.nickname}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">{match.nickname}</span>
                    <span className="text-sm text-gray-500">
                      {match.thoughtSimilarity}% match
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : currentThought && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500"
              >
                No matches found yet. Try expressing your thought differently.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

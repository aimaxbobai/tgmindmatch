import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThoughts } from '../services/firebase';
import { Thought } from '../types/thought';
import ThoughtCard from './ThoughtCard';
import SearchBar from './SearchBar';

const ThoughtList: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadThoughts = async () => {
    try {
      setLoading(true);
      const thoughtsData = await getThoughts(20, debouncedQuery);
      setThoughts(thoughtsData);
    } catch (error) {
      console.error('Error loading thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обновляем мысли при изменении поискового запроса
  useEffect(() => {
    loadThoughts();
  }, [debouncedQuery]);

  // Периодическое обновление мыслей
  useEffect(() => {
    const interval = setInterval(loadThoughts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleThoughtDeleted = () => {
    loadThoughts();
  };

  if (loading && thoughts.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-screen pb-20">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <AnimatePresence mode="popLayout">
        {thoughts.length > 0 ? (
          thoughts.map((thought) => (
            <motion.div
              key={thought.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ThoughtCard
                thought={thought}
                onResonance={loadThoughts}
                onDelete={handleThoughtDeleted}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            {searchQuery 
              ? "No thoughts found matching your search" 
              : "No thoughts yet. Be the first to share!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThoughtList;

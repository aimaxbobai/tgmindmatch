import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThoughts } from '../services/firebase';
import { Thought } from '../types/thought';
import ThoughtCard from './ThoughtCard';
import ThoughtGroup from './ThoughtGroup';
import SearchBar from './SearchBar';

const ThoughtList: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [groupedThoughts, setGroupedThoughts] = useState<Thought[][]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Группировка мыслей по схожести
  const groupThoughts = (thoughts: Thought[]) => {
    // Здесь будет логика группировки мыслей
    // Пока просто группируем по 2-3 мысли для демонстрации
    const groups: Thought[][] = [];
    let currentGroup: Thought[] = [];
    
    thoughts.forEach((thought, index) => {
      currentGroup.push(thought);
      if (currentGroup.length === (index % 2 === 0 ? 2 : 3) || index === thoughts.length - 1) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
    });
    
    return groups;
  };

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
      setGroupedThoughts(groupThoughts(thoughtsData));
    } catch (error) {
      console.error('Error loading thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThoughts();
  }, [debouncedQuery]);

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
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="space-y-8"
        >
          {groupedThoughts.map((group, index) => (
            <ThoughtGroup
              key={group[0].id}
              thoughts={group}
              onThoughtDeleted={handleThoughtDeleted}
              onResonance={loadThoughts}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ThoughtList;

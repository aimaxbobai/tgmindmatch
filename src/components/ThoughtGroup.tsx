import React from 'react';
import { motion } from 'framer-motion';
import { Thought } from '../types/thought';
import ThoughtCard from './ThoughtCard';

interface ThoughtGroupProps {
  thoughts: Thought[];
  onThoughtDeleted: () => void;
  onResonance: () => void;
}

const ThoughtGroup: React.FC<ThoughtGroupProps> = ({ thoughts, onThoughtDeleted, onResonance }) => {
  // Основная мысль группы (с наибольшим количеством резонансов)
  const mainThought = thoughts[0];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative p-4"
    >
      {/* Визуальный индикатор связи */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-2xl backdrop-blur-sm" />
      
      {/* Основная мысль */}
      <div className="mb-4">
        <ThoughtCard
          thought={mainThought}
          onDelete={onThoughtDeleted}
          onResonance={onResonance}
        />
      </div>
      
      {/* Связанные мысли */}
      {thoughts.slice(1).map((thought, index) => (
        <motion.div
          key={thought.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 0.9 }}
          transition={{ delay: index * 0.1 }}
          className="ml-8 mb-2 transform scale-95"
        >
          <ThoughtCard
            thought={thought}
            onDelete={onThoughtDeleted}
            onResonance={onResonance}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ThoughtGroup;

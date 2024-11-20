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
  if (!thoughts.length) return null;

  const mainThought = thoughts[0];
  const relatedThoughts = thoughts.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      {/* Основная мысль */}
      <div className="mb-4">
        <ThoughtCard
          thought={mainThought}
          onDelete={onThoughtDeleted}
          onResonance={onResonance}
          className="border-2 border-purple-500 shadow-lg"
        />
      </div>

      {/* Связанные мысли */}
      {relatedThoughts.length > 0 && (
        <div className="ml-8 space-y-3">
          {relatedThoughts.map((thought, index) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Линия связи */}
              <div className="absolute -left-4 top-1/2 w-4 h-px bg-purple-300" />
              
              <ThoughtCard
                thought={thought}
                onDelete={onThoughtDeleted}
                onResonance={onResonance}
                className="border border-purple-300 shadow-md"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ThoughtGroup;

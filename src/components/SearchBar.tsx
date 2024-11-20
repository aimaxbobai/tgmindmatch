import React from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 py-3 backdrop-blur-lg bg-white/50"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search thoughts..."
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl
            bg-white/70 backdrop-blur-sm
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            placeholder-gray-400
            transition-all duration-200"
        />
      </div>
    </motion.div>
  );
}

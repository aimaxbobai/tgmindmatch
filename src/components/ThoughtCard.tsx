import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { toggleResonance, deleteThought } from '../services/firebase';
import { Thought } from '../types/thought';
import WebApp from '@twa-dev/sdk';

interface ThoughtCardProps {
  thought: Thought;
  onResonance: () => void;
  onDelete: () => void;
}

export default function ThoughtCard({ thought, onResonance, onDelete }: ThoughtCardProps) {
  const [isResonating, setIsResonating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showResonatedBy, setShowResonatedBy] = useState(false);
  const { user } = useUser();

  const handleResonance = async () => {
    if (!user || isResonating) return;

    setIsResonating(true);
    try {
      const newResonanceState = await toggleResonance(thought.id!, String(user.id));
      onResonance();
      
      WebApp.showPopup({
        title: newResonanceState ? "Resonated! ✨" : "Unresonated",
        message: newResonanceState 
          ? "Your mind resonates with this thought!" 
          : "You no longer resonate with this thought.",
      });
    } catch (error) {
      console.error('Error resonating with thought:', error);
      WebApp.showPopup({
        title: "Error",
        message: "Failed to resonate with the thought. Please try again.",
      });
    } finally {
      setIsResonating(false);
    }
  };

  const handleDelete = async () => {
    if (!user || isDeleting) return;

    try {
      const confirmResult = await WebApp.showConfirm("Are you sure you want to delete this thought?");
      if (confirmResult !== true) return;

      setIsDeleting(true);
      await deleteThought(thought.id!, String(user.id));
      onDelete();
      
      WebApp.showPopup({
        title: "Success",
        message: "Your thought has returned to the universe ✨",
      });
    } catch (error) {
      console.error('Error deleting thought:', error);
      WebApp.showPopup({
        title: "Error",
        message: "Failed to delete the thought. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isResonated = user ? thought.resonatedBy?.includes(String(user.id)) : false;
  const isOwnThought = user && thought.userId === String(user.id);
  
  const formattedDate = thought.createdAt ? thought.createdAt.toDate().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden bg-white/30 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-50"
        style={{
          maskImage: 'radial-gradient(circle at center, black, transparent)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <motion.div 
            className="text-sm text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {thought.nickname} • {formattedDate}
          </motion.div>
          
          {isOwnThought && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-4 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </motion.button>
          )}
        </div>

        {/* Thought text */}
        <motion.p 
          className="text-gray-800 text-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {thought.text}
        </motion.p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResonance}
            disabled={isResonating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isResonated
                ? 'text-pink-500 bg-pink-50'
                : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <span className="text-xl">
              {isResonated ? '❤️' : '🤍'}
            </span>
            <span className="font-medium">
              {thought.resonanceCount || 0}
            </span>
          </motion.button>

          {thought.resonatedBy && thought.resonatedBy.length > 0 && (
            <motion.button
              onClick={() => setShowResonatedBy(!showResonatedBy)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showResonatedBy ? 'Hide resonances' : 'Show resonances'}
            </motion.button>
          )}
        </div>

        {/* Resonated by list */}
        <AnimatePresence>
          {showResonatedBy && thought.resonatedBy && thought.resonatedBy.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="text-sm text-gray-500 space-y-1">
                {thought.resonatedBy.map((userId) => (
                  <div key={userId} className="flex items-center space-x-2">
                    <span className="text-pink-500">❤️</span>
                    <span>{userId}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

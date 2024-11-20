import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { createThought } from '../services/firebase';
import WebApp from '@twa-dev/sdk';

interface ThoughtInputProps {
  onThoughtCreated: () => void;
}

const MAX_THOUGHT_LENGTH = 280;

const MOODS = [
  { emoji: '😊', name: 'Happy', color: 'text-yellow-500' },
  { emoji: '🤔', name: 'Reflective', color: 'text-blue-500' },
  { emoji: '🔥', name: 'Excited', color: 'text-orange-500' },
  { emoji: '❤️', name: 'Loving', color: 'text-pink-500' },
  { emoji: '💡', name: 'Inspired', color: 'text-purple-500' },
];

export default function ThoughtInput({ onThoughtCreated }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { user } = useUser();
  
  useEffect(() => {
    const handleMainButtonClick = () => {
      if (isValid && !isSubmitting) {
        handleSubmit();
      }
    };

    if (content.trim().length > 0) {
      WebApp.MainButton.setText('Share Thought');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(handleMainButtonClick);
    } else {
      WebApp.MainButton.hide();
    }

    return () => {
      WebApp.MainButton.offClick(handleMainButtonClick);
    };
  }, [content, isSubmitting]);

  const remainingChars = MAX_THOUGHT_LENGTH - content.length;
  const isValid = content.trim().length > 0 && content.length <= MAX_THOUGHT_LENGTH;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const moodEmoji = selectedMood !== null ? MOODS[selectedMood].emoji + ' ' : '';
      await createThought(
        moodEmoji + content.trim(),
        String(user.id),
        user.username || `user_${user.id}`
      );
      setContent('');
      setSelectedMood(null);
      onThoughtCreated();
      WebApp.showPopup({
        title: "Success! ✨",
        message: "Your thought has been shared with the universe",
      });
    } catch (error) {
      console.error('Error creating thought:', error);
      setError('Failed to share your thought. Please try again.');
      WebApp.showPopup({
        title: "Error",
        message: "Failed to share your thought. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mood selector */}
        <div className="flex justify-center space-x-4 py-2">
          {MOODS.map((mood, index) => (
            <motion.button
              key={mood.name}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(index)}
              className={`p-3 rounded-full transition-all duration-200 text-2xl ${
                selectedMood === index
                  ? 'bg-gray-100 scale-110 ' + mood.color
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {mood.emoji}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <motion.textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="Share your thoughts with the universe..."
            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none
              bg-white/70 backdrop-blur-sm
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'opacity-50' : ''}
              transition-all duration-200 text-lg`}
            rows={4}
            disabled={isSubmitting}
            maxLength={MAX_THOUGHT_LENGTH}
          />
          
          {/* Character counter */}
          <motion.div
            className={`absolute bottom-2 right-2 text-sm font-medium
              ${remainingChars <= 20 ? 'text-red-500' : 'text-gray-500'}`}
            animate={{
              scale: remainingChars <= 20 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {remainingChars}
          </motion.div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}

import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { addResonance } from '../services/api';
import { Thought } from '../types';

interface ThoughtCardProps {
  thought: Thought;
  onResonance: () => void;
}

export default function ThoughtCard({ thought, onResonance }: ThoughtCardProps) {
  const [isResonating, setIsResonating] = useState(false);
  const { user } = useUser();

  const handleResonance = async () => {
    if (!user || isResonating || thought.resonatedBy?.includes(user._id)) return;

    setIsResonating(true);
    try {
      await addResonance(thought._id, user._id);
      onResonance();
    } catch (error) {
      console.error('Error resonating with thought:', error);
    } finally {
      setIsResonating(false);
    }
  };

  const isResonated = user ? thought.resonatedBy?.includes(user._id) : false;

  const formattedDate = new Date(thought.timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      <p className="text-white mb-2">{thought.content}</p>
      <div className="flex justify-between items-center text-gray-400 text-sm">
        <span>{formattedDate}</span>
        <button
          onClick={handleResonance}
          disabled={isResonating || Boolean(isResonated)}
          className={`px-4 py-2 rounded ${
            isResonated
              ? 'bg-purple-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          } transition-colors ${isResonating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isResonated ? 'Резонирует' : 'Резонировать'}
        </button>
      </div>
    </div>
  );
}

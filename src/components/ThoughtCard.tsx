import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { incrementResonance } from '../services/firebase';
import { Thought } from '../types/thought';

interface ThoughtCardProps {
  thought: Thought;
  onResonance: () => void;
}

export default function ThoughtCard({ thought, onResonance }: ThoughtCardProps) {
  const [isResonating, setIsResonating] = useState(false);
  const { user } = useUser();

  const handleResonance = async () => {
    if (!user || isResonating || thought.resonatedBy?.includes(String(user.id))) return;

    setIsResonating(true);
    try {
      await incrementResonance(thought.id!);
      onResonance();
    } catch (error) {
      console.error('Error resonating with thought:', error);
    } finally {
      setIsResonating(false);
    }
  };

  const isResonated = user ? thought.resonatedBy?.includes(String(user.id)) : false;
  const formattedDate = thought.createdAt ? thought.createdAt.toDate().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <p className="text-white">{thought.content}</p>
        <span className="text-gray-400 text-sm">@{thought.username}</span>
      </div>
      <div className="flex justify-between items-center text-gray-400 text-sm">
        <span>{formattedDate}</span>
        <div className="flex items-center space-x-2">
          <span>{thought.resonanceCount} ✨</span>
          <button
            onClick={handleResonance}
            disabled={isResonating || Boolean(isResonated)}
            className={`px-4 py-2 rounded ${
              isResonated
                ? 'bg-purple-700 text-white'
                : isResonating
                ? 'bg-gray-600 text-gray-300'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isResonated ? 'Resonated' : isResonating ? 'Resonating...' : 'Resonate'}
          </button>
        </div>
      </div>
    </div>
  );
}

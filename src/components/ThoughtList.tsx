import React, { useEffect, useState } from 'react';
import { getThoughts, incrementResonance, type Thought } from '../services/firebase';
import { useUser } from '../contexts/UserContext';

const ThoughtList: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const thoughtsData = await getThoughts();
        setThoughts(thoughtsData);
      } catch (error) {
        console.error('Error loading thoughts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThoughts();
  }, []);

  const handleResonance = async (thoughtId: string) => {
    try {
      await incrementResonance(thoughtId);
      setThoughts(thoughts.map(thought => 
        thought.id === thoughtId 
          ? { ...thought, resonanceCount: thought.resonanceCount + 1 }
          : thought
      ));
    } catch (error) {
      console.error('Error resonating with thought:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading thoughts...</div>;
  }

  return (
    <div className="space-y-4">
      {thoughts.map((thought) => (
        <div
          key={thought.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{thought.username}
              </p>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {thought.content}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => thought.id && handleResonance(thought.id)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
              <span>✨</span>
              <span>{thought.resonanceCount}</span>
            </button>
            <span className="text-sm text-gray-500">
              {new Date(thought.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThoughtList;

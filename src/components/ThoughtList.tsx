import React, { useEffect, useState } from 'react';
import { getThoughts, incrementResonance } from '../services/firebase';
import { Thought } from '../types/thought';
import ThoughtCard from './ThoughtCard';

const ThoughtList: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadThoughts();
  }, []);

  const handleResonance = async (thoughtId: string) => {
    try {
      await incrementResonance(thoughtId);
      await loadThoughts(); // Перезагружаем мысли после резонанса
    } catch (error) {
      console.error('Error handling resonance:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thoughts.map((thought) => (
        <ThoughtCard
          key={thought.id}
          thought={thought}
          onResonance={() => thought.id && handleResonance(thought.id)}
        />
      ))}
    </div>
  );
};

export default ThoughtList;

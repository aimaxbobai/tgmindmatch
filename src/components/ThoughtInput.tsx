import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { createThought } from '../services/firebase';

interface ThoughtInputProps {
  onThoughtCreated: () => void;
}

export default function ThoughtInput({ onThoughtCreated }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createThought({
        userId: user.id,
        username: user.username,
        content: content.trim()
      });
      setContent('');
      onThoughtCreated();
    } catch (error) {
      console.error('Error creating thought:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        rows={3}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sharing...' : 'Share Thought'}
      </button>
    </form>
  );
}

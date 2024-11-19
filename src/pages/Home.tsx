import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import ThoughtInput from '../components/ThoughtInput';
import ThoughtList from '../components/ThoughtList';

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThoughtCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        <ThoughtInput onThoughtCreated={handleThoughtCreated} />
        <ThoughtList key={refreshKey} />
      </div>
    </div>
  );
}

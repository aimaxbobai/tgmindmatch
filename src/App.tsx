import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import './App.css';

function App() {
  useEffect(() => {
    try {
      console.log('Initializing Telegram Web App...');
      console.log('WebApp object:', window.Telegram?.WebApp);
      
      if (!window.Telegram?.WebApp) {
        console.error('Telegram WebApp is not available');
        return;
      }

      WebApp.ready();
      WebApp.expand();
      
      console.log('Telegram Web App initialized successfully');
      console.log('WebApp Platform:', WebApp.platform);
      console.log('WebApp Version:', WebApp.version);
      console.log('WebApp InitData:', WebApp.initData);
    } catch (error) {
      console.error('Error initializing Telegram Web App:', error);
    }
  }, []);

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Home />
      </div>
    </UserProvider>
  );
}

export default App;

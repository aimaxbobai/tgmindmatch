import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import './App.css';

function App() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <UserProvider>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Home />
      </div>
    </UserProvider>
  );
}

export default App;

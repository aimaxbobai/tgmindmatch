import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import WelcomeScreen from './components/WelcomeScreen';
import NicknameSetup from './components/NicknameSetup';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
    console.log('WebApp object:', WebApp);
    console.log('Window Telegram object:', window.Telegram);
    
    if (WebApp) {
      console.log('WebApp initialized');
      WebApp.ready();
      WebApp.expand();
    } else {
      console.error('WebApp not initialized');
    }
  }, []);

  return (
    <UserProvider>
      <Router basename="/tgmindmatch">
        <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-b from-purple-50 to-white">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/nickname" element={<NicknameSetup />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;

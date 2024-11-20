import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { useUser } from '../contexts/UserContext';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    // Перенаправление, если никнейм уже установлен
    if (user && user.nickname) {
      navigate('/home');
    }

    // Отключаем нативный скролл в Telegram WebApp
    WebApp.setBackgroundColor('#ffffff');
    WebApp.expand();
  }, [user, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white touch-none"
      style={{ 
        height: '100%',
        minHeight: '-webkit-fill-available'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center px-6 max-w-md w-full"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-purple-800 mb-4"
        >
          Welcome to MindMatch
        </motion.h1>
        
        <motion.p 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          Where thoughts connect people
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/nickname')}
          className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-all"
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;

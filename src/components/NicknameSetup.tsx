import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import WebApp from '@twa-dev/sdk';
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const NicknameSetup = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState<boolean | null>(null);

  // Проверяем, запущено ли приложение в Telegram
  useEffect(() => {
    const checkTelegramWebApp = () => {
      const isTelegram = !!(window.Telegram?.WebApp && WebApp?.initData);
      console.log('Checking Telegram WebApp:', { 
        isTelegram,
        webAppExists: !!WebApp,
        windowTelegramExists: !!window.Telegram?.WebApp,
        initDataExists: !!WebApp?.initData
      });
      setIsTelegramWebApp(isTelegram);

      if (isTelegram) {
        WebApp.ready();
        WebApp.expand();
      }
    };

    checkTelegramWebApp();
  }, []);

  const validateNickname = (value: string) => {
    if (value.length < 3) {
      setError('Nickname must be at least 3 characters long');
      setIsValid(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setError('Only letters, numbers, and underscores are allowed');
      setIsValid(false);
      return;
    }

    setError('');
    setIsValid(true);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    
    if (!isValid) {
      console.log('Nickname is not valid, stopping submission');
      return;
    }

    try {
      setIsChecking(true);
      console.log('Starting save process...');
      
      // Получаем данные пользователя из Telegram WebApp
      const webAppUser = WebApp.initDataUnsafe?.user;
      console.log('WebApp user data:', webAppUser);
      
      if (!webAppUser) {
        throw new Error('No user data available');
      }

      const usersRef = collection(db, 'users');

      // Проверяем, существует ли пользователь с таким ID
      const q = query(usersRef, where('id', '==', String(webAppUser.id)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Обновляем существующего пользователя
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { nickname });
        const updatedUserData = { ...querySnapshot.docs[0].data(), nickname } as User;
        setUser(updatedUserData);
        
        WebApp.showPopup({
          title: 'Success!',
          message: 'Nickname saved successfully!',
          buttons: [{ type: 'ok' }]
        });
        
        navigate('/home', { replace: true });
      } else {
        // Создаем нового пользователя
        const userData = {
          id: String(webAppUser.id),
          nickname,
          first_name: webAppUser.first_name || null,
          last_name: webAppUser.last_name || null,
          username: webAppUser.username || null,
          createdAt: new Date().toISOString()
        };

        await addDoc(usersRef, userData);
        setUser(userData);
        
        WebApp.showPopup({
          title: 'Success!',
          message: 'Nickname saved successfully!',
          buttons: [{ type: 'ok' }]
        });
        
        navigate('/home', { replace: true });
      }

      setIsChecking(false);
    } catch (error) {
      console.error('Error saving nickname:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      WebApp.showPopup({
        title: 'Error',
        message: `Failed to save nickname: ${errorMessage}`,
        buttons: [{ type: 'ok' }]
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Если еще проверяем окружение
  if (isTelegramWebApp === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Если не в Telegram
  if (!isTelegramWebApp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Not in Telegram</h2>
          <p className="text-gray-600">
            This app must be opened through Telegram.<br/>
            Please use the app through your Telegram client.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-purple-800">
          Create Your Identity
        </h1>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose a nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Enter your nickname"
            disabled={isChecking}
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || isChecking}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white
            ${isValid && !isChecking ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400'}
            transition-colors`}
        >
          {isChecking ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default NicknameSetup;

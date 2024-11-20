import React, { createContext, useContext, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  error: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        console.log('Initializing user...');
        
        // Проверяем, запущено ли приложение в Telegram
        if (!window.Telegram?.WebApp) {
          console.error('Application must be opened in Telegram');
          setError('This application must be opened in Telegram');
          setLoading(false);
          return;
        }
        
        // Проверяем, что WebApp правильно инициализирован
        if (!WebApp || !WebApp.initData || !WebApp.initDataUnsafe?.user) {
          console.error('WebApp initialization failed');
          setError('Failed to initialize Telegram Web App');
          setLoading(false);
          return;
        }

        // Получаем данные пользователя из Telegram WebApp
        const tgUser = WebApp.initDataUnsafe.user;

        // Проверяем, существует ли пользователь в Firebase
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('id', '==', String(tgUser.id)));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Получаем существующего пользователя
          const doc = querySnapshot.docs[0];
          const userData = doc.data() as User;
          setUser(userData);
        } else {
          // Пользователь не существует, оставляем user как null
          setUser(null);
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const contextValue = {
    user,
    setUser,
    loading,
    error,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

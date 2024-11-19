import React, { createContext, useContext, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types/user';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
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
        // Проверяем, что WebApp правильно инициализирован
        if (!WebApp || !WebApp.initData || !WebApp.initDataUnsafe?.user) {
          console.log('WebApp initialization data:', {
            webApp: !!WebApp,
            initData: !!WebApp?.initData,
            user: !!WebApp?.initDataUnsafe?.user
          });
          
          // Для тестирования создаем тестового пользователя
          const testUser: User = {
            id: '12345',
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en',
            is_premium: false,
            added_to_attachment_menu: false,
            allows_write_to_pm: true,
          };
          
          setUser(testUser);
          setLoading(false);
          return;
        }

        // Получаем данные пользователя из Telegram WebApp
        const tgUser = WebApp.initDataUnsafe.user;

        // Проверяем, существует ли пользователь в Firebase
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('id', '==', String(tgUser.id)));
        const querySnapshot = await getDocs(q);

        let userData: User;

        if (querySnapshot.empty) {
          // Создаем нового пользователя
          const userDoc = {
            id: String(tgUser.id),
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            username: tgUser.username,
            language_code: tgUser.language_code,
            is_premium: tgUser.is_premium,
            added_to_attachment_menu: tgUser.added_to_attachment_menu,
            allows_write_to_pm: tgUser.allows_write_to_pm,
          };

          await addDoc(usersRef, userDoc);
          userData = userDoc;
        } else {
          // Получаем существующего пользователя
          const doc = querySnapshot.docs[0];
          userData = doc.data() as User;
        }

        setUser(userData);
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

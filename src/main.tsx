import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import './index.css'
import App from './App.tsx'

// Глобальный обработчик ошибок
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Window Error:', { msg, url, lineNo, columnNo, error });
  return false;
};

// Глобальный обработчик непойманных промисов
window.onunhandledrejection = function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
};

// Логируем информацию о платформе
console.log('Platform Info:', {
  userAgent: window.navigator.userAgent,
  platform: window.navigator.platform,
  vendor: window.navigator.vendor,
  webApp: !!window.Telegram?.WebApp,
  webAppPlatform: WebApp?.platform,
  initDataUnsafe: WebApp?.initDataUnsafe
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  // Показываем сообщение об ошибке на экране
  rootElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      color: black;
      padding: 20px;
      text-align: center;
    ">
      <div>
        <h1 style="margin-bottom: 10px;">Something went wrong</h1>
        <p>Please try restarting the app</p>
      </div>
    </div>
  `;
}

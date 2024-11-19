import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

console.log('Starting bot initialization...');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Present' : 'Missing');
console.log('API_URL:', process.env.API_URL);
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Middleware для обработки ошибок
bot.catch((err, ctx) => {
  console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Команда start - единственная команда для открытия Mini App
bot.command('start', async (ctx) => {
  try {
    console.log('Received start command from user:', ctx.from);
    const { id: telegramId, username, first_name, last_name } = ctx.from;
    
    // Регистрируем или обновляем пользователя
    console.log('Attempting to register user with API...');
    await axios.post(`${API_URL}/users`, {
      telegramId: telegramId.toString(),
      username,
      firstName: first_name,
      lastName: last_name
    });

    const webAppUrl = process.env.WEBAPP_URL;
    console.log('Sending welcome message with WebApp URL:', webAppUrl);
    
    await ctx.reply(
      'Добро пожаловать в MindMatch! 🧠✨\n\nНажмите кнопку ниже, чтобы открыть приложение:',
      {
        reply_markup: {
          keyboard: [[
            { text: "Открыть MindMatch", web_app: { url: webAppUrl } }
          ]],
          resize_keyboard: true,
          persistent: true
        }
      }
    );
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Произошла ошибка при запуске. Пожалуйста, попробуйте позже.');
  }
});

console.log('Setting up bot launch...');
bot.launch().then(() => {
  console.log('Bot successfully launched and running!');
}).catch((err) => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

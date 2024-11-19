import { User } from '../models/index.js';

// Создание или обновление пользователя
export const createOrUpdateUser = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;

    const user = await User.findOneAndUpdate(
      { telegramId },
      { 
        username,
        firstName,
        lastName,
        lastActive: new Date()
      },
      { 
        new: true,
        upsert: true
      }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Получение профиля пользователя
export const getUserProfile = async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const user = await User.findOne({ telegramId })
      .populate('resonatedThoughts');
      
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение списка пользователей с похожими резонансами
export const getSimilarUsers = async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const user = await User.findOne({ telegramId })
      .populate('resonatedThoughts');
      
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем пользователей, которые резонировали с теми же мыслями
    const similarUsers = await User.find({
      telegramId: { $ne: telegramId },
      resonatedThoughts: { 
        $in: user.resonatedThoughts
      }
    }).limit(10);

    res.json(similarUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

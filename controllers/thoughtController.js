import { Thought, User } from '../models/index.js';

// Создание новой мысли
export const createThought = async (req, res) => {
  try {
    const { content, userId } = req.body;
    
    const thought = new Thought({
      content,
      userId
    });
    
    await thought.save();
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Получение всех мыслей
export const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: -1 });
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение мыслей конкретного пользователя
export const getUserThoughts = async (req, res) => {
  try {
    const { userId } = req.params;
    const thoughts = await Thought.find({ userId })
      .sort({ createdAt: -1 });
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Резонирование с мыслью
export const resonateWithThought = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { userId } = req.body;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Мысль не найдена' });
    }

    // Проверяем, не резонировал ли пользователь уже с этой мыслью
    const existingResonate = thought.resonances.find(r => r.userId === userId);
    if (existingResonate) {
      return res.status(400).json({ message: 'Вы уже резонировали с этой мыслью' });
    }

    thought.resonances.push({ userId });
    await thought.save();

    // Добавляем мысль в список резонированных у пользователя
    await User.findOneAndUpdate(
      { telegramId: userId },
      { $addToSet: { resonatedThoughts: thoughtId } }
    );

    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Отмена резонанса с мыслью
export const unresonateWithThought = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { userId } = req.body;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Мысль не найдена' });
    }

    thought.resonances = thought.resonances.filter(r => r.userId !== userId);
    await thought.save();

    // Удаляем мысль из списка резонированных у пользователя
    await User.findOneAndUpdate(
      { telegramId: userId },
      { $pull: { resonatedThoughts: thoughtId } }
    );

    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

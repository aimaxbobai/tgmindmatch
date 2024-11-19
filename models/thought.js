import mongoose from 'mongoose';

const thoughtSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
  resonances: [{
    userId: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Виртуальное поле для подсчета количества резонансов
thoughtSchema.virtual('resonanceCount').get(function() {
  return this.resonances.length;
});

// Убедимся, что виртуальные поля включены в JSON
thoughtSchema.set('toJSON', { virtuals: true });
thoughtSchema.set('toObject', { virtuals: true });

const Thought = mongoose.model('Thought', thoughtSchema);

export default Thought;

import { motion } from 'framer-motion';

interface MatchedUserProps {
  nickname: string;
  similarity: number;
  angle: number;
  distance: number;
  delay: number;
}

export const MatchedUser = ({ nickname, similarity, angle, distance, delay }: MatchedUserProps) => {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x, y }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x,
        y
      }}
      transition={{ 
        delay,
        duration: 0.5,
        ease: "easeOut"
      }}
      className="absolute flex flex-col items-center"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center space-y-1">
        <span className="text-sm font-medium text-gray-800">{nickname}</span>
        <span className="text-xs text-blue-500 font-semibold">{similarity}% match</span>
      </div>
      {/* Линия соединения с центром */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: delay + 0.2 }}
        className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-blue-400 to-transparent"
        style={{
          width: Math.sqrt(x * x + y * y),
          transform: `rotate(${Math.atan2(y, x)}rad)`,
          transformOrigin: '0 0'
        }}
      />
    </motion.div>
  );
};

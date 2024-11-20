import { motion } from 'framer-motion';

interface CenterAnimationProps {
  isSearching: boolean;
}

export const CenterAnimation = ({ isSearching }: CenterAnimationProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Основной пульсирующий круг */}
      <motion.div
        animate={{
          scale: isSearching ? [1, 1.2, 1] : 1,
          opacity: isSearching ? [0.7, 0.3, 0.7] : 0.7,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm"
      />

      {/* Вращающийся внешний круг */}
      <motion.div
        animate={{
          rotate: isSearching ? 360 : 0,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-32 h-32"
      >
        {/* Частицы вокруг */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translate(${isSearching ? 40 : 30}px, 0)`,
            }}
            animate={{
              scale: isSearching ? [1, 1.5, 1] : 1,
              opacity: isSearching ? [0.5, 1, 0.5] : 0.5,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

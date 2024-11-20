import { motion } from 'framer-motion';

interface CenterAnimationProps {
  isSearching: boolean;
}

export const CenterAnimation = ({ isSearching }: CenterAnimationProps) => {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
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
        className="absolute w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm"
      />

      {/* Внутренний круг с градиентом */}
      <motion.div
        animate={{
          scale: isSearching ? [0.8, 1, 0.8] : 0.9,
          opacity: isSearching ? [0.8, 1, 0.8] : 0.9,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-16 h-16 bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 rounded-full"
        style={{ filter: 'blur(1px)' }}
      />

      {/* Вращающиеся частицы "мыслей" */}
      {Array.from({ length: 3 }).map((_, orbitIndex) => (
        <motion.div
          key={`orbit-${orbitIndex}`}
          animate={{
            rotate: isSearching ? 360 : 0,
          }}
          transition={{
            duration: 8 - orbitIndex * 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-full h-full"
          style={{
            width: `${100 + orbitIndex * 40}%`,
            height: `${100 + orbitIndex * 40}%`,
          }}
        >
          {/* Частицы на орбите */}
          {Array.from({ length: 4 }).map((_, particleIndex) => (
            <motion.div
              key={`particle-${orbitIndex}-${particleIndex}`}
              className="absolute w-2 h-2"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${particleIndex * 90}deg) translateX(${50 + orbitIndex * 20}%)`,
              }}
            >
              <motion.div
                animate={{
                  scale: isSearching ? [1, 1.5, 1] : 1,
                  opacity: isSearching ? [0.5, 1, 0.5] : 0.5,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: (particleIndex * 0.2) + (orbitIndex * 0.3),
                }}
                className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                style={{ filter: 'blur(1px)' }}
              />
            </motion.div>
          ))}
        </motion.div>
      ))}

      {/* "Мысли" летящие к центру */}
      {isSearching && Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={`thought-${index}`}
          className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
          initial={{
            x: Math.cos(index * Math.PI / 4) * 100,
            y: Math.sin(index * Math.PI / 4) * 100,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

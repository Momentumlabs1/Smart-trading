import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export const QuizProgress = ({ current, total }: QuizProgressProps) => {
  return (
    <div className="w-full relative">
      {/* Dot Progress - playful style like reference */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current - 1;
          
          return (
            <motion.div
              key={index}
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: isCompleted || isCurrent ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isCompleted 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/25'
                  }
                `}
                animate={{
                  scale: isCurrent ? [1, 1.15, 1] : 1,
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: isCurrent ? Infinity : 0, 
                  ease: 'easeInOut' 
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Question counter - clean pill */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass px-5 py-2 rounded-full border border-border/40">
          <span className="text-sm font-medium">
            <span className="text-primary font-mono font-bold">{current}</span>
            <span className="text-muted-foreground"> / {total}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

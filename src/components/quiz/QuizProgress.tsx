import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      {/* Progress bar container with subtle glow */}
      <div className="relative">
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
          <motion.div
            className="h-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, hsl(45 93% 48%), hsl(45 93% 58%), hsl(45 93% 48%))',
              backgroundSize: '200% 100%',
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${progress}%`,
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
            }}
            transition={{ 
              width: { duration: 0.4, ease: 'easeOut' },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' }
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 1,
              }}
            />
          </motion.div>
        </div>

        {/* Glow effect under the progress */}
        <motion.div
          className="absolute top-0 left-0 h-2 rounded-full blur-md opacity-50"
          style={{
            background: 'hsl(45 93% 58%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current - 1;
          
          return (
            <motion.div
              key={index}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-300
                ${isCompleted 
                  ? 'bg-primary' 
                  : isCurrent 
                    ? 'bg-primary/60 scale-125' 
                    : 'bg-muted-foreground/20'
                }
              `}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: isCurrent ? 1.3 : isCompleted ? 1 : 0.8,
                opacity: isCompleted || isCurrent ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
    </div>
  );
};

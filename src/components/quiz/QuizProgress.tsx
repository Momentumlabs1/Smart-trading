import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface QuizProgressProps {
  current: number;
  total: number;
}

export const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full relative">
      {/* Ambient glow behind progress */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, hsl(45 93% 58% / ${progress / 100}) ${progress}%, transparent ${progress}%)`,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Progress bar container with subtle glow */}
      <div className="relative">
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-xl border border-border/40 shadow-inner">
          <motion.div
            className="h-full relative overflow-hidden rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(45 93% 45%), hsl(45 93% 58%), hsl(45 93% 65%), hsl(45 93% 58%), hsl(45 93% 45%))',
              backgroundSize: '200% 100%',
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${progress}%`,
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
            }}
            transition={{ 
              width: { duration: 0.6, ease: 'easeOut' },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' }
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.5,
              }}
            />
            
            {/* Leading edge glow */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent"
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Glow effect under the progress */}
        <motion.div
          className="absolute -top-1 left-0 h-5 rounded-full blur-lg opacity-60"
          style={{
            background: 'hsl(45 93% 58%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        
        {/* Sparkle at progress tip */}
        <AnimatePresence>
          {progress > 5 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${progress}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8], 
                opacity: 1,
                rotate: [0, 180, 360],
              }}
              transition={{ 
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              }}
            >
              <Sparkles className="w-4 h-4 text-primary drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step indicators with enhanced styling */}
      <div className="flex justify-between mt-4 px-1">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current - 1;
          
          return (
            <div key={index} className="relative">
              <motion.div
                className={`
                  w-2 h-2 rounded-full transition-all duration-300 relative
                  ${isCompleted 
                    ? 'bg-primary shadow-lg shadow-primary/50' 
                    : isCurrent 
                      ? 'bg-primary/80' 
                      : 'bg-muted-foreground/20'
                  }
                `}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: isCurrent ? 1.5 : isCompleted ? 1.2 : 0.8,
                  opacity: isCompleted || isCurrent ? 1 : 0.3,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              
              {/* Pulse ring for current */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Question counter */}
      <motion.div
        className="flex justify-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass px-4 py-1.5 rounded-full border border-border/50">
          <span className="text-xs font-medium">
            <span className="text-primary font-mono">{current}</span>
            <span className="text-muted-foreground"> / {total}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizLandingProps {
  onStart: () => void;
}

export const QuizLanding = ({ onStart }: QuizLandingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] -top-48 -left-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.08), transparent 70%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] -bottom-32 -right-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(0 0% 100% / 0.03), transparent 70%)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6 max-w-xl"
      >
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
          Finde heraus, welches Programm
          <br />
          <span className="text-gradient-primary">zu deinem Trading-Level passt.</span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Button
            variant="hero"
            size="xl"
            onClick={onStart}
            className="group"
          >
            Analyse starten
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            3 Minuten
          </span>
          <span>•</span>
          <span>Kostenlos</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

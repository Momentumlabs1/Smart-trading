import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizLandingProps {
  onStart: () => void;
}

const tradingLevels = [
  { label: 'Einsteiger', icon: '📊' },
  { label: 'Fortgeschritten', icon: '📈' },
  { label: 'Erfahren', icon: '💹' },
  { label: 'Profi', icon: '🏆' },
];

export const QuizLanding = ({ onStart }: QuizLandingProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLevel((prev) => (prev + 1) % tradingLevels.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Chart pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(45deg, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(-45deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />

        {/* Primary gradient orb */}
        <motion.div
          className="absolute w-[800px] h-[800px] -top-48 -left-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.1), transparent 60%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary gradient orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] -bottom-32 -right-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.06), transparent 60%)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating chart indicator */}
        <motion.div
          className="absolute top-20 right-10 sm:right-20 hidden sm:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="glass rounded-lg px-3 py-2 flex items-center gap-2 opacity-50">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-foreground font-mono">+12.4%</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Main Glassmorphism Card */}
        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-border/50 relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />

          {/* Animated Level Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
              {tradingLevels.map((level, index) => (
                <motion.div
                  key={level.label}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 flex items-center gap-1.5 ${
                    index === currentLevel
                      ? 'bg-primary/20 text-primary border border-primary/50 shadow-lg shadow-primary/20'
                      : 'bg-muted/20 text-muted-foreground border border-transparent'
                  }`}
                  animate={{
                    scale: index === currentLevel ? 1.08 : 1,
                    y: index === currentLevel ? -2 : 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <span>{level.icon}</span>
                  <span className="hidden sm:inline">{level.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Headline with animated underline */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
              Finde heraus, welches Programm
            </h1>
            <div className="relative inline-block">
              <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary">
                zu deinem Trading-Level passt.
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-10 max-w-sm mx-auto">
            12 kurze Fragen. Personalisierte Empfehlung für deinen Trading-Erfolg.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={onStart}
              className="group w-full sm:w-auto"
            >
              Analyse starten
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 sm:gap-8"
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>3 Minuten</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary/70" />
              <span>Kostenlos</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Target className="w-4 h-4 text-primary/70" />
              <span>Personalisiert</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

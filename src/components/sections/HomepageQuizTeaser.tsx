import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tradingLevels = [
  { label: 'Einsteiger', color: 'text-muted-foreground' },
  { label: 'Fortgeschritten', color: 'text-foreground' },
  { label: 'Erfahren', color: 'text-primary' },
  { label: 'Profi', color: 'text-primary' },
];

export const HomepageQuizTeaser = () => {
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLevel((prev) => (prev + 1) % tradingLevels.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                         linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Animated gradient orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(45 93% 58% / 0.08), transparent 60%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Glassmorphism Card */}
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-border/50 relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />

            {/* Animated Level Badges */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {tradingLevels.map((level, index) => (
                <motion.div
                  key={level.label}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-300 ${
                    index === currentLevel
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-muted/30 text-muted-foreground border border-transparent'
                  }`}
                  animate={{
                    scale: index === currentLevel ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {level.label}
                </motion.div>
              ))}
            </div>

            {/* Headline */}
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center leading-tight mb-3 sm:mb-4">
              Finde in 3 Minuten heraus,
              <br />
              <span className="text-gradient-primary">welches Programm zu dir passt.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8 max-w-md mx-auto">
              Beantworte 12 kurze Fragen und erhalte eine personalisierte Empfehlung für deinen Trading-Erfolg.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <Link to="/quiz">
                <Button
                  variant="hero"
                  size="lg"
                  className="group text-sm sm:text-base"
                >
                  Wie gut kannst du traden?
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70" />
                3 Min
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70" />
                Kostenlos
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70" />
                Personalisiert
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

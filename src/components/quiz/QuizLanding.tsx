import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import tradingBg from '@/assets/trading-bg.webp';

interface QuizLandingProps {
  onStart: () => void;
}

const tradingLevels = [
  { label: 'Einsteiger', icon: '📊' },
  { label: 'Fortgeschritten', icon: '📈' },
  { label: 'Erfahren', icon: '💹' },
  { label: 'Profi', icon: '🏆' },
];

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full"
        initial={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [null, `${Math.random() * 100}%`],
          x: [null, `${Math.random() * 100}%`],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

export const QuizLanding = ({ onStart }: QuizLandingProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLevel((prev) => (prev + 1) % tradingLevels.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-8 overflow-hidden">
      {/* Trading Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${tradingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: 0.15,
          scale: [1.1, 1.15, 1.1],
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Chart pattern background */}
        <motion.div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `
              linear-gradient(45deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(-45deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Primary gradient orb - enhanced */}
        <motion.div
          className="absolute w-[1000px] h-[1000px] -top-64 -left-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.15), hsl(45 93% 58% / 0.05) 40%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary gradient orb - enhanced */}
        <motion.div
          className="absolute w-[800px] h-[800px] -bottom-48 -right-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.1), transparent 60%)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating chart indicator - left */}
        <motion.div
          className="absolute top-20 right-10 sm:right-20 hidden sm:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.5 },
            x: { duration: 0.8, delay: 0.5 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-green-500/20 shadow-lg shadow-green-500/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-foreground font-mono font-medium">+12.4%</span>
          </div>
        </motion.div>
        
        {/* Second floating indicator */}
        <motion.div
          className="absolute bottom-32 left-10 sm:left-20 hidden sm:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.7 },
            x: { duration: 0.8, delay: 0.7 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-primary/20 shadow-lg shadow-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground font-medium">Smart Trading</span>
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
        <motion.div 
          className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-border/50 relative overflow-hidden shadow-2xl shadow-primary/5"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Card inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          
          {/* Corner accents */}
          <motion.div 
            className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          />
          <motion.div 
            className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />
          <motion.div 
            className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
          <motion.div 
            className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />

          {/* Animated Level Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8 relative"
          >
            <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
              <AnimatePresence mode="wait">
                {tradingLevels.map((level, index) => (
                  <motion.div
                    key={level.label}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 flex items-center gap-2 relative overflow-hidden ${
                      index === currentLevel
                        ? 'bg-primary/20 text-primary border border-primary/50 shadow-xl shadow-primary/30'
                        : 'bg-muted/20 text-muted-foreground border border-transparent hover:bg-muted/30'
                    }`}
                    animate={{
                      scale: index === currentLevel ? 1.1 : 1,
                      y: index === currentLevel ? -4 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {/* Glow effect for active */}
                    {index === currentLevel && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ backgroundSize: '200% 100%' }}
                      />
                    )}
                    <motion.span
                      animate={{ 
                        rotate: index === currentLevel ? [0, -10, 10, 0] : 0,
                        scale: index === currentLevel ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {level.icon}
                    </motion.span>
                    <span className="hidden sm:inline relative z-10">{level.label}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Headline with animated underline */}
          <div className="text-center mb-4 sm:mb-6">
            <motion.h1 
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Finde heraus, welches Programm
            </motion.h1>
            <div className="relative inline-block">
              <motion.span 
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                zu deinem Trading-Level passt.
              </motion.span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              />
              <motion.div
                className="absolute -bottom-1 left-0 h-2 bg-primary/20 blur-md rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
          </div>

          {/* Subtitle */}
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-10 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            12 kurze Fragen. Personalisierte Empfehlung für deinen Trading-Erfolg.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              className="relative"
              onHoverStart={() => setIsButtonHovered(true)}
              onHoverEnd={() => setIsButtonHovered(false)}
            >
              {/* Button glow */}
              <motion.div
                className="absolute -inset-2 bg-primary/30 rounded-2xl blur-xl"
                animate={{
                  opacity: isButtonHovered ? 0.8 : 0.4,
                  scale: isButtonHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <Button
                variant="hero"
                size="xl"
                onClick={onStart}
                className="group w-full sm:w-auto relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isButtonHovered ? '100%' : '-100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Analyse starten
                  <motion.span
                    animate={{ x: isButtonHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
          >
            <motion.div 
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground glass px-3 py-2 rounded-full border border-border/30"
              whileHover={{ scale: 1.05, borderColor: 'hsl(45 93% 58% / 0.3)' }}
            >
              <Clock className="w-4 h-4 text-primary/70" />
              <span>3 Minuten</span>
            </motion.div>
            <div className="w-px h-4 bg-border" />
            <motion.div 
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground glass px-3 py-2 rounded-full border border-border/30"
              whileHover={{ scale: 1.05, borderColor: 'hsl(45 93% 58% / 0.3)' }}
            >
              <Sparkles className="w-4 h-4 text-primary/70" />
              <span>Kostenlos</span>
            </motion.div>
            <div className="w-px h-4 bg-border" />
            <motion.div 
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground glass px-3 py-2 rounded-full border border-border/30"
              whileHover={{ scale: 1.05, borderColor: 'hsl(45 93% 58% / 0.3)' }}
            >
              <Target className="w-4 h-4 text-primary/70" />
              <span>Personalisiert</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

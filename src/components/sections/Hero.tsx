import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <span className="font-mono">
      {displayValue}
      {suffix}
    </span>
  );
};

// Community avatars component
const CommunityAvatars = () => {
  const avatars = [
    { bg: 'bg-primary/20', letter: 'M' },
    { bg: 'bg-secondary/30', letter: 'S' },
    { bg: 'bg-muted', letter: 'A' },
    { bg: 'bg-primary/30', letter: 'T' },
    { bg: 'bg-secondary/20', letter: 'K' },
    { bg: 'bg-muted', letter: 'L' },
  ];

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {avatars.map((avatar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
            className={`w-10 h-10 rounded-full ${avatar.bg} border-2 border-background flex items-center justify-center text-sm font-semibold text-foreground`}
          >
            {avatar.letter}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="ml-4 text-left"
      >
        <div className="text-sm font-semibold text-primary">
          <AnimatedCounter value={480} suffix="+" />
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          Aktive Community Mitglieder
        </div>
      </motion.div>
    </div>
  );
};

// Floating trading card
const FloatingCard = ({ delay, className, children }: { delay: number; className: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={className}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);

export const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[1000px] h-[1000px] -top-1/4 -left-1/4 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.15), transparent 60%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] -bottom-1/4 -right-1/4 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(0 0% 100% / 0.1), transparent 60%)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating elements - trading signals */}
      <FloatingCard delay={0.8} className="absolute top-32 left-[10%] hidden lg:block">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground font-medium">BTC/USD</span>
          <span className="text-sm text-green-500 font-mono">+2.4%</span>
        </div>
      </FloatingCard>

      <FloatingCard delay={1.0} className="absolute top-48 right-[8%] hidden lg:block">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground font-medium">ETH/USD</span>
          <span className="text-sm text-green-500 font-mono">+5.1%</span>
        </div>
      </FloatingCard>

      <FloatingCard delay={1.2} className="absolute bottom-40 left-[15%] hidden lg:block">
        <div className="glass rounded-xl px-4 py-3">
          <div className="text-xs text-muted-foreground mb-1">Bot Performance</div>
          <div className="text-lg font-mono font-bold text-primary">+847%</div>
        </div>
      </FloatingCard>

      <FloatingCard delay={1.4} className="absolute bottom-32 right-[12%] hidden lg:block">
        <div className="glass rounded-xl px-4 py-3">
          <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
          <div className="text-lg font-mono font-bold text-foreground">73.2%</div>
        </div>
      </FloatingCard>

      {/* Main content */}
      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
              Willkommen bei Smart Trading
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
          >
            Die erste Adresse für
            <br />
            <span className="relative inline-block">
              <span className="text-gradient-primary">professionelle</span>
              <motion.svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.path
                  d="M 0 6 Q 75 0, 150 6 Q 225 12, 300 6"
                  fill="none"
                  stroke="hsl(45 93% 58%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </motion.svg>
            </span>
            <br />
            Trader-Ausbildungen
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Erlerne die Fähigkeiten zum Profi-Trader und erreiche zeitliche und finanzielle Freiheit.
            <br />
            <span className="text-foreground font-medium">Dein Erfolg ist unsere Mission.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/quiz">
              <Button
                variant="hero"
                size="xl"
                className="group relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                  animate={{
                    x: isHovered ? ['-100%', '100%'] : '-100%',
                  }}
                  transition={{ duration: 0.6 }}
                  style={{ opacity: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Kostenloses Erstgespräch
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="w-4 h-4 mr-2" />
                Member Login
              </Button>
            </Link>
          </motion.div>

          {/* Community Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <CommunityAvatars />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

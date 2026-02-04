import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import tradingBg from '@/assets/trading-bg.webp';

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

// Stats Bar component
const StatsBar = () => {
  const stats = [
    { value: 847, suffix: '%', label: 'Bot Performance', prefix: '+' },
    { value: 73, suffix: '%', label: 'Win Rate' },
    { value: 480, suffix: '+', label: 'Community Mitglieder' },
    { value: 12, suffix: '+', label: 'Jahre Erfahrung' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 mt-16 pt-8 border-t border-border/30"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-2xl md:text-3xl font-bold text-foreground font-mono">
            {stat.prefix && <span className="text-primary">{stat.prefix}</span>}
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
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
      {/* Animated Trading Chart Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 3, ease: 'easeOut', delay: 0.5 }}
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${tradingBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
            }}
          />
        </motion.div>
        {/* Gradient overlay for smooth fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-background/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-background/95 pointer-events-none" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Floating elements - trading signals (decorative, positioned far out) */}
      <FloatingCard delay={0.8} className="absolute top-28 left-[5%] hidden xl:block z-0">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground font-medium">BTC/USD</span>
          <span className="text-sm text-green-500 font-mono">+2.4%</span>
        </div>
      </FloatingCard>

      <FloatingCard delay={1.0} className="absolute top-36 right-[5%] hidden xl:block z-0">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground font-medium">ETH/USD</span>
          <span className="text-sm text-green-500 font-mono">+5.1%</span>
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
                  Wie gut kannst du traden?
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

          {/* Stats Bar */}
          <StatsBar />
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

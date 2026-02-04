import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import tradingBg from '@/assets/trading-bg.webp';

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix = ''
}: {
  value: number;
  suffix?: string;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: 'easeOut'
    });
    const unsubscribe = rounded.on('change', v => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);
  return <span className="font-mono">
      {displayValue}
      {suffix}
    </span>;
};

// Stats Bar component - responsive
const StatsBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    once: false
  });
  const stats = [{
    value: 14,
    suffix: '%',
    label: 'Bot Rendite',
    prefix: '+'
  }, {
    value: 73,
    suffix: '%',
    label: 'Win Rate'
  }];
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: isInView ? 1 : 0,
    y: isInView ? 0 : 20
  }} transition={{
    duration: 0.6,
    delay: 0.3
  }} className="flex justify-center lg:justify-start gap-8 sm:gap-12 md:gap-16 pt-6 border-t border-border/30">
      {stats.map((stat, i) => <motion.div key={i} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: isInView ? 1 : 0,
      y: isInView ? 0 : 20
    }} transition={{
      delay: 0.4 + i * 0.1,
      duration: 0.5
    }} className="text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground font-mono">
            {stat.prefix && <span className="text-primary">{stat.prefix}</span>}
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>)}
    </motion.div>;
};
export const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-8 sm:pb-0">
      {/* Animated Trading Chart Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-0" initial={{
        clipPath: 'inset(0 100% 0 0)'
      }} animate={{
        clipPath: 'inset(0 0% 0 0)'
      }} transition={{
        duration: 3,
        ease: 'easeOut',
        delay: 0.5
      }}>
          <div className="absolute inset-0" style={{
          backgroundImage: `url(${tradingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5
        }} />
        </motion.div>
        {/* Gradient overlay for smooth fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/30 to-background/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/80 pointer-events-none" />
      </div>

      {/* Animated gradient orbs - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <motion.div className="absolute w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] -top-1/4 -left-1/4 rounded-full opacity-20" style={{
        background: 'radial-gradient(circle, hsl(45 93% 58% / 0.15), transparent 60%)'
      }} animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 10, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut'
      }} />
      </div>

      {/* Grid pattern - lighter on mobile */}
      <div className="absolute inset-0 opacity-[0.02] sm:opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
      backgroundSize: '40px 40px sm:80px 80px'
    }} />

      {/* Floating elements - hidden on mobile */}
      <div className="absolute top-28 left-[5%] hidden xl:block z-0">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8,
        duration: 0.6
      }}>
          <motion.div animate={{
          y: [0, -8, 0]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-foreground font-medium">BTC/USD</span>
              <span className="text-sm text-green-500 font-mono">+2.4%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="section-container relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto py-8 lg:py-16">
          
          {/* Desktop: Side by side | Mobile: Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-center">
            
            {/* Video Placeholder - Fixed size, left side on desktop - Links to Quiz */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="justify-self-center lg:justify-self-start"
            >
              <Link to="/quiz">
                <div className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 group cursor-pointer hover:border-primary/50 transition-all duration-300">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow"
                    >
                      <Play className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground ml-0.5" fill="currentColor" />
                    </motion.div>
                    <p className="text-xs lg:text-sm font-medium text-foreground text-center px-4">
                      Video starten
                    </p>
                    <span className="text-[10px] text-muted-foreground">2:30 Min</span>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />

                  {/* Hover Glow */}
                  <motion.div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>

            {/* Text Content - Right side on desktop */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  Willkommen bei Smart Trading
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.15] mb-6"
              >
                Die erste Adresse für
                <br />
                <span className="relative inline-block">
                  <span className="text-gradient-primary">professionelle</span>
                  <motion.svg
                    viewBox="0 0 300 12"
                    className="absolute -bottom-1 lg:-bottom-2 left-0 w-full"
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

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <Link to="/quiz" className="w-full sm:w-auto">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full sm:w-auto group relative overflow-hidden text-sm sm:text-base"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                      animate={{ x: isHovered ? ['-100%', '100%'] : '-100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ opacity: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Wie gut kannst du traden?
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="heroOutline" size="lg" className="w-full sm:w-auto group text-sm sm:text-base">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Member Login
                  </Button>
                </Link>
              </motion.div>

              {/* Stats Bar */}
              <div className="mt-8">
                <StatsBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
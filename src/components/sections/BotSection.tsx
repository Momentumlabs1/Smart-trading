import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Generate realistic trading data
const generateChartData = () => {
  const data = [];
  let value = 1000;
  for (let i = 0; i < 50; i++) {
    const change = (Math.random() - 0.4) * 50; // Slight upward bias
    value = Math.max(800, value + change);
    data.push({ x: i, y: value });
  }
  return data;
};

// Animated chart line
const TradingChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [data] = useState(generateChartData);
  const [currentValue, setCurrentValue] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));
  const range = maxY - minY;
  
  // Create SVG path
  const pathData = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((point.y - minY) / range) * 80;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Animate current value
  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < data.length) {
          setCurrentValue(data[i].y);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [isInView, data, isAnimating]);

  const percentGain = ((currentValue - 1000) / 1000 * 100).toFixed(1);

  return (
    <div ref={ref} className="relative">
      {/* Current value display */}
      <div className="absolute -top-2 right-0 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="glass rounded-xl px-4 py-2"
        >
          <div className="text-xs text-muted-foreground">Portfolio Value</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-foreground">
              €{currentValue.toFixed(0)}
            </span>
            <span className={`text-sm font-mono ${Number(percentGain) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(percentGain) >= 0 ? '+' : ''}{percentGain}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <svg viewBox="0 0 100 100" className="w-full h-48 md:h-64">
        {/* Grid lines */}
        {[20, 40, 60, 80].map(y => (
          <line 
            key={y} 
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="hsl(var(--muted))" 
            strokeWidth="0.2" 
            strokeDasharray="2,2" 
          />
        ))}
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(45 93% 58%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(45 93% 58%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill area */}
        <motion.path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="hsl(45 93% 58%)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
        
        {/* Animated dot at end */}
        <motion.circle
          cx={100}
          cy={100 - ((data[data.length - 1].y - minY) / range) * 80}
          r="2"
          fill="hsl(45 93% 58%)"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: [0, 1.5, 1] } : {}}
          transition={{ delay: 2.5, duration: 0.3 }}
        />
        
        {/* Pulsing glow */}
        <motion.circle
          cx={100}
          cy={100 - ((data[data.length - 1].y - minY) / range) * 80}
          r="4"
          fill="none"
          stroke="hsl(45 93% 58%)"
          strokeWidth="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { 
            scale: [1, 2, 1], 
            opacity: [0.5, 0, 0.5] 
          } : {}}
          transition={{ 
            delay: 2.8, 
            duration: 2, 
            repeat: Infinity 
          }}
        />
      </svg>
    </div>
  );
};

// Stats with animated counters
const StatCard = ({ icon: Icon, value, label, suffix = '', delay = 0 }: {
  icon: typeof TrendingUp;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { 
        duration: 2, 
        delay,
        ease: 'easeOut' 
      });
      const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, value, count, rounded, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="glass rounded-2xl p-6 text-center cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="font-mono text-3xl font-bold text-foreground mb-1">
        {displayValue}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export const BotSection = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="section-container relative z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">KI-Powered</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Der Bot, der
              <span className="text-gradient-primary"> niemals schläft.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Während du schläfst, arbeitet unser KI-Trading Bot für dich.
            </p>

            {/* Compact Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: TrendingUp, text: '+14.2% Rendite' },
                { icon: Shield, text: 'Risikomanagement' },
                { icon: Clock, text: '24/7 aktiv' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5"
                >
                  <item.icon className="w-3 h-3 text-primary" />
                  <span className="text-xs text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <Link to="/bot">
              <Button variant="hero" size="default" className="group text-sm">
                Bot kennenlernen
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Compact Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Bot Performance
                </h3>
                <p className="text-xs text-muted-foreground">Nov 17 - Feb 4</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 font-medium">Aktiv</span>
              </div>
            </div>

            <TradingChart />

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="font-mono text-sm font-bold text-foreground">73%</div>
                <div className="text-[10px] text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-sm font-bold text-foreground">-10%</div>
                <div className="text-[10px] text-muted-foreground">Max DD</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-sm font-bold text-primary">+14.2%</div>
                <div className="text-[10px] text-muted-foreground">Rendite</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

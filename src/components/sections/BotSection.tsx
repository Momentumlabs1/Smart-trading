import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Clock, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const botFeatures = [
  { icon: Clock, label: '24/7 Aktiv', description: 'Arbeitet auch wenn du schläfst' },
  { icon: Cpu, label: 'KI-gesteuert', description: 'Lernt und verbessert sich kontinuierlich' },
  { icon: Shield, label: 'Risikomanagement', description: 'Automatische Stop-Loss Absicherung' },
];

export const BotSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-6">
              🤖 Trading Bot
            </span>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Deine KI.
              <br />
              <span className="text-gradient-primary">Dein Edge.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Während du lernst, arbeitet der Bot. Emotionslos, diszipliniert, 24 Stunden am Tag.
              <span className="text-foreground font-semibold"> 800%+ Rendite</span> in den letzten 2 Jahren.
            </p>

            <div className="space-y-4 mb-10">
              {botFeatures.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{feature.label}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/bot">
                <Button variant="hero" size="lg" className="group">
                  Mehr über den Bot
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/academy">
                <Button variant="glass" size="lg">
                  Im Academy inkludiert
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Chart Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              {/* Mock Chart */}
              <div className="aspect-[4/3] relative">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={`h-${i}`}
                      x1="0"
                      y1={60 * i + 30}
                      x2="400"
                      y2={60 * i + 30}
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.05"
                    />
                  ))}
                  
                  {/* Performance Line */}
                  <motion.path
                    d="M 0 250 Q 50 240, 80 220 T 150 180 T 220 120 T 280 100 T 350 40 L 400 20"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                  
                  {/* Area Fill */}
                  <motion.path
                    d="M 0 250 Q 50 240, 80 220 T 150 180 T 220 120 T 280 100 T 350 40 L 400 20 L 400 300 L 0 300 Z"
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Performance Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                  className="absolute top-4 right-4 glass rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="font-mono text-xl font-bold text-accent">+847%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">2 Jahre Rendite</div>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -bottom-6 -left-6 glass rounded-2xl px-6 py-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-sm text-muted-foreground">Aktive Trades</div>
              <div className="font-mono text-2xl font-bold text-foreground">12</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, TrendingUp, Crown, Check, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Grundlagen',
    subtitle: 'Woche 1-2',
    headline: 'Das Fundament legen',
    description: 'Du verstehst die Märkte, lernst Chartanalyse und baust ein solides Risk Management auf.',
    skills: ['Candlestick Patterns', 'Support & Resistance', 'Risk/Reward Ratio', 'Marktstruktur'],
    outcome: 'Du verstehst, warum 90% der Trader scheitern — und wie du es nicht tust.',
  },
  {
    id: 2,
    icon: Target,
    title: 'Strategie',
    subtitle: 'Woche 3-6',
    headline: 'Dein System entwickeln',
    description: 'Du entwickelst eine klare, regelbasierte Trading-Strategie die zu deinem Lifestyle passt.',
    skills: ['Entry & Exit Rules', 'Position Sizing', 'Trading Plan', 'Backtesting'],
    outcome: 'Du hast einen klaren Plan, den du konsequent umsetzen kannst.',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Praxis',
    subtitle: 'Woche 7-12',
    headline: 'Live Trading starten',
    description: 'Du setzt alles um — erst im Demo, dann mit echtem Kapital. Unterstützt von unserem KI-Bot.',
    skills: ['Live Trading', 'Bot Integration', 'Trade Journal', 'Psychologie'],
    outcome: 'Du machst deine ersten profitablen Trades und baust Konsistenz auf.',
  },
  {
    id: 4,
    icon: Crown,
    title: 'Meisterschaft',
    subtitle: 'Ab Woche 13',
    headline: 'Skalieren & Optimieren',
    description: 'Du optimierst deine Strategie, skalierst dein Kapital und baust langfristigen Wohlstand auf.',
    skills: ['Advanced Strategies', 'Portfolio Skalierung', 'Mentorship', 'Compounding'],
    outcome: 'Trading wird zu deinem Skill für finanzielle Freiheit.',
  },
];

export const JourneySection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance through stages
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStageClick = (index: number) => {
    setActiveStage(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <motion.div
          className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.15), transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">12 Wochen Transformation</span>
          </motion.div>
          
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Von <span className="text-gradient-primary">Null</span> auf
            <br />
            <span className="relative inline-block">
              profitabel
              <motion.svg
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.path
                  d="M 0 6 Q 50 0, 100 6 Q 150 12, 200 6"
                  fill="none"
                  stroke="hsl(45 93% 58%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.svg>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Der bewährte Fahrplan, der aus kompletten Anfängern konstant profitable Trader macht.
          </p>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
            
            {/* Left Column - Stage Selector */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === activeStage;
                const isPast = index < activeStage;

                return (
                  <motion.button
                    key={stage.id}
                    onClick={() => handleStageClick(index)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'glass border border-primary/30' 
                        : 'hover:bg-muted/30'
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                  >
                    {/* Active indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 rounded-full"
                      />
                    )}

                    {/* Progress bar for active stage */}
                    {isActive && isAutoPlaying && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-primary/40"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                        key={`progress-${activeStage}`}
                      />
                    )}

                    <div className="flex items-center gap-4">
                      {/* Step Number/Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(45_93%_58%/0.3)]' 
                          : isPast 
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {isPast ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold transition-colors ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {stage.subtitle}
                          </span>
                        </div>
                        <h3 className={`font-display text-lg font-bold truncate transition-colors ${
                          isActive ? 'text-foreground' : 'text-foreground/70'
                        }`}>
                          {stage.title}
                        </h3>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className={`w-5 h-5 shrink-0 transition-all ${
                        isActive 
                          ? 'text-primary translate-x-0' 
                          : 'text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Right Column - Stage Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />

                <div className="relative">
                  {/* Stage Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0"
                    >
                      {(() => {
                        const Icon = stages[activeStage].icon;
                        return <Icon className="w-8 h-8 text-primary" />;
                      })()}
                    </motion.div>
                    <div>
                      <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Phase {activeStage + 1} — {stages[activeStage].subtitle}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
                        {stages[activeStage].headline}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {stages[activeStage].description}
                  </p>

                  {/* Skills Grid */}
                  <div className="mb-8">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider mb-4 block">
                      Was du lernst
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {stages[activeStage].skills.map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          className="flex items-center gap-3 glass rounded-xl px-4 py-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-foreground text-sm font-medium">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-primary/10 border border-primary/20 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-primary font-semibold uppercase tracking-wider">Ergebnis</span>
                        <p className="text-foreground font-medium mt-1">
                          {stages[activeStage].outcome}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 md:mt-16"
          >
            <Link to="/quiz">
              <Button variant="hero" size="xl" className="group">
                Starte deine Transformation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Mache den kostenlosen Trader-Test und finde heraus, wo du startest.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
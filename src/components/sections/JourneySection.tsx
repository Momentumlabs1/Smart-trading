import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, TrendingUp, Crown, Check, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
const stages = [{
  id: 1,
  icon: BookOpen,
  title: 'Grundlagen',
  subtitle: 'Woche 1-2',
  headline: 'Das Fundament legen',
  description: 'Du verstehst die Märkte, lernst Chartanalyse und baust ein solides Risk Management auf.',
  skills: ['Candlestick Patterns', 'Support & Resistance', 'Risk/Reward', 'Marktstruktur'],
  outcome: 'Du verstehst, warum 90% der Trader scheitern.'
}, {
  id: 2,
  icon: Target,
  title: 'Strategie',
  subtitle: 'Woche 3-6',
  headline: 'Dein System entwickeln',
  description: 'Du entwickelst eine klare, regelbasierte Trading-Strategie.',
  skills: ['Entry & Exit Rules', 'Position Sizing', 'Trading Plan', 'Backtesting'],
  outcome: 'Du hast einen klaren Plan zum Umsetzen.'
}, {
  id: 3,
  icon: TrendingUp,
  title: 'Praxis',
  subtitle: 'Woche 7-12',
  headline: 'Live Trading starten',
  description: 'Du setzt alles um — erst im Demo, dann mit echtem Kapital.',
  skills: ['Live Trading', 'Bot Integration', 'Trade Journal', 'Psychologie'],
  outcome: 'Deine ersten profitablen Trades.'
}, {
  id: 4,
  icon: Crown,
  title: 'Meisterschaft',
  subtitle: 'Ab Woche 13',
  headline: 'Skalieren & Optimieren',
  description: 'Du optimierst und skalierst für langfristigen Erfolg.',
  skills: ['Advanced Strategies', 'Skalierung', 'Mentorship', 'Compounding'],
  outcome: 'Trading als Skill für Freiheit.'
}];

// Stage type
type Stage = typeof stages[number];

// Mobile Slideshow Component
const MobileSlideshow = ({
  stages,
  activeStage,
  setActiveStage,
  isAutoPlaying,
  setIsAutoPlaying
}: {
  stages: Stage[];
  activeStage: number;
  setActiveStage: (index: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (value: boolean) => void;
}) => {
  const currentStage = stages[activeStage];
  const Icon = currentStage.icon;
  const handleDotClick = (index: number) => {
    setActiveStage(index);
    setIsAutoPlaying(false);
  };
  const handleSwipe = (direction: number) => {
    const newIndex = activeStage + direction;
    if (newIndex >= 0 && newIndex < stages.length) {
      setActiveStage(newIndex);
      setIsAutoPlaying(false);
    }
  };
  return <div className="relative">
      {/* Progress Bar */}
      <div className="flex gap-1.5 mb-6">
        {stages.map((_, index) => <button key={index} onClick={() => handleDotClick(index)} className="flex-1 h-1 rounded-full overflow-hidden bg-muted/50 relative" aria-label={`Go to phase ${index + 1}`}>
            {index < activeStage && <div className="absolute inset-0 bg-primary" />}
            {index === activeStage && isAutoPlaying && <motion.div className="absolute inset-0 bg-primary origin-left" initial={{
          scaleX: 0
        }} animate={{
          scaleX: 1
        }} transition={{
          duration: 5,
          ease: 'linear'
        }} key={`progress-${activeStage}`} />}
            {index === activeStage && !isAutoPlaying && <div className="absolute inset-0 bg-primary" />}
          </button>)}
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary font-semibold text-xs uppercase tracking-wider">
          Phase {activeStage + 1} von {stages.length}
        </span>
        <span className="text-muted-foreground text-xs">
          {currentStage.subtitle}
        </span>
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeStage} initial={{
        opacity: 0,
        x: 50
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: -50
      }} transition={{
        duration: 0.3
      }} drag="x" dragConstraints={{
        left: 0,
        right: 0
      }} dragElastic={0.2} onDragEnd={(_, info) => {
        if (info.offset.x < -50) handleSwipe(1);
        if (info.offset.x > 50) handleSwipe(-1);
      }} className="glass rounded-2xl p-5 relative overflow-hidden min-h-[320px] touch-pan-y">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {currentStage.headline}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {currentStage.description}
            </p>

            {/* Skills */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {currentStage.skills.map((skill, i) => <motion.div key={skill} initial={{
              opacity: 0,
              x: 10
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: i * 0.05
            }} className="flex items-center gap-2 text-xs">
                  <Check className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-foreground">{skill}</span>
                </motion.div>)}
            </div>

            {/* Outcome */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                <p className="text-foreground text-xs font-medium">{currentStage.outcome}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots (alternative) */}
      <div className="flex justify-center gap-2 mt-4">
        {stages.map((_, index) => <button key={index} onClick={() => handleDotClick(index)} className={`h-2 rounded-full transition-all duration-300 ${index === activeStage ? 'w-6 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/50'}`} aria-label={`Go to phase ${index + 1}`} />)}
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Wische zum Blättern
      </p>
    </div>;
};
export const JourneySection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, {
    amount: 0.2,
    once: false
  });

  // Auto-advance through stages (desktop only)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  const handleStageClick = (index: number) => {
    setActiveStage(index);
    setIsAutoPlaying(false);
  };
  return <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background Effects - simplified on mobile */}
      <div className="absolute inset-0">
        
        <motion.div className="absolute top-1/4 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full opacity-10 sm:opacity-20 hidden sm:block" style={{
        background: 'radial-gradient(circle, hsl(45 93% 58% / 0.15), transparent 70%)'
      }} animate={{
        x: [0, 50, 0],
        y: [0, -30, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut'
      }} />
      </div>

      <div className="section-container relative z-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: isSectionInView ? 1 : 0,
        y: isSectionInView ? 0 : 30
      }} transition={{
        duration: 0.5
      }} className="text-center mb-10 sm:mb-16 md:mb-20">
          <motion.div animate={{
          opacity: isSectionInView ? 1 : 0,
          scale: isSectionInView ? 1 : 0.9
        }} className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">12 Wochen Transformation</span>
          </motion.div>
          
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight whitespace-nowrap">
            Von <span className="text-gradient-primary">Null</span> auf{' '}
            <span className="relative inline-block">
              <span className="text-gradient-primary">profitabel</span>
              <motion.svg viewBox="0 0 200 12" className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" initial={{
              pathLength: 0
            }} animate={{
              pathLength: isSectionInView ? 1 : 0
            }} transition={{
              delay: 0.5,
              duration: 0.8
            }}>
                <motion.path d="M 0 6 Q 50 0, 100 6 Q 150 12, 200 6" fill="none" stroke="hsl(45 93% 58%)" strokeWidth="3" strokeLinecap="round" initial={{
                pathLength: 0
              }} animate={{
                pathLength: isSectionInView ? 1 : 0
              }} transition={{
                delay: 0.5,
                duration: 0.8
              }} />
              </motion.svg>
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Der bewährte Fahrplan, der aus Anfängern profitable Trader macht.
          </p>
        </motion.div>

        {/* Mobile Layout - Slideshow */}
        <div className="lg:hidden">
          <MobileSlideshow stages={stages} activeStage={activeStage} setActiveStage={setActiveStage} isAutoPlaying={isAutoPlaying} setIsAutoPlaying={setIsAutoPlaying} />
        </div>

        {/* Desktop Layout - Two Column */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
            {/* Left Column - Stage Selector */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: isSectionInView ? 1 : 0,
            x: isSectionInView ? 0 : -30
          }} className="space-y-3">
              {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeStage;
              const isPast = index < activeStage;
              return <motion.button key={stage.id} onClick={() => handleStageClick(index)} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${isActive ? 'glass border border-primary/30' : 'hover:bg-muted/30'}`} whileHover={{
                x: isActive ? 0 : 4
              }}>
                    {isActive && <motion.div layoutId="activeIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 rounded-full" />}

                    {isActive && isAutoPlaying && <motion.div className="absolute bottom-0 left-0 h-0.5 bg-primary/40" initial={{
                  width: '0%'
                }} animate={{
                  width: '100%'
                }} transition={{
                  duration: 5,
                  ease: 'linear'
                }} key={`progress-${activeStage}`} />}

                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(45_93%_58%/0.3)]' : isPast ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                          {stage.subtitle}
                        </span>
                        <h3 className={`font-display text-lg font-bold truncate transition-colors ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                          {stage.title}
                        </h3>
                      </div>

                      <ChevronRight className={`w-5 h-5 shrink-0 transition-all ${isActive ? 'text-primary translate-x-0' : 'text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </div>
                  </motion.button>;
            })}
            </motion.div>

            {/* Right Column - Stage Details */}
            <AnimatePresence mode="wait">
              <motion.div key={activeStage} initial={{
              opacity: 0,
              y: 20,
              scale: 0.98
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} exit={{
              opacity: 0,
              y: -20,
              scale: 0.98
            }} transition={{
              duration: 0.4,
              ease: 'easeOut'
            }} className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div initial={{
                    scale: 0.8,
                    rotate: -10
                  }} animate={{
                    scale: 1,
                    rotate: 0
                  }} transition={{
                    delay: 0.1,
                    type: 'spring'
                  }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
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

                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {stages[activeStage].description}
                  </p>

                  <div className="mb-8">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider mb-4 block">
                      Was du lernst
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {stages[activeStage].skills.map((skill, i) => <motion.div key={skill} initial={{
                      opacity: 0,
                      x: 20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 0.15 + i * 0.05
                    }} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-foreground text-sm font-medium">{skill}</span>
                        </motion.div>)}
                    </div>
                  </div>

                  <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.4
                }} className="bg-primary/10 border border-primary/20 rounded-xl p-4">
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
        </div>

        {/* CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: isSectionInView ? 1 : 0,
        y: isSectionInView ? 0 : 20
      }} className="text-center mt-10 sm:mt-12 md:mt-16">
          <Link to="/quiz">
            <Button variant="hero" size="lg" className="w-full sm:w-auto group">
              Starte deine Transformation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            Mache den kostenlosen Trader-Test.
          </p>
        </motion.div>
      </div>
    </section>;
};
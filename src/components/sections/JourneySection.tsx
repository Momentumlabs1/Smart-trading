import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, TrendingUp, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Grundlagen',
    subtitle: 'Woche 1-2',
    description: 'Du lernst die Basics: Märkte verstehen, Chartanalyse, Risikomanagement. Das Fundament für alles Weitere.',
    skills: ['Candlestick Patterns', 'Support & Resistance', 'Risk/Reward Ratio'],
    color: 'from-primary/20 to-primary/5',
  },
  {
    id: 2,
    icon: Target,
    title: 'Strategie',
    subtitle: 'Woche 3-6',
    description: 'Du entwickelst deine persönliche Trading-Strategie basierend auf bewährten Methoden.',
    skills: ['Entry & Exit Rules', 'Position Sizing', 'Trading Plan'],
    color: 'from-primary/30 to-primary/10',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Praxis',
    subtitle: 'Woche 7-12',
    description: 'Du wendest alles an - erst im Demo, dann mit echtem Kapital. Mit Bot-Unterstützung.',
    skills: ['Live Trading', 'Bot Integration', 'Journal Analyse'],
    color: 'from-primary/40 to-primary/15',
  },
  {
    id: 4,
    icon: Crown,
    title: 'Meisterschaft',
    subtitle: 'Ab Woche 13',
    description: 'Du optimierst kontinuierlich und skalierst deine Ergebnisse. Der Weg zur Konsistenz.',
    skills: ['Advanced Strategies', 'Skalierung', 'Mentorship'],
    color: 'from-primary/50 to-primary/20',
  },
];

export const JourneySection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Dein Weg
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Von Null auf
            <br />
            <span className="text-gradient-primary">profitabel.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ein klarer Fahrplan, der funktioniert. Schritt für Schritt zur Konsistenz.
          </p>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="max-w-5xl mx-auto">
          {/* Progress Line - Desktop */}
          <div className="hidden md:block relative mb-12">
            <div className="h-1 bg-muted rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full">
              {stages.map((stage, index) => (
                <motion.button
                  key={stage.id}
                  onClick={() => setActiveStage(index)}
                  onMouseEnter={() => {
                    setActiveStage(index);
                    setIsHovering(true);
                  }}
                  onMouseLeave={() => setIsHovering(false)}
                  className="relative -mt-0.5"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index <= activeStage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    animate={{
                      boxShadow: index === activeStage 
                        ? '0 0 20px hsl(45 93% 58% / 0.5)' 
                        : '0 0 0 transparent'
                    }}
                  >
                    {index < activeStage ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </motion.div>
                  <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap transition-colors ${
                    index === activeStage ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}>
                    {stage.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stage Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-16 md:mt-24"
            >
              <div className={`glass rounded-3xl p-8 md:p-12 bg-gradient-to-br ${stages[activeStage].color}`}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left - Icon & Title */}
                  <div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6"
                    >
                      {(() => {
                        const Icon = stages[activeStage].icon;
                        return <Icon className="w-10 h-10 text-primary" />;
                      })()}
                    </motion.div>
                    
                    <span className="text-sm text-primary font-semibold">
                      {stages[activeStage].subtitle}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">
                      {stages[activeStage].title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {stages[activeStage].description}
                    </p>
                  </div>

                  {/* Right - Skills */}
                  <div>
                    <span className="text-sm text-muted-foreground mb-4 block">
                      Was du lernst:
                    </span>
                    <div className="space-y-3">
                      {stages[activeStage].skills.map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-foreground font-medium">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {stages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeStage ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/quiz">
              <Button variant="hero" size="xl" className="group">
                Starte deine Reise
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

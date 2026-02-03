import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizResult } from '@/lib/quiz-data';

const QuizResults = () => {
  const location = useLocation();
  const { result, contact } = location.state as { 
    result: QuizResult; 
    contact: { name: string; email: string; phone: string };
  } || {};

  // Redirect if no result
  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  const firstName = contact?.name?.split(' ')[0] || 'du';

  const programDetails = {
    free: {
      name: 'Smart Trading Free',
      description: 'Perfekt für deinen Start. Lerne die Grundlagen kostenlos.',
      features: ['Trading Grundlagen', 'Risk Management Basics', 'Demo-Zugang'],
      cta: 'Kostenlos starten',
      href: '/academy',
    },
    academy: {
      name: 'Smart Trading Academy',
      description: 'Komplette Ausbildung mit bewährten Strategien und Community.',
      features: [
        'Komplette Video-Ausbildung',
        'Bewährte Strategien',
        'Wöchentliche Q&A Sessions',
        'Community Zugang',
        'KI-Trading Bot inklusive',
      ],
      price: '€99/Monat',
      cta: 'Mehr erfahren',
      href: '/academy',
    },
    elite: {
      name: 'Elite Mentoring',
      description: '1:1 mit Saif, für fortgeschrittene Trader.',
      features: [
        'Persönliches 1:1 Mentoring',
        'Live Trading Sessions',
        'Direkte WhatsApp Betreuung',
        'Individuelle Strategie',
      ],
      note: 'Begrenzte Plätze, auf Anfrage.',
      cta: 'Mehr erfahren',
      href: '/elite',
    },
  };

  const primaryProgram = programDetails[result.recommendation.primary];
  const secondaryProgram = result.recommendation.secondary 
    ? programDetails[result.recommendation.secondary] 
    : null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hey {firstName},
          </h1>
          <p className="text-muted-foreground">hier ist deine Einschätzung.</p>
        </motion.div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="text-sm text-muted-foreground mb-2">Dein Level:</div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-primary mb-4">
            {result.levelLabel.toUpperCase()}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {result.description}
          </p>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Deine Stärken:
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((strength) => (
                <li key={strength} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Deine Baustellen:
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-muted-foreground">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-muted-foreground mb-6">Unsere Empfehlung für dich:</p>

          {/* Primary Recommendation */}
          <div className="glass rounded-2xl p-6 md:p-8 border border-primary/30 mb-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {primaryProgram.name.toUpperCase()}
            </h3>
            
            <ul className="space-y-2 mb-6">
              {primaryProgram.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {'price' in primaryProgram && (
              <p className="text-lg font-semibold text-foreground mb-6">
                {primaryProgram.price}
              </p>
            )}

            {'note' in primaryProgram && (
              <p className="text-sm text-muted-foreground mb-6">
                {primaryProgram.note}
              </p>
            )}

            <Link to={primaryProgram.href}>
              <Button variant="hero" size="lg" className="w-full group">
                {primaryProgram.cta}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Secondary Recommendation */}
          {secondaryProgram && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {secondaryProgram.name.toUpperCase()}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {secondaryProgram.description}
              </p>

              {'note' in secondaryProgram && secondaryProgram.note && (
                <p className="text-sm text-muted-foreground mb-4">
                  {secondaryProgram.note as string}
                </p>
              )}

              <Link to={secondaryProgram.href}>
                <Button variant="outline" size="default" className="group">
                  {secondaryProgram.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-8"
        >
          <p className="text-muted-foreground mb-4">Fragen?</p>
          <Link to="/contact">
            <Button variant="ghost" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Erstgespräch buchen
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResults;

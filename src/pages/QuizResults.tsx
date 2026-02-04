import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Lock, Bot, GraduationCap, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizResult } from '@/lib/quiz-data';

// Product data with fit levels
const products = {
  free: {
    id: 'free',
    name: 'Smart Trading Free',
    tagline: 'Dein Einstieg ins Trading',
    price: '€0',
    priceNote: 'Für immer kostenlos',
    icon: GraduationCap,
    features: [
      'Trading Grundlagen (5 Lektionen)',
      'Risk Management Basics',
      'Demo-Zugang zum Bot',
      'Community Read-Only',
    ],
    cta: 'Kostenlos starten',
    href: '/free',
  },
  academy: {
    id: 'academy',
    name: 'Smart Trading Academy',
    tagline: 'Die komplette Ausbildung',
    price: '€99',
    priceNote: '/Monat',
    icon: Sparkles,
    features: [
      '78+ Video-Lektionen',
      'Alle Trading Strategien',
      'Wöchentliche Live Q&As',
      'Community mit Chat',
      'Trade Analyse Tool (KI)',
    ],
    cta: 'Academy beitreten',
    href: '/academy',
    popular: true,
  },
  bot: {
    id: 'bot',
    name: 'Smart Trading Bot',
    tagline: 'KI-gestütztes Trading',
    price: '$499',
    priceNote: 'Einmalig',
    icon: Bot,
    features: [
      'Automatisierte Trading-Signale',
      'KI Chart-Analyse via Telegram',
      'Screenshot-Analyse',
      '24/7 Marktüberwachung',
      'Setup-Benachrichtigungen',
    ],
    cta: 'Bot aktivieren',
    href: '/bot',
  },
  elite: {
    id: 'elite',
    name: 'Elite Mentoring',
    tagline: '1:1 mit Saif persönlich',
    price: '€1.950',
    priceNote: 'Einmalig',
    icon: Crown,
    features: [
      'Wöchentliche 1:1 Calls',
      'Live Trading Sessions',
      'Direkter WhatsApp Zugang',
      'Persönlicher Trading Plan',
      'Setup Reviews in 24h',
    ],
    cta: 'Jetzt bewerben',
    href: '/elite',
    exclusive: true,
  },
};

// Fit descriptions based on level
const getFitDescription = (
  productId: string,
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): { fit: 'perfect' | 'good' | 'optional' | 'notReady'; message: string } => {
  const fitMap: Record<string, Record<string, { fit: 'perfect' | 'good' | 'optional' | 'notReady'; message: string }>> = {
    free: {
      beginner: { fit: 'perfect', message: 'Perfekt für deinen Start — lerne die Grundlagen.' },
      intermediate: { fit: 'optional', message: 'Du hast die Basics bereits — aber auffrischen schadet nie.' },
      advanced: { fit: 'optional', message: 'Du bist darüber hinaus, aber kostenlos zum Nachschlagen.' },
      expert: { fit: 'optional', message: 'Für dein Level nicht relevant.' },
    },
    academy: {
      beginner: { fit: 'good', message: 'Der nächste Schritt nach den Basics — komplette Ausbildung.' },
      intermediate: { fit: 'perfect', message: 'Genau richtig für dich — bringe dein Trading auf das nächste Level.' },
      advanced: { fit: 'good', message: 'Festige dein Wissen mit unseren fortgeschrittenen Strategien.' },
      expert: { fit: 'optional', message: 'Du kennst vieles bereits, aber die Community könnte wertvoll sein.' },
    },
    bot: {
      beginner: { fit: 'good', message: 'Der Bot hilft dir, die Märkte zu verstehen und Signale zu erkennen.' },
      intermediate: { fit: 'perfect', message: 'Ideal für dich — automatisiere dein Trading mit KI.' },
      advanced: { fit: 'perfect', message: 'Perfekte Ergänzung — lass die KI für dich arbeiten.' },
      expert: { fit: 'good', message: 'Nutze den Bot als zusätzliches Tool in deinem Arsenal.' },
    },
    elite: {
      beginner: { fit: 'notReady', message: 'Du bist noch nicht bereit für Elite — starte erst mit den Basics.' },
      intermediate: { fit: 'notReady', message: 'Du brauchst noch mehr Erfahrung — Elite ist für Fortgeschrittene.' },
      advanced: { fit: 'good', message: 'Du könntest bald bereit sein — sammle noch etwas mehr Erfahrung.' },
      expert: { fit: 'perfect', message: 'Du bist bereit für das nächste Level — persönliches Mentoring mit Saif.' },
    },
  };

  return fitMap[productId]?.[level] || { fit: 'optional', message: '' };
};

const getFitBadge = (fit: 'perfect' | 'good' | 'optional' | 'notReady') => {
  switch (fit) {
    case 'perfect':
      return { text: 'Perfekt für dich', className: 'bg-primary/20 text-primary border-primary/30' };
    case 'good':
      return { text: 'Empfohlen', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
    case 'optional':
      return { text: 'Optional', className: 'bg-muted text-muted-foreground border-border' };
    case 'notReady':
      return { text: 'Noch nicht bereit', className: 'bg-muted text-muted-foreground border-border' };
  }
};

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
  
  // Map quiz level to our level system
  const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
    expert: 'expert',
  };
  const userLevel = levelMap[result.level] || 'beginner';

  // Order products by fit for this user
  const productOrder = ['free', 'academy', 'bot', 'elite'] as const;
  const orderedProducts = productOrder.map((id) => ({
    ...products[id],
    ...getFitDescription(id, userLevel),
  }));

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hey {firstName}, hier ist dein Ergebnis
          </h1>
          <p className="text-muted-foreground">Basierend auf deinen Antworten haben wir dein Trading-Level analysiert.</p>
        </motion.div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8 mb-10 text-center"
        >
          <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Dein Trading-Level</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-primary mb-4">
            {result.levelLabel}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {result.description}
          </p>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Deine Stärken
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((strength) => (
                <li key={strength} className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Deine Baustellen
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="w-4 h-4 flex items-center justify-center text-muted-foreground shrink-0">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Wähle deinen Weg zum Trading-Erfolg
            </h2>
            <p className="text-muted-foreground text-sm">
              Basierend auf deinem Level haben wir die passenden Optionen für dich.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {orderedProducts.map((product, index) => {
              const Icon = product.icon;
              const badge = getFitBadge(product.fit);
              const isNotReady = product.fit === 'notReady';
              const isPerfect = product.fit === 'perfect';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`glass rounded-2xl p-6 relative ${
                    isPerfect ? 'border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.1)]' : ''
                  } ${isNotReady ? 'opacity-60' : ''}`}
                >
                  {/* Fit Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${badge.className}`}>
                    {isNotReady && <Lock className="w-3 h-3" />}
                    {badge.text}
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isPerfect ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${isPerfect ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="font-display text-2xl font-bold text-foreground">{product.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{product.priceNote}</span>
                  </div>

                  {/* Fit Message */}
                  <p className={`text-sm mb-4 ${isPerfect ? 'text-primary' : 'text-muted-foreground'}`}>
                    {product.message}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Check className={`w-4 h-4 shrink-0 ${isPerfect ? 'text-primary' : 'text-muted-foreground'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={isNotReady ? '#' : product.href} className={isNotReady ? 'pointer-events-none' : ''}>
                    <Button 
                      variant={isPerfect ? 'hero' : 'outline'} 
                      size="default" 
                      className="w-full group"
                      disabled={isNotReady}
                    >
                      {isNotReady ? 'Noch nicht verfügbar' : product.cta}
                      {!isNotReady && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-12"
        >
          <p className="text-muted-foreground mb-4">Unsicher welches Programm passt?</p>
          <Link to="/contact">
            <Button variant="ghost" className="gap-2">
              Kostenlos beraten lassen
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResults;
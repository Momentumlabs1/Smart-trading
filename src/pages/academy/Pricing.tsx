import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, X, Sparkles, Crown, Zap, ArrowRight, Star,
  Video, MessageSquare, Users, Bot, Phone, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const tiers = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    price: '0',
    period: '',
    description: 'Perfekt zum Einstieg ins Trading',
    features: [
      { text: '7 Basis-Video-Kurse', included: true },
      { text: 'Telegram Bot (10 Anfragen/Tag)', included: true },
      { text: 'Community (nur lesen)', included: true },
      { text: 'Trading Grundlagen', included: true },
      { text: 'Premium Kurse', included: false },
      { text: 'Live Trading Calls', included: false },
      { text: '1:1 Mentoring', included: false },
    ],
    cta: 'Kostenlos starten',
    popular: false,
    gradient: 'from-muted to-muted/50',
  },
  {
    id: 'academy',
    name: 'Academy',
    icon: Sparkles,
    price: '99',
    period: '/Monat',
    description: 'Vollständiger Zugang zur Academy',
    features: [
      { text: '50+ Premium Video-Kurse', included: true },
      { text: 'Unbegrenzter Telegram Bot', included: true },
      { text: 'Voller Community-Zugang', included: true },
      { text: 'Wöchentliche Live Calls', included: true },
      { text: 'Saif\'s Trading Livestreams', included: true },
      { text: 'Exklusive Strategien', included: true },
      { text: '1:1 Mentoring', included: false },
    ],
    cta: 'Academy beitreten',
    popular: true,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    id: 'elite',
    name: 'Elite',
    icon: Crown,
    price: '1.950',
    period: '',
    description: '1:1 Mentoring mit Saif',
    features: [
      { text: 'Alles aus Academy', included: true },
      { text: '1:1 Mentoring (2x/Woche)', included: true },
      { text: 'Direkte WhatsApp-Nummer', included: true },
      { text: 'Office-Besuch (1x/Quartal)', included: true },
      { text: 'Trading Bot Premium', included: true },
      { text: 'Prioritäts-Support', included: true },
      { text: 'Lifetime Zugang', included: true },
    ],
    cta: 'Elite werden',
    popular: false,
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
];

const comparison = [
  { feature: 'Video-Kurse', starter: '7 Basis', academy: '50+ Premium', elite: 'Alle + Exklusiv' },
  { feature: 'Telegram Bot', starter: '10/Tag', academy: 'Unbegrenzt', elite: 'Unbegrenzt + Priority' },
  { feature: 'Community', starter: 'Nur lesen', academy: 'Voller Zugang', elite: 'VIP Bereich' },
  { feature: 'Live Calls', starter: '-', academy: 'Wöchentlich', elite: '2x Wöchentlich + 1:1' },
  { feature: 'Mentoring', starter: '-', academy: 'Gruppen Q&A', elite: '1:1 mit Saif' },
  { feature: 'Trading Bot', starter: '-', academy: 'Standard', elite: 'Premium + Setup' },
  { feature: 'Support', starter: 'Community', academy: 'Email + Chat', elite: 'WhatsApp direkt' },
];

export default function Pricing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (tierId: string) => {
    if (!user) {
      navigate('/academy/register');
      return;
    }
    // TODO: Integrate Stripe checkout
    console.log('Selected plan:', tierId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/academy" className="font-bold text-xl">
            SmartTrading <span className="text-primary">Academy</span>
          </Link>
          {user ? (
            <Link to="/academy/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/academy/login">
              <Button variant="ghost">Anmelden</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Wähle deinen Weg zum Erfolg</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Investiere in deine{' '}
            <span className="text-gradient-primary">Trading-Zukunft</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Von Anfänger bis Profi – wir haben den richtigen Plan für dich.
            Starte kostenlos oder werde Teil unserer exklusiven Elite-Community.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const isCurrentPlan = profile?.tier === tier.id;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    "relative rounded-2xl p-8 border transition-all duration-300",
                    tier.popular
                      ? "border-primary bg-gradient-to-b from-primary/10 to-transparent scale-105 z-10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Beliebt
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      tier.popular ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">€{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className={cn(
                          "text-sm",
                          !feature.included && "text-muted-foreground"
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(tier.id)}
                    disabled={isCurrentPlan}
                    className={cn(
                      "w-full gap-2",
                      tier.popular && "glow-primary"
                    )}
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {isCurrentPlan ? 'Aktueller Plan' : tier.cta}
                    {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Vergleiche die Pläne</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Starter</th>
                  <th className="text-center py-4 px-4 font-medium text-primary">Academy</th>
                  <th className="text-center py-4 px-4 font-medium">Elite</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{row.starter}</td>
                    <td className="py-4 px-4 text-center text-primary font-medium">{row.academy}</td>
                    <td className="py-4 px-4 text-center font-medium">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit durchzustarten?</h2>
          <p className="text-muted-foreground mb-8">
            Starte noch heute kostenlos und erlebe, was professionelles Trading-Wissen bewirken kann.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/academy/register">
              <Button size="lg" className="gap-2">
                Kostenlos registrieren
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/academy/login">
              <Button size="lg" variant="outline">
                Bereits Mitglied? Anmelden
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

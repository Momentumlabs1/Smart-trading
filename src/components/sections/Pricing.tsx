import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingTiers = [
  {
    name: 'Free',
    description: 'Perfekt zum Reinschnuppern',
    price: '€0',
    period: 'für immer',
    features: [
      'Trading Basics Modul (5 Lektionen)',
      'Risk Management Fundamentals',
      'Telegram Bot Zugang (Basic)',
      'Community Read-Only',
      'Wöchentlicher Newsletter',
    ],
    cta: 'Kostenlos starten',
    href: '/free',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Academy',
    description: 'Für ambitionierte Trader',
    price: '€99',
    period: '/Monat',
    yearlyPrice: '€799/Jahr (2 Monate gratis)',
    features: [
      'Alles aus Free, plus:',
      'Komplette Video Academy (78+ Lektionen)',
      'Alle Trading Strategien',
      'Trading Bot INKLUSIVE',
      'Live Community mit Chat',
      'Wöchentliche Q&A Sessions',
      'Trade Analyse Tool (KI)',
      'Telegram Bot (Advanced)',
    ],
    cta: 'Academy beitreten',
    href: '/academy',
    variant: 'hero' as const,
    popular: true,
  },
  {
    name: 'Elite',
    description: 'Nur für Bewerbungen',
    price: 'Auf Anfrage',
    period: '',
    features: [
      'Alles aus Academy, plus:',
      '1:1 Calls mit Saif (wöchentlich)',
      'Live Trading Sessions',
      'Direkter WhatsApp/Telegram Zugang',
      'Office Besuch in Linz möglich',
      'Persönlicher Trading Plan',
      'Setup Reviews in 24h',
      'Graduation zu Partner-Programm',
    ],
    cta: 'Jetzt bewerben',
    href: '/elite',
    variant: 'secondaryPurple' as const,
    popular: false,
    exclusive: true,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-6">
            Mitgliedschaft
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wähle deinen Weg
            <br />
            <span className="text-gradient-primary">zum Trading-Erfolg</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Egal ob du gerade anfängst oder das nächste Level erreichen willst — 
            wir haben das passende Programm für dich.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${tier.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Beliebteste Wahl
                  </div>
                </div>
              )}

              <div
                className={`glass rounded-3xl p-8 h-full flex flex-col ${
                  tier.popular
                    ? 'border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.15)]'
                    : tier.exclusive
                    ? 'border-secondary/30 shadow-[0_0_40px_hsl(var(--secondary)/0.1)]'
                    : ''
                }`}
              >
                {/* Header */}
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-muted-foreground">{tier.period}</span>
                    )}
                  </div>
                  {tier.yearlyPrice && (
                    <p className="text-sm text-primary mt-2">{tier.yearlyPrice}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={tier.href}>
                  <Button variant={tier.variant} size="lg" className="w-full group">
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

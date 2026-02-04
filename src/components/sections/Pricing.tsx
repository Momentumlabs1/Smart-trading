import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
      'Trading Basics (5 Lektionen)',
      'Risk Management Basics',
      'Telegram Bot (Basic)',
      'Community Read-Only',
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
      '78+ Video Lektionen',
      'Trading Bot INKLUSIVE',
      'Live Community',
      'Wöchentliche Q&As',
      'KI Trade Analyse',
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
      '1:1 Calls mit Saif',
      'Live Trading Sessions',
      'WhatsApp Zugang',
      'Setup Reviews in 24h',
    ],
    cta: 'Jetzt bewerben',
    href: '/elite',
    variant: 'outline' as const,
    popular: false,
    exclusive: true,
  },
];

// Pricing Card with scroll animation
const PricingCard = ({ tier, index }: { tier: typeof pricingTiers[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 30,
        scale: isInView ? 1 : 0.95,
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative ${tier.popular ? 'sm:-mt-2 sm:mb-2 lg:-mt-4 lg:mb-4' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Beliebteste Wahl
          </div>
        </div>
      )}

      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 h-full flex flex-col ${
          tier.popular
            ? 'border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)]'
            : tier.exclusive
            ? 'border-secondary/30'
            : ''
        }`}
      >
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
            {tier.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {tier.price}
            </span>
            {tier.period && (
              <span className="text-sm text-muted-foreground">{tier.period}</span>
            )}
          </div>
          {tier.yearlyPrice && (
            <p className="text-xs sm:text-sm text-primary mt-1 sm:mt-2">{tier.yearlyPrice}</p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
          {tier.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to={tier.href}>
          <Button variant={tier.variant} size="default" className="w-full group text-sm sm:text-base">
            {tier.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export const Pricing = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { amount: 0.3, once: false });

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="section-container relative z-10 px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHeaderInView ? 1 : 0,
            y: isHeaderInView ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block glass rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            Mitgliedschaft
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Wähle deinen Weg
            <br />
            <span className="text-gradient-primary">zum Trading-Erfolg</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Egal ob du gerade anfängst oder das nächste Level willst — 
            wir haben das passende Programm.
          </p>
        </motion.div>

        {/* Pricing Cards - Swipeable on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bot, MessageSquare, TrendingUp, Clock, Zap, ArrowRight,
  ArrowLeft, ExternalLink, Crown, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: TrendingUp,
    title: 'Chart-Analyse',
    description: 'Sende dem Bot ein Chart-Bild und erhalte sofort eine professionelle Analyse.',
  },
  {
    icon: MessageSquare,
    title: 'Trading-Fragen',
    description: 'Stelle Fragen zu Strategien, Indikatoren und Marktbewegungen.',
  },
  {
    icon: Clock,
    title: '24/7 Verfügbar',
    description: 'Der Bot ist rund um die Uhr für dich da - auch am Wochenende.',
  },
  {
    icon: Zap,
    title: 'Instant Antworten',
    description: 'Erhalte innerhalb von Sekunden fundierte Antworten auf deine Fragen.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Öffne Telegram',
    description: 'Lade die Telegram App herunter oder öffne sie in deinem Browser.',
  },
  {
    number: '02',
    title: 'Suche @smarttrading_bot',
    description: 'Suche nach dem offiziellen SmartTrading Bot in der Telegram-Suche.',
  },
  {
    number: '03',
    title: 'Klicke /start',
    description: 'Starte den Bot mit dem /start Befehl und verifiziere dein Konto.',
  },
  {
    number: '04',
    title: 'Beginne zu traden!',
    description: 'Sende Fragen oder Chart-Bilder und erhalte sofort Antworten.',
  },
];

export default function TelegramBot() {
  const { profile } = useAuth();
  
  const isStarter = profile?.tier === 'starter';
  const queriesUsed = profile?.telegram_queries_today || 0;
  const dailyLimit = isStarter ? 10 : Infinity;
  const queriesRemaining = Math.max(0, dailyLimit - queriesUsed);
  const usagePercentage = isStarter ? (queriesUsed / dailyLimit) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/academy/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </Link>
          <h1 className="font-bold text-lg">Telegram Trading Bot</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-8"
          >
            <Bot className="w-12 h-12 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Dein AI{' '}
            <span className="text-gradient-primary">Trading-Assistent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Erhalte Chart-Analysen, beantworte Trading-Fragen und optimiere deine 
            Strategien - alles direkt in Telegram.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="https://t.me/smarttrading_bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                <Bot className="w-5 h-5" />
                Bot in Telegram öffnen
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Rate Limit Display for Starter */}
      {isStarter && (
        <section className="py-8 px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Tägliches Limit</h3>
                <span className="text-sm text-muted-foreground">
                  {queriesUsed} / {dailyLimit} Anfragen
                </span>
              </div>
              
              <Progress value={usagePercentage} className="h-3 mb-4" />
              
              {queriesRemaining > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Du hast noch <span className="text-primary font-medium">{queriesRemaining} Anfragen</span> heute übrig.
                </p>
              ) : (
                <p className="text-sm text-destructive">
                  Du hast dein tägliches Limit erreicht. Upgrade für unbegrenzte Anfragen!
                </p>
              )}

              <Link to="/academy/pricing" className="block mt-4">
                <Button variant="outline" className="w-full gap-2">
                  <Crown className="w-4 h-4" />
                  Upgrade auf Academy für unbegrenzte Anfragen
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Was kann der Bot?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Connect */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">So verbindest du dich</h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://t.me/smarttrading_bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Jetzt starten
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      {isStarter && (
        <section className="py-16 px-4 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-3xl mx-auto text-center">
            <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Hol dir unbegrenzten Zugang</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Als Academy Mitglied hast du unbegrenzten Zugang zum Trading Bot - 
              keine täglichen Limits mehr!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {['Unbegrenzte Anfragen', 'Prioritäts-Antworten', 'Premium Features'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/academy/pricing">
              <Button size="lg" className="gap-2">
                <Crown className="w-4 h-4" />
                Upgrade auf Academy
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

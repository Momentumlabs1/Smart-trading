import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bot, Download, Shield, TrendingUp, Zap, ArrowLeft,
  CheckCircle2, Copy, ExternalLink, Key, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { botService } from '@/lib/api';

interface BotLicense {
  id: string;
  license_key: string;
  status: string | null;
  activated_at: string | null;
  expires_at: string | null;
  download_count: number | null;
  strategy_type: string | null;
}

const features = [
  {
    icon: TrendingUp,
    title: 'Hedging Strategie',
    description: 'Profitiere in jeder Marktlage mit unserer bewährten Hedging-Strategie.',
  },
  {
    icon: Bot,
    title: 'Vollautomatisch',
    description: '24/7 Trading ohne manuellen Eingriff - der Bot arbeitet für dich.',
  },
  {
    icon: Shield,
    title: 'Risk-Management',
    description: 'Integriertes Risikomanagement schützt dein Kapital vor großen Verlusten.',
  },
  {
    icon: Zap,
    title: 'Schnelle Execution',
    description: 'Blitzschnelle Orderausführung für optimale Entry- und Exit-Punkte.',
  },
];

const stats = [
  { value: '72%', label: 'Win Rate' },
  { value: '2.4', label: 'Profit Factor' },
  { value: '12%', label: 'Max Drawdown' },
  { value: '847', label: 'Trades/Jahr' },
];

const faqs = [
  {
    q: 'Welche Broker werden unterstützt?',
    a: 'Der Bot läuft auf allen MT4/MT5 Brokern. Wir empfehlen ICMarkets oder Pepperstone.',
  },
  {
    q: 'Wie viel Startkapital brauche ich?',
    a: 'Wir empfehlen mindestens 1.000€ für optimale Ergebnisse. Der Bot funktioniert aber auch mit weniger.',
  },
  {
    q: 'Bekomme ich Support bei der Einrichtung?',
    a: 'Ja! Du erhältst eine ausführliche Anleitung und kannst uns bei Fragen jederzeit kontaktieren.',
  },
  {
    q: 'Gibt es eine Geld-zurück-Garantie?',
    a: 'Ja, wir bieten eine 14-tägige Geld-zurück-Garantie wenn du nicht zufrieden bist.',
  },
];

export default function BotDownload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<BotLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLicense, setShowLicense] = useState<string | null>(null);

  useEffect(() => {
    const loadLicenses = async () => {
      if (!user) return;
      
      try {
        const data = await botService.getUserBotLicenses(user.id);
        setLicenses(data as BotLicense[]);
      } catch (error) {
        console.error('Error loading licenses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLicenses();
  }, [user]);

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Kopiert!',
      description: 'Lizenz-Schlüssel wurde in die Zwischenablage kopiert.',
    });
  };

  const hasActiveLicense = licenses.some(l => l.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/academy/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </Link>
          <h1 className="font-bold text-lg">Trading Bot</h1>
        </div>
      </header>

      {/* If user has license - show download section first */}
      {hasActiveLicense && (
        <section className="py-12 px-4 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Du hast Zugang zum Trading Bot!</h2>
              <p className="text-muted-foreground mb-8">
                Lade den Bot herunter und starte mit dem automatischen Trading.
              </p>

              {/* License Keys */}
              <div className="space-y-4 mb-8">
                {licenses.filter(l => l.status === 'active').map((license) => (
                  <div key={license.id} className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Lizenz-Schlüssel:</span>
                      <button
                        onClick={() => setShowLicense(showLicense === license.id ? null : license.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        {showLicense === license.id ? 'Verstecken' : 'Anzeigen'}
                      </button>
                    </div>
                    
                    {showLicense === license.id && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={license.license_key}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyLicense(license.license_key)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-muted-foreground">
                        Strategie: {license.strategy_type || 'Hedging'}
                      </span>
                      <span className="text-muted-foreground">
                        Downloads: {license.download_count || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Download className="w-4 h-4" />
                  Bot herunterladen (MT4)
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Bot herunterladen (MT5)
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Benötigst du Hilfe bei der Installation?{' '}
                <a href="#" className="text-primary hover:underline">Setup-Anleitung</a>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto mb-8"
          >
            <Bot className="w-12 h-12 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Der SmartTrading{' '}
            <span className="text-gradient-primary">Expert Advisor</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Lass deinen Trading-Erfolg automatisieren. Unser professioneller EA 
            tradet für dich - 24 Stunden am Tag, 7 Tage die Woche.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Warum unser Trading Bot?</h2>
          
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

      {/* Pricing Card */}
      {!hasActiveLicense && (
        <section className="py-16 px-4">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 border-2 border-primary"
            >
              <div className="text-center mb-8">
                <p className="text-sm font-medium text-primary mb-2">EINMALZAHLUNG</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">€497</span>
                </div>
                <p className="text-muted-foreground mt-2">Lifetime Lizenz - keine monatlichen Kosten</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Hedging + Martingale Strategie',
                  'MT4 & MT5 kompatibel',
                  'Ausführliche Setup-Anleitung',
                  'Lebenslange Updates',
                  'Email Support',
                  '14 Tage Geld-zurück-Garantie',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full gap-2" size="lg">
                <Key className="w-4 h-4" />
                Jetzt kaufen
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Sichere Zahlung via Stripe • Sofortiger Download nach Zahlung
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

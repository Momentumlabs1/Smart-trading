import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Play, Bot, Users, Calendar, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import saifDesk from '@/assets/saif-desk.webp';

const features = [
  {
    icon: Play,
    title: '78+ Video Lektionen',
    description: 'Von Basics bis zu fortgeschrittenen Strategien. Strukturiert und verständlich.',
  },
  {
    icon: Bot,
    title: 'Trading Bot inklusive',
    description: 'Unser KI-Bot arbeitet 24/7 für dich. 800%+ Rendite in 2 Jahren.',
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Tausche dich mit 480+ gleichgesinnten Tradern aus.',
  },
  {
    icon: Calendar,
    title: 'Wöchentliche Live Calls',
    description: 'Jeden Donnerstag Q&A Session mit Saif. Stelle deine Fragen direkt.',
  },
];

const curriculum = [
  { module: '1', title: 'Trading Fundamentals', lessons: 12 },
  { module: '2', title: 'Technische Analyse', lessons: 18 },
  { module: '3', title: 'Risiko Management', lessons: 8 },
  { module: '4', title: 'Trading Psychologie', lessons: 10 },
  { module: '5', title: 'Strategien in der Praxis', lessons: 15 },
  { module: '6', title: 'Bot Setup & Automation', lessons: 8 },
  { module: '7', title: 'Advanced Setups', lessons: 7 },
];

const Academy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Beliebteste Wahl</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Smart Trading
              <br />
              <span className="text-gradient-primary">Academy</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Alles was du brauchst um konsistent profitabel zu traden. 
              Video-Kurse, Live-Calls, Community und Trading Bot — alles in einem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/quiz">
                <Button variant="hero" size="xl" className="group">
                  Jetzt Mitglied werden
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl">
                Kostenlose Preview
              </Button>
            </div>

            {/* Pricing */}
            <div className="glass rounded-2xl p-6 inline-block">
              <div className="flex items-baseline gap-2 justify-center">
                <span className="font-display text-4xl font-bold text-foreground">€99</span>
                <span className="text-muted-foreground">/Monat</span>
              </div>
              <p className="text-sm text-primary mt-2">oder €799/Jahr (2 Monate gratis)</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass glass-hover rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-gradient-mesh">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Das komplette Curriculum
            </h2>
            <p className="text-muted-foreground">78+ Lektionen in 7 Modulen</p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {curriculum.map((item, index) => (
              <motion.div
                key={item.module}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-primary">
                    {item.module}
                  </div>
                  <span className="font-semibold text-foreground">{item.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.lessons} Lektionen</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Saif Image Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl overflow-hidden"
            >
              <img 
                src={saifDesk} 
                alt="Saif Al-Nasiri beim Trading" 
                className="w-full h-[400px] md:h-[500px] object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Was du bekommst:
              </h3>

              <div className="space-y-4 mb-8">
                {[
                  { item: 'Video Academy (78+ Lektionen)', value: '€2.997' },
                  { item: 'Trading Bot Zugang', value: '€499/Monat' },
                  { item: 'Elite Community', value: '€49/Monat' },
                  { item: 'Wöchentliche Live Calls', value: '€199/Monat' },
                  { item: 'Trade Analyse Tool', value: '€99/Monat' },
                  { item: 'Telegram Bot Assistant', value: '€29/Monat' },
                ].map((item) => (
                  <div key={item.item} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent" />
                      <span className="text-foreground">{item.item}</span>
                    </div>
                    <span className="text-muted-foreground line-through">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Gesamtwert:</span>
                  <span className="text-muted-foreground line-through">€3.872</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Dein Preis:</span>
                  <span className="font-display text-3xl font-bold text-primary">€99/Monat</span>
                </div>
              </div>

              <Link to="/quiz" className="block mt-8">
                <Button variant="hero" size="xl" className="w-full group">
                  Jetzt Academy beitreten
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="text-center text-sm text-muted-foreground mt-4">
                30 Tage Geld-zurück-Garantie • Jederzeit kündbar
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academy;

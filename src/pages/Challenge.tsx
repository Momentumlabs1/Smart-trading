import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Clock, Gift, Users, TrendingUp, Shield, 
  Target, Brain, Compass, Play, Calendar, Monitor, 
  MapPin, CheckCircle2, XCircle, Sparkles, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChallengeRegistrationModal } from '@/components/challenge/ChallengeRegistrationModal';
import { challengeDays } from '@/lib/challenge-data';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Compass,
    title: 'Zeitlose Fähigkeit',
    description: 'Du lernst direkt am Chart alle Skills und Indikatoren, die dir bis an dein Lebensende finanzielle Sicherheit und Wohlstand ermöglichen.',
  },
  {
    icon: Shield,
    title: 'Fremdkapital: Trading ohne Risiko',
    description: 'Eigenes Geld einzusetzen bedeutet höheres Risiko, weniger Hebel & geringere Profite. Hier erfährst du im Detail, wie du dich für Fremdkapitalkonten qualifizierst.',
  },
  {
    icon: Target,
    title: 'Maximale Freiheit',
    description: 'Kein Chef, Büro oder 9-to-5 mehr, wenn du es nicht willst. Diese Fähigkeiten ermöglichen dir örtliche und zeitliche Unabhängigkeit.',
  },
  {
    icon: Brain,
    title: 'Mentale Stärke eines Profis',
    description: 'Entwickle die mentale Stärke, um frei von Angst & Gier zu traden – und die rational besten Entscheidungen zu treffen.',
  },
];

const faqs = [
  {
    icon: Calendar,
    title: 'Wann?',
    content: 'Die 5-Tages-Trader-Challenge startet für dich direkt nach der Anmeldung. Du kannst dir jeden Abend das nächste Video ansehen - mit nur 10-20 Minuten pro Video ist das garantiert möglich für dich. Du kannst dir aber auch einen Abend blockieren, und die gesamte Challenge am Stück schauen!',
  },
  {
    icon: Monitor,
    title: 'Wie?',
    content: 'Die Challenge ist 100 % online und besteht aus einem mehrteiligen Videokurs. Alles, was du brauchst, ist ein Laptop oder PC zum Videos schauen und die Bereitschaft, deine Trading-Skills gezielt aufzubauen.',
  },
  {
    icon: MapPin,
    title: 'Wo?',
    content: 'Nach deiner Anmeldung erhältst du Zugang zu unserer Lernplattform, wo alle Videos auf dich warten. Du kannst die Inhalte flexibel ansehen und sofort in der Praxis umsetzen.',
  },
];

export default function Challenge() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('challenge_email');
    if (email) {
      setIsRegistered(true);
    }
  }, []);

  const handleVideoClick = () => {
    if (isRegistered) {
      navigate('/challenge/player');
    } else {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false);
    setIsRegistered(true);
    navigate('/challenge/player');
  };

  const handleStartChallenge = () => {
    if (isRegistered) {
      navigate('/challenge/player');
    } else {
      setShowRegistrationModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl opacity-50" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">5 Tages Trader Challenge</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Über 4.000 ganz normale Menschen haben es geschafft:
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                Als Angestellter nebenbei ein <span className="text-foreground font-semibold">Vollzeit-Einkommen aufbauen</span> mit Trading - in nur 30 Minuten täglich
              </p>

              <p className="text-muted-foreground mb-8">
                Die kostenlose 5-Tage-Challenge <span className="text-primary">(Wert: 497€)</span> beweist dir: Auch mit nur 40% Gewinnquote ist das möglich
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">4.000+ Teilnehmer</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">100% Kostenlos</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Nur für kurze Zeit</span>
                </div>
              </div>

              <Button 
                size="lg" 
                variant="hero" 
                className="gap-2 group text-base px-8"
                onClick={handleStartChallenge}
              >
                {isRegistered ? 'Zur Challenge' : 'Challenge starten'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Right: Challenge Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="glass rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden border border-primary/20">
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/30 blur-3xl" />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/30">
                    Nur für kurze Zeit
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-sm text-muted-foreground mb-2 font-medium">5 Tages</div>
                  <h2 className="font-display text-4xl font-bold mb-2">
                    Trader<br />Challenge
                  </h2>

                  <div className="flex items-center justify-center gap-3 my-6">
                    <span className="text-2xl text-muted-foreground line-through opacity-60">497€</span>
                    <span className="text-3xl font-bold text-primary">Jetzt kostenlos</span>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 group mb-4 text-base"
                    onClick={handleStartChallenge}
                  >
                    {isRegistered ? 'Weiter zur Challenge' : 'Challenge starten'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    4.000+ haben es geschafft
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mindset Shift */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Von "hoffentlich funktioniert es"<br />
              zu <span className="text-gradient-primary">"ich weiß, was ich tue"</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              5 Tage, die zwischen dir und einem planbaren Nebeneinkommen stehen
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenge Preview / Day Selector */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Einblick in die Challenge
            </h2>
            <p className="text-muted-foreground">das erwartet dich in den 5 Tagen</p>
          </motion.div>

          {/* Day Tabs */}
          <Tabs value={`day-${selectedDay}`} onValueChange={(v) => setSelectedDay(parseInt(v.replace('day-', '')))}>
            {/* Progress Bar with Day Indicators */}
            <div className="relative mb-8">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((selectedDay - 1) / 4) * 100}%` }}
              />

              <TabsList className="relative flex justify-between bg-transparent p-0">
                {challengeDays.map((day) => (
                  <TabsTrigger
                    key={day.day}
                    value={`day-${day.day}`}
                    className="flex flex-col items-center gap-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0"
                  >
                    <div 
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm",
                        "transition-all duration-300 cursor-pointer border-2",
                        selectedDay === day.day 
                          ? 'bg-primary text-primary-foreground scale-110 border-primary shadow-lg shadow-primary/30' 
                          : selectedDay > day.day 
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-muted text-muted-foreground border-transparent'
                      )}
                    >
                      {day.day}
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">Tag {day.day}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Day Content */}
            {challengeDays.map((day) => (
              <TabsContent key={day.day} value={`day-${day.day}`} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 sm:p-8"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Video Placeholder - Clickable */}
                    <button
                      onClick={handleVideoClick}
                      className="aspect-video bg-black/50 rounded-xl overflow-hidden relative group cursor-pointer w-full"
                    >
                      {/* Lock overlay for non-registered users */}
                      {!isRegistered && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                          <Lock className="w-8 h-8 text-primary" />
                          <span className="text-sm text-muted-foreground">Jetzt freischalten</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                          "bg-primary/20 group-hover:scale-110 group-hover:bg-primary/30"
                        )}>
                          <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Tag {day.day} von 5</span>
                        <span className="text-xs text-muted-foreground">{day.duration}</span>
                      </div>
                    </button>

                    {/* Day Info */}
                    <div>
                      <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                        <span className="text-primary font-semibold">Tag {day.day}</span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold mb-4">{day.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{day.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {selectedDay < 5 && (
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedDay(selectedDay + 1)}
                            className="gap-2"
                          >
                            Weiter mit Tag {selectedDay + 1}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          onClick={handleVideoClick}
                          className="gap-2"
                        >
                          {isRegistered ? 'Video ansehen' : 'Jetzt freischalten'}
                          {isRegistered ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Tipp: Du kannst auch alle Videos an einem Abend schauen!
                  </p>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Dein Fahrplan zu Trading Skills<br />in unter einer Woche
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={faq.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{faq.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.content}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem/Solution Stats */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Das Problem ist nicht Trading
            </h2>
            <p className="text-lg text-muted-foreground">sondern ohne Strategie zu starten</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without Support */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border-destructive/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-destructive" />
                <span className="font-medium text-muted-foreground">Ohne Unterstützung</span>
              </div>
              <div className="text-center">
                <div className="font-display text-6xl sm:text-7xl font-bold text-destructive mb-2">91%</div>
                <p className="text-muted-foreground">scheitern</p>
              </div>
            </motion.div>

            {/* With Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border-primary/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="font-medium text-muted-foreground">Mit Unterstützung</span>
              </div>
              <div className="text-center">
                <div className="font-display text-6xl sm:text-7xl font-bold text-primary mb-2">84%</div>
                <p className="text-muted-foreground">erfolgreich</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Wert: 497€ - Jetzt kostenlos</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Starte jetzt deine <span className="text-gradient-primary">Trading-Transformation</span>
            </h2>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Schließe dich über 4.000 erfolgreichen Teilnehmern an und lerne in nur 5 Tagen, 
              wie du mit Trading ein planbares Nebeneinkommen aufbaust.
            </p>

            <Button 
              size="lg" 
              variant="hero" 
              className="gap-2 group text-base px-8"
              onClick={handleStartChallenge}
            >
              {isRegistered ? 'Zur Challenge' : 'Challenge starten - 4.000 haben es geschafft'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Nur für kurze Zeit kostenlos verfügbar
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      <ChallengeRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}

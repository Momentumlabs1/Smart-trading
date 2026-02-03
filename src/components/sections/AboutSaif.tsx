import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AboutSaif = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass p-2">
              {/* Placeholder for Saif's photo */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="font-display text-4xl font-bold text-primary">SA</span>
                  </div>
                  <p className="text-muted-foreground">Saif Al-Nasiri</p>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              className="absolute -bottom-6 -right-6 glass rounded-2xl px-6 py-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="font-mono text-2xl font-bold text-foreground">5+ Jahre</div>
              <div className="text-sm text-muted-foreground">Trading Erfahrung</div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -left-4 glass rounded-2xl px-6 py-4"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="font-mono text-2xl font-bold text-primary">480+</div>
              <div className="text-sm text-muted-foreground">Trader ausgebildet</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-6">
              Über den Gründer
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              "Ich war genau da,
              <br />
              <span className="text-gradient-primary">wo du jetzt bist."</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed mb-10">
              <p>
                Vor 5 Jahren stand ich am gleichen Punkt. Ich hatte tausende Euros an sogenannte 
                "Gurus" verloren, die selbst nicht profitabel waren. Ich habe jeden Fehler gemacht, 
                den man machen kann.
              </p>
              <p>
                Dann habe ich alles auf Null gesetzt. Ich habe angefangen, wie ein Wissenschaftler 
                zu denken - Hypothesen aufstellen, testen, optimieren. Nach 2 Jahren hatte ich 
                endlich ein System, das funktioniert.
              </p>
              <p className="text-foreground font-medium">
                Heute teile ich alles, was ich gelernt habe. Keine Geheimnisse, kein Gatekeeping. 
                Nur das, was wirklich funktioniert.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="text-left">
                <div className="font-display font-bold text-xl text-foreground">Saif Al-Nasiri</div>
                <div className="text-sm text-muted-foreground">Gründer & Head Trader</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button variant="hero" size="lg" className="group">
                  Saifs Story lesen
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href="https://instagram.com/smarttrading"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glass" size="lg">
                  <Instagram className="w-5 h-5" />
                  Auf Instagram folgen
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

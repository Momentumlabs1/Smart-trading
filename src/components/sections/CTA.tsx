import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bereit, Trading
            <br />
            <span className="text-gradient-primary">richtig zu lernen?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Starte jetzt mit dem kostenlosen Quiz und finde heraus, welches Programm 
            perfekt zu deinem aktuellen Level passt.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button variant="hero" size="xl" className="group">
                Kostenlosen Test starten
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/academy">
              <Button variant="heroOutline" size="xl">
                Direkt zur Academy
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Keine Kreditkarte erforderlich • Jederzeit kündbar • 30 Tage Geld-zurück-Garantie
          </p>
        </motion.div>
      </div>
    </section>
  );
};

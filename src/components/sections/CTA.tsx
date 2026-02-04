import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Effects - Simplified on mobile */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="section-container relative z-10 px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
            scale: isInView ? 1 : 0.98,
          }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Bereit, Trading
            <br />
            <span className="text-gradient-primary">richtig zu lernen?</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
            Starte jetzt mit dem kostenlosen Quiz und finde heraus, welches Programm 
            perfekt zu deinem Level passt.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Link to="/quiz" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                Kostenlosen Test starten
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/academy" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                Direkt zur Academy
              </Button>
            </Link>
          </div>

          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-6 sm:mt-8 px-2">
            Keine Kreditkarte erforderlich • Jederzeit kündbar • 30 Tage Geld-zurück-Garantie
          </p>
        </motion.div>
      </div>
    </section>
  );
};
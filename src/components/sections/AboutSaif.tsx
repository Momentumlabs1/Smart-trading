import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, ArrowRight, Award, Users, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import saifPortrait from '@/assets/saif-portrait.webp';

const achievements = [
  { icon: TrendingUp, value: '5+', label: 'Jahre Trading' },
  { icon: Users, value: '480+', label: 'Trader ausgebildet' },
  { icon: Award, value: '800%+', label: 'Bot Rendite' },
  { icon: Calendar, value: '200+', label: 'Live Sessions' },
];

export const AboutSaif = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <motion.div 
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 glass rounded-3xl p-2">
                <img 
                  src={saifPortrait} 
                  alt="Saif Al-Nasiri - Gründer von Smart Trading" 
                  className="w-full h-full rounded-2xl object-cover object-center"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-2xl" />
              </div>
            </motion.div>

            {/* Floating Achievement Cards */}
            <motion.div
              className="absolute -bottom-4 -right-4 md:-right-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="glass rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-foreground">5+ Jahre</div>
                    <div className="text-xs text-muted-foreground">Trading Erfahrung</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -left-4 md:-left-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="glass rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-primary">480+</div>
                    <div className="text-xs text-muted-foreground">Trader ausgebildet</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              Über den Gründer
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              "Ich war genau da,
              <br />
              <span className="text-gradient-primary">wo du jetzt bist."</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Vor 5 Jahren stand ich am gleichen Punkt. Ich hatte tausende Euros an sogenannte 
                "Gurus" verloren, die selbst nicht profitabel waren.
              </p>
              <p>
                Dann habe ich alles auf Null gesetzt und angefangen, wie ein Wissenschaftler 
                zu denken – Hypothesen aufstellen, testen, optimieren. Nach 2 Jahren hatte ich 
                endlich ein System, das funktioniert.
              </p>
              <p className="text-foreground font-medium">
                Heute teile ich alles, was ich gelernt habe. Keine Geheimnisse, kein Gatekeeping.
              </p>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {achievements.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.03 }}
                  className="glass rounded-xl p-3 flex items-center gap-3 cursor-default"
                >
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="font-mono font-bold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
              <div>
                <div className="font-display font-bold text-xl text-foreground">Saif Al-Nasiri</div>
                <div className="text-sm text-muted-foreground">Gründer & Head Trader</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                  Saifs Story lesen
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href="https://instagram.com/smarttrading"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

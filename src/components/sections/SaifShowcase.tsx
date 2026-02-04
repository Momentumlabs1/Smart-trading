import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import saifDesk from '@/assets/saif-desk.webp';
import saifPhone from '@/assets/saif-phone.webp';
import saifTrading from '@/assets/saif-trading.webp';

const images = [
  {
    src: saifDesk,
    alt: 'Saif am Trading Desk',
    caption: 'Live Trading Sessions',
  },
  {
    src: saifPhone,
    alt: 'Saif mit Smartphone',
    caption: 'Immer erreichbar',
  },
  {
    src: saifTrading,
    alt: 'Saif beim Trading',
    caption: 'Echte Trades, echte Ergebnisse',
  },
];

export const SaifShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section ref={ref} className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Behind the Scenes
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ein Blick in den
            <span className="text-gradient-primary"> Alltag</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Kein inszenierter Content. Echte Einblicke in das Leben eines professionellen Traders.
          </p>
        </motion.div>

        {/* Image Grid - Creative Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Large featured image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : -30,
            }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-7 relative group"
          >
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden glass p-1.5 sm:p-2">
              <img 
                src={images[0].src} 
                alt={images[0].alt}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-xl sm:rounded-2xl" />
              
              {/* Caption */}
              <motion.div 
                className="absolute bottom-4 left-4 right-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="glass rounded-xl px-4 py-3 inline-block">
                  <span className="text-sm font-medium text-foreground">{images[0].caption}</span>
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="glass rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                <span className="text-xs font-mono text-primary">Live Session</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - stacked images */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            {images.slice(1).map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, x: 30 }}
                animate={{
                  opacity: isInView ? 1 : 0,
                  x: isInView ? 0 : 30,
                }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="relative group flex-1"
              >
                <div className="relative h-full min-h-[180px] sm:min-h-[200px] rounded-2xl sm:rounded-3xl overflow-hidden glass p-1.5 sm:p-2">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent rounded-xl sm:rounded-2xl" />
                  
                  {/* Caption */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs sm:text-sm font-medium text-foreground">{image.caption}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mt-8 sm:mt-12 max-w-2xl mx-auto"
        >
          {[
            { value: '5+', label: 'Jahre Erfahrung' },
            { value: '200+', label: 'Live Sessions' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 10,
              }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-mono text-xl sm:text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

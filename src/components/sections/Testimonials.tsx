import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Max Weber',
    role: 'Day Trader',
    location: 'Wien',
    avatar: 'MW',
    rating: 5,
    text: 'Die Academy hat mein Trading komplett verändert. Nach 3 Monaten bin ich konsistent profitabel.',
    profit: '+340%',
    timeframe: '6 Monate',
  },
  {
    id: 2,
    name: 'Sarah Müller',
    role: 'Swing Trader',
    location: 'München',
    avatar: 'SM',
    rating: 5,
    text: 'Der Bot alleine ist das Geld wert. Er handelt emotionslos während ich mich auf meinen Job konzentriere.',
    profit: '+180%',
    timeframe: '4 Monate',
  },
  {
    id: 3,
    name: 'Thomas Klein',
    role: 'Position Trader',
    location: 'Zürich',
    avatar: 'TK',
    rating: 5,
    text: 'Nach Jahren von Verlusten war ich skeptisch. Aber die Strategien funktionieren einfach.',
    profit: '+520%',
    timeframe: '8 Monate',
  },
  {
    id: 4,
    name: 'Lisa Hofmann',
    role: 'Crypto Trader',
    location: 'Berlin',
    avatar: 'LH',
    rating: 5,
    text: 'Das Elite Mentoring war die beste Investition meines Lebens.',
    profit: '+890%',
    timeframe: '12 Monate',
  },
];

// Trust Metric with scroll animation
const TrustMetric = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
      }}
      transition={{ delay, duration: 0.4 }}
      className="text-center"
    >
      <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { amount: 0.2, once: false });

  const paginate = (direction: number) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="section-container relative z-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isSectionInView ? 1 : 0,
            y: isSectionInView ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4">
            Erfolgsgeschichten
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Das sagen unsere
            <br />
            <span className="text-gradient-primary">Trader</span>
          </h2>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isSectionInView ? 1 : 0,
            y: isSectionInView ? 0 : 20,
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-xl mx-auto mb-10 sm:mb-16"
        >
          <TrustMetric value="480+" label="Trader" delay={0} />
          <TrustMetric value="4.9★" label="Bewertung" delay={0.1} />
          <TrustMetric value="98%" label="Zufrieden" delay={0.2} />
        </motion.div>

        {/* Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12"
            >
              <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-primary/30 mb-4 sm:mb-6" />
              
              <p className="text-base sm:text-xl md:text-2xl text-foreground leading-relaxed mb-6 sm:mb-8">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Author */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div 
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="font-display font-bold text-primary text-sm sm:text-base">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profit Badge */}
                <motion.div 
                  className="glass rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 self-start sm:self-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-primary">
                      {testimonials[currentIndex].profit}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      in {testimonials[currentIndex].timeframe}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation - Visible on larger screens, touch to swipe on mobile */}
          <button
            onClick={() => paginate(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 w-10 h-10 md:w-12 md:h-12 rounded-full glass items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 w-10 h-10 md:w-12 md:h-12 rounded-full glass items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots - Touch-friendly on mobile */}
        <div className="flex justify-center gap-2 sm:gap-2 mt-6 sm:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 sm:w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Swipe hint on mobile */}
        <p className="text-center text-xs text-muted-foreground mt-4 sm:hidden">
          Wische zum Blättern
        </p>
      </div>
    </section>
  );
};
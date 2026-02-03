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
    text: 'Die Academy hat mein Trading komplett verändert. Nach 3 Monaten bin ich endlich konsistent profitabel. Saif erklärt alles so, dass man es wirklich versteht.',
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
    text: 'Der Bot alleine ist das Geld wert. Er handelt emotionslos und ich kann mich auf meinen Hauptjob konzentrieren. Die Community ist ein riesiger Bonus.',
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
    text: 'Nach Jahren von Verlusten war ich skeptisch. Aber die Strategien von Saif funktionieren einfach. Ich wünschte, ich hätte das früher gefunden.',
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
    text: 'Das Elite Mentoring war die beste Investition meines Lebens. Die 1:1 Calls mit Saif haben mir Dinge gezeigt, die ich alleine nie gesehen hätte.',
    profit: '+890%',
    timeframe: '12 Monate',
  },
];

// Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive }: { testimonial: typeof testimonials[0]; isActive: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
    transition={{ duration: 0.3 }}
    className={`glass rounded-2xl p-6 transition-all ${isActive ? 'shadow-lg' : ''}`}
  >
    {/* Quote */}
    <p className="text-foreground leading-relaxed mb-6">
      "{testimonial.text}"
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {testimonial.avatar}
          </span>
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm">
            {testimonial.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role} • {testimonial.location}
          </div>
        </div>
      </div>

      {/* Profit */}
      <div className="text-right">
        <div className="font-mono text-lg font-bold text-primary">
          {testimonial.profit}
        </div>
        <div className="text-xs text-muted-foreground">
          {testimonial.timeframe}
        </div>
      </div>
    </div>
  </motion.div>
);

// Interactive Trust Metric
const TrustMetric = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="text-center cursor-default"
    >
      <div className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
            Erfolgsgeschichten
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Das sagen unsere
            <br />
            <span className="text-gradient-primary">Trader</span>
          </h2>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto mb-16"
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
        >
          {/* Main Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <Quote className="w-12 h-12 text-primary/30 mb-6" />
              
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Author */}
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="font-display font-bold text-primary">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profit Badge */}
                <motion.div 
                  className="glass rounded-xl px-6 py-4 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-mono text-2xl font-bold text-primary">
                      {testimonials[currentIndex].profit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      in {testimonials[currentIndex].timeframe}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

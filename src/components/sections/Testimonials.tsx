import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Max Weber',
    role: 'Day Trader',
    location: 'Wien, Österreich',
    avatar: 'MW',
    rating: 5,
    text: 'Die Academy hat mein Trading komplett verändert. Nach 3 Monaten bin ich endlich konsistent profitabel. Saif erklärt alles so, dass man es wirklich versteht.',
    profit: '+340%',
    timeframe: 'in 6 Monaten',
  },
  {
    id: 2,
    name: 'Sarah Müller',
    role: 'Swing Trader',
    location: 'München, Deutschland',
    avatar: 'SM',
    rating: 5,
    text: 'Der Bot alleine ist das Geld wert. Er handelt emotionslos und ich kann mich auf meinen Hauptjob konzentrieren. Die Community ist ein riesiger Bonus.',
    profit: '+180%',
    timeframe: 'in 4 Monaten',
  },
  {
    id: 3,
    name: 'Thomas Klein',
    role: 'Position Trader',
    location: 'Zürich, Schweiz',
    avatar: 'TK',
    rating: 5,
    text: 'Nach Jahren von Verlusten war ich skeptisch. Aber die Strategien von Saif funktionieren einfach. Ich wünschte, ich hätte das früher gefunden.',
    profit: '+520%',
    timeframe: 'in 8 Monaten',
  },
  {
    id: 4,
    name: 'Lisa Hofmann',
    role: 'Crypto Trader',
    location: 'Berlin, Deutschland',
    avatar: 'LH',
    rating: 5,
    text: 'Das Elite Mentoring war die beste Investition meines Lebens. Die 1:1 Calls mit Saif haben mir Dinge gezeigt, die ich alleine nie gesehen hätte.',
    profit: '+890%',
    timeframe: 'in 12 Monaten',
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-6">
            Erfolgsgeschichten
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Das sagen unsere
            <br />
            <span className="text-gradient-primary">Trader</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                {/* Quote Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <Quote className="w-8 h-8 text-primary" />
                </div>

                {/* Quote Text */}
                <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                  "{currentTestimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="font-display font-bold text-secondary">
                        {currentTestimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentTestimonial.role} • {currentTestimonial.location}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Profit Badge */}
                  <div className="glass rounded-xl px-6 py-4 text-center">
                    <div className="font-mono text-2xl font-bold text-accent">
                      {currentTestimonial.profit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentTestimonial.timeframe}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-glass-hover transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-glass-hover transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

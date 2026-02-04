import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

// Import real testimonial images
import testimonial1 from '@/assets/testimonials/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonials/testimonial-2.jpg';
import testimonial3 from '@/assets/testimonials/testimonial-3.jpg';
import testimonial4 from '@/assets/testimonials/testimonial-4.jpg';
import testimonial5 from '@/assets/testimonials/testimonial-5.jpg';
import testimonial6 from '@/assets/testimonials/testimonial-6.jpg';

// Main testimonials with full texts
const mainTestimonials = [
  {
    id: 1,
    name: 'Academy Schüler',
    role: 'Trading Student',
    avatar: testimonial1,
    rating: 5,
    text: 'Ich hatte öfters die Möglichkeit in meinem Leben das Traden zu erlernen, habe diese jedoch nie genützt da ich das Verhalten sowie Vertrauen nie gefunden habe das ich suchte eines Mentors. Das konnte mir Al-Nassiri Saif jedoch gleich geben. Dadurch das wir im privaten Leben sehr gute Freunde sind, musste ich auch nicht viel überlegen ob es falsch oder richtig ist. Am Ende des Tages wird es mir nicht an Wissen fehlen sondern wie extrem dahinter man ist und sein Leben verändern möchte. Diese Möglichkeit bietete mir Saif an und erlernte mir die wichtigsten Dinge im Traden. Mein Mentor hat ein Ziel und das ist jedem Schüler die möglichkeit zugeben was in seinem Leben zuverändern.',
  },
  {
    id: 2,
    name: 'Habib',
    role: 'Trading Student',
    avatar: testimonial3,
    rating: 5,
    text: 'Habib Saif Al-Nasiri... Bester Lehrer... Deine Schulungen vom Trading ist die beste Qualität... Nimmt sich für seine Schüler Zeit gibt sein Wissen sorgfältig weiter auch nach dem Kurs... Preis-Leistungsverhältnis top.',
  },
  {
    id: 3,
    name: 'Academy Schüler',
    role: 'Trading Student',
    avatar: testimonial2,
    rating: 5,
    text: 'Saif hat mich damals praktisch von null abgeholt und mir die gesamte Trading-Welt verständlich gemacht. Vorher hatte ich nur grobe Kenntnisse im Kryptobereich und keine wirkliche Ahnung vom Trading. Durch ihn konnte ich die Materie Schritt für Schritt erlernen. Besonders beeindruckt bin ich davon, wie viel Zeit er sich nimmt, alles ausführlich zu erklären, Aufgaben zu geben und auch langfristig zu betreuen. Ich bin wirklich froh, ihn kennengelernt zu haben, und kann ihn wärmstens weiterempfehlen. Ein großartiger Coach – Hut ab!',
  },
  {
    id: 4,
    name: 'Academy Schüler',
    role: 'Fortgeschrittener Trader',
    avatar: testimonial4,
    rating: 5,
    text: 'Obwohl ich bereits ein solides Fundament im Trading hatte, hat der 1-zu-1-Kurs meine Erwartungen bei weitem übertroffen. Die persönliche Betreuung und der gezielte Fokus auf meine individuellen Stärken und Schwächen waren genau das, was ich gebraucht habe, um auf das nächste Level zu kommen. Durch die klaren und strukturierten Erklärungen konnte ich nicht nur meine Schwächen eliminieren, sondern meine Stärken auf ein ganz neues Niveau bringen. Was diesen Kurs wirklich einzigartig macht, ist die Geduld und Hingabe, mit der jedes Thema behandelt wird.',
  },
];

// Additional mini testimonials for the grid
const miniTestimonials = [
  {
    id: 5,
    name: 'Academy Schüler',
    avatar: testimonial5,
    rating: 5,
    shortQuote: 'Exzellente Betreuung und nachhaltige Ergebnisse. Ein Mentor der wirklich für seine Schüler da ist.',
  },
  {
    id: 6,
    name: 'Academy Schüler',
    avatar: testimonial6,
    rating: 5,
    shortQuote: 'Professioneller Unterricht auf höchstem Niveau. Die Strategien funktionieren wirklich.',
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

// Star rating component
const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className={`${sizeClass} text-primary fill-primary`} />
      ))}
    </div>
  );
};

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { amount: 0.2, once: false });

  const paginate = (direction: number) => {
    setIsExpanded(false);
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = mainTestimonials.length - 1;
      if (next >= mainTestimonials.length) next = 0;
      return next;
    });
  };

  useEffect(() => {
    if (isPaused || isExpanded) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex, isExpanded]);

  const currentTestimonial = mainTestimonials[currentIndex];
  const shouldTruncate = currentTestimonial.text.length > 250;
  const displayText = shouldTruncate && !isExpanded 
    ? currentTestimonial.text.slice(0, 250) + '...'
    : currentTestimonial.text;

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

        {/* Main Carousel */}
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
              key={currentTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
            >
              {/* Avatar and Quote Icon */}
              <div className="flex items-start gap-4 sm:gap-6 mb-6">
                <motion.div 
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-lg shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={currentTestimonial.avatar} 
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30 mt-2" />
              </div>
              
              {/* Testimonial Text */}
              <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed mb-4">
                "{displayText}"
              </p>
              
              {/* Read More Button */}
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary text-sm hover:underline mb-6 transition-colors"
                >
                  {isExpanded ? 'Weniger anzeigen' : 'Mehr lesen'}
                </button>
              )}

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="font-semibold text-foreground text-base sm:text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {currentTestimonial.role}
                  </div>
                  <StarRating rating={currentTestimonial.rating} size="md" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
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

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 sm:gap-2 mt-6 sm:mt-8">
          {mainTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsExpanded(false);
                setCurrentIndex(index);
              }}
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

        {/* Mini Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: isSectionInView ? 1 : 0,
            y: isSectionInView ? 0 : 30,
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto mt-12 sm:mt-16"
        >
          {miniTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="glass rounded-xl p-5 sm:p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-foreground/80 mb-3 leading-relaxed">
                    "{testimonial.shortQuote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </span>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

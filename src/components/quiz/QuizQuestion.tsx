import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { QuizQuestion as QuizQuestionType, QuizAnswers } from '@/lib/quiz-data';

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentAnswer: string | string[] | number | undefined;
  onAnswer: (value: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  contactData: { name: string; email: string; phone: string };
  onContactChange: (field: 'name' | 'email' | 'phone', value: string) => void;
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export const QuizQuestion = ({
  question,
  currentAnswer,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
  contactData,
  onContactChange,
}: QuizQuestionProps) => {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(
    typeof currentAnswer === 'number' ? currentAnswer : question.sliderConfig?.min || 500
  );
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);

  // Auto-advance for single choice (except chart questions with feedback)
  const handleSingleChoice = (value: string) => {
    onAnswer(value);
    setSelectedAnimation(value);
    
    if (question.type === 'chart' && question.feedback) {
      setShowFeedback(question.feedback[value] || null);
      // Auto advance after showing feedback
      setTimeout(() => {
        setShowFeedback(null);
        setSelectedAnimation(null);
        onNext();
      }, 2000);
    } else {
      // Auto advance after short delay
      setTimeout(() => {
        setSelectedAnimation(null);
        onNext();
      }, 400);
    }
  };

  const handleMultiChoice = (value: string) => {
    const currentValues = (currentAnswer as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onAnswer(newValues);
  };

  const handleSliderChange = (values: number[]) => {
    const value = values[0];
    setSliderValue(value);
    onAnswer(value);
  };

  const isContactValid = () => {
    return contactData.name.trim() !== '' && 
           contactData.email.trim() !== '' && 
           contactData.email.includes('@');
  };

  const canProceed = () => {
    if (question.type === 'contact') return isContactValid();
    if (question.type === 'slider') return true;
    if (question.type === 'multi') return (currentAnswer as string[])?.length > 0;
    return currentAnswer !== undefined;
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full max-w-2xl mx-auto px-6 relative"
    >
      {/* Enhanced background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.06), hsl(45 93% 58% / 0.02) 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Question Card - Enhanced */}
      <motion.div 
        className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.div 
          className="glass rounded-2xl p-6 sm:p-8 border border-border/50 inline-block relative overflow-hidden shadow-xl shadow-primary/5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          
          {/* Animated border accent */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.h2 
            className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {question.title}
          </motion.h2>
          {question.subtitle && (
            <motion.p 
              className="text-muted-foreground text-sm sm:text-base relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {question.subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Single Choice */}
      {question.type === 'single' && (
        <motion.div 
          className="space-y-3 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {question.options?.map((option, index) => {
            const isSelected = currentAnswer === option.value;
            const isAnimating = selectedAnimation === option.value;
            
            return (
            <motion.button
              key={option.value}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSingleChoice(option.value)}
              className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 group relative overflow-hidden ${
                isSelected
                  ? 'border-primary/60 bg-primary/15 shadow-xl shadow-primary/20'
                  : 'hover:border-primary/40 hover:bg-primary/5 border-border/50'
              }`}
            >
              {/* Selection ripple effect */}
              <AnimatePresence>
                {isAnimating && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ originX: 0, originY: 0.5 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Hover gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all relative ${
                  isSelected
                    ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                    : 'border-muted-foreground/40 group-hover:border-primary/60 group-hover:scale-110'
                }`}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={`transition-colors relative z-10 font-medium ${
                isSelected ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
              }`}>
                {option.label}
              </span>
              
              {/* Arrow indicator on hover */}
              <motion.div
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.button>
          )})}
        </motion.div>
      )}

      {/* Chart Question */}
      {question.type === 'chart' && (
        <motion.div 
          className="space-y-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Chart Visualization */}
          <motion.div 
            className="glass rounded-2xl p-4 sm:p-6 aspect-video relative overflow-hidden border border-border/50 shadow-xl shadow-primary/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-transparent" />
            
            {/* Animated scan line */}
            <motion.div
              className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-50"
              animate={{
                x: ['-10%', '110%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            <div className="relative h-full flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full opacity-80">
                {/* Grid lines */}
                <g stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.3">
                  {[20, 40, 60, 80].map(y => (
                    <line key={y} x1="0" y1={y} x2="200" y2={y} />
                  ))}
                  {[40, 80, 120, 160].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="100" />
                  ))}
                </g>
                {/* Support line */}
                <line x1="0" y1="70" x2="200" y2="70" stroke="hsl(45 93% 58%)" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
                
                {/* Animated Candlesticks */}
                {[
                  { x: 30, y: 35, h: 25, wickTop: 30, wickBottom: 65, red: true },
                  { x: 50, y: 45, h: 20, wickTop: 40, wickBottom: 70, red: true },
                  { x: 70, y: 55, h: 12, wickTop: 52, wickBottom: 70, red: true },
                  { x: 90, y: 50, h: 18, wickTop: 47, wickBottom: 70, red: false },
                  { x: 110, y: 40, h: 22, wickTop: 37, wickBottom: 65, red: false },
                  { x: 130, y: 30, h: 25, wickTop: 27, wickBottom: 58, red: false },
                ].map((candle, i) => (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ originY: 1 }}
                  >
                    <rect 
                      x={candle.x} 
                      y={candle.y} 
                      width="8" 
                      height={candle.h} 
                      fill={candle.red ? 'hsl(0 70% 50%)' : 'hsl(120 60% 45%)'} 
                    />
                    <line 
                      x1={candle.x + 4} 
                      y1={candle.wickTop} 
                      x2={candle.x + 4} 
                      y2={candle.wickBottom} 
                      stroke={candle.red ? 'hsl(0 70% 50%)' : 'hsl(120 60% 45%)'} 
                      strokeWidth="1.5" 
                    />
                  </motion.g>
                ))}
                
                {/* Question mark area */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <rect x="155" y="20" width="35" height="50" fill="hsl(var(--muted))" fillOpacity="0.3" rx="4" strokeDasharray="4 2" stroke="hsl(45 93% 58%)" strokeWidth="1.5" />
                  <motion.text 
                    x="172" 
                    y="50" 
                    textAnchor="middle" 
                    fill="hsl(45 93% 58%)" 
                    fontSize="18" 
                    fontWeight="bold"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ?
                  </motion.text>
                </motion.g>
              </svg>
            </div>
            <motion.p 
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Candlestick Chart an Support-Zone
            </motion.p>
          </motion.div>

          {/* Options */}
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {question.options?.map((option, index) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSingleChoice(option.value)}
                disabled={showFeedback !== null}
                className={`w-full glass rounded-xl p-4 text-left transition-all flex items-center gap-4 group relative overflow-hidden ${
                  currentAnswer === option.value
                    ? 'border-primary/60 bg-primary/15 shadow-xl shadow-primary/20'
                    : 'hover:border-primary/40 hover:bg-primary/5 border-border/50'
                } ${showFeedback !== null ? 'opacity-60' : ''}`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    currentAnswer === option.value
                      ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                      : 'border-muted-foreground/40 group-hover:border-primary/60 group-hover:scale-110'
                  }`}
                >
                  <AnimatePresence>
                    {currentAnswer === option.value && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-foreground relative z-10 font-medium">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="glass rounded-xl p-5 text-center border border-primary/40 relative overflow-hidden shadow-xl shadow-primary/10"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-foreground font-medium relative z-10">{showFeedback}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Multi Choice */}
      {question.type === 'multi' && (
        <motion.div 
          className="space-y-3 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {question.options?.map((option, index) => {
            const isSelected = (currentAnswer as string[])?.includes(option.value);
            return (
              <motion.button
                key={option.value}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultiChoice(option.value)}
                className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 group relative overflow-hidden ${
                  isSelected
                    ? 'border-primary/60 bg-primary/15 shadow-xl shadow-primary/20'
                    : 'hover:border-primary/40 hover:bg-primary/5 border-border/50'
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                      : 'border-muted-foreground/40 group-hover:border-primary/60 group-hover:scale-110'
                  }`}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className={`transition-colors relative z-10 font-medium ${
                  isSelected ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground' 
                }`}>
                  {option.label}
                </span>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <Star className="w-4 h-4 text-primary fill-primary" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Enhanced Slider */}
      {question.type === 'slider' && question.sliderConfig && (
        <motion.div 
          className="space-y-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div 
              className="glass inline-block rounded-2xl px-10 py-6 border border-primary/40 relative overflow-hidden shadow-xl shadow-primary/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
              <motion.span 
                className="font-mono text-4xl sm:text-5xl font-bold text-gradient-primary relative z-10"
                key={sliderValue}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {question.sliderConfig.format(sliderValue)}
              </motion.span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="px-4 glass rounded-2xl p-8 border border-border/50 relative overflow-hidden shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <Slider
              value={[sliderValue]}
              min={question.sliderConfig.min}
              max={question.sliderConfig.max}
              step={question.sliderConfig.step}
              onValueChange={handleSliderChange}
              className="w-full relative z-10"
            />
            <div className="flex justify-between mt-6 text-sm text-muted-foreground">
              <span>€500</span>
              <span>€50.000+</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Contact Form */}
      {question.type === 'contact' && (
        <motion.div 
          className="space-y-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="glass rounded-2xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5 relative"
            whileHover={{ borderColor: 'hsl(45 93% 58% / 0.3)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                placeholder="Vorname"
                value={contactData.name}
                onChange={(e) => onContactChange('name', e.target.value)}
                className="h-16 text-lg border-0 border-b border-border/30 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 relative z-10 px-6"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                type="email"
                placeholder="E-Mail"
                value={contactData.email}
                onChange={(e) => onContactChange('email', e.target.value)}
                className="h-16 text-lg border-0 border-b border-border/30 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 relative z-10 px-6"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                placeholder="WhatsApp/Telegram (optional)"
                value={contactData.phone}
                onChange={(e) => onContactChange('phone', e.target.value)}
                className="h-16 text-lg border-0 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 relative z-10 px-6"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Navigation - Only show for multi, slider, and contact */}
      {(question.type === 'multi' || question.type === 'slider' || question.type === 'contact') && (
        <motion.div 
          className="flex items-center justify-between mt-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
            <Button
            variant="ghost"
            onClick={onBack}
            disabled={isFirst}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
            </Button>
          </motion.div>

          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {canProceed() && (
              <motion.div
                className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <Button
              variant="hero"
              onClick={onNext}
              disabled={!canProceed()}
              className="gap-2 group relative"
            >
              {isLast ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Ergebnis anzeigen
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Back button only for single choice questions */}
      {(question.type === 'single' || question.type === 'chart') && !isFirst && (
        <motion.div 
          className="mt-10 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

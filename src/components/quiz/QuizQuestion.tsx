import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
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

  // Auto-advance for single choice (except chart questions with feedback)
  const handleSingleChoice = (value: string) => {
    onAnswer(value);
    
    if (question.type === 'chart' && question.feedback) {
      setShowFeedback(question.feedback[value] || null);
      // Auto advance after showing feedback
      setTimeout(() => {
        setShowFeedback(null);
        onNext();
      }, 2000);
    } else {
      // Auto advance after short delay
      setTimeout(() => onNext(), 300);
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
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto px-6 relative"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(45 93% 58% / 0.04), transparent 60%)',
          }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-10 relative z-10">
        <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 inline-block">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            {question.title}
          </h2>
          {question.subtitle && (
            <p className="text-muted-foreground text-sm sm:text-base">{question.subtitle}</p>
          )}
        </div>
      </div>

      {/* Single Choice */}
      {question.type === 'single' && (
        <div className="space-y-3 relative z-10">
          {question.options?.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSingleChoice(option.value)}
              className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 group ${
                currentAnswer === option.value
                  ? 'border-primary/60 bg-primary/15 shadow-lg shadow-primary/10'
                  : 'hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  currentAnswer === option.value
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/40 group-hover:border-primary/60'
                }`}
              >
                <AnimatePresence>
                  {currentAnswer === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={`transition-colors ${
                currentAnswer === option.value ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
              }`}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Chart Question */}
      {question.type === 'chart' && (
        <div className="space-y-6 relative z-10">
          {/* Enhanced Chart Visualization */}
          <div className="glass rounded-2xl p-4 sm:p-6 aspect-video relative overflow-hidden border border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
            <div className="relative h-full flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full opacity-70">
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
                {/* Candlesticks */}
                <g>
                  {/* Bearish candles */}
                  <rect x="30" y="35" width="8" height="25" fill="hsl(0 70% 50%)" />
                  <line x1="34" y1="30" x2="34" y2="65" stroke="hsl(0 70% 50%)" strokeWidth="1.5" />
                  
                  <rect x="50" y="45" width="8" height="20" fill="hsl(0 70% 50%)" />
                  <line x1="54" y1="40" x2="54" y2="70" stroke="hsl(0 70% 50%)" strokeWidth="1.5" />
                  
                  {/* At support */}
                  <rect x="70" y="55" width="8" height="12" fill="hsl(0 70% 50%)" />
                  <line x1="74" y1="52" x2="74" y2="70" stroke="hsl(0 70% 50%)" strokeWidth="1.5" />
                  
                  {/* Reversal candle */}
                  <rect x="90" y="50" width="8" height="18" fill="hsl(120 60% 45%)" />
                  <line x1="94" y1="47" x2="94" y2="70" stroke="hsl(120 60% 45%)" strokeWidth="1.5" />
                  
                  {/* Bullish continuation */}
                  <rect x="110" y="40" width="8" height="22" fill="hsl(120 60% 45%)" />
                  <line x1="114" y1="37" x2="114" y2="65" stroke="hsl(120 60% 45%)" strokeWidth="1.5" />
                  
                  <rect x="130" y="30" width="8" height="25" fill="hsl(120 60% 45%)" />
                  <line x1="134" y1="27" x2="134" y2="58" stroke="hsl(120 60% 45%)" strokeWidth="1.5" />
                </g>
                {/* Question mark area */}
                <rect x="155" y="20" width="35" height="50" fill="hsl(var(--muted))" fillOpacity="0.3" rx="4" strokeDasharray="4 2" stroke="hsl(45 93% 58%)" strokeWidth="1" />
                <text x="172" y="50" textAnchor="middle" fill="hsl(45 93% 58%)" fontSize="16" fontWeight="bold">?</text>
              </svg>
            </div>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
              Candlestick Chart an Support-Zone
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSingleChoice(option.value)}
                disabled={showFeedback !== null}
                className={`w-full glass rounded-xl p-4 text-left transition-all flex items-center gap-4 group ${
                  currentAnswer === option.value
                    ? 'border-primary/60 bg-primary/15 shadow-lg shadow-primary/10'
                    : 'hover:border-primary/40 hover:bg-primary/5'
                } ${showFeedback !== null ? 'opacity-60' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    currentAnswer === option.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/40 group-hover:border-primary/60'
                  }`}
                >
                  <AnimatePresence>
                    {currentAnswer === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-foreground">{option.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass rounded-xl p-4 text-center border border-primary/30"
              >
                <p className="text-muted-foreground">{showFeedback}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Multi Choice */}
      {question.type === 'multi' && (
        <div className="space-y-3 relative z-10">
          {question.options?.map((option, index) => {
            const isSelected = (currentAnswer as string[])?.includes(option.value);
            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleMultiChoice(option.value)}
                className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 group ${
                  isSelected
                    ? 'border-primary/60 bg-primary/15 shadow-lg shadow-primary/10'
                    : 'hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/40 group-hover:border-primary/60'
                  }`}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className={`transition-colors ${
                  isSelected ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
                }`}>
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Slider */}
      {question.type === 'slider' && question.sliderConfig && (
        <div className="space-y-8 relative z-10">
          <div className="text-center">
            <div className="glass inline-block rounded-2xl px-8 py-4 border border-primary/30">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-gradient-primary">
                {question.sliderConfig.format(sliderValue)}
              </span>
            </div>
          </div>
          
          <div className="px-4 glass rounded-2xl p-6 border border-border/50">
            <Slider
              value={[sliderValue]}
              min={question.sliderConfig.min}
              max={question.sliderConfig.max}
              step={question.sliderConfig.step}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>€500</span>
              <span>€50.000+</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {question.type === 'contact' && (
        <div className="space-y-4 relative z-10">
          <div className="glass rounded-xl border border-border/50 overflow-hidden">
            <Input
              placeholder="Vorname"
              value={contactData.name}
              onChange={(e) => onContactChange('name', e.target.value)}
              className="h-14 text-lg border-0 border-b border-border/30 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0"
            />
            <Input
              type="email"
              placeholder="E-Mail"
              value={contactData.email}
              onChange={(e) => onContactChange('email', e.target.value)}
              className="h-14 text-lg border-0 border-b border-border/30 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0"
            />
            <Input
              placeholder="WhatsApp/Telegram (optional)"
              value={contactData.phone}
              onChange={(e) => onContactChange('phone', e.target.value)}
              className="h-14 text-lg border-0 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </div>
      )}

      {/* Navigation - Only show for multi, slider, and contact */}
      {(question.type === 'multi' || question.type === 'slider' || question.type === 'contact') && (
        <div className="flex items-center justify-between mt-10 relative z-10">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isFirst}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>

          <Button
            variant="hero"
            onClick={onNext}
            disabled={!canProceed()}
            className="gap-2 group"
          >
            {isLast ? 'Ergebnis anzeigen' : 'Weiter'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}

      {/* Back button only for single choice questions */}
      {(question.type === 'single' || question.type === 'chart') && !isFirst && (
        <div className="mt-10 text-center relative z-10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
        </div>
      )}
    </motion.div>
  );
};

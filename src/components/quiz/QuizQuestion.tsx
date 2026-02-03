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
      className="w-full max-w-2xl mx-auto px-6"
    >
      {/* Question */}
      <div className="text-center mb-10">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-muted-foreground">{question.subtitle}</p>
        )}
      </div>

      {/* Single Choice */}
      {question.type === 'single' && (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSingleChoice(option.value)}
              className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 ${
                currentAnswer === option.value
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-glass-border-hover'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  currentAnswer === option.value
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}
              >
                {currentAnswer === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary-foreground"
                  />
                )}
              </div>
              <span className="text-foreground">{option.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Chart Question */}
      {question.type === 'chart' && (
        <div className="space-y-6">
          {/* Chart Placeholder */}
          <div className="glass rounded-2xl p-6 aspect-video flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-muted-foreground text-sm">
                Candlestick Chart an Support-Zone
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options?.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSingleChoice(option.value)}
                disabled={showFeedback !== null}
                className={`w-full glass rounded-xl p-4 text-left transition-all flex items-center gap-4 ${
                  currentAnswer === option.value
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-glass-border-hover'
                } ${showFeedback !== null ? 'opacity-60' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    currentAnswer === option.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {currentAnswer === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary-foreground"
                    />
                  )}
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
                className="glass rounded-xl p-4 text-center"
              >
                <p className="text-muted-foreground">{showFeedback}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Multi Choice */}
      {question.type === 'multi' && (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const isSelected = (currentAnswer as string[])?.includes(option.value);
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleMultiChoice(option.value)}
                className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'hover:border-glass-border-hover'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-foreground">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Slider */}
      {question.type === 'slider' && question.sliderConfig && (
        <div className="space-y-8">
          <div className="text-center">
            <span className="font-mono text-4xl font-bold text-primary">
              {question.sliderConfig.format(sliderValue)}
            </span>
          </div>
          
          <div className="px-4">
            <Slider
              value={[sliderValue]}
              min={question.sliderConfig.min}
              max={question.sliderConfig.max}
              step={question.sliderConfig.step}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>€500</span>
              <span>€50.000+</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {question.type === 'contact' && (
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Vorname"
              value={contactData.name}
              onChange={(e) => onContactChange('name', e.target.value)}
              className="glass h-14 text-lg"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="E-Mail"
              value={contactData.email}
              onChange={(e) => onContactChange('email', e.target.value)}
              className="glass h-14 text-lg"
            />
          </div>
          <div>
            <Input
              placeholder="WhatsApp/Telegram (optional)"
              value={contactData.phone}
              onChange={(e) => onContactChange('phone', e.target.value)}
              className="glass h-14 text-lg"
            />
          </div>
        </div>
      )}

      {/* Navigation - Only show for multi, slider, and contact */}
      {(question.type === 'multi' || question.type === 'slider' || question.type === 'contact') && (
        <div className="flex items-center justify-between mt-10">
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
        <div className="mt-10 text-center">
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

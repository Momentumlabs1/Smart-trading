import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { quizQuestions, QuizAnswers, calculateResult } from '@/lib/quiz-data';
import tradingBg from '@/assets/trading-bg.webp';

const Quiz = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (value: string | string[] | number) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id.toString()]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate result and navigate
      const result = calculateResult(answers);
      navigate('/quiz/results', { 
        state: { 
          result,
          contact: contactData,
          answers,
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleContactChange = (field: 'name' | 'email' | 'phone', value: string) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background">
        <QuizLanding onStart={() => setIsStarted(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${tradingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.08,
          scale: [1, 1.05, 1],
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] -top-96 -left-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(45 93% 58% / 0.08), transparent 60%)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] -bottom-64 -right-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(45 93% 58% / 0.06), transparent 60%)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Fixed Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl pt-4 pb-2 px-6 border-b border-border/20">
        <div className="max-w-2xl mx-auto">
          <QuizProgress current={currentQuestion + 1} total={quizQuestions.length} />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center pt-32 pb-8 relative z-10">
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            currentAnswer={answers[question.id.toString()]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === quizQuestions.length - 1}
            contactData={contactData}
            onContactChange={handleContactChange}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;

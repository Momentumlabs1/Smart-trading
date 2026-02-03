import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { quizQuestions, QuizAnswers, calculateResult } from '@/lib/quiz-data';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg pt-4 px-6">
        <QuizProgress current={currentQuestion + 1} total={quizQuestions.length} />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center pt-16 pb-8">
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

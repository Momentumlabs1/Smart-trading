import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, Leaf, TreeDeciduous, Trophy, Brain } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuizAnswer {
  question: number;
  answer: string | number;
}

const questions = [
  {
    id: 1,
    title: 'Wie würdest du deinen aktuellen Stand beschreiben?',
    type: 'cards',
    options: [
      { icon: Leaf, label: 'Neuling', description: 'Noch nie getradet', value: 'beginner' },
      { icon: TreeDeciduous, label: 'Lernend', description: 'Demo/kleine Live-Trades', value: 'learning' },
      { icon: Brain, label: 'Erfahren', description: 'Trade seit 1+ Jahren', value: 'experienced' },
      { icon: Trophy, label: 'Profi', description: 'Konsistent profitabel', value: 'pro' },
    ],
  },
  {
    id: 2,
    title: 'Du bist 3% im Minus auf einem Trade. Was machst du?',
    type: 'list',
    options: [
      { label: 'Sofort schließen - Verluste begrenzen', value: 'close', correct: true },
      { label: 'Stop Loss anpassen, vielleicht kommt\'s zurück', value: 'adjust', correct: false },
      { label: 'Nachkaufen um den Durchschnitt zu senken', value: 'average', correct: false },
      { label: 'Nichts, ich hatte keinen Stop Loss gesetzt', value: 'nothing', correct: false },
    ],
  },
  {
    id: 3,
    title: 'Mit welchem Kapital planst du zu starten?',
    type: 'list',
    options: [
      { label: 'Unter €1.000', value: 'small' },
      { label: '€1.000 - €5.000', value: 'medium' },
      { label: '€5.000 - €20.000', value: 'large' },
      { label: 'Über €20.000', value: 'xlarge' },
    ],
  },
  {
    id: 4,
    title: 'Wie lernst du am besten?',
    type: 'cards',
    options: [
      { label: 'Video', description: 'Selbstständig durch Kurse', value: 'video', icon: null },
      { label: 'Live', description: 'Interaktive Sessions', value: 'live', icon: null },
      { label: '1:1', description: 'Persönliches Mentoring', value: 'mentoring', icon: null },
      { label: 'KI-unterstützt', description: 'Automatisierte Systeme', value: 'ai', icon: null },
    ],
  },
  {
    id: 5,
    title: 'Was ist dein Hauptziel?',
    type: 'list',
    options: [
      { label: 'Nebeneinkommen aufbauen (€500-2000/Monat)', value: 'side' },
      { label: 'Haupteinkommen ersetzen (€3000+/Monat)', value: 'main' },
      { label: 'Vermögen aufbauen (langfristig)', value: 'wealth' },
      { label: 'Einfach lernen & verstehen', value: 'learn' },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, { question: question.id, answer: selectedAnswer }];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Navigate to results with answers
      navigate('/quiz/results', { state: { answers: newAnswers } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      const previousAnswer = answers.find((a) => a.question === questions[currentQuestion - 1].id);
      setSelectedAnswer(previousAnswer?.answer as string || null);
      setAnswers(answers.filter((a) => a.question !== questions[currentQuestion].id));
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="glass rounded-3xl p-12">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                  <Brain className="w-10 h-10 text-primary" />
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Finde heraus, welches Programm
                  <br />
                  <span className="text-gradient-primary">dich am schnellsten zum Erfolg bringt.</span>
                </h1>

                <p className="text-muted-foreground mb-8">
                  Dauer: ~2 Minuten • Keine Kosten • Keine Verpflichtung
                </p>

                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setIsStarted(true)}
                  className="group"
                >
                  Quiz starten
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Frage {currentQuestion + 1} von {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                  {question.title}
                </h2>

                {question.type === 'cards' && (
                  <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.value)}
                        className={`glass rounded-2xl p-6 text-left transition-all ${
                          selectedAnswer === option.value
                            ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                            : 'hover:border-glass-border-hover'
                        }`}
                      >
                        {option.icon && (
                          <option.icon className={`w-8 h-8 mb-3 ${
                            selectedAnswer === option.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        )}
                        <div className="font-semibold text-foreground mb-1">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {question.type === 'list' && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full glass rounded-xl p-5 text-left transition-all flex items-center gap-4 ${
                          selectedAnswer === option.value
                            ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                            : 'hover:border-glass-border-hover'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedAnswer === option.value
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {selectedAnswer === option.value && (
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

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                  </Button>

                  <Button
                    variant="hero"
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className="gap-2 group"
                  >
                    {currentQuestion === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;

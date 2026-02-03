import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Check, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ScoreCategory {
  label: string;
  score: number;
  color: string;
}

const QuizResults = () => {
  const location = useLocation();
  const answers = location.state?.answers || [];

  // Calculate scores based on answers (simplified scoring)
  const calculateScores = (): ScoreCategory[] => {
    // This is a simplified scoring system
    return [
      { label: 'Wissen', score: 70, color: 'primary' },
      { label: 'Mindset', score: 55, color: 'secondary' },
      { label: 'Strategie', score: 40, color: 'accent' },
      { label: 'Kapital', score: 85, color: 'primary' },
    ];
  };

  const scores = calculateScores();
  const overallScore = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);

  // Determine recommended tier based on answers
  const getRecommendation = () => {
    const experienceAnswer = answers.find((a: { question: number }) => a.question === 1);
    const experience = experienceAnswer?.answer || 'beginner';

    if (experience === 'beginner') {
      return 'free';
    } else if (experience === 'learning' || experience === 'experienced') {
      return 'academy';
    }
    return 'elite';
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Score Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              {/* Overall Score Circle */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 283' }}
                    animate={{ strokeDasharray: `${overallScore * 2.83} 283` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="font-mono text-4xl font-bold text-foreground">
                      {overallScore}
                    </span>
                    <span className="text-muted-foreground">/100</span>
                  </motion.div>
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Dein Trading Profil
              </h1>
            </motion.div>

            {/* Score Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {scores.map((score, index) => (
                <div key={score.label} className="glass rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">{score.label}</div>
                  <Progress value={score.score} className="h-2 mb-2" />
                  <div className="font-mono text-lg font-bold text-foreground">{score.score}%</div>
                </div>
              ))}
            </motion.div>

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-center text-muted-foreground mb-8">
                Basierend auf deinem Profil empfehlen wir:
              </p>

              {/* Recommended Tier */}
              <div className={`glass rounded-3xl p-8 border-2 ${
                recommendation === 'academy' 
                  ? 'border-primary shadow-[0_0_40px_hsl(var(--primary)/0.2)]' 
                  : 'border-accent shadow-[0_0_40px_hsl(var(--accent)/0.2)]'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Empfohlen für dich
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {recommendation === 'free' && '🆓 Smart Trading Free'}
                  {recommendation === 'academy' && '🎓 Smart Trading Academy'}
                  {recommendation === 'elite' && '👑 Elite Mentoring'}
                </h2>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {recommendation === 'free' && 'Perfekt für deinen Start. Lerne die Grundlagen kostenlos und entscheide dann, ob Trading etwas für dich ist.'}
                  {recommendation === 'academy' && 'Perfekt für deinen aktuellen Stand. Du hast die Grundlagen, aber brauchst Struktur und bewährte Strategien um konsistent profitabel zu werden.'}
                  {recommendation === 'elite' && 'Du bist bereit für das höchste Level. Persönliches 1:1 Mentoring mit Saif bringt dich am schnellsten zum Ziel.'}
                </p>

                <ul className="space-y-3 mb-8">
                  {recommendation === 'academy' && [
                    '78+ Video Lektionen',
                    'Trading Bot inklusive',
                    'Wöchentliche Live Q&A',
                    'Elite Community Zugang',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={`/${recommendation}`}>
                  <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                    {recommendation === 'free' && 'Kostenlos starten'}
                    {recommendation === 'academy' && 'Academy Details ansehen'}
                    {recommendation === 'elite' && 'Elite Bewerbung starten'}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Locked Tier (if not Elite) */}
            {recommendation !== 'elite' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-3xl p-8 opacity-60"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Noch nicht freigeschaltet
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  👑 Elite Mentoring
                </h3>

                <p className="text-muted-foreground">
                  Aktuell nicht verfügbar für dein Profil. Beweise dich erst in der Academy 
                  und qualifiziere dich für das persönliche Mentoring mit Saif.
                </p>

                <Link to="/elite" className="inline-block mt-4">
                  <Button variant="ghost" size="sm">
                    Was ist Elite?
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResults;

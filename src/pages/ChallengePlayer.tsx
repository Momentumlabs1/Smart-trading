import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Play, CheckCircle2, 
  Bookmark, Star, ExternalLink, Menu, X, Clock,
  List, Award, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { challengeDays, sevenStepsPlan } from '@/lib/challenge-data';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export default function ChallengePlayer() {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const currentContent = challengeDays.find(d => d.day === currentDay);
  const progress = (completedDays.length / 5) * 100;

  useEffect(() => {
    // Check if user is registered
    const storedEmail = localStorage.getItem('challenge_email');
    if (!storedEmail) {
      navigate('/challenge');
      return;
    }
    setEmail(storedEmail);
    loadProgress(storedEmail);
  }, [navigate]);

  const loadProgress = async (email: string) => {
    const { data } = await supabase
      .from('challenge_registrations')
      .select('current_day, completed_days')
      .eq('email', email)
      .maybeSingle();

    if (data) {
      setCurrentDay(data.current_day || 1);
      setCompletedDays(data.completed_days || []);
    }
  };

  const markAsComplete = async () => {
    if (!email || completedDays.includes(currentDay)) return;

    const newCompleted = [...completedDays, currentDay];
    setCompletedDays(newCompleted);

    await supabase
      .from('challenge_registrations')
      .update({ 
        completed_days: newCompleted,
        current_day: Math.min(currentDay + 1, 5),
        last_accessed_at: new Date().toISOString()
      })
      .eq('email', email);
  };

  const goToDay = async (day: number) => {
    setCurrentDay(day);
    setShowSidebar(false);
    setShowOverview(false);

    if (email) {
      await supabase
        .from('challenge_registrations')
        .update({ current_day: day, last_accessed_at: new Date().toISOString() })
        .eq('email', email);
    }
  };

  if (!currentContent) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 glass rounded-lg"
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className={cn(
              "fixed left-0 top-0 h-full w-[280px] bg-card border-r border-white/10 z-40",
              "flex flex-col",
              "lg:translate-x-0"
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">Trader Challenge</h2>
                  <p className="text-xs text-muted-foreground">5 Tages Workshop</p>
                </div>
              </div>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fortschritt</span>
                  <span className="text-primary font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Days list */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {challengeDays.map((day) => {
                  const isCompleted = completedDays.includes(day.day);
                  const isCurrent = currentDay === day.day;

                  return (
                    <button
                      key={day.day}
                      onClick={() => goToDay(day.day)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                        isCurrent 
                          ? "bg-primary/20 border border-primary/30" 
                          : "hover:bg-white/5",
                        isCompleted && !isCurrent && "opacity-70"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
                        isCompleted 
                          ? "bg-green-500/20 text-green-400" 
                          : isCurrent 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : day.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isCurrent && "text-primary"
                        )}>
                          Tag {day.day}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {day.title}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {day.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Back button */}
            <div className="p-4 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/challenge')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück zur Übersicht
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-[280px] min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Trader Challenge</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Tag {currentDay}</span>
            </div>
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Übersicht</span>
            </button>
          </div>

          {/* Course header bar */}
          <div className="px-4 lg:px-8 pb-4">
            <div className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-medium uppercase tracking-wide">
                  Trader Challenge - Tag {currentDay}
                </p>
                <h1 className="font-bold truncate">{currentContent.title}</h1>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <button
                  onClick={() => setShowOverview(!showOverview)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <List className="w-4 h-4" />
                  Übersicht
                </button>
                <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Overview Panel */}
        <AnimatePresence>
          {showOverview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/10"
            >
              <div className="px-4 lg:px-8 py-6 bg-card/50">
                <h3 className="font-bold mb-4">Alle Lektionen</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {challengeDays.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => goToDay(day.day)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                        currentDay === day.day 
                          ? "bg-primary/20 border border-primary/30" 
                          : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center text-sm font-bold",
                        completedDays.includes(day.day) 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {completedDays.includes(day.day) ? '✓' : day.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Tag {day.day}</p>
                        <p className="text-xs text-muted-foreground truncate">{day.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden relative group mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{currentContent.duration}</span>
              </div>
            </div>

            {/* Lesson Title */}
            <h2 className="text-2xl font-bold mb-6">{currentContent.videoTitle}</h2>

            {/* Content */}
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentContent.content.intro}
              </p>

              {currentContent.content.bulletPoints.length > 0 && (
                <div className="space-y-3">
                  <p className="font-medium">Dabei lernst du:</p>
                  <ul className="space-y-2">
                    {currentContent.content.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {currentContent.content.conclusion}
              </p>

              {/* 7-Step Plan for Day 5 */}
              {currentDay === 5 && (
                <div className="glass rounded-xl p-6 mt-8">
                  <h3 className="font-bold text-lg mb-4">7-Schritte-Plan für den Trading Start:</h3>
                  <ol className="space-y-3">
                    {sevenStepsPlan.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* CTA Box */}
              {currentContent.content.ctaText && (
                <div className="glass rounded-xl p-6 mt-8 bg-primary/5 border border-primary/20">
                  <p className="font-medium mb-2">Du willst nicht warten?</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wenn du jetzt schon weißt, dass du unbedingt etwas in deinem Leben verändern musst - und den Mut hast, es auch umzusetzen - dann melde dich bei uns.
                  </p>
                  <a 
                    href={currentContent.content.ctaLink}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    {currentContent.content.ctaText}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Feedback geben</span>
                </button>
              </div>

              <Button
                onClick={markAsComplete}
                disabled={completedDays.includes(currentDay)}
                className={cn(
                  "gap-2",
                  completedDays.includes(currentDay) && "bg-green-500/20 text-green-400"
                )}
              >
                {completedDays.includes(currentDay) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Abgeschlossen
                  </>
                ) : (
                  <>
                    Lektion abschließen
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Next Lesson Card */}
            {currentDay < 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <button
                  onClick={() => goToDay(currentDay + 1)}
                  className="w-full glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary font-medium uppercase tracking-wide">
                      Nächste Lektion
                    </p>
                    <p className="font-medium truncate">
                      Tag {currentDay + 1} - {challengeDays[currentDay]?.title}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Completion Card for Day 5 */}
            {currentDay === 5 && completedDays.includes(5) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
              >
                <div className="glass rounded-2xl p-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-xs text-primary font-medium uppercase tracking-wide mb-2">
                    Trader Challenge - Tag 5
                  </p>
                  <h3 className="text-2xl font-bold mb-4">Challenge abgeschlossen!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Herzlichen Glückwunsch! Du hast alle 5 Tage der Trader Challenge erfolgreich abgeschlossen.
                  </p>
                  <Button size="lg" className="gap-2">
                    Jetzt persönliches Gespräch buchen
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

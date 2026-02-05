import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight,
  Menu, X, Lock, BookOpen, Video, FileText, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { courseService, progressService, enrollmentService } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  lesson_type: string;
  video_duration_seconds: number | null;
  content_url: string | null;
  article_content: string | null;
  is_free_preview: boolean;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  tier_required: string;
  modules: Module[];
}

interface LessonProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  watched_seconds: number;
  last_position_seconds: number;
}

export default function CoursePlayer() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<{ id: string } | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Flatten lessons for navigation
  const allLessons = course?.modules.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calculate overall progress
  const completedCount = Object.values(lessonProgress).filter(p => p.status === 'completed').length;
  const overallProgress = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

  useEffect(() => {
    const loadCourse = async () => {
      if (!slug || !user) return;
      
      try {
        setLoading(true);
        const courseData = await courseService.getCourseDetails(slug);
        setCourse(courseData as Course);

        // Get or create enrollment
        let enroll = await enrollmentService.getEnrollment(user.id, courseData.id);
        if (!enroll) {
          enroll = await enrollmentService.enrollCourse(user.id, courseData.id);
        }
        setEnrollment(enroll as { id: string });

        // Load progress for all lessons
        const progressMap: Record<string, LessonProgress> = {};
        for (const module of courseData.modules || []) {
          for (const lesson of module.lessons || []) {
            const progress = await progressService.getLessonProgress(user.id, lesson.id);
            progressMap[lesson.id] = progress as LessonProgress;
          }
        }
        setLessonProgress(progressMap);

        // Set current lesson
        const lessons = courseData.modules?.flatMap((m: Module) => m.lessons) || [];
        if (lessonId) {
          const lesson = lessons.find((l: Lesson) => l.id === lessonId);
          if (lesson) setCurrentLesson(lesson);
        } else if (lessons.length > 0) {
          // Find first incomplete lesson or start from beginning
          const incomplete = lessons.find((l: Lesson) => 
            progressMap[l.id]?.status !== 'completed'
          );
          setCurrentLesson(incomplete || lessons[0]);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [slug, lessonId, user]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    navigate(`/academy/courses/${slug}/${lesson.id}`, { replace: true });
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || !user || !enrollment) return;

    try {
      await progressService.markLessonComplete(user.id, currentLesson.id, enrollment.id);
      setLessonProgress(prev => ({
        ...prev,
        [currentLesson.id]: { ...prev[currentLesson.id], status: 'completed' }
      }));

      // Auto-advance to next lesson
      if (nextLesson) {
        setTimeout(() => handleLessonSelect(nextLesson), 500);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      default: return BookOpen;
    }
  };

  const getStatusIcon = (lessonId: string) => {
    const progress = lessonProgress[lessonId];
    if (progress?.status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-primary" />;
    }
    if (progress?.status === 'in_progress') {
      return <Circle className="w-5 h-5 text-primary fill-primary/30" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Kurs wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Kurs nicht gefunden</h2>
          <p className="text-muted-foreground mb-4">Der gewünschte Kurs existiert nicht.</p>
          <Link to="/academy/courses">
            <Button>Zurück zu Kursen</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-80 border-r border-border bg-card flex-shrink-0 flex flex-col"
          >
            {/* Course Header */}
            <div className="p-4 border-b border-border">
              <Link to="/academy/courses" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
                <ArrowLeft className="w-4 h-4" />
                Zurück zu Kursen
              </Link>
              <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Fortschritt</span>
                  <span className="font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>

            {/* Module List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Modul {moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const Icon = getLessonIcon(lesson.lesson_type);
                        const isActive = currentLesson?.id === lesson.id;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={cn(
                              "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                              isActive 
                                ? "bg-primary/10 border border-primary/30" 
                                : "hover:bg-muted"
                            )}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {getStatusIcon(lesson.id)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium line-clamp-2",
                                isActive && "text-primary"
                              )}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Icon className="w-3 h-3" />
                                <span>{formatDuration(lesson.video_duration_seconds)}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            {currentLesson && (
              <h1 className="font-semibold truncate">{currentLesson.title}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && handleLessonSelect(prevLesson)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Zurück
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!nextLesson}
              onClick={() => nextLesson && handleLessonSelect(nextLesson)}
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </header>

        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col">
          {currentLesson ? (
            <>
              {/* Video Player */}
              {currentLesson.lesson_type === 'video' && currentLesson.content_url && (
                <div className="aspect-video bg-black">
                  <iframe
                    ref={videoRef}
                    src={currentLesson.content_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Article Content */}
              {currentLesson.lesson_type === 'article' && (
                <ScrollArea className="flex-1 p-8">
                  <div className="max-w-3xl mx-auto prose prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.article_content || '' }} />
                  </div>
                </ScrollArea>
              )}

              {/* Placeholder if no content */}
              {!currentLesson.content_url && currentLesson.lesson_type === 'video' && (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Video wird bald verfügbar sein</p>
                  </div>
                </div>
              )}

              {/* Lesson Actions */}
              <div className="p-6 border-t border-border bg-card/50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                    {currentLesson.description && (
                      <p className="text-muted-foreground mt-1">{currentLesson.description}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleMarkComplete}
                    disabled={lessonProgress[currentLesson.id]?.status === 'completed'}
                    className="gap-2"
                  >
                    {lessonProgress[currentLesson.id]?.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Abgeschlossen
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Als erledigt markieren
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Wähle eine Lektion aus</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

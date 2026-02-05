import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Play, 
  Lock,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { authService, profileService, courseService, enrollmentService } from '@/lib/api';
import type { Profile, Course } from '@/lib/supabase';

export default function CourseList() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, levelFilter]);

  const loadCourses = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate('/academy/login');
        return;
      }

      const [profileData, coursesData, enrollmentsData] = await Promise.all([
        profileService.getProfile(user.id),
        courseService.getCourses(),
        enrollmentService.getUserEnrollments(user.id)
      ]);

      setProfile(profileData);
      setCourses((coursesData || []) as Course[]);
      
      const enrolledIds = new Set((enrollmentsData || []).map(e => e.course_id));
      setEnrolledCourseIds(enrolledIds);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Kurse konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  const canAccessCourse = (course: Course) => {
    if (!profile) return false;
    const tierOrder = { starter: 0, academy: 1, elite: 2 };
    const userTierLevel = tierOrder[profile.tier as keyof typeof tierOrder] || 0;
    const courseTierLevel = tierOrder[course.tier_required as keyof typeof tierOrder] || 0;
    return courseTierLevel <= userTierLevel;
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      await enrollmentService.enrollCourse(user.id, courseId);
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
      
      toast({
        title: "Erfolgreich eingeschrieben!",
        description: "Du kannst jetzt mit dem Kurs beginnen.",
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Fehler",
        description: "Einschreibung fehlgeschlagen.",
        variant: "destructive",
      });
    }
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      advanced: 'Experte'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-primary/20 text-primary',
      intermediate: 'bg-secondary/20 text-secondary-foreground',
      advanced: 'bg-accent/20 text-accent-foreground'
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/academy/dashboard" className="font-display text-2xl font-bold text-gradient-primary">
              SmartTrading
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/academy/dashboard">
                ← Zurück zum Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Alle Kurse
          </h1>
          <p className="text-muted-foreground">
            Entdecke unsere Trading-Kurse und erweitere dein Wissen.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Kurse durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLevelFilter(level)}
              >
                {level === 'all' ? 'Alle' : getLevelLabel(level)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => {
              const hasAccess = canAccessCourse(course);
              const isEnrolled = enrolledCourseIds.has(course.id);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glass rounded-xl overflow-hidden group ${
                    hasAccess ? 'hover:border-primary/50' : 'opacity-75'
                  } transition-all`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {hasAccess ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {getLevelLabel(course.level)}
                      </span>
                    </div>

                    {/* Tier Badge */}
                    {course.tier_required !== 'starter' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {course.tier_required === 'academy' ? '🎓 Academy' : '👑 Elite'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.total_videos} Videos
                      </div>
                      {course.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_minutes} Min.
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    {hasAccess ? (
                      isEnrolled ? (
                        <Button variant="hero" className="w-full" asChild>
                          <Link to={`/academy/courses/${course.slug}`}>
                            Fortsetzen <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="hero" 
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Einschreiben <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/academy/pricing">
                          Upgrade für Zugang <Lock className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              Keine Kurse gefunden
            </h3>
            <p className="text-muted-foreground">
              Versuche andere Suchbegriffe oder Filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

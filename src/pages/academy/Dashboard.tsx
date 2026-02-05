import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Trophy, 
  Clock, 
  ArrowRight, 
  Play, 
  Star,
  LogOut,
  Settings,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { authService, profileService, enrollmentService } from '@/lib/api';
import type { Profile, Enrollment, DashboardStats } from '@/lib/supabase';

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate('/academy/login');
        return;
      }

      const [profileData, enrollmentsData, statsData] = await Promise.all([
        profileService.getProfile(user.id),
        enrollmentService.getUserEnrollments(user.id),
        profileService.getDashboardStats(user.id)
      ]);

      setProfile(profileData);
      setEnrollments((enrollmentsData || []) as Enrollment[]);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Dashboard-Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/academy/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      starter: { label: '🌱 Starter', color: 'bg-muted text-muted-foreground' },
      academy: { label: '🎓 Academy', color: 'bg-primary/20 text-primary' },
      elite: { label: '👑 Elite', color: 'bg-yellow-500/20 text-yellow-500' }
    };
    return badges[tier as keyof typeof badges] || badges.starter;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const tierBadge = getTierBadge(profile?.tier || 'starter');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-display text-2xl font-bold text-gradient-primary">
                SmartTrading
              </Link>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierBadge.color}`}>
                {tierBadge.label}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/academy/settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Willkommen zurück, {profile?.full_name?.split(' ')[0] || 'Trader'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Setze deine Trading-Reise fort und erreiche deine Ziele.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Eingeschriebene Kurse"
            value={stats?.enrolled_courses_count || 0}
            color="primary"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Abgeschlossene Kurse"
            value={stats?.completed_courses_count || 0}
            color="yellow"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Durchschnittlicher Fortschritt"
            value={`${Math.round(stats?.avg_completion_percentage || 0)}%`}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Lektionen angesehen"
            value={stats?.total_lessons_watched || 0}
            color="blue"
          />
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Weiter lernen
            </h2>
            <Button variant="ghost" asChild>
              <Link to="/academy/courses">
                Alle Kurse <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.slice(0, 3).map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Noch keine Kurse
              </h3>
              <p className="text-muted-foreground mb-4">
                Starte deine Trading-Reise mit unserem kostenlosen Grundlagen-Kurs.
              </p>
              <Button variant="hero" asChild>
                <Link to="/academy/courses">
                  Kurse entdecken <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Schnellzugriff
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<BookOpen className="w-6 h-6" />}
              label="Alle Kurse"
              href="/academy/courses"
            />
            <QuickActionCard
              icon={<User className="w-6 h-6" />}
              label="Community"
              href="/academy/community"
            />
            <QuickActionCard
              icon={<Star className="w-6 h-6" />}
              label="Upgrade"
              href="/academy/pricing"
            />
            <QuickActionCard
              icon={<Settings className="w-6 h-6" />}
              label="Einstellungen"
              href="/academy/settings"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  color: 'primary' | 'yellow' | 'green' | 'blue';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500'
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Course Card Component
function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const course = enrollment.course;
  if (!course) return null;

  return (
    <Link to={`/academy/courses/${course.slug}`}>
      <div className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-all">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fortschritt</span>
              <span className="text-foreground font-medium">{enrollment.completion_percentage}%</span>
            </div>
            <Progress value={enrollment.completion_percentage} className="h-2" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Quick Action Card Component
function QuickActionCard({ 
  icon, 
  label, 
  href 
}: { 
  icon: React.ReactNode; 
  label: string; 
  href: string;
}) {
  return (
    <Link to={href}>
      <div className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-all group">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
    </Link>
  );
}

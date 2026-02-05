// =====================================================
// API SERVICE LAYER - ALL DATABASE OPERATIONS
// Complete CRUD operations for the trading academy
// =====================================================

import { supabase } from './supabase';
import type { 
  Profile, 
  Course, 
  Enrollment, 
  LessonProgress,
  QuizAttempt,
  BotLicense,
  LiveSession,
  CommunityPost,
  Notification,
  DashboardStats
} from './supabase';

// =====================================================
// 1. AUTHENTICATION & USER MANAGEMENT
// =====================================================

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (authError) throw authError;
    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }
};

// =====================================================
// 2. PROFILE MANAGEMENT
// =====================================================

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile | null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates as Record<string, unknown>)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTier(userId: string, tier: 'starter' | 'academy' | 'elite') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ tier, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async linkTelegram(userId: string, telegramUserId: number) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ telegram_user_id: telegramUserId })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDashboardStats(userId: string): Promise<DashboardStats | null> {
    // Since the view might not exist yet, we'll compute stats manually
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', userId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const enrolledCount = enrollments?.length || 0;
    const completedCount = enrollments?.filter(e => e.completion_percentage === 100).length || 0;
    const avgCompletion = enrolledCount > 0 
      ? enrollments!.reduce((sum, e) => sum + e.completion_percentage, 0) / enrolledCount 
      : 0;

    return {
      user_id: userId,
      tier: profile?.tier || 'starter',
      enrolled_courses_count: enrolledCount,
      completed_courses_count: completedCount,
      avg_completion_percentage: avgCompletion,
      total_lessons_watched: 0,
      total_quizzes_taken: 0,
      avg_quiz_score: 0
    };
  }
};

// =====================================================
// 3. COURSE MANAGEMENT
// =====================================================

export const courseService = {
  async getCourses(tier?: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:course_categories(name, slug, icon)
      `)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    
    // Filter by tier access
    if (tier) {
      const tierOrder = { starter: 0, academy: 1, elite: 2 };
      const userTierLevel = tierOrder[tier as keyof typeof tierOrder] || 0;
      return data?.filter(course => {
        const courseTierLevel = tierOrder[course.tier_required as keyof typeof tierOrder] || 0;
        return courseTierLevel <= userTierLevel;
      });
    }
    
    return data;
  },

  async getCourseDetails(courseSlug: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:course_categories(name, slug, icon)
      `)
      .eq('slug', courseSlug)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    // Fetch modules separately
    const { data: modules } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', data.id)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', module.id)
          .eq('is_published', true)
          .order('order_index', { ascending: true });
        return { ...module, lessons: lessons || [] };
      })
    );

    return { ...data, modules: modulesWithLessons };
  },

  async searchCourses(query: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 4. ENROLLMENT & PROGRESS
// =====================================================

export const enrollmentService = {
  async enrollCourse(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserEnrollments(userId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getEnrollment(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    return data !== null;
  }
};

export const progressService = {
  async getLessonProgress(userId: string, lessonId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (!data) {
      return {
        status: 'not_started' as const,
        watched_seconds: 0,
        last_position_seconds: 0
      };
    }

    if (error) throw error;
    return data;
  },

  async updateVideoProgress(
    userId: string, 
    lessonId: string, 
    enrollmentId: string,
    watchedSeconds: number,
    totalSeconds: number,
    lastPosition: number
  ) {
    const status = watchedSeconds >= totalSeconds * 0.9 ? 'completed' : 'in_progress';

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        watched_seconds: watchedSeconds,
        total_seconds: totalSeconds,
        last_position_seconds: lastPosition,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markLessonComplete(userId: string, lessonId: string, enrollmentId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        status: 'completed',
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 5. QUIZ MANAGEMENT
// =====================================================

export const quizService = {
  async getQuiz(quizId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions:quiz_questions(*)
      `)
      .eq('id', quizId)
      .single();

    if (error) throw error;
    return data;
  },

  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
    score: number,
    totalPoints: number,
    timeTaken: number
  ) {
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('attempt_number')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const attemptNumber = attempts && attempts.length > 0 ? attempts[0].attempt_number + 1 : 1;
    const percentage = Math.round((score / totalPoints) * 100);

    const { data: quiz } = await supabase
      .from('quizzes')
      .select('passing_score')
      .eq('id', quizId)
      .single();

    const passed = percentage >= (quiz?.passing_score || 70);

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        total_points: totalPoints,
        percentage,
        passed,
        answers,
        time_taken_seconds: timeTaken,
        attempt_number: attemptNumber
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 6. TRADING BOT
// =====================================================

export const botService = {
  async createBotLicense(userId: string, licenseKey: string) {
    const { data, error } = await supabase
      .from('bot_licenses')
      .insert({
        user_id: userId,
        license_key: licenseKey,
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserBotLicenses(userId: string) {
    const { data, error } = await supabase
      .from('bot_licenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 7. LIVE SESSIONS
// =====================================================

export const sessionService = {
  async getUpcomingSessions(userTier: string) {
    const now = new Date().toISOString();
    
    const tierFilter = userTier === 'elite' ? ['academy', 'elite'] : ['academy'];
    
    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .gte('scheduled_at', now)
      .eq('status', 'scheduled')
      .in('tier_required', tierFilter)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async registerForSession(userId: string, sessionId: string) {
    const { data, error } = await supabase
      .from('session_registrations')
      .insert({
        user_id: userId,
        session_id: sessionId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 8. COMMUNITY
// =====================================================

export const communityService = {
  async getPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async createPost(
    userId: string,
    title: string,
    content: string,
    postType: string,
    images?: string[]
  ) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        title,
        content,
        post_type: postType,
        images: images || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPostWithComments(postId: string) {
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `)
      .eq('id', postId)
      .single();

    if (postError) throw postError;

    const { data: comments, error: commentsError } = await supabase
      .from('community_comments')
      .select(`
        *,
        author:profiles(full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;

    return { ...post, comments };
  },

  async addComment(userId: string, postId: string, content: string, parentCommentId?: string) {
    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content,
        parent_comment_id: parentCommentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// 9. NOTIFICATIONS
// =====================================================

export const notificationService = {
  async getNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};

// =====================================================
// 10. TELEGRAM BOT TRACKING
// =====================================================

export const telegramService = {
  async checkRateLimit(userId: string): Promise<boolean> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, telegram_queries_today, telegram_queries_reset_at')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const lastReset = new Date(profile.telegram_queries_reset_at!);
    const now = new Date();
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      await supabase
        .from('profiles')
        .update({
          telegram_queries_today: 1,
          telegram_queries_reset_at: now.toISOString()
        })
        .eq('id', userId);
      return true;
    }

    const limits = { starter: 10, academy: Infinity, elite: Infinity };
    const limit = limits[profile.tier as keyof typeof limits];

    if (profile.telegram_queries_today >= limit) {
      return false;
    }

    await supabase
      .from('profiles')
      .update({
        telegram_queries_today: profile.telegram_queries_today + 1
      })
      .eq('id', userId);

    return true;
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  
  return Array(segments)
    .fill(null)
    .map(() => 
      Array(segmentLength)
        .fill(null)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
    )
    .join('-');
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}

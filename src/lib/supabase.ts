// Re-export the supabase client from integrations
export { supabase } from '@/integrations/supabase/client';

// Type definitions for the SmartTrading Academy
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  telegram_user_id: number | null;
  whatsapp_number: string | null;
  tier: 'starter' | 'academy' | 'elite';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing' | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  telegram_queries_today: number;
  telegram_queries_reset_at: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  created_at: string;
}

export interface Course {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  tier_required: 'starter' | 'academy' | 'elite';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number | null;
  order_index: number;
  is_published: boolean;
  total_videos: number;
  total_quizzes: number;
  created_at: string;
  updated_at: string;
  category?: CourseCategory;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  lesson_type: 'video' | 'article' | 'quiz' | 'live_session';
  content_url: string | null;
  video_duration_seconds: number | null;
  article_content: string | null;
  is_free_preview: boolean;
  order_index: number;
  is_published: boolean;
  resources: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  started_at: string | null;
  completed_at: string | null;
  completion_percentage: number;
  last_accessed_at: string | null;
  course?: Course;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  enrollment_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  watched_seconds: number;
  total_seconds: number | null;
  completed_at: string | null;
  last_position_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, unknown>;
  time_taken_seconds: number | null;
  attempt_number: number;
  created_at: string;
}

export interface BotLicense {
  id: string;
  user_id: string;
  license_key: string;
  mt_account_number: string | null;
  broker: string | null;
  strategy_type: 'hedging' | 'martingale' | 'custom';
  status: 'active' | 'inactive' | 'suspended';
  activated_at: string | null;
  expires_at: string | null;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  session_type: 'group_call' | 'livestream' | 'webinar' | '1to1';
  tier_required: 'academy' | 'elite';
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  recording_url: string | null;
  replay_expires_at: string | null;
  max_participants: number | null;
  current_participants: number;
  status: 'scheduled' | 'live' | 'completed' | 'canceled';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_type: 'question' | 'discussion' | 'achievement' | 'setup_share' | null;
  images: string[] | null;
  upvotes: number;
  is_pinned: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'course_update' | 'new_lesson' | 'live_session' | 'achievement' | 'payment' | 'system';
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  user_id: string;
  tier: string;
  enrolled_courses_count: number;
  completed_courses_count: number;
  avg_completion_percentage: number;
  total_lessons_watched: number;
  total_quizzes_taken: number;
  avg_quiz_score: number;
}

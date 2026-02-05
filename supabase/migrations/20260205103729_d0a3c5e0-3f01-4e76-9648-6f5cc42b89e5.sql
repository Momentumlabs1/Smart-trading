-- =====================================================
-- SMARTTRADING ACADEMY - SUPABASE DATABASE SCHEMA
-- Complete Trading Education Platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  telegram_user_id BIGINT UNIQUE,
  whatsapp_number TEXT,
  tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'academy', 'elite')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  telegram_queries_today INTEGER DEFAULT 0,
  telegram_queries_reset_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  telegram_notifications BOOLEAN DEFAULT true,
  weekly_report BOOLEAN DEFAULT true,
  trade_alerts BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'de' CHECK (language IN ('de', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. COURSE STRUCTURE
-- =====================================================

-- Course categories
CREATE TABLE course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  tier_required TEXT NOT NULL DEFAULT 'starter' CHECK (tier_required IN ('starter', 'academy', 'elite')),
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  total_videos INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules (sections within courses)
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons (videos, articles, etc.)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('video', 'article', 'quiz', 'live_session')),
  content_url TEXT,
  video_duration_seconds INTEGER,
  article_content TEXT,
  is_free_preview BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  resources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  max_attempts INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  correct_answer TEXT NOT NULL,
  options JSONB,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. ENROLLMENT & PROGRESS TRACKING
-- =====================================================

-- Course enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completion_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  watched_seconds INTEGER DEFAULT 0,
  total_seconds INTEGER,
  completed_at TIMESTAMPTZ,
  last_position_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  time_taken_seconds INTEGER,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. TELEGRAM BOT MANAGEMENT
-- =====================================================

-- Telegram bot interactions
CREATE TABLE telegram_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  telegram_user_id BIGINT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'photo', 'document')),
  user_message TEXT,
  bot_response TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  was_upsell BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting for telegram queries
CREATE TABLE telegram_rate_limits (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  queries_today INTEGER DEFAULT 0,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. TRADING BOT MANAGEMENT
-- =====================================================

-- Trading bot licenses
CREATE TABLE bot_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  mt_account_number TEXT,
  broker TEXT,
  strategy_type TEXT DEFAULT 'hedging' CHECK (strategy_type IN ('hedging', 'martingale', 'custom')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot performance tracking
CREATE TABLE bot_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  license_id UUID NOT NULL REFERENCES bot_licenses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  trades_count INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2),
  profit_loss DECIMAL(10,2),
  balance DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(license_id, date)
);

-- =====================================================
-- 6. TRADE ANALYSIS (AI FEATURE)
-- =====================================================

-- Trade analysis history
CREATE TABLE trade_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT CHECK (analysis_type IN ('screenshot', 'csv', 'manual')),
  trades_data JSONB NOT NULL,
  ai_analysis JSONB NOT NULL,
  performance_metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. COMMUNITY & INTERACTION
-- =====================================================

-- Live sessions
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL CHECK (session_type IN ('group_call', 'livestream', 'webinar', '1to1')),
  tier_required TEXT NOT NULL CHECK (tier_required IN ('academy', 'elite')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meeting_url TEXT,
  recording_url TEXT,
  replay_expires_at TIMESTAMPTZ,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'canceled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session registrations
CREATE TABLE session_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Community posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('question', 'discussion', 'achievement', 'setup_share')),
  images JSONB,
  upvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on posts
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. PAYMENTS & TRANSACTIONS
-- =====================================================

-- Payment transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'bot_license', 'elite_upgrade')),
  product_id UUID,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. NOTIFICATIONS
-- =====================================================

-- User notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('course_update', 'new_lesson', 'live_session', 'achievement', 'payment', 'system')),
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. ANALYTICS & TRACKING
-- =====================================================

-- User activity logs
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'course_start', 'lesson_complete', 'quiz_attempt', 'bot_download', 'session_join')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course completion certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_telegram_user_id ON profiles(telegram_user_id);
CREATE INDEX idx_profiles_tier ON profiles(tier);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_courses_tier_required ON courses(tier_required);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_telegram_interactions_user_id ON telegram_interactions(user_id);
CREATE INDEX idx_telegram_interactions_created_at ON telegram_interactions(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses are publicly readable
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = true);

-- Course categories are publicly readable
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view course categories" ON course_categories FOR SELECT USING (true);

-- Course modules are publicly readable
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published modules" ON course_modules FOR SELECT USING (is_published = true);

-- Lessons are publicly readable
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published lessons" ON lessons FOR SELECT USING (is_published = true);

-- Quizzes are publicly readable
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);

-- Quiz questions are publicly readable
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lesson progress policies
CREATE POLICY "Users can view own progress" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Quiz attempts policies
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Telegram interactions policies
CREATE POLICY "Users can view own telegram interactions" ON telegram_interactions FOR SELECT USING (auth.uid() = user_id);

-- Bot licenses policies
CREATE POLICY "Users can view own bot licenses" ON bot_licenses FOR SELECT USING (auth.uid() = user_id);

-- Trade analyses policies
CREATE POLICY "Users can view own trade analyses" ON trade_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create trade analyses" ON trade_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Live sessions are publicly readable
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view live sessions" ON live_sessions FOR SELECT USING (true);

-- Session registrations policies
CREATE POLICY "Users can view own session registrations" ON session_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create session registrations" ON session_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Anyone can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Community comments policies
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- User activities policies
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own activities" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates policies
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);

-- Bot performance policies
ALTER TABLE bot_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bot performance" ON bot_performance FOR SELECT 
  USING (license_id IN (SELECT id FROM bot_licenses WHERE user_id = auth.uid()));

-- Telegram rate limits policies
ALTER TABLE telegram_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rate limits" ON telegram_rate_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rate limits" ON telegram_rate_limits FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_licenses_updated_at BEFORE UPDATE ON bot_licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'starter'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update enrollment completion percentage
CREATE OR REPLACE FUNCTION update_enrollment_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  completion_pct INTEGER;
  enrollment_id_var UUID;
BEGIN
  enrollment_id_var := NEW.enrollment_id;
  
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  JOIN course_modules cm ON l.module_id = cm.id
  JOIN enrollments e ON cm.course_id = e.course_id
  WHERE e.id = enrollment_id_var;
  
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress lp
  WHERE lp.enrollment_id = enrollment_id_var AND lp.status = 'completed';
  
  IF total_lessons > 0 THEN
    completion_pct := (completed_lessons * 100) / total_lessons;
  ELSE
    completion_pct := 0;
  END IF;
  
  UPDATE enrollments
  SET completion_percentage = completion_pct,
      last_accessed_at = NOW(),
      completed_at = CASE WHEN completion_pct = 100 THEN NOW() ELSE NULL END
  WHERE id = enrollment_id_var;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_completion
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_enrollment_completion();

-- =====================================================
-- SEED DATA FOR STARTER CONTENT
-- =====================================================

-- Insert default categories
INSERT INTO course_categories (name, slug, description, icon, order_index) VALUES
  ('Basics', 'basics', 'Grundlagen des Tradings', '📚', 1),
  ('Technische Analyse', 'technical-analysis', 'Charts lesen und verstehen', '📈', 2),
  ('Risk Management', 'risk-management', 'Kapital schützen', '🛡️', 3),
  ('Trading Psychologie', 'psychology', 'Emotionen kontrollieren', '🧠', 4),
  ('Fortgeschritten', 'advanced', 'Advanced Trading Strategien', '🚀', 5);

-- Insert starter course
INSERT INTO courses (category_id, title, slug, description, tier_required, level, duration_minutes, order_index, is_published, total_videos) VALUES
  (
    (SELECT id FROM course_categories WHERE slug = 'basics'),
    'Trading Grundlagen - Dein Start',
    'trading-basics',
    'Lerne die fundamentalen Konzepte des Tradings kennen. Dieser kostenlose Kurs zeigt dir, wie du anfängst.',
    'starter',
    'beginner',
    90,
    1,
    true,
    7
  );

-- Insert modules and lessons
DO $$
DECLARE
  basics_course_id UUID;
  module1_id UUID;
  module2_id UUID;
BEGIN
  SELECT id INTO basics_course_id FROM courses WHERE slug = 'trading-basics';
  
  INSERT INTO course_modules (course_id, title, description, order_index, is_published)
  VALUES (basics_course_id, 'Willkommen im Trading', 'Erste Schritte und Übersicht', 1, true)
  RETURNING id INTO module1_id;
  
  INSERT INTO course_modules (course_id, title, description, order_index, is_published)
  VALUES (basics_course_id, 'Chart Basics', 'Lerne Charts zu lesen', 2, true)
  RETURNING id INTO module2_id;
  
  INSERT INTO lessons (module_id, title, description, lesson_type, video_duration_seconds, is_free_preview, order_index, is_published)
  VALUES
    (module1_id, 'Was ist Trading?', 'Einführung in die Welt des Tradings', 'video', 600, true, 1, true),
    (module1_id, 'Die verschiedenen Märkte', 'Forex, Aktien, Krypto erklärt', 'video', 720, true, 2, true),
    (module1_id, 'Broker Auswahl', 'Wie du den richtigen Broker findest', 'video', 480, true, 3, true);
  
  INSERT INTO lessons (module_id, title, description, lesson_type, video_duration_seconds, is_free_preview, order_index, is_published)
  VALUES
    (module2_id, 'Candlestick Charts verstehen', 'Die Basics der Kerzen', 'video', 840, true, 1, true),
    (module2_id, 'Support und Resistance', 'Wichtige Preisniveaus erkennen', 'video', 900, true, 2, true),
    (module2_id, 'Trend-Erkennung', 'Uptrends, Downtrends, Seitwärtsmärkte', 'video', 780, true, 3, true),
    (module2_id, 'Deine erste Analyse', 'Praktische Übung', 'video', 660, true, 4, true);
END $$;
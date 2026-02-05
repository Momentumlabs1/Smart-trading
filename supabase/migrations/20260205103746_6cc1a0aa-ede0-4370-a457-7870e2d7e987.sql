-- Fix security issues: Enable RLS on remaining tables and set search_path for functions

-- Enable RLS on tables that might have been missed
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bot_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS telegram_rate_limits ENABLE ROW LEVEL SECURITY;

-- Fix functions with search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
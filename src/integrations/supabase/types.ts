export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bot_licenses: {
        Row: {
          activated_at: string | null
          broker: string | null
          created_at: string | null
          download_count: number | null
          expires_at: string | null
          id: string
          last_downloaded_at: string | null
          license_key: string
          mt_account_number: string | null
          status: string | null
          strategy_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          broker?: string | null
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          id?: string
          last_downloaded_at?: string | null
          license_key: string
          mt_account_number?: string | null
          status?: string | null
          strategy_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          broker?: string | null
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          id?: string
          last_downloaded_at?: string | null
          license_key?: string
          mt_account_number?: string | null
          status?: string | null
          strategy_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_performance: {
        Row: {
          balance: number | null
          created_at: string | null
          date: string
          id: string
          license_id: string
          profit_loss: number | null
          trades_count: number | null
          win_rate: number | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          date: string
          id?: string
          license_id: string
          profit_loss?: number | null
          trades_count?: number | null
          win_rate?: number | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          date?: string
          id?: string
          license_id?: string
          profit_loss?: number | null
          trades_count?: number | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_performance_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "bot_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string | null
          pdf_url: string | null
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_registrations: {
        Row: {
          completed_days: number[] | null
          created_at: string
          current_day: number | null
          email: string
          full_name: string
          id: string
          last_accessed_at: string | null
          registered_at: string
          updated_at: string
        }
        Insert: {
          completed_days?: number[] | null
          created_at?: string
          current_day?: number | null
          email: string
          full_name: string
          id?: string
          last_accessed_at?: string | null
          registered_at?: string
          updated_at?: string
        }
        Update: {
          completed_days?: number[] | null
          created_at?: string
          current_day?: number | null
          email?: string
          full_name?: string
          id?: string
          last_accessed_at?: string | null
          registered_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          images: Json | null
          is_answered: boolean | null
          is_pinned: boolean | null
          post_type: string | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_answered?: boolean | null
          is_pinned?: boolean | null
          post_type?: string | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_answered?: boolean | null
          is_pinned?: boolean | null
          post_type?: string | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index: number
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          slug?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          level: string
          order_index: number
          slug: string
          thumbnail_url: string | null
          tier_required: string
          title: string
          total_quizzes: number | null
          total_videos: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level?: string
          order_index: number
          slug: string
          thumbnail_url?: string | null
          tier_required?: string
          title: string
          total_quizzes?: number | null
          total_videos?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level?: string
          order_index?: number
          slug?: string
          thumbnail_url?: string | null
          tier_required?: string
          title?: string
          total_quizzes?: number | null
          total_videos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          course_id: string
          enrolled_at: string | null
          id: string
          last_accessed_at: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          last_accessed_at?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          last_accessed_at?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          enrollment_id: string
          id: string
          last_position_seconds: number | null
          lesson_id: string
          status: string
          total_seconds: number | null
          updated_at: string | null
          user_id: string
          watched_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id: string
          id?: string
          last_position_seconds?: number | null
          lesson_id: string
          status?: string
          total_seconds?: number | null
          updated_at?: string | null
          user_id: string
          watched_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: string
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string
          status?: string
          total_seconds?: number | null
          updated_at?: string | null
          user_id?: string
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          article_content: string | null
          content_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_free_preview: boolean | null
          is_published: boolean | null
          lesson_type: string
          module_id: string
          order_index: number
          resources: Json | null
          title: string
          updated_at: string | null
          video_duration_seconds: number | null
        }
        Insert: {
          article_content?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type: string
          module_id: string
          order_index: number
          resources?: Json | null
          title: string
          updated_at?: string | null
          video_duration_seconds?: number | null
        }
        Update: {
          article_content?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type?: string
          module_id?: string
          order_index?: number
          resources?: Json | null
          title?: string
          updated_at?: string | null
          video_duration_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string | null
          duration_minutes: number
          id: string
          max_participants: number | null
          meeting_url: string | null
          recording_url: string | null
          replay_expires_at: string | null
          scheduled_at: string
          session_type: string
          status: string | null
          tier_required: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes: number
          id?: string
          max_participants?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          replay_expires_at?: string | null
          scheduled_at: string
          session_type: string
          status?: string | null
          tier_required: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number
          id?: string
          max_participants?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          replay_expires_at?: string | null
          scheduled_at?: string
          session_type?: string
          status?: string | null
          tier_required?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          notification_type: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_type: string
          product_id: string | null
          status: string
          stripe_payment_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_type: string
          product_id?: string | null
          status: string
          stripe_payment_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string
          product_id?: string | null
          status?: string
          stripe_payment_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_started_at: string | null
          subscription_status: string | null
          telegram_queries_reset_at: string | null
          telegram_queries_today: number | null
          telegram_user_id: number | null
          tier: string
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          telegram_queries_reset_at?: string | null
          telegram_queries_today?: number | null
          telegram_user_id?: number | null
          tier?: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          telegram_queries_reset_at?: string | null
          telegram_queries_today?: number | null
          telegram_user_id?: number | null
          tier?: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          created_at: string | null
          id: string
          passed: boolean
          percentage: number
          quiz_id: string
          score: number
          time_taken_seconds: number | null
          total_points: number
          user_id: string
        }
        Insert: {
          answers: Json
          attempt_number: number
          created_at?: string | null
          id?: string
          passed: boolean
          percentage: number
          quiz_id: string
          score: number
          time_taken_seconds?: number | null
          total_points: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          created_at?: string | null
          id?: string
          passed?: boolean
          percentage?: number
          quiz_id?: string
          score?: number
          time_taken_seconds?: number | null
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          options: Json | null
          order_index: number
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index: number
          points?: number | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      session_registrations: {
        Row: {
          attended: boolean | null
          created_at: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_registrations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_interactions: {
        Row: {
          bot_response: string | null
          created_at: string | null
          id: string
          message_type: string
          response_time_ms: number | null
          telegram_user_id: number
          tokens_used: number | null
          user_id: string
          user_message: string | null
          was_upsell: boolean | null
        }
        Insert: {
          bot_response?: string | null
          created_at?: string | null
          id?: string
          message_type: string
          response_time_ms?: number | null
          telegram_user_id: number
          tokens_used?: number | null
          user_id: string
          user_message?: string | null
          was_upsell?: boolean | null
        }
        Update: {
          bot_response?: string | null
          created_at?: string | null
          id?: string
          message_type?: string
          response_time_ms?: number | null
          telegram_user_id?: number
          tokens_used?: number | null
          user_id?: string
          user_message?: string | null
          was_upsell?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_rate_limits: {
        Row: {
          last_reset_at: string | null
          queries_today: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          last_reset_at?: string | null
          queries_today?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          last_reset_at?: string | null
          queries_today?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_analyses: {
        Row: {
          ai_analysis: Json
          analysis_type: string | null
          created_at: string | null
          id: string
          performance_metrics: Json | null
          trades_data: Json
          user_id: string
        }
        Insert: {
          ai_analysis: Json
          analysis_type?: string | null
          created_at?: string | null
          id?: string
          performance_metrics?: Json | null
          trades_data: Json
          user_id: string
        }
        Update: {
          ai_analysis?: Json
          analysis_type?: string | null
          created_at?: string | null
          id?: string
          performance_metrics?: Json | null
          trades_data?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          language: string | null
          telegram_notifications: boolean | null
          theme: string | null
          trade_alerts: boolean | null
          updated_at: string | null
          user_id: string
          weekly_report: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          language?: string | null
          telegram_notifications?: boolean | null
          theme?: string | null
          trade_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_report?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          language?: string | null
          telegram_notifications?: boolean | null
          theme?: string | null
          trade_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_report?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

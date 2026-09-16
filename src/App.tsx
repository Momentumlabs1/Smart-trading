import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/academy/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
const EntryCheck = lazy(() => import("./pages/EntryCheck"));
const Quiz = lazy(() => import("./pages/Quiz"));
const QuizResults = lazy(() => import("./pages/QuizResults"));
const Academy = lazy(() => import("./pages/Academy"));
const Bot = lazy(() => import("./pages/Bot"));
const Challenge = lazy(() => import("./pages/Challenge"));
const ChallengePlayer = lazy(() => import("./pages/ChallengePlayer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/About"));

// Academy Pages
const AcademyLogin = lazy(() => import("./pages/academy/Login"));
const AcademyRegister = lazy(() => import("./pages/academy/Register"));
const AcademyDashboard = lazy(() => import("./pages/academy/Dashboard"));
const AcademyCourseList = lazy(() => import("./pages/academy/CourseList"));
const CoursePlayer = lazy(() => import("./pages/academy/CoursePlayer"));
const Pricing = lazy(() => import("./pages/academy/Pricing"));
const Settings = lazy(() => import("./pages/academy/Settings"));
const Community = lazy(() => import("./pages/academy/Community"));
const TelegramBot = lazy(() => import("./pages/academy/TelegramBot"));
const BotDownload = lazy(() => import("./pages/academy/BotDownload"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div role="status" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#f7f7f2", color: "#46523c", fontFamily: "Manrope, sans-serif" }}>Wird geladen…</div>}>
          <Routes>
            {/* Homepage Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/einstieg" element={<EntryCheck />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/bot" element={<Bot />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/challenge/player" element={<ChallengePlayer />} />
            
            {/* Academy Auth Pages (Public) */}
            <Route path="/academy/login" element={<AcademyLogin />} />
            <Route path="/academy/register" element={<AcademyRegister />} />
            <Route path="/academy/pricing" element={<Pricing />} />
            
            {/* Protected Academy Pages */}
            <Route path="/academy/dashboard" element={
              <ProtectedRoute>
                <AcademyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/academy/courses" element={
              <ProtectedRoute>
                <AcademyCourseList />
              </ProtectedRoute>
            } />
            <Route path="/academy/courses/:slug" element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } />
            <Route path="/academy/courses/:slug/:lessonId" element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } />
            <Route path="/academy/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/academy/community" element={
              <ProtectedRoute requiredTier="academy">
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/academy/telegram" element={
              <ProtectedRoute>
                <TelegramBot />
              </ProtectedRoute>
            } />
            <Route path="/academy/bot" element={
              <ProtectedRoute>
                <BotDownload />
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes - will be built out */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/elite" element={<Index />} />
            <Route path="/success" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            <Route path="/free" element={<Index />} />
            <Route path="/login" element={<Index />} />
            <Route path="/impressum" element={<Index />} />
            <Route path="/datenschutz" element={<Index />} />
            <Route path="/agb" element={<Index />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/academy/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import Academy from "./pages/Academy";
import Bot from "./pages/Bot";
import Challenge from "./pages/Challenge";
import NotFound from "./pages/NotFound";

// Academy Pages
import AcademyLogin from "./pages/academy/Login";
import AcademyRegister from "./pages/academy/Register";
import AcademyDashboard from "./pages/academy/Dashboard";
import AcademyCourseList from "./pages/academy/CourseList";
import CoursePlayer from "./pages/academy/CoursePlayer";
import Pricing from "./pages/academy/Pricing";
import Settings from "./pages/academy/Settings";
import Community from "./pages/academy/Community";
import TelegramBot from "./pages/academy/TelegramBot";
import BotDownload from "./pages/academy/BotDownload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Homepage Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/bot" element={<Bot />} />
            <Route path="/challenge" element={<Challenge />} />
            
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
            <Route path="/about" element={<Index />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

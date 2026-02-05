import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import Academy from "./pages/Academy";
import Bot from "./pages/Bot";
import NotFound from "./pages/NotFound";

// Academy Pages
import AcademyLogin from "./pages/academy/Login";
import AcademyRegister from "./pages/academy/Register";
import AcademyDashboard from "./pages/academy/Dashboard";
import AcademyCourseList from "./pages/academy/CourseList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* Academy Platform Routes */}
          <Route path="/academy/login" element={<AcademyLogin />} />
          <Route path="/academy/register" element={<AcademyRegister />} />
          <Route path="/academy/dashboard" element={<AcademyDashboard />} />
          <Route path="/academy/courses" element={<AcademyCourseList />} />
          
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
  </QueryClientProvider>
);

export default App;

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import Index from "./pages/Index";
const EntryCheck = lazy(() => import("./pages/EntryCheck"));
const Quiz = lazy(() => import("./pages/Quiz"));
const QuizResults = lazy(() => import("./pages/QuizResults"));
const Trades = lazy(() => import("./components/experience/TradesLanding"));
const Challenge = lazy(() => import("./pages/Challenge"));
const ChallengePlayer = lazy(() => import("./pages/ChallengePlayer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/About"));
const Legal = lazy(() => import("./pages/Legal"));
const SaifAdmin = lazy(() => import("./pages/admin/SaifAdmin"));

const BasicAcademy = lazy(() => import("./academy/AcademyApp"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div role="status" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#090b0e", color: "#efc657", fontFamily: "Manrope, sans-serif" }}>Wird geladen…</div>}>
          <Routes>
            {/* Homepage Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/einstieg" element={<EntryCheck />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/academy/*" element={<BasicAcademy />} />
            <Route path="/signale" element={<Trades />} />
            <Route path="/bot" element={<Navigate to="/signale" replace />} />
            <Route path="/admin" element={<SaifAdmin />} />
            <Route path="/impressum" element={<Legal />} />
            <Route path="/datenschutz" element={<Legal />} />
            <Route path="/risikohinweis" element={<Legal />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/challenge/player" element={<ChallengePlayer />} />
            
            {/* Placeholder routes - will be built out */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/elite" element={<Index />} />
            <Route path="/success" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            <Route path="/free" element={<Index />} />
            <Route path="/login" element={<Index />} />
            <Route path="/agb" element={<Navigate to="/impressum" replace />} />
            
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

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
            
            {/* Alte Lovable-Pfade: führen auf die echte Startseite statt auf Platzhalter */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/challenge" element={<Navigate to="/" replace />} />
            <Route path="/elite" element={<Navigate to="/" replace />} />
            <Route path="/success" element={<Navigate to="/" replace />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />
            <Route path="/free" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
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

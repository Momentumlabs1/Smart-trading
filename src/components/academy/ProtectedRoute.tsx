import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: 'starter' | 'academy' | 'elite';
}

export function ProtectedRoute({ children, requiredTier }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/academy/login" state={{ from: location }} replace />;
  }

  // Check tier if required
  if (requiredTier && profile) {
    const tierOrder = { starter: 0, academy: 1, elite: 2 };
    const userTierLevel = tierOrder[profile.tier as keyof typeof tierOrder] || 0;
    const requiredTierLevel = tierOrder[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return <Navigate to="/academy/pricing" replace />;
    }
  }

  return <>{children}</>;
}

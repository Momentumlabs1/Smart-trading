import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, Lock, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

interface ChallengeRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Name muss mindestens 2 Zeichen haben").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein").max(255),
});

export function ChallengeRegistrationModal({ isOpen, onClose, onSuccess }: ChallengeRegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = registrationSchema.safeParse({ fullName, email });
    if (!result.success) {
      const fieldErrors: { fullName?: string; email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'fullName') fieldErrors.fullName = err.message;
        if (err.path[0] === 'email') fieldErrors.email = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('challenge_registrations')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existing) {
        // Already registered, just proceed
        localStorage.setItem('challenge_email', email.toLowerCase());
        onSuccess(email.toLowerCase());
        return;
      }

      // Register new user
      const { error } = await supabase
        .from('challenge_registrations')
        .insert({
          email: email.toLowerCase(),
          full_name: fullName.trim(),
        });

      if (error) throw error;

      localStorage.setItem('challenge_email', email.toLowerCase());
      toast({
        title: "Willkommen zur Challenge! 🎉",
        description: "Du hast jetzt Zugang zu allen 5 Tagen.",
      });
      onSuccess(email.toLowerCase());
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Fehler bei der Registrierung",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="glass rounded-2xl p-8 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="text-center mb-6 relative z-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Wert: 497€ - Jetzt kostenlos</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  Starte deine <span className="text-gradient-primary">5-Tage Challenge</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Trage dich ein und erhalte sofort Zugang zu allen Videos
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Dein Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Max Mustermann"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-primary"
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="max@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-primary"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Jetzt kostenlos starten
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>100% kostenlos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>4.000+ Teilnehmer</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

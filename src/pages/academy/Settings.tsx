import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Bell, CreditCard, Save, Loader2, 
  ArrowLeft, CheckCircle2, AlertCircle, Crown, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, authService } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Profile form
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Account form
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [telegramNotifications, setTelegramNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSavingProfile(true);
      await profileService.updateProfile(user.id, {
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
      });
      await refreshProfile();
      toast({
        title: 'Profil gespeichert',
        description: 'Deine Änderungen wurden erfolgreich gespeichert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Profil konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    
    try {
      setSavingEmail(true);
      await authService.updateEmail(newEmail);
      toast({
        title: 'Bestätigungs-Email gesendet',
        description: 'Bitte bestätige deine neue Email-Adresse.',
      });
      setNewEmail('');
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Email konnte nicht geändert werden.',
        variant: 'destructive',
      });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Fehler',
        description: 'Passwörter stimmen nicht überein.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Fehler',
        description: 'Passwort muss mindestens 8 Zeichen haben.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSavingPassword(true);
      await authService.updatePassword(newPassword);
      toast({
        title: 'Passwort geändert',
        description: 'Dein Passwort wurde erfolgreich geändert.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Passwort konnte nicht geändert werden.',
        variant: 'destructive',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    try {
      setSavingNotifications(true);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: emailNotifications,
          telegram_notifications: telegramNotifications,
          weekly_report: weeklyReport,
        });

      if (error) throw error;
      
      toast({
        title: 'Einstellungen gespeichert',
        description: 'Deine Benachrichtigungseinstellungen wurden aktualisiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  const tierDisplay = {
    starter: { label: 'Starter', color: 'text-muted-foreground' },
    academy: { label: 'Academy', color: 'text-primary' },
    elite: { label: 'Elite', color: 'text-amber-500' },
  };

  const currentTier = tierDisplay[profile?.tier as keyof typeof tierDisplay] || tierDisplay.starter;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/academy/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </Link>
          <h1 className="font-bold text-lg">Einstellungen</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Benachrichtigungen</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Profil bearbeiten</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <div>
                  <p className="font-medium">Profilbild</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG oder GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dein Name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Erzähl etwas über dich..."
                    className="mt-1.5 h-24"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2">
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Speichern
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Email ändern</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Aktuelle Email: <span className="text-foreground">{user?.email}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newEmail">Neue Email-Adresse</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="neue@email.com"
                    className="mt-1.5"
                  />
                </div>
                <Button onClick={handleUpdateEmail} disabled={savingEmail || !newEmail} className="gap-2">
                  {savingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Email ändern
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Passwort ändern</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5"
                  />
                </div>
                <Button 
                  onClick={handleUpdatePassword} 
                  disabled={savingPassword || !newPassword || !confirmPassword} 
                  className="gap-2"
                >
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Passwort ändern
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Benachrichtigungen</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email-Benachrichtigungen</p>
                    <p className="text-sm text-muted-foreground">Erhalte Updates per Email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Telegram-Benachrichtigungen</p>
                    <p className="text-sm text-muted-foreground">Erhalte Updates via Telegram</p>
                  </div>
                  <Switch
                    checked={telegramNotifications}
                    onCheckedChange={setTelegramNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wöchentlicher Report</p>
                    <p className="text-sm text-muted-foreground">Dein wöchentlicher Fortschrittsbericht</p>
                  </div>
                  <Switch
                    checked={weeklyReport}
                    onCheckedChange={setWeeklyReport}
                  />
                </div>

                <Button onClick={handleSaveNotifications} disabled={savingNotifications} className="gap-2">
                  {savingNotifications ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Speichern
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Aktueller Plan</h2>
              
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  profile?.tier === 'elite' ? "bg-amber-500/20 text-amber-500" :
                  profile?.tier === 'academy' ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground"
                )}>
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <p className={cn("font-bold text-lg", currentTier.color)}>
                    {currentTier.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.tier === 'starter' ? 'Kostenloser Plan' : 
                     profile?.tier === 'academy' ? '€99/Monat' : 
                     'Einmalzahlung'}
                  </p>
                </div>
              </div>

              {profile?.tier === 'starter' && (
                <Link to="/academy/pricing">
                  <Button className="w-full gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade auf Academy
                  </Button>
                </Link>
              )}

              {profile?.tier === 'academy' && (
                <div className="space-y-4">
                  <Link to="/academy/pricing">
                    <Button className="w-full gap-2" variant="outline">
                      <Crown className="w-4 h-4" />
                      Upgrade auf Elite
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                    Abo kündigen
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

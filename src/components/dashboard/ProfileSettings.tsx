
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Shield, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfile } from '@/hooks/useDashboardData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const { 
    data: userProfile, 
    isLoading, 
    error, 
    refetch 
  } = useUserProfile();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { name: string; phone: string }) => {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          phone: profileData.phone,
        })
        .eq('id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: 'Succesvol',
        description: 'Profiel succesvol bijgewerkt',
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: 'Fout',
        description: 'Kon profiel niet bijwerken',
        variant: 'destructive',
      });
    },
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: profile.name,
      phone: profile.phone,
    });
  };

  if (error) {
    return (
      <div className={`space-y-6 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-8'}`}>
        <ErrorMessage 
          title="Kon profiel niet laden"
          message="Er is een probleem opgetreden bij het laden van je profielgegevens."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-8'}`}>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-foreground`}>Profiel Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer je accountinformatie en voorkeuren
        </p>
      </div>

      {/* Profile Information Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className={`${isMobile ? 'pb-4 px-4 pt-4' : 'pb-6'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-foreground`}>
                Persoonlijke Informatie
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Werk je persoonlijke gegevens bij
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`space-y-6 ${isMobile ? 'px-4 pb-4' : ''}`}>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Volledige Naam
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={`${isMobile ? 'h-12' : 'h-11'} bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary`}
                placeholder="Voer je volledige naam in"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mailadres
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${isMobile ? 'h-12' : 'h-11'} bg-muted/50 border-border text-muted-foreground pl-10`}
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-muted-foreground">
                E-mailadres kan niet worden gewijzigd. Neem contact op met support indien nodig.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Telefoonnummer
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className={`${isMobile ? 'h-12' : 'h-11'} bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary pl-10`}
                  placeholder="Voer je telefoonnummer in"
                />
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                className={`w-full ${isMobile ? 'h-12' : 'h-11'} bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200`}
                size="lg"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Profiel Bijwerken...
                  </>
                ) : (
                  'Profiel Bijwerken'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Security Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className={`${isMobile ? 'pb-4 px-4 pt-4' : 'pb-6'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-foreground`}>
                Account Beveiliging
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Beheer je wachtwoord en beveiligingsinstellingen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            <Button 
              variant="outline"
              className={`${isMobile ? 'h-12' : 'h-11'} bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200`}
              size="lg"
            >
              Wachtwoord Wijzigen
            </Button>
            <Button 
              variant="outline"
              className={`${isMobile ? 'h-12' : 'h-11'} bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200`}
              size="lg"
            >
              2FA Inschakelen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Shield, Settings } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, email, phone')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Succesvol',
        description: 'Profiel succesvol bijgewerkt',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Fout',
        description: 'Kon profiel niet bijwerken',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground">Profiel Instellingen</h1>
        <p className="text-muted-foreground text-lg">
          Beheer je accountinformatie en voorkeuren
        </p>
      </div>

      {/* Profile Information Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Persoonlijke Informatie
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Werk je persoonlijke gegevens bij
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Volledige Naam
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary"
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
                  className="h-11 bg-muted/50 border-border text-muted-foreground pl-10"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
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
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary pl-10"
                  placeholder="Voer je telefoonnummer in"
                />
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
                size="lg"
              >
                {loading ? 'Profiel Bijwerken...' : 'Profiel Bijwerken'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Security Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Account Beveiliging
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Beheer je wachtwoord en beveiligingsinstellingen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button 
              variant="outline"
              className="h-11 bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200"
              size="lg"
            >
              Wachtwoord Wijzigen
            </Button>
            <Button 
              variant="outline"
              className="h-11 bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200"
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

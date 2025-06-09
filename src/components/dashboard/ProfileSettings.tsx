
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
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
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
        <h1 className="text-3xl font-semibold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account information and preferences
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
                Personal Information
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Update your personal details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
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
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary pl-10"
                  placeholder="Enter your phone number"
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
                {loading ? 'Updating Profile...' : 'Update Profile'}
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
                Account Security
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Manage your password and security settings
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
              Change Password
            </Button>
            <Button 
              variant="outline"
              className="h-11 bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200"
              size="lg"
            >
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

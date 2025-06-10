
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, User, Save, Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function ProfileSettings() {
  const { data: profile, isLoading, error, refetch } = useUserProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    health_notes: '',
    training_preferences: ''
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        health_notes: profile.health_notes || '',
        training_preferences: profile.training_preferences || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: 'Profiel bijgewerkt',
        description: 'Je profiel gegevens zijn succesvol opgeslagen.',
      });

      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het opslaan van je profiel.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Profiel Instellingen</h1>
            <p className="text-muted-foreground">Beheer je profiel en voorkeuren</p>
          </div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Profiel Instellingen</h1>
            <p className="text-muted-foreground">Beheer je profiel en voorkeuren</p>
          </div>
        </div>
        <ErrorMessage 
          title="Fout bij laden profiel"
          message="Er is een fout opgetreden bij het laden van je profiel gegevens."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Profiel Instellingen</h1>
          <p className="text-muted-foreground">Beheer je profiel en voorkeuren</p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profiel Informatie
            </CardTitle>
            <CardDescription>
              Bekijk en bewerk je persoonlijke gegevens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Volledige naam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Geboortedatum</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  E-mailadres kan niet worden gewijzigd
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Noodcontact</CardTitle>
            <CardDescription>
              Contactgegevens voor noodsituaties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Naam noodcontact</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Telefoon noodcontact</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health & Training */}
        <Card>
          <CardHeader>
            <CardTitle>Gezondheid & Training</CardTitle>
            <CardDescription>
              Medische informatie en trainingsvoorkeuren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="health_notes">Medische opmerkingen</Label>
              <Textarea
                id="health_notes"
                value={formData.health_notes}
                onChange={(e) => handleInputChange('health_notes', e.target.value)}
                placeholder="Blessures, medicijnen, medische aandoeningen..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="training_preferences">Trainingsvoorkeuren</Label>
              <Textarea
                id="training_preferences"
                value={formData.training_preferences}
                onChange={(e) => handleInputChange('training_preferences', e.target.value)}
                placeholder="Gewenste trainingstijden, doelen, oefenvoorkeuren..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="min-w-32"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Profiel opslaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

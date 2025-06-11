import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface ClientProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  onUpdate: () => void;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  health_notes: string | null;
  training_preferences: string | null;
  client_status: string;
  acquisition_source: string | null;
  notes: string | null;
}

export function ClientProfileModal({ open, onOpenChange, clientId, onUpdate }: ClientProfileModalProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    health_notes: '',
    training_preferences: '',
    client_status: 'prospect',
    acquisition_source: '',
    notes: ''
  });

  useEffect(() => {
    if (open && clientId) {
      fetchClientProfile();
    }
  }, [open, clientId]);

  const fetchClientProfile = async () => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;

      setClient(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        date_of_birth: data.date_of_birth || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        health_notes: data.health_notes || '',
        training_preferences: data.training_preferences || '',
        client_status: data.client_status && data.client_status.trim() !== '' ? data.client_status : 'prospect',
        acquisition_source: data.acquisition_source || '',
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Error fetching client profile:', error);
      toast({
        title: 'Fout',
        description: 'Kon klantprofiel niet ophalen',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!client) return;

    setSaving(true);
    try {
      // Prepare data for database - convert empty strings to null for date fields
      const updateData = {
        ...formData,
        date_of_birth: formData.date_of_birth.trim() === '' ? null : formData.date_of_birth,
        phone: formData.phone.trim() === '' ? null : formData.phone,
        address: formData.address.trim() === '' ? null : formData.address,
        emergency_contact_name: formData.emergency_contact_name.trim() === '' ? null : formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone.trim() === '' ? null : formData.emergency_contact_phone,
        health_notes: formData.health_notes.trim() === '' ? null : formData.health_notes,
        training_preferences: formData.training_preferences.trim() === '' ? null : formData.training_preferences,
        acquisition_source: formData.acquisition_source.trim() === '' ? null : formData.acquisition_source,
        notes: formData.notes.trim() === '' ? null : formData.notes
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: 'Succes',
        description: 'Klantprofiel succesvol bijgewerkt',
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating client profile:', error);
      toast({
        title: 'Fout',
        description: 'Kon klantprofiel niet bijwerken',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!client && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Klantprofiel - {client?.name || 'Laden...'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="data-[state=active]:text-orange-500">Basisinfo</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:text-orange-500">Contact</TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:text-orange-500">Gezondheid & Training</TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:text-orange-500">Notities</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Volledige Naam</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Telefoon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-gray-700">Geboortedatum</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_status" className="text-gray-700">Klantstatus</Label>
                  <Select value={formData.client_status} onValueChange={(value) => handleInputChange('client_status', value)}>
                    <SelectTrigger className="focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Actief</SelectItem>
                      <SelectItem value="inactive">Inactief</SelectItem>
                      <SelectItem value="churned">Weggevallen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisition_source" className="text-gray-700">Aanwervingsbron</Label>
                  <Input
                    id="acquisition_source"
                    value={formData.acquisition_source}
                    onChange={(e) => handleInputChange('acquisition_source', e.target.value)}
                    placeholder="bijv. Website, Verwijzing, Social Media"
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700">Adres</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="focus:border-orange-500 focus:ring-orange-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name" className="text-gray-700">Noodcontact Naam</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      className="focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone" className="text-gray-700">Noodcontact Telefoon</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      className="focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="health_notes" className="text-gray-700">Gezondheidsnotities</Label>
                  <Textarea
                    id="health_notes"
                    value={formData.health_notes}
                    onChange={(e) => handleInputChange('health_notes', e.target.value)}
                    placeholder="Medische aandoeningen, blessures of gezondheidsoverwegingen..."
                    className="focus:border-orange-500 focus:ring-orange-500"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="training_preferences" className="text-gray-700">Trainingsvoorkeuren</Label>
                  <Textarea
                    id="training_preferences"
                    value={formData.training_preferences}
                    onChange={(e) => handleInputChange('training_preferences', e.target.value)}
                    placeholder="Voorkeurstijden voor training, doelen, oefenvoorkeuren..."
                    className="focus:border-orange-500 focus:ring-orange-500"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700">Interne Notities</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Interne notities over de klant..."
                  className="focus:border-orange-500 focus:ring-orange-500"
                  rows={8}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="hover:bg-gray-50"
              >
                Annuleren
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

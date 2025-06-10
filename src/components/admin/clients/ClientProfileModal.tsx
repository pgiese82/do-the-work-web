
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
        client_status: data.client_status || 'prospect',
        acquisition_source: data.acquisition_source || '',
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Error fetching client profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client profile',
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
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client profile updated successfully',
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating client profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update client profile',
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-orange-900/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Client Profile - {client?.name || 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="basic" className="text-gray-300 data-[state=active]:text-orange-400">Basic Info</TabsTrigger>
              <TabsTrigger value="contact" className="text-gray-300 data-[state=active]:text-orange-400">Contact</TabsTrigger>
              <TabsTrigger value="health" className="text-gray-300 data-[state=active]:text-orange-400">Health & Training</TabsTrigger>
              <TabsTrigger value="notes" className="text-gray-300 data-[state=active]:text-orange-400">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-gray-300">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_status" className="text-gray-300">Client Status</Label>
                  <Select value={formData.client_status} onValueChange={(value) => handleInputChange('client_status', value)}>
                    <SelectTrigger className="bg-gray-700/50 border-orange-900/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-orange-900/20">
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="churned">Churned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisition_source" className="text-gray-300">Acquisition Source</Label>
                  <Input
                    id="acquisition_source"
                    value={formData.acquisition_source}
                    onChange={(e) => handleInputChange('acquisition_source', e.target.value)}
                    placeholder="e.g., Website, Referral, Social Media"
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name" className="text-gray-300">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      className="bg-gray-700/50 border-orange-900/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone" className="text-gray-300">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      className="bg-gray-700/50 border-orange-900/20 text-white"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="health_notes" className="text-gray-300">Health Notes</Label>
                  <Textarea
                    id="health_notes"
                    value={formData.health_notes}
                    onChange={(e) => handleInputChange('health_notes', e.target.value)}
                    placeholder="Any medical conditions, injuries, or health considerations..."
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="training_preferences" className="text-gray-300">Training Preferences</Label>
                  <Textarea
                    id="training_preferences"
                    value={formData.training_preferences}
                    onChange={(e) => handleInputChange('training_preferences', e.target.value)}
                    placeholder="Preferred training times, goals, exercise preferences..."
                    className="bg-gray-700/50 border-orange-900/20 text-white"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Internal notes about the client..."
                  className="bg-gray-700/50 border-orange-900/20 text-white"
                  rows={8}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

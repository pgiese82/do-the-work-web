
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Save, Mail, Bell, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface NotificationPreference {
  id?: string;
  notification_type: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  toast_enabled: boolean;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAdminAuth();

  const notificationTypes = [
    { key: 'new_booking', label: 'New Bookings', description: 'When clients create new bookings' },
    { key: 'payment_confirmation', label: 'Payment Confirmations', description: 'When payments are successfully processed' },
    { key: 'payment_failed', label: 'Payment Failures', description: 'When payments fail (Critical alerts)' },
    { key: 'booking_cancelled', label: 'Booking Cancellations', description: 'When clients cancel their bookings' },
    { key: 'same_day_cancellation', label: 'Same-Day Cancellations', description: 'Urgent cancellations within 24 hours' },
    { key: 'no_show', label: 'No-Shows', description: 'When clients don\'t show up for appointments' },
    { key: 'system_alert', label: 'System Alerts', description: 'Important system notifications' }
  ];

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('notification_preferences')
        .select('*')
        .eq('admin_id', user.id);

      if (error) throw error;

      // Create default preferences for types that don't exist
      const existingTypes = data?.map((p: any) => p.notification_type) || [];
      const defaultPreferences = notificationTypes.map(type => {
        const existing = data?.find((p: any) => p.notification_type === type.key);
        return existing || {
          notification_type: type.key,
          in_app_enabled: true,
          email_enabled: true,
          toast_enabled: true
        };
      });

      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notification preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (type: string, field: string, value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.notification_type === type 
          ? { ...pref, [field]: value }
          : pref
      )
    );
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const upsertData = preferences.map(pref => ({
        ...pref,
        admin_id: user.id
      }));

      const { error } = await (supabase as any)
        .from('notification_preferences')
        .upsert(upsertData, { 
          onConflict: 'admin_id,notification_type',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notification preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading preferences...</div>;
  }

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-400" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {notificationTypes.map(type => {
            const pref = preferences.find(p => p.notification_type === type.key);
            if (!pref) return null;

            return (
              <div key={type.key} className="border border-gray-700 rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="text-white font-medium">{type.label}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <Label htmlFor={`${type.key}-app`} className="text-gray-300">
                        In-App
                      </Label>
                    </div>
                    <Switch
                      id={`${type.key}-app`}
                      checked={pref.in_app_enabled}
                      onCheckedChange={(checked) => 
                        updatePreference(type.key, 'in_app_enabled', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-400" />
                      <Label htmlFor={`${type.key}-email`} className="text-gray-300">
                        Email
                      </Label>
                    </div>
                    <Switch
                      id={`${type.key}-email`}
                      checked={pref.email_enabled}
                      onCheckedChange={(checked) => 
                        updatePreference(type.key, 'email_enabled', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-400" />
                      <Label htmlFor={`${type.key}-toast`} className="text-gray-300">
                        Toast
                      </Label>
                    </div>
                    <Switch
                      id={`${type.key}-toast`}
                      checked={pref.toast_enabled}
                      onCheckedChange={(checked) => 
                        updatePreference(type.key, 'toast_enabled', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

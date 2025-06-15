
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export interface NotificationPreference {
  id?: string;
  notification_type: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  toast_enabled: boolean;
  admin_id?: string;
}

export const notificationTypes = [
    { key: 'new_booking', label: 'New Bookings', description: 'When clients create new bookings' },
    { key: 'payment_confirmation', label: 'Payment Confirmations', description: 'When payments are successfully processed' },
    { key: 'payment_failed', label: 'Payment Failures', description: 'When payments fail (Critical alerts)' },
    { key: 'booking_cancelled', label: 'Booking Cancellations', description: 'When clients cancel their bookings' },
    { key: 'same_day_cancellation', label: 'Same-Day Cancellations', description: 'Urgent cancellations within 24 hours' },
    { key: 'no_show', label: 'No-Shows', description: 'When clients don\'t show up for appointments' },
    { key: 'system_alert', label: 'System Alerts', description: 'Important system notifications' }
];

export function useNotificationPreferences(user: User | null) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('notification_preferences')
        .select('*')
        .eq('admin_id', user.id);

      if (error) throw error;

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

  return { preferences, loading, saving, updatePreference, savePreferences, notificationTypes };
}

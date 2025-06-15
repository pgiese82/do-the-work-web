
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { NotificationCategory } from './NotificationCategory';

export function NotificationPreferences() {
  const { user } = useAdminAuth();
  const { 
    preferences, 
    loading, 
    saving, 
    updatePreference, 
    savePreferences,
    notificationTypes
  } = useNotificationPreferences(user);

  if (loading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Settings className="w-5 h-5 text-orange-500" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {notificationTypes.map(type => {
            const pref = preferences.find(p => p.notification_type === type.key);
            if (!pref) return null;

            return (
              <NotificationCategory 
                key={type.key}
                type={type}
                preference={pref}
                onUpdate={updatePreference}
              />
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="bg-orange-600 text-primary-foreground hover:bg-orange-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

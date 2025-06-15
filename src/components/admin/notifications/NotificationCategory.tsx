
import React from 'react';
import { NotificationToggle } from './NotificationToggle';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { NotificationPreference } from '@/hooks/useNotificationPreferences';

interface NotificationCategoryProps {
  type: { key: string; label: string; description: string };
  preference: NotificationPreference;
  onUpdate: (type: string, field: string, value: boolean) => void;
}

export function NotificationCategory({ type, preference, onUpdate }: NotificationCategoryProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="mb-3">
        <h3 className="font-medium text-foreground">{type.label}</h3>
        <p className="text-sm text-muted-foreground">{type.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NotificationToggle
          id={`${type.key}-app`}
          label="In-App"
          icon={Bell}
          iconClassName="text-blue-500"
          checked={preference.in_app_enabled}
          onCheckedChange={(checked) => onUpdate(type.key, 'in_app_enabled', checked)}
        />
        <NotificationToggle
          id={`${type.key}-email`}
          label="Email"
          icon={Mail}
          iconClassName="text-green-500"
          checked={preference.email_enabled}
          onCheckedChange={(checked) => onUpdate(type.key, 'email_enabled', checked)}
        />
        <NotificationToggle
          id={`${type.key}-toast`}
          label="Toast"
          icon={MessageSquare}
          iconClassName="text-orange-500"
          checked={preference.toast_enabled}
          onCheckedChange={(checked) => onUpdate(type.key, 'toast_enabled', checked)}
        />
      </div>
    </div>
  );
}


import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationToggleProps {
  id: string;
  label: string;
  icon: React.ElementType;
  iconClassName: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function NotificationToggle({
  id,
  label,
  icon: Icon,
  iconClassName,
  checked,
  onCheckedChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconClassName}`} />
        <Label htmlFor={id} className="text-sm font-normal text-foreground">
          {label}
        </Label>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

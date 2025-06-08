
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, List } from 'lucide-react';

interface BookingViewToggleProps {
  viewMode: 'list' | 'calendar';
  setViewMode: (mode: 'list' | 'calendar') => void;
}

export function BookingViewToggle({ viewMode, setViewMode }: BookingViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('list')}
        className="border-white/20 text-white"
      >
        <List className="w-4 h-4 mr-2" />
        List
      </Button>
      <Button
        variant={viewMode === 'calendar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('calendar')}
        className="border-white/20 text-white"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Calendar
      </Button>
    </div>
  );
}

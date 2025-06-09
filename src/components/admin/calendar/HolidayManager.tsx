
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  isRecurring: boolean;
  color: string;
  blockBookings: boolean;
}

interface HolidayManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HolidayManager({ isOpen, onClose }: HolidayManagerProps) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    isRecurring: false,
    color: '#ff6b35',
    blockBookings: true
  });
  
  const { toast } = useToast();
  
  const colorOptions = [
    { name: 'Orange', value: '#ff6b35' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadHolidays();
    }
  }, [isOpen]);

  const loadHolidays = async () => {
    // Initialize with some common holidays
    const defaultHolidays: Holiday[] = [
      {
        id: '1',
        name: 'Christmas Day',
        startDate: '2024-12-25',
        endDate: '2024-12-25',
        description: 'Christmas holiday - gym closed',
        isRecurring: true,
        color: '#ef4444',
        blockBookings: true
      },
      {
        id: '2',
        name: 'New Year\'s Day',
        startDate: '2025-01-01',
        endDate: '2025-01-01',
        description: 'New Year holiday - gym closed',
        isRecurring: true,
        color: '#6366f1',
        blockBookings: true
      }
    ];
    
    setHolidays(defaultHolidays);
  };

  const addHoliday = () => {
    if (!newHoliday.name || !newHoliday.startDate || !newHoliday.endDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (isAfter(parseISO(newHoliday.startDate), parseISO(newHoliday.endDate))) {
      toast({
        variant: "destructive",
        title: "Invalid Date Range",
        description: "End date must be after start date.",
      });
      return;
    }

    const holiday: Holiday = {
      id: Date.now().toString(),
      name: newHoliday.name,
      startDate: newHoliday.startDate,
      endDate: newHoliday.endDate,
      description: newHoliday.description || undefined,
      isRecurring: newHoliday.isRecurring,
      color: newHoliday.color,
      blockBookings: newHoliday.blockBookings
    };

    setHolidays(prev => [...prev, holiday]);
    setNewHoliday({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      isRecurring: false,
      color: '#ff6b35',
      blockBookings: true
    });

    toast({
      title: "Holiday Added",
      description: `${holiday.name} has been added to the calendar.`,
    });
  };

  const removeHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
    toast({
      title: "Holiday Removed",
      description: "Holiday has been removed from the calendar.",
    });
  };

  const saveHolidays = async () => {
    // Here you would typically save to your backend
    console.log('Saving holidays:', holidays);
    
    toast({
      title: "Holidays Saved",
      description: "Your holiday settings have been saved successfully.",
    });
    
    onClose();
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'MMMM d, yyyy');
    }
    
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const getUpcomingHolidays = () => {
    const now = new Date();
    return holidays
      .filter(holiday => isAfter(parseISO(holiday.startDate), now))
      .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())
      .slice(0, 3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Holiday & Vacation Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Overview */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Holidays
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingHolidays().length > 0 ? (
                <div className="space-y-2">
                  {getUpcomingHolidays().map(holiday => (
                    <div key={holiday.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: holiday.color }}
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{holiday.name}</div>
                        <div className="text-sm text-gray-300">
                          {formatDateRange(holiday.startDate, holiday.endDate)}
                        </div>
                      </div>
                      {holiday.blockBookings && (
                        <Badge className="bg-red-500/20 text-red-300">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Blocks Bookings
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No upcoming holidays
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Holiday */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Add Holiday/Vacation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Holiday Name *</Label>
                  <Input
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Christmas, Personal Vacation"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Color</Label>
                  <div className="flex gap-2 mt-1">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewHoliday(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newHoliday.color === color.value ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Start Date *</Label>
                  <Input
                    type="date"
                    value={newHoliday.startDate}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">End Date *</Label>
                  <Input
                    type="date"
                    value={newHoliday.endDate}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={newHoliday.description}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description or notes"
                  className="bg-white/10 border-white/20 text-white"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newHoliday.isRecurring}
                    onCheckedChange={(checked) => setNewHoliday(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label className="text-white">Recurring annually</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newHoliday.blockBookings}
                    onCheckedChange={(checked) => setNewHoliday(prev => ({ ...prev, blockBookings: checked }))}
                  />
                  <Label className="text-white">Block new bookings</Label>
                </div>
              </div>

              <Button
                onClick={addHoliday}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            </CardContent>
          </Card>

          {/* Holiday List */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">All Holidays & Vacations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: holiday.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{holiday.name}</span>
                          {holiday.isRecurring && (
                            <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                              Recurring
                            </Badge>
                          )}
                          {holiday.blockBookings && (
                            <Badge className="bg-red-500/20 text-red-300 text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Blocks
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-300">
                          {formatDateRange(holiday.startDate, holiday.endDate)}
                        </div>
                        {holiday.description && (
                          <div className="text-sm text-gray-400 mt-1">
                            {holiday.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeHoliday(holiday.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {holidays.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No holidays configured
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={saveHolidays}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Holidays
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

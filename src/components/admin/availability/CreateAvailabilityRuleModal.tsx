
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateAvailabilityRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function CreateAvailabilityRuleModal({ open, onOpenChange, onSuccess }: CreateAvailabilityRuleModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    service_id: '',
    rule_type: '',
    // Schedule fields
    days_of_week: [] as number[],
    start_time: '',
    end_time: '',
    // Booking notice fields
    min_hours: '',
    // Max bookings fields
    max_per_day: '',
    // Blackout fields
    blackout_start_date: '',
    blackout_end_date: '',
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let ruleValue = {};

      switch (data.rule_type) {
        case 'schedule':
          ruleValue = {
            days_of_week: data.days_of_week,
            start_time: data.start_time,
            end_time: data.end_time,
          };
          break;
        case 'booking_notice':
          ruleValue = {
            min_hours: parseInt(data.min_hours),
          };
          break;
        case 'max_bookings':
          ruleValue = {
            max_per_day: parseInt(data.max_per_day),
          };
          break;
        case 'blackout':
          ruleValue = {
            start_date: data.blackout_start_date,
            end_date: data.blackout_end_date,
          };
          break;
      }

      const { error } = await supabase
        .from('availability_rules')
        .insert({
          service_id: data.service_id,
          rule_type: data.rule_type,
          rule_value: ruleValue,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Availability rule created successfully',
      });
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create availability rule',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      service_id: '',
      rule_type: '',
      days_of_week: [],
      start_time: '',
      end_time: '',
      min_hours: '',
      max_per_day: '',
      blackout_start_date: '',
      blackout_end_date: '',
    });
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: checked
        ? [...prev.days_of_week, day].sort()
        : prev.days_of_week.filter(d => d !== day)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_id || !formData.rule_type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const renderRuleTypeFields = () => {
    switch (formData.rule_type) {
      case 'schedule':
        return (
          <>
            <div>
              <Label className="text-gray-300 mb-3 block">Days of Week *</Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={formData.days_of_week.includes(day.value)}
                      onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                      className="border-orange-500/20"
                    />
                    <Label htmlFor={`day-${day.value}`} className="text-sm text-gray-300">
                      {day.label.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time" className="text-gray-300">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  className="bg-gray-700/50 border-orange-900/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="end_time" className="text-gray-300">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  className="bg-gray-700/50 border-orange-900/20 text-white"
                />
              </div>
            </div>
          </>
        );
      case 'booking_notice':
        return (
          <div>
            <Label htmlFor="min_hours" className="text-gray-300">Minimum Hours Notice *</Label>
            <Input
              id="min_hours"
              type="number"
              min="0"
              value={formData.min_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, min_hours: e.target.value }))}
              className="bg-gray-700/50 border-orange-900/20 text-white"
              placeholder="e.g., 2"
            />
          </div>
        );
      case 'max_bookings':
        return (
          <div>
            <Label htmlFor="max_per_day" className="text-gray-300">Maximum Bookings Per Day *</Label>
            <Input
              id="max_per_day"
              type="number"
              min="1"
              value={formData.max_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, max_per_day: e.target.value }))}
              className="bg-gray-700/50 border-orange-900/20 text-white"
              placeholder="e.g., 8"
            />
          </div>
        );
      case 'blackout':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blackout_start_date" className="text-gray-300">Start Date *</Label>
              <Input
                id="blackout_start_date"
                type="date"
                value={formData.blackout_start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, blackout_start_date: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="blackout_end_date" className="text-gray-300">End Date *</Label>
              <Input
                id="blackout_end_date"
                type="date"
                value={formData.blackout_end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, blackout_end_date: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-800 border-orange-900/20">
        <DialogHeader>
          <DialogTitle className="text-white">Create Availability Rule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service" className="text-gray-300">Service *</Label>
              <Select value={formData.service_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}>
                <SelectTrigger className="bg-gray-700/50 border-orange-900/20 text-white">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-orange-900/20">
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-white">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rule_type" className="text-gray-300">Rule Type *</Label>
              <Select value={formData.rule_type} onValueChange={(value) => setFormData(prev => ({ ...prev, rule_type: value }))}>
                <SelectTrigger className="bg-gray-700/50 border-orange-900/20 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-orange-900/20">
                  <SelectItem value="schedule" className="text-white">Schedule</SelectItem>
                  <SelectItem value="booking_notice" className="text-white">Booking Notice</SelectItem>
                  <SelectItem value="max_bookings" className="text-white">Max Bookings</SelectItem>
                  <SelectItem value="blackout" className="text-white">Blackout Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderRuleTypeFields()}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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

interface CreatePricingRuleModalProps {
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

export function CreatePricingRuleModal({ open, onOpenChange, onSuccess }: CreatePricingRuleModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    service_id: '',
    pricing_type: '',
    price: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    days_of_week: [] as number[],
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
      const { error } = await supabase
        .from('service_pricing')
        .insert({
          service_id: data.service_id,
          pricing_type: data.pricing_type,
          price: parseFloat(data.price),
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
          days_of_week: data.days_of_week.length > 0 ? data.days_of_week : null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Pricing rule created successfully',
      });
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create pricing rule',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      service_id: '',
      pricing_type: '',
      price: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      days_of_week: [],
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
    if (!formData.service_id || !formData.pricing_type || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-800 border-orange-900/20">
        <DialogHeader>
          <DialogTitle className="text-white">Create Pricing Rule</DialogTitle>
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
              <Label htmlFor="pricing_type" className="text-gray-300">Pricing Type *</Label>
              <Select value={formData.pricing_type} onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_type: value }))}>
                <SelectTrigger className="bg-gray-700/50 border-orange-900/20 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-orange-900/20">
                  <SelectItem value="promotional" className="text-white">Promotional</SelectItem>
                  <SelectItem value="peak" className="text-white">Peak</SelectItem>
                  <SelectItem value="off_peak" className="text-white">Off-Peak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="price" className="text-gray-300">Price (€) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="bg-gray-700/50 border-orange-900/20 text-white"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-gray-300">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="end_date" className="text-gray-300">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-gray-300">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="end_time" className="text-gray-300">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="bg-gray-700/50 border-orange-900/20 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-3 block">Days of Week (optional)</Label>
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

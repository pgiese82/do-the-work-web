
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Clock, Calendar, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkingHours {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface AvailabilityBlock {
  id: string;
  startDateTime: string;
  endDateTime: string;
  type: 'available' | 'blocked';
  reason?: string;
  recurring?: {
    frequency: 'weekly' | 'monthly';
    endDate?: string;
  };
}

interface AvailabilityManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvailabilityManager({ isOpen, onClose }: AvailabilityManagerProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>([]);
  const [newBlock, setNewBlock] = useState({
    startDateTime: '',
    endDateTime: '',
    type: 'blocked' as 'available' | 'blocked',
    reason: '',
    isRecurring: false,
    frequency: 'weekly' as 'weekly' | 'monthly',
    endDate: ''
  });
  
  const { toast } = useToast();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (isOpen) {
      loadAvailabilitySettings();
    }
  }, [isOpen]);

  const loadAvailabilitySettings = async () => {
    // Initialize with default working hours (9 AM - 5 PM, Monday to Friday)
    const defaultHours: WorkingHours[] = daysOfWeek.map((day, index) => ({
      id: `default-${index}`,
      dayOfWeek: index,
      startTime: index >= 1 && index <= 5 ? '09:00' : '',
      endTime: index >= 1 && index <= 5 ? '17:00' : '',
      isActive: index >= 1 && index <= 5
    }));
    
    setWorkingHours(defaultHours);
    setAvailabilityBlocks([]);
  };

  const updateWorkingHours = (dayIndex: number, field: string, value: any) => {
    setWorkingHours(prev => prev.map(day => 
      day.dayOfWeek === dayIndex 
        ? { ...day, [field]: value }
        : day
    ));
  };

  const addAvailabilityBlock = () => {
    if (!newBlock.startDateTime || !newBlock.endDateTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const block: AvailabilityBlock = {
      id: Date.now().toString(),
      startDateTime: newBlock.startDateTime,
      endDateTime: newBlock.endDateTime,
      type: newBlock.type,
      reason: newBlock.reason || undefined,
      recurring: newBlock.isRecurring ? {
        frequency: newBlock.frequency,
        endDate: newBlock.endDate || undefined
      } : undefined
    };

    setAvailabilityBlocks(prev => [...prev, block]);
    setNewBlock({
      startDateTime: '',
      endDateTime: '',
      type: 'blocked',
      reason: '',
      isRecurring: false,
      frequency: 'weekly',
      endDate: ''
    });

    toast({
      title: "Availability Updated",
      description: `${newBlock.type === 'blocked' ? 'Time blocked' : 'Availability added'} successfully.`,
    });
  };

  const removeAvailabilityBlock = (blockId: string) => {
    setAvailabilityBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Block Removed",
      description: "Availability block has been removed.",
    });
  };

  const saveSettings = async () => {
    // Here you would typically save to your backend
    console.log('Saving working hours:', workingHours);
    console.log('Saving availability blocks:', availabilityBlocks);
    
    toast({
      title: "Settings Saved",
      description: "Your availability settings have been saved successfully.",
    });
    
    onClose();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Availability Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="working-hours" className="space-y-6">
          <TabsList className="bg-white/10">
            <TabsTrigger value="working-hours" className="text-white data-[state=active]:bg-orange-500">
              <Clock className="w-4 h-4 mr-2" />
              Working Hours
            </TabsTrigger>
            <TabsTrigger value="blocks" className="text-white data-[state=active]:bg-orange-500">
              <Calendar className="w-4 h-4 mr-2" />
              Time Blocks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="working-hours" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Regular Working Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workingHours.map((day) => (
                  <div key={day.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-24">
                      <Switch
                        checked={day.isActive}
                        onCheckedChange={(checked) => updateWorkingHours(day.dayOfWeek, 'isActive', checked)}
                      />
                    </div>
                    <div className="w-24 text-white font-medium">
                      {daysOfWeek[day.dayOfWeek]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateWorkingHours(day.dayOfWeek, 'startTime', e.target.value)}
                        disabled={!day.isActive}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <span className="text-gray-300">to</span>
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateWorkingHours(day.dayOfWeek, 'endTime', e.target.value)}
                        disabled={!day.isActive}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Add Time Block</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newBlock.startDateTime}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, startDateTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newBlock.endDateTime}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, endDateTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type</Label>
                    <select
                      value={newBlock.type}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, type: e.target.value as 'available' | 'blocked' }))}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                    >
                      <option value="blocked">Block Time</option>
                      <option value="available">Add Availability</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Reason (Optional)</Label>
                    <Input
                      value={newBlock.reason}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g., Vacation, Meeting, etc."
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newBlock.isRecurring}
                      onCheckedChange={(checked) => setNewBlock(prev => ({ ...prev, isRecurring: checked }))}
                    />
                    <Label className="text-white">Recurring</Label>
                  </div>
                  
                  {newBlock.isRecurring && (
                    <>
                      <select
                        value={newBlock.frequency}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, frequency: e.target.value as 'weekly' | 'monthly' }))}
                        className="p-2 bg-white/10 border border-white/20 rounded text-white"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <Input
                        type="date"
                        value={newBlock.endDate}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="End date"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </>
                  )}
                </div>

                <Button
                  onClick={addAvailabilityBlock}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Current Time Blocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availabilityBlocks.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge className={block.type === 'blocked' ? 'bg-red-500' : 'bg-green-500'}>
                          {block.type === 'blocked' ? 'Blocked' : 'Available'}
                        </Badge>
                        <div className="text-white">
                          <div className="font-medium">
                            {formatDateTime(block.startDateTime)} - {formatDateTime(block.endDateTime)}
                          </div>
                          {block.reason && (
                            <div className="text-sm text-gray-300">{block.reason}</div>
                          )}
                          {block.recurring && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Repeat className="w-3 h-3" />
                              {block.recurring.frequency}
                              {block.recurring.endDate && ` until ${new Date(block.recurring.endDate).toLocaleDateString()}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeAvailabilityBlock(block.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {availabilityBlocks.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No time blocks configured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

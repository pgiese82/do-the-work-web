
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
  const daysOfWeek = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

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
        title: "Ontbrekende informatie",
        description: "Vul alle verplichte velden in.",
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
      title: "Beschikbaarheid bijgewerkt",
      description: `${newBlock.type === 'blocked' ? 'Tijd geblokkeerd' : 'Beschikbaarheid toegevoegd'} succesvol.`,
    });
  };

  const removeAvailabilityBlock = (blockId: string) => {
    setAvailabilityBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Blok verwijderd",
      description: "Beschikbaarheidsblok is verwijderd.",
    });
  };

  const saveSettings = async () => {
    // Here you would typically save to your backend
    console.log('Saving working hours:', workingHours);
    console.log('Saving availability blocks:', availabilityBlocks);
    
    toast({
      title: "Instellingen opgeslagen",
      description: "Uw beschikbaarheidsinstellingen zijn succesvol opgeslagen.",
    });
    
    onClose();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('nl-NL');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Beschikbaarheidsbeheer</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="working-hours" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="working-hours" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Werkuren
            </TabsTrigger>
            <TabsTrigger value="blocks" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Tijdblokken
            </TabsTrigger>
          </TabsList>

          <TabsContent value="working-hours" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Reguliere werkuren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workingHours.map((day) => (
                  <div key={day.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div className="w-24">
                      <Switch
                        checked={day.isActive}
                        onCheckedChange={(checked) => updateWorkingHours(day.dayOfWeek, 'isActive', checked)}
                      />
                    </div>
                    <div className="w-24 text-foreground font-medium">
                      {daysOfWeek[day.dayOfWeek]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateWorkingHours(day.dayOfWeek, 'startTime', e.target.value)}
                        disabled={!day.isActive}
                        className="bg-background border-border text-foreground"
                      />
                      <span className="text-muted-foreground">tot</span>
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateWorkingHours(day.dayOfWeek, 'endTime', e.target.value)}
                        disabled={!day.isActive}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Tijdblok toevoegen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Startdatum & tijd</Label>
                    <Input
                      type="datetime-local"
                      value={newBlock.startDateTime}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, startDateTime: e.target.value }))}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Einddatum & tijd</Label>
                    <Input
                      type="datetime-local"
                      value={newBlock.endDateTime}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, endDateTime: e.target.value }))}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Type</Label>
                    <select
                      value={newBlock.type}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, type: e.target.value as 'available' | 'blocked' }))}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                    >
                      <option value="blocked">Tijd blokkeren</option>
                      <option value="available">Beschikbaarheid toevoegen</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-foreground">Reden (optioneel)</Label>
                    <Input
                      value={newBlock.reason}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="bijv. Vakantie, Vergadering, etc."
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newBlock.isRecurring}
                      onCheckedChange={(checked) => setNewBlock(prev => ({ ...prev, isRecurring: checked }))}
                    />
                    <Label className="text-foreground">Herhalend</Label>
                  </div>
                  
                  {newBlock.isRecurring && (
                    <>
                      <select
                        value={newBlock.frequency}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, frequency: e.target.value as 'weekly' | 'monthly' }))}
                        className="p-2 bg-background border border-border rounded text-foreground"
                      >
                        <option value="weekly">Wekelijks</option>
                        <option value="monthly">Maandelijks</option>
                      </select>
                      <Input
                        type="date"
                        value={newBlock.endDate}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="Einddatum"
                        className="bg-background border-border text-foreground"
                      />
                    </>
                  )}
                </div>

                <Button
                  onClick={addAvailabilityBlock}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Blok toevoegen
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Huidige tijdblokken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availabilityBlocks.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant={block.type === 'blocked' ? 'destructive' : 'default'}>
                          {block.type === 'blocked' ? 'Geblokkeerd' : 'Beschikbaar'}
                        </Badge>
                        <div className="text-foreground">
                          <div className="font-medium">
                            {formatDateTime(block.startDateTime)} - {formatDateTime(block.endDateTime)}
                          </div>
                          {block.reason && (
                            <div className="text-sm text-muted-foreground">{block.reason}</div>
                          )}
                          {block.recurring && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Repeat className="w-3 h-3" />
                              {block.recurring.frequency === 'weekly' ? 'wekelijks' : 'maandelijks'}
                              {block.recurring.endDate && ` tot ${new Date(block.recurring.endDate).toLocaleDateString('nl-NL')}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeAvailabilityBlock(block.id)}
                        variant="outline"
                        size="sm"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {availabilityBlocks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Geen tijdblokken geconfigureerd
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Annuleren
          </Button>
          <Button
            onClick={saveSettings}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Instellingen opslaan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

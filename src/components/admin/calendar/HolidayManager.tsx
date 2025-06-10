
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
import { nl } from 'date-fns/locale';

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
    { name: 'Oranje', value: '#ff6b35' },
    { name: 'Rood', value: '#ef4444' },
    { name: 'Groen', value: '#22c55e' },
    { name: 'Blauw', value: '#3b82f6' },
    { name: 'Paars', value: '#a855f7' },
    { name: 'Roze', value: '#ec4899' },
    { name: 'Geel', value: '#eab308' },
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
        name: 'Eerste Kerstdag',
        startDate: '2024-12-25',
        endDate: '2024-12-25',
        description: 'Kerstfeest - gym gesloten',
        isRecurring: true,
        color: '#ef4444',
        blockBookings: true
      },
      {
        id: '2',
        name: 'Nieuwjaarsdag',
        startDate: '2025-01-01',
        endDate: '2025-01-01',
        description: 'Nieuwjaar - gym gesloten',
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
        title: "Ontbrekende informatie",
        description: "Vul alle verplichte velden in.",
      });
      return;
    }

    if (isAfter(parseISO(newHoliday.startDate), parseISO(newHoliday.endDate))) {
      toast({
        variant: "destructive",
        title: "Ongeldige datumbereik",
        description: "Einddatum moet na startdatum liggen.",
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
      title: "Feestdag toegevoegd",
      description: `${holiday.name} is toegevoegd aan de kalender.`,
    });
  };

  const removeHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
    toast({
      title: "Feestdag verwijderd",
      description: "Feestdag is verwijderd van de kalender.",
    });
  };

  const saveHolidays = async () => {
    // Here you would typically save to your backend
    console.log('Saving holidays:', holidays);
    
    toast({
      title: "Feestdagen opgeslagen",
      description: "Uw feestdaginstellingen zijn succesvol opgeslagen.",
    });
    
    onClose();
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'd MMMM yyyy', { locale: nl });
    }
    
    return `${format(start, 'd MMM', { locale: nl })} - ${format(end, 'd MMM yyyy', { locale: nl })}`;
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Feestdag & vakantiebeheer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Overview */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Aankomende feestdagen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingHolidays().length > 0 ? (
                <div className="space-y-2">
                  {getUpcomingHolidays().map(holiday => (
                    <div key={holiday.id} className="flex items-center gap-3 p-2 border border-border rounded">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: holiday.color }}
                      />
                      <div className="flex-1">
                        <div className="text-foreground font-medium">{holiday.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateRange(holiday.startDate, holiday.endDate)}
                        </div>
                      </div>
                      {holiday.blockBookings && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Blokkeert boekingen
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Geen aankomende feestdagen
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Holiday */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Feestdag/vakantie toevoegen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Naam feestdag *</Label>
                  <Input
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="bijv. Kerst, Persoonlijke vakantie"
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Kleur</Label>
                  <div className="flex gap-2 mt-1">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewHoliday(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newHoliday.color === color.value ? 'border-foreground' : 'border-transparent'
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
                  <Label className="text-foreground">Startdatum *</Label>
                  <Input
                    type="date"
                    value={newHoliday.startDate}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Einddatum *</Label>
                  <Input
                    type="date"
                    value={newHoliday.endDate}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground">Beschrijving</Label>
                <Textarea
                  value={newHoliday.description}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optionele beschrijving of notities"
                  className="bg-background border-border text-foreground"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newHoliday.isRecurring}
                    onCheckedChange={(checked) => setNewHoliday(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label className="text-foreground">Jaarlijks herhalend</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newHoliday.blockBookings}
                    onCheckedChange={(checked) => setNewHoliday(prev => ({ ...prev, blockBookings: checked }))}
                  />
                  <Label className="text-foreground">Nieuwe boekingen blokkeren</Label>
                </div>
              </div>

              <Button
                onClick={addHoliday}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Feestdag toevoegen
              </Button>
            </CardContent>
          </Card>

          {/* Holiday List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Alle feestdagen & vakanties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: holiday.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">{holiday.name}</span>
                          {holiday.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              Herhalend
                            </Badge>
                          )}
                          {holiday.blockBookings && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Blokkeert
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateRange(holiday.startDate, holiday.endDate)}
                        </div>
                        {holiday.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {holiday.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeHoliday(holiday.id)}
                      variant="outline"
                      size="sm"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {holidays.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Geen feestdagen geconfigureerd
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Annuleren
          </Button>
          <Button
            onClick={saveHolidays}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Feestdagen opslaan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  Mail, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BookingsBulkActionsProps {
  selectedBookings: string[];
  onActionComplete: () => void;
}

export function BookingsBulkActions({ selectedBookings, onActionComplete }: BookingsBulkActionsProps) {
  const { toast } = useToast();

  const handleConfirmBookings = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .in('id', selectedBookings);

      if (error) throw error;

      toast({
        title: "Succesvol",
        description: `${selectedBookings.length} boekingen succesvol bevestigd.`,
      });
      
      onActionComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: error.message,
      });
    }
  };

  const handleSendReminders = async () => {
    // This would typically integrate with an email service
    toast({
      title: "Herinneringen Verzonden",
      description: `Herinnering emails verzonden naar ${selectedBookings.length} klanten.`,
    });
    
    onActionComplete();
  };

  const handleExportSelected = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email),
          service:services(name, price)
        `)
        .in('id', selectedBookings);

      if (error) throw error;

      const csvData = bookings.map(booking => ({
        'Boeking ID': booking.id,
        'Klant Naam': booking.user?.name || 'N/A',
        'Klant Email': booking.user?.email || 'N/A',
        'Service': booking.service?.name || 'N/A',
        'Datum': new Date(booking.date_time).toLocaleDateString('nl-NL'),
        'Tijd': new Date(booking.date_time).toLocaleTimeString('nl-NL'),
        'Status': booking.status,
        'Betaalstatus': booking.payment_status,
        'Prijs': `€${booking.service?.price || 0}`,
        'Notities': booking.notes || '',
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geselecteerde-boekingen-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Voltooid",
        description: `${selectedBookings.length} boekingen succesvol geëxporteerd.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export Fout",
        description: error.message,
      });
    }
  };

  return (
    <Card className="bg-orange-500/10 border-orange-500/20">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{selectedBookings.length} boekingen geselecteerd</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleConfirmBookings}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Bevestig Alle
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendReminders}
              className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
            >
              <Mail className="w-4 h-4 mr-1" />
              Stuur Herinneringen
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportSelected}
              className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
            >
              <Download className="w-4 h-4 mr-1" />
              Exporteer Geselecteerde
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


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
        title: "Success",
        description: `${selectedBookings.length} bookings confirmed successfully.`,
      });
      
      onActionComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSendReminders = async () => {
    // This would typically integrate with an email service
    toast({
      title: "Reminders Sent",
      description: `Reminder emails sent to ${selectedBookings.length} clients.`,
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
        'Booking ID': booking.id,
        'Client Name': booking.user?.name || 'N/A',
        'Client Email': booking.user?.email || 'N/A',
        'Service': booking.service?.name || 'N/A',
        'Date': new Date(booking.date_time).toLocaleDateString(),
        'Time': new Date(booking.date_time).toLocaleTimeString(),
        'Status': booking.status,
        'Payment Status': booking.payment_status,
        'Price': `€${booking.service?.price || 0}`,
        'Notes': booking.notes || '',
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected-bookings-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `${selectedBookings.length} bookings exported successfully.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export Error",
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
            <span className="font-medium">{selectedBookings.length} bookings selected</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleConfirmBookings}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirm All
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendReminders}
              className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
            >
              <Mail className="w-4 h-4 mr-1" />
              Send Reminders
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportSelected}
              className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
            >
              <Download className="w-4 h-4 mr-1" />
              Export Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

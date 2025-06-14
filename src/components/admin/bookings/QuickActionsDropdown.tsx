
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';

interface QuickActionsDropdownProps {
  booking: {
    id: string;
    status: string;
    payment_status: string;
    user: {
      email: string;
      phone: string | null;
    };
  };
  onEdit: () => void;
  onUpdate: () => void;
}

export function QuickActionsDropdown({ booking, onEdit, onUpdate }: QuickActionsDropdownProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: 'Status Bijgewerkt',
        description: `Boeking status gewijzigd naar ${newStatus}`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fout',
        description: 'Kon boeking status niet bijwerken',
        variant: 'destructive',
      });
    }
  };

  const handleSendReminder = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-booking-reminder', {
        body: { bookingId: booking.id }
      });

      if (error) throw error;

      toast({
        title: 'Herinnering Verzonden',
        description: 'Boeking herinnering succesvol verzonden',
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Fout',
        description: 'Kon herinnering niet verzenden',
        variant: 'destructive',
      });
    }
  };

  const handleSendSMS = async () => {
    if (!booking.user.phone) {
      toast({
        title: 'Geen Telefoonnummer',
        description: 'Klant heeft geen telefoonnummer in het systeem',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-sms-reminder', {
        body: { bookingId: booking.id }
      });

      if (error) throw error;

      toast({
        title: 'SMS Verzonden',
        description: 'SMS herinnering succesvol verzonden',
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: 'Fout',
        description: 'Kon SMS niet verzenden',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-700 border-orange-900/20">
        <DropdownMenuItem onClick={onEdit} className="text-gray-300 hover:text-white hover:bg-gray-600">
          <Edit className="mr-2 h-4 w-4" />
          Bewerk Details
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-orange-900/20" />
        
        {booking.status !== 'confirmed' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('confirmed')}
            className="text-green-400 hover:text-green-300 hover:bg-gray-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Bevestig Boeking
          </DropdownMenuItem>
        )}
        
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('completed')}
            className="text-blue-400 hover:text-blue-300 hover:bg-gray-600"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Markeer als Voltooid
          </DropdownMenuItem>
        )}
        
        {booking.status !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('cancelled')}
            className="text-red-400 hover:text-red-300 hover:bg-gray-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Annuleer Boeking
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-orange-900/20" />
        
        <DropdownMenuItem 
          onClick={handleSendReminder}
          className="text-gray-300 hover:text-white hover:bg-gray-600"
        >
          <Mail className="mr-2 h-4 w-4" />
          Stuur Email Herinnering
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleSendSMS}
          className="text-gray-300 hover:text-white hover:bg-gray-600"
          disabled={!booking.user.phone}
        >
          <Phone className="mr-2 h-4 w-4" />
          Stuur SMS Herinnering
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

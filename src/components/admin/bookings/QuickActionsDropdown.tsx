
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
        title: 'Status Updated',
        description: `Booking status changed to ${newStatus}`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
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
        title: 'Reminder Sent',
        description: 'Booking reminder sent successfully',
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reminder',
        variant: 'destructive',
      });
    }
  };

  const handleSendSMS = async () => {
    if (!booking.user.phone) {
      toast({
        title: 'No Phone Number',
        description: 'Client does not have a phone number on file',
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
        title: 'SMS Sent',
        description: 'SMS reminder sent successfully',
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: 'Error',
        description: 'Failed to send SMS',
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
          Edit Details
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-orange-900/20" />
        
        {booking.status !== 'confirmed' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('confirmed')}
            className="text-green-400 hover:text-green-300 hover:bg-gray-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Booking
          </DropdownMenuItem>
        )}
        
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('completed')}
            className="text-blue-400 hover:text-blue-300 hover:bg-gray-600"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Mark Complete
          </DropdownMenuItem>
        )}
        
        {booking.status !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={() => handleStatusChange('cancelled')}
            className="text-red-400 hover:text-red-300 hover:bg-gray-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Booking
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-orange-900/20" />
        
        <DropdownMenuItem 
          onClick={handleSendReminder}
          className="text-gray-300 hover:text-white hover:bg-gray-600"
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Email Reminder
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleSendSMS}
          className="text-gray-300 hover:text-white hover:bg-gray-600"
          disabled={!booking.user.phone}
        >
          <Phone className="mr-2 h-4 w-4" />
          Send SMS Reminder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

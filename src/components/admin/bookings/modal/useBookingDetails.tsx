
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  date_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  internal_notes: string | null;
  session_notes: string | null;
  attendance_status: 'present' | 'absent' | 'late' | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

export function useBookingDetails(bookingId: string | null, open: boolean) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  
  // Form states
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');
  const [newDateTime, setNewDateTime] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  
  // Communication states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (open && bookingId) {
      fetchBookingDetails();
    }
  }, [open, bookingId]);

  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(id, name, email, phone),
          service:services(name, price, duration)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      // Type cast the attendance_status to ensure it matches our interface
      const bookingData: BookingDetails = {
        ...data,
        attendance_status: data.attendance_status as 'present' | 'absent' | 'late' | null
      };

      setBooking(bookingData);
      setStatus(data.status);
      setPaymentStatus(data.payment_status);
      setInternalNotes(data.internal_notes || '');
      setSessionNotes(data.session_notes || '');
      setAttendanceStatus(data.attendance_status || '');
      setNewDateTime(format(new Date(data.date_time), "yyyy-MM-dd'T'HH:mm"));
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch booking details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!booking) return;

    setSaving(true);
    try {
      const updates: any = {
        status,
        payment_status: paymentStatus,
        internal_notes: internalNotes,
        session_notes: sessionNotes,
        attendance_status: attendanceStatus,
      };

      if (newDateTime !== format(new Date(booking.date_time), "yyyy-MM-dd'T'HH:mm")) {
        updates.date_time = newDateTime;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking updated successfully',
      });

      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!booking || refundAmount <= 0) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'refunded',
          internal_notes: `${internalNotes}\n\nRefund processed: €${refundAmount} on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: 'Refund Processed',
        description: `Refund of €${refundAmount} has been processed`,
      });

      fetchBookingDetails();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: 'Error',
        description: 'Failed to process refund',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = async () => {
    if (!booking || !emailSubject || !emailMessage) return;

    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-custom-email', {
        body: {
          to: booking.user.email,
          subject: emailSubject,
          message: emailMessage,
          bookingId: booking.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Email Sent',
        description: `Email sent to ${booking.user.email}`,
      });

      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendSMS = async () => {
    if (!booking || !smsMessage || !booking.user.phone) return;

    setSendingSMS(true);
    try {
      const { error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: booking.user.phone,
          message: smsMessage,
          bookingId: booking.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'SMS Sent',
        description: `SMS sent to ${booking.user.phone}`,
      });

      setSmsMessage('');
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: 'Error',
        description: 'Failed to send SMS',
        variant: 'destructive',
      });
    } finally {
      setSendingSMS(false);
    }
  };

  return {
    booking,
    loading,
    saving,
    sendingEmail,
    sendingSMS,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    internalNotes,
    setInternalNotes,
    sessionNotes,
    setSessionNotes,
    attendanceStatus,
    setAttendanceStatus,
    newDateTime,
    setNewDateTime,
    refundAmount,
    setRefundAmount,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    smsMessage,
    setSmsMessage,
    handleSave,
    handleProcessRefund,
    handleSendEmail,
    handleSendSMS,
    fetchBookingDetails
  };
}

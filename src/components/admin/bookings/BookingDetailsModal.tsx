import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  User, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Mail, 
  Phone,
  Clock,
  FileText,
  DollarSign,
  Save,
  Send
} from 'lucide-react';

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string | null;
  onUpdate: () => void;
}

interface BookingDetails {
  id: string;
  date_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
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

export function BookingDetailsModal({ open, onOpenChange, bookingId, onUpdate }: BookingDetailsModalProps) {
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

      setBooking(data);
      setStatus(data.status);
      setPaymentStatus(data.payment_status);
      setInternalNotes(''); // Initialize as empty since not in DB yet
      setSessionNotes(''); // Initialize as empty since not in DB yet
      setAttendanceStatus(''); // Initialize as empty since not in DB yet
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
      };

      if (newDateTime !== format(new Date(booking.date_time), "yyyy-MM-dd'T'HH:mm")) {
        updates.date_time = newDateTime;
      }

      // For now, we'll store internal notes, session notes, and attendance in the existing notes field
      // This is a temporary solution until we add proper database fields
      if (internalNotes || sessionNotes || attendanceStatus) {
        const notesData = {
          internal_notes: internalNotes,
          session_notes: sessionNotes,
          attendance_status: attendanceStatus,
          original_notes: booking.notes
        };
        updates.notes = JSON.stringify(notesData);
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

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!booking || refundAmount <= 0) return;

    try {
      // This would typically integrate with a payment processor
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'refunded',
          notes: `${booking.notes || ''}\n\nRefund processed: €${refundAmount} on ${format(new Date(), 'yyyy-MM-dd HH:mm')}`
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

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Loading...</DialogTitle>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-orange-900/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Booking Details - {booking.user.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="details" className="text-gray-300 data-[state=active]:text-orange-400">Details</TabsTrigger>
            <TabsTrigger value="communication" className="text-gray-300 data-[state=active]:text-orange-400">Communication</TabsTrigger>
            <TabsTrigger value="attendance" className="text-gray-300 data-[state=active]:text-orange-400">Attendance</TabsTrigger>
            <TabsTrigger value="payment" className="text-gray-300 data-[state=active]:text-orange-400">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Info */}
              <Card className="bg-gray-700/50 border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-400" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-gray-300">
                    <strong>Name:</strong> {booking.user.name}
                  </div>
                  <div className="text-gray-300">
                    <strong>Email:</strong> {booking.user.email}
                  </div>
                  <div className="text-gray-300">
                    <strong>Phone:</strong> {booking.user.phone || 'Not provided'}
                  </div>
                </CardContent>
              </Card>

              {/* Service Info */}
              <Card className="bg-gray-700/50 border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-gray-300">
                    <strong>Service:</strong> {booking.service.name}
                  </div>
                  <div className="text-gray-300">
                    <strong>Duration:</strong> {booking.service.duration} minutes
                  </div>
                  <div className="text-gray-300">
                    <strong>Price:</strong> €{booking.service.price}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Details Form */}
            <Card className="bg-gray-700/50 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white">Booking Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="datetime" className="text-gray-300">Date & Time</Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      value={newDateTime}
                      onChange={(e) => setNewDateTime(e.target.value)}
                      className="bg-gray-600 border-orange-900/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-gray-300">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="internal-notes" className="text-gray-300">Internal Notes</Label>
                  <Textarea
                    id="internal-notes"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add internal notes (not visible to client)..."
                    className="bg-gray-600 border-orange-900/20 text-white"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="communication" className="space-y-6">
            {/* Email Section */}
            <Card className="bg-gray-700/50 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Send Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-subject" className="text-gray-300">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="bg-gray-600 border-orange-900/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email-message" className="text-gray-300">Message</Label>
                  <Textarea
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Email message..."
                    className="bg-gray-600 border-orange-900/20 text-white"
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleSendEmail} 
                  disabled={sendingEmail || !emailSubject || !emailMessage}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </Button>
              </CardContent>
            </Card>

            {/* SMS Section */}
            <Card className="bg-gray-700/50 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  Send SMS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-message" className="text-gray-300">Message</Label>
                  <Textarea
                    id="sms-message"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="SMS message..."
                    className="bg-gray-600 border-orange-900/20 text-white"
                    rows={3}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {smsMessage.length}/160 characters
                  </div>
                </div>
                <Button 
                  onClick={handleSendSMS} 
                  disabled={sendingSMS || !smsMessage || !booking.user.phone}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingSMS ? 'Sending...' : 'Send SMS'}
                </Button>
                {!booking.user.phone && (
                  <p className="text-yellow-400 text-sm">No phone number available for this client</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-gray-700/50 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Attendance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="attendance" className="text-gray-300">Attendance Status</Label>
                  <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
                    <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                      <SelectValue placeholder="Select attendance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="session-notes" className="text-gray-300">Session Notes</Label>
                  <Textarea
                    id="session-notes"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Add session notes, progress, observations..."
                    className="bg-gray-600 border-orange-900/20 text-white"
                    rows={4}
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Attendance & Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="bg-gray-700/50 border-orange-900/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  Payment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment-status" className="text-gray-300">Payment Status</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="refund-amount" className="text-gray-300">Refund Amount (€)</Label>
                    <Input
                      id="refund-amount"
                      type="number"
                      min="0"
                      max={booking.service.price}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="bg-gray-600 border-orange-900/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                    <Save className="w-4 h-4 mr-2" />
                    Update Payment Status
                  </Button>
                  
                  <Button 
                    onClick={handleProcessRefund} 
                    disabled={refundAmount <= 0 || paymentStatus === 'refunded'}
                    variant="outline"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                </div>

                <div className="bg-gray-600/50 p-4 rounded-lg">
                  <div className="text-gray-300 space-y-1">
                    <div><strong>Service Price:</strong> €{booking.service.price}</div>
                    <div><strong>Current Status:</strong> <Badge variant="outline" className={`
                      ${paymentStatus === 'paid' ? 'text-green-400 border-green-400' : ''}
                      ${paymentStatus === 'pending' ? 'text-yellow-400 border-yellow-400' : ''}
                      ${paymentStatus === 'failed' ? 'text-red-400 border-red-400' : ''}
                      ${paymentStatus === 'refunded' ? 'text-gray-400 border-gray-400' : ''}
                    `}>{paymentStatus}</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

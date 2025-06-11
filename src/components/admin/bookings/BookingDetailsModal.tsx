
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { BookingDetailsTab } from './modal/BookingDetailsTab';
import { CommunicationTab } from './modal/CommunicationTab';
import { AttendanceTab } from './modal/AttendanceTab';
import { PaymentTab } from './modal/PaymentTab';
import { useBookingDetails } from './modal/useBookingDetails';

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string | null;
  onUpdate: () => void;
}

export function BookingDetailsModal({ open, onOpenChange, bookingId, onUpdate }: BookingDetailsModalProps) {
  const {
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
    handleSendSMS
  } = useBookingDetails(bookingId, open);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      onUpdate();
      onOpenChange(false);
    }
  };

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Loading...</DialogTitle>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Booking Details - {booking.user.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="details" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background">Details</TabsTrigger>
            <TabsTrigger value="communication" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background">Communication</TabsTrigger>
            <TabsTrigger value="attendance" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background">Attendance</TabsTrigger>
            <TabsTrigger value="payment" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <BookingDetailsTab
              booking={booking}
              status={status}
              setStatus={setStatus}
              internalNotes={internalNotes}
              setInternalNotes={setInternalNotes}
              newDateTime={newDateTime}
              setNewDateTime={setNewDateTime}
              onSave={onSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationTab
              booking={booking}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              emailMessage={emailMessage}
              setEmailMessage={setEmailMessage}
              smsMessage={smsMessage}
              setSmsMessage={setSmsMessage}
              onSendEmail={handleSendEmail}
              onSendSMS={handleSendSMS}
              sendingEmail={sendingEmail}
              sendingSMS={sendingSMS}
            />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTab
              attendanceStatus={attendanceStatus}
              setAttendanceStatus={setAttendanceStatus}
              sessionNotes={sessionNotes}
              setSessionNotes={setSessionNotes}
              onSave={onSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentTab
              booking={booking}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              refundAmount={refundAmount}
              setRefundAmount={setRefundAmount}
              onSave={onSave}
              onProcessRefund={handleProcessRefund}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

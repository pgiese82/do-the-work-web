
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingsFilters } from './BookingsFilters';
import { BookingsBulkActions } from './BookingsBulkActions';
import { BookingDetailsModal } from './BookingDetailsModal';
import { QuickActionsDropdown } from './QuickActionsDropdown';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  Search, 
  Download, 
  User,
  Edit
} from 'lucide-react';

interface Booking {
  id: string;
  date_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  service: {
    name: string;
    price: number;
  };
}

export function AdminBookingsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', searchTerm, statusFilter, paymentFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email, phone),
          service:services(name, price)
        `)
        .order('date_time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show');
      }

      if (paymentFilter !== 'all') {
        query = query.eq('payment_status', paymentFilter as 'pending' | 'paid' | 'failed' | 'refunded');
      }

      if (dateRange.from) {
        query = query.gte('date_time', dateRange.from);
      }

      if (dateRange.to) {
        query = query.lte('date_time', dateRange.to);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by search term (client name or booking ID)
      if (searchTerm) {
        return data.filter(booking => 
          booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data;
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(bookings.map(booking => booking.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, bookingId]);
    } else {
      setSelectedBookings(prev => prev.filter(id => id !== bookingId));
    }
  };

  const handleEditBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDetailsModalOpen(true);
  };

  const exportToCSV = () => {
    const csvData = bookings.map(booking => ({
      'Booking ID': booking.id,
      'Client Name': booking.user?.name || 'N/A',
      'Client Email': booking.user?.email || 'N/A',
      'Service': booking.service?.name || 'N/A',
      'Date': format(new Date(booking.date_time), 'yyyy-MM-dd'),
      'Time': format(new Date(booking.date_time), 'HH:mm'),
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
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Search, Filters and Export */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by client name or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <BookingsFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            
            <Button 
              onClick={exportToCSV}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <BookingsBulkActions
              selectedBookings={selectedBookings}
              onActionComplete={() => {
                setSelectedBookings([]);
                refetch();
              }}
            />
          )}

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBookings.length === bookings.length && bookings.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading bookings...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={(checked) => handleSelectBooking(booking.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{booking.user?.name || 'N/A'}</div>
                            <div className="text-muted-foreground text-xs">{booking.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.service?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <div>{format(new Date(booking.date_time), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(booking.date_time), 'HH:mm')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={booking.payment_status} />
                      </TableCell>
                      <TableCell>
                        €{booking.service?.price || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBooking(booking.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                          <QuickActionsDropdown
                            booking={booking}
                            onEdit={() => handleEditBooking(booking.id)}
                            onUpdate={refetch}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BookingDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        bookingId={selectedBookingId}
        onUpdate={refetch}
      />
    </>
  );
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingsFilters } from './BookingsFilters';
import { BookingsBulkActions } from './BookingsBulkActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  Search, 
  Download, 
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  notes: string | null;
  user: {
    name: string;
    email: string;
  };
  service: {
    name: string;
    price: number;
  };
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
  no_show: AlertCircle,
};

const paymentStatusColors = {
  pending: 'text-yellow-400',
  paid: 'text-green-400',
  failed: 'text-red-400',
  refunded: 'text-gray-400',
};

const statusColors = {
  pending: 'text-yellow-400',
  confirmed: 'text-blue-400',
  completed: 'text-green-400',
  cancelled: 'text-red-400',
  no_show: 'text-orange-400',
};

export function AdminBookingsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', searchTerm, statusFilter, paymentFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email),
          service:services(name, price)
        `)
        .order('date_time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (paymentFilter !== 'all') {
        query = query.eq('payment_status', paymentFilter);
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
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Bookings Management
          </span>
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by client name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-orange-900/20 text-white placeholder:text-gray-400"
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
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBookings.length === bookings.length && bookings.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-orange-500/20"
                  />
                </TableHead>
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Service</TableHead>
                <TableHead className="text-gray-300">Date & Time</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Payment</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons] || Clock;
                  
                  return (
                    <TableRow key={booking.id} className="border-orange-900/20 hover:bg-gray-700/20">
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={(checked) => handleSelectBooking(booking.id, checked as boolean)}
                          className="border-orange-500/20"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-white font-medium">{booking.user?.name || 'N/A'}</div>
                            <div className="text-gray-400 text-xs">{booking.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{booking.service?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="text-gray-300">
                          <div>{format(new Date(booking.date_time), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-gray-400">{format(new Date(booking.date_time), 'HH:mm')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${statusColors[booking.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="capitalize">{booking.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors]}`}>
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize">{booking.payment_status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        €{booking.service?.price || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

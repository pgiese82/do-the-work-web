import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  User,
  Edit,
  Trash2,
  Copy,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { useAdvancedBookingSearch } from '@/hooks/useAdvancedBookingSearch';
import { useEnhancedBookingOperations } from '@/hooks/useEnhancedBookingOperations';
import { BookingsFilters } from './BookingsFilters';
import { BookingsBulkActions } from './BookingsBulkActions';
import { BookingDetailsModal } from './BookingDetailsModal';
import { QuickActionsDropdown } from './QuickActionsDropdown';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function EnhancedBookingsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [clientStatusFilter, setClientStatusFilter] = useState<string>('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { 
    bookings, 
    isLoading, 
    refetch, 
    sortConfig, 
    handleSort, 
    searchStats 
  } = useAdvancedBookingSearch({
    searchTerm,
    statusFilter,
    paymentFilter,
    dateRange,
    serviceFilter,
    clientStatusFilter
  });

  const { 
    performBulkUpdate, 
    deleteBooking, 
    duplicateBooking, 
    loading: operationLoading 
  } = useEnhancedBookingOperations();

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

  const handleDeleteBooking = async (bookingId: string) => {
    setBookingToDelete(bookingId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    try {
      console.log('🗑️ Attempting to delete booking:', bookingToDelete);
      
      const success = await deleteBooking(bookingToDelete);
      
      if (success) {
        console.log('✅ Booking deleted successfully, refreshing data...');
        
        // Force a complete refetch of the data
        await refetch();
        
        // Also remove from selected bookings if it was selected
        setSelectedBookings(prev => prev.filter(id => id !== bookingToDelete));
        
        toast({
          title: "Boeking verwijderd",
          description: "De boeking is succesvol verwijderd.",
        });
        
        console.log('🔄 Data refresh completed');
      } else {
        console.error('❌ Failed to delete booking');
        toast({
          variant: "destructive",
          title: "Fout bij verwijderen",
          description: "Er is een fout opgetreden bij het verwijderen van de boeking.",
        });
      }
    } catch (error) {
      console.error('💥 Error in delete process:', error);
      toast({
        variant: "destructive",
        title: "Fout bij verwijderen",
        description: "Er is een onverwachte fout opgetreden.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleDuplicateBooking = async (bookingId: string) => {
    const newDateTime = prompt('Enter new date and time (YYYY-MM-DD HH:MM):');
    if (newDateTime) {
      const success = await duplicateBooking(bookingId, newDateTime);
      if (success) {
        await refetch();
      }
    }
  };

  const exportToCSV = () => {
    const csvData = bookings.map(booking => ({
      'Booking ID': booking.id,
      'Client Name': booking.user?.name || 'N/A',
      'Client Email': booking.user?.email || 'N/A',
      'Client Status': booking.user?.client_status || 'N/A',
      'Service': booking.service?.name || 'N/A',
      'Date': format(new Date(booking.date_time), 'yyyy-MM-dd'),
      'Time': format(new Date(booking.date_time), 'HH:mm'),
      'Status': booking.status,
      'Payment Status': booking.payment_status,
      'Price': `€${booking.service?.price || 0}`,
      'Total Client Spent': `€${booking.user?.total_spent || 0}`,
      'Last Session': booking.user?.last_session_date ? format(new Date(booking.user.last_session_date), 'yyyy-MM-dd') : 'N/A',
      'Internal Notes': booking.internal_notes || '',
      'Session Notes': booking.session_notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return <ArrowUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Enhanced Booking Management</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          
          {/* Search Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{searchStats.totalResults}</div>
              <div className="text-xs text-muted-foreground">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{searchStats.pendingBookings}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{searchStats.confirmedBookings}</div>
              <div className="text-xs text-muted-foreground">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{searchStats.completedBookings}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">€{searchStats.totalRevenue.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by client name, email, booking ID, service, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <BookingsFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

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

          {/* Enhanced Table */}
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('user.name')}>
                    <div className="flex items-center gap-2">
                      Client {getSortIcon('user.name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('service.name')}>
                    <div className="flex items-center gap-2">
                      Service {getSortIcon('service.name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date_time')}>
                    <div className="flex items-center gap-2">
                      Date & Time {getSortIcon('date_time')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('service.price')}>
                    <div className="flex items-center gap-2">
                      Price {getSortIcon('service.price')}
                    </div>
                  </TableHead>
                  <TableHead>Client Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Loading enhanced bookings...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No bookings found matching your criteria
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
                            <Badge variant="outline" className="text-xs mt-1">
                              {booking.user?.client_status || 'prospect'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.service?.name || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{booking.service?.duration}min</div>
                        </div>
                      </TableCell>
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
                        <div className="text-center">
                          <div className="font-medium">€{booking.user?.total_spent || 0}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.user?.last_session_date 
                              ? format(new Date(booking.user.last_session_date), 'MMM dd')
                              : 'No sessions'
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBooking(booking.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicateBooking(booking.id)}
                            disabled={operationLoading}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={operationLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Boeking verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je deze boeking wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

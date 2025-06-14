
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
  Ban,
  Copy,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { useAdvancedBookingSearch } from '@/hooks/useAdvancedBookingSearch';
import { useEnhancedBookingOperations } from '@/hooks/useEnhancedBookingOperations';
import { useBookingUpdate } from '@/hooks/booking-operations/useBookingUpdate';
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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
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

  // Use direct booking operations for bulk and duplication
  const { 
    performBulkUpdate, 
    duplicateBooking, 
    loading: bulkOperationLoading 
  } = useEnhancedBookingOperations();

  // Use direct single update hook for cancellations
  const { updateBooking, loading: singleUpdateLoading } = useBookingUpdate();

  const loading = bulkOperationLoading || singleUpdateLoading;

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

  const handleCancelBooking = async (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      console.log('🚫 Attempting to cancel booking using direct update:', bookingToCancel);
      
      // Use direct update instead of enhanced operations to avoid bulk function
      const success = await updateBooking(bookingToCancel, { 
        status: 'cancelled',
        internal_notes: 'Geannuleerd via admin interface'
      });
      
      if (success) {
        console.log('✅ Booking cancelled successfully, refreshing data...');
        
        // Force a complete refetch of the data
        await refetch();
        
        // Also remove from selected bookings if it was selected
        setSelectedBookings(prev => prev.filter(id => id !== bookingToCancel));
        
        console.log('🔄 Data refresh completed');
        
        toast({
          title: "Boeking geannuleerd",
          description: "De boeking is succesvol geannuleerd.",
        });
      }
    } catch (error) {
      console.error('💥 Error in cancellation process:', error);
      toast({
        variant: "destructive",
        title: "Fout bij annuleren",
        description: "Er is een onverwachte fout opgetreden.",
      });
    } finally {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleDuplicateBooking = async (bookingId: string) => {
    const newDateTime = prompt('Voer nieuwe datum en tijd in (JJJJ-MM-DD UU:MM):');
    if (newDateTime) {
      const success = await duplicateBooking(bookingId, newDateTime);
      if (success) {
        await refetch();
      }
    }
  };

  const exportToCSV = () => {
    const csvData = bookings.map(booking => ({
      'Boeking ID': booking.id,
      'Klant Naam': booking.user?.name || 'N/A',
      'Klant Email': booking.user?.email || 'N/A',
      'Klant Status': booking.user?.client_status || 'N/A',
      'Service': booking.service?.name || 'N/A',
      'Datum': format(new Date(booking.date_time), 'yyyy-MM-dd'),
      'Tijd': format(new Date(booking.date_time), 'HH:mm'),
      'Status': booking.status,
      'Betaalstatus': booking.payment_status,
      'Prijs': `€${booking.service?.price || 0}`,
      'Totaal Klant Uitgegeven': `€${booking.user?.total_spent || 0}`,
      'Laatste Sessie': booking.user?.last_session_date ? format(new Date(booking.user.last_session_date), 'yyyy-MM-dd') : 'N/A',
      'Interne Notities': booking.internal_notes || '',
      'Sessie Notities': booking.session_notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boekingen-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
            <CardTitle>Uitgebreid Boekingen Beheer</CardTitle>
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
                Exporteer CSV
              </Button>
            </div>
          </div>
          
          {/* Search Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{searchStats.totalResults}</div>
              <div className="text-xs text-muted-foreground">Totaal Resultaten</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{searchStats.pendingBookings}</div>
              <div className="text-xs text-muted-foreground">In Afwachting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{searchStats.confirmedBookings}</div>
              <div className="text-xs text-muted-foreground">Bevestigd</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{searchStats.completedBookings}</div>
              <div className="text-xs text-muted-foreground">Voltooid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">€{searchStats.totalRevenue.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Omzet</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Zoek op klantnaam, email, boeking ID, service, of notities..."
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
                      Klant {getSortIcon('user.name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('service.name')}>
                    <div className="flex items-center gap-2">
                      Service {getSortIcon('service.name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date_time')}>
                    <div className="flex items-center gap-2">
                      Datum & Tijd {getSortIcon('date_time')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Betaling</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('service.price')}>
                    <div className="flex items-center gap-2">
                      Prijs {getSortIcon('service.price')}
                    </div>
                  </TableHead>
                  <TableHead>Klant Waarde</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Boekingen laden...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Geen boekingen gevonden die voldoen aan je criteria
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
                          <div>{format(new Date(booking.date_time), 'dd MMM yyyy')}</div>
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
                              ? format(new Date(booking.user.last_session_date), 'dd MMM')
                              : 'Geen sessies'
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
                            disabled={loading}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          
                          {booking.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={loading}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                          
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

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Boeking annuleren</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je deze boeking wilt annuleren? De boeking wordt op "geannuleerd" gezet en blijft zichtbaar in de administratie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Niet annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              Annuleren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

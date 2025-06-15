import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  searchTerm: string;
  statusFilter: string;
  paymentFilter: string;
  dateRange: { from: string; to: string };
  serviceFilter: string;
  clientStatusFilter: string;
}

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export const useAdvancedBookingSearch = (filters: SearchFilters) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'date_time', direction: 'desc' });

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['advanced-bookings-search', filters.statusFilter, filters.paymentFilter, filters.serviceFilter, filters.dateRange, sortConfig],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:users(
            id,
            name, 
            email, 
            phone,
            client_status,
            total_spent,
            last_session_date
          ),
          service:services(
            id,
            name, 
            price,
            duration
          )
        `);

      // Apply filters with proper type validation
      if (filters.statusFilter !== 'all') {
        const validStatuses: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
        if (validStatuses.includes(filters.statusFilter as BookingStatus)) {
          query = query.eq('status', filters.statusFilter as BookingStatus);
        }
      }

      if (filters.paymentFilter !== 'all') {
        const validPaymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded'];
        if (validPaymentStatuses.includes(filters.paymentFilter as PaymentStatus)) {
          query = query.eq('payment_status', filters.paymentFilter as PaymentStatus);
        }
      }

      if (filters.serviceFilter !== 'all') {
        query = query.eq('service_id', filters.serviceFilter);
      }

      // Client status filter is now handled on the client side.

      if (filters.dateRange.from) {
        query = query.gte('date_time', filters.dateRange.from);
      }

      if (filters.dateRange.to) {
        query = query.lte('date_time', filters.dateRange.to);
      }

      // Text search is moved to client-side to prevent errors with NULL relations
      // The .or() filter has been removed from here.

      // Apply sorting
      const ascending = sortConfig.direction === 'asc';
      if (sortConfig.key.includes('.')) {
        // Handle nested sorting (e.g., 'user.name')
        const [table, column] = sortConfig.key.split('.');
        query = query.order(column, { 
          ascending, 
          foreignTable: table 
        });
      } else {
        query = query.order(sortConfig.key, { ascending });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Advanced search error:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });

  // Perform text search and client status filtering on the client side for robustness
  const filteredBookings = useMemo(() => {
    let results = bookings;

    // Apply client status filter
    if (filters.clientStatusFilter !== 'all') {
      results = results.filter(booking => booking.user?.client_status === filters.clientStatusFilter);
    }
    
    // Apply text search
    if (!filters.searchTerm) {
      return results;
    }

    const searchLower = filters.searchTerm.toLowerCase();
    return results.filter(booking => {
      const searchFields = [
        booking.id,
        booking.user?.name,
        booking.user?.email,
        booking.service?.name,
        booking.internal_notes,
        booking.notes,
      ];

      return searchFields.some(field =>
        field && String(field).toLowerCase().includes(searchLower)
      );
    });
  }, [bookings, filters.searchTerm, filters.clientStatusFilter]);


  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate search statistics based on client-filtered results
  const searchStats = useMemo(() => {
    return {
      totalResults: filteredBookings.length,
      pendingBookings: filteredBookings.filter(b => b.status === 'pending').length,
      confirmedBookings: filteredBookings.filter(b => b.status === 'confirmed').length,
      completedBookings: filteredBookings.filter(b => b.status === 'completed').length,
      totalRevenue: filteredBookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.service?.price || 0), 0),
    };
  }, [filteredBookings]);

  return {
    bookings: filteredBookings,
    isLoading,
    refetch,
    sortConfig,
    handleSort,
    searchStats
  };
};

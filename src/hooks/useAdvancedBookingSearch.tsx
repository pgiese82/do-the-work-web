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

export const useAdvancedBookingSearch = (filters: SearchFilters) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'date_time', direction: 'desc' });

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['advanced-bookings-search', filters, sortConfig],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          user:users!inner(
            id,
            name, 
            email, 
            phone,
            client_status,
            total_spent,
            last_session_date
          ),
          service:services!inner(
            id,
            name, 
            price,
            duration
          )
        `);

      // Apply filters with proper type casting
      if (filters.statusFilter !== 'all') {
        query = query.eq('status', filters.statusFilter as any);
      }

      if (filters.paymentFilter !== 'all') {
        query = query.eq('payment_status', filters.paymentFilter as any);
      }

      if (filters.serviceFilter !== 'all') {
        query = query.eq('service_id', filters.serviceFilter);
      }

      if (filters.clientStatusFilter !== 'all') {
        query = query.eq('user.client_status', filters.clientStatusFilter);
      }

      if (filters.dateRange.from) {
        query = query.gte('date_time', filters.dateRange.from);
      }

      if (filters.dateRange.to) {
        query = query.lte('date_time', filters.dateRange.to);
      }

      // Apply text search using database full-text search
      if (filters.searchTerm) {
        query = query.or(`
          id.ilike.%${filters.searchTerm}%,
          user.name.ilike.%${filters.searchTerm}%,
          user.email.ilike.%${filters.searchTerm}%,
          service.name.ilike.%${filters.searchTerm}%,
          internal_notes.ilike.%${filters.searchTerm}%
        `);
      }

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

  // Memoized search results with additional client-side filtering for complex queries
  const filteredBookings = useMemo(() => {
    if (!filters.searchTerm) return bookings;

    return bookings.filter(booking => {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        booking.id.toLowerCase().includes(searchLower) ||
        booking.user?.name?.toLowerCase().includes(searchLower) ||
        booking.user?.email?.toLowerCase().includes(searchLower) ||
        booking.service?.name?.toLowerCase().includes(searchLower) ||
        booking.internal_notes?.toLowerCase().includes(searchLower) ||
        booking.notes?.toLowerCase().includes(searchLower)
      );
    });
  }, [bookings, filters.searchTerm]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate search statistics
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

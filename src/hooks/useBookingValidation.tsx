
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BookingValidationResult {
  isValid: boolean;
  errors: string[];
  conflicts: any[];
}

export const useBookingValidation = () => {
  const { user } = useAuth();

  const validateBooking = async (
    serviceId: string,
    dateTime: Date,
    userId?: string
  ): Promise<BookingValidationResult> => {
    const result: BookingValidationResult = {
      isValid: true,
      errors: [],
      conflicts: []
    };

    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      result.isValid = false;
      result.errors.push('User moet ingelogd zijn om te boeken');
      return result;
    }

    // Check minimum notice (24 hours)
    const hoursUntilBooking = (dateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursUntilBooking < 24) {
      result.isValid = false;
      result.errors.push('Boekingen moeten minimaal 24 uur van tevoren worden gemaakt');
    }

    // Check maximum future bookings (60 days)
    const daysUntilBooking = hoursUntilBooking / 24;
    if (daysUntilBooking > 60) {
      result.isValid = false;
      result.errors.push('Boekingen kunnen maximaal 60 dagen van tevoren worden gemaakt');
    }

    // Check for existing bookings at the same time
    try {
      const { data: conflicts, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date_time,
          status,
          user_id,
          users (name, email),
          services (name, duration)
        `)
        .eq('date_time', dateTime.toISOString())
        .neq('status', 'cancelled');

      if (error) throw error;

      if (conflicts && conflicts.length > 0) {
        result.isValid = false;
        result.errors.push('Dit tijdslot is al gereserveerd');
        result.conflicts = conflicts;
      }

      // Check user's existing bookings for the same day (max 1 per day)
      const startOfDay = new Date(dateTime);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateTime);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: userBookings, error: userBookingsError } = await supabase
        .from('bookings')
        .select('id, date_time')
        .eq('user_id', targetUserId)
        .gte('date_time', startOfDay.toISOString())
        .lte('date_time', endOfDay.toISOString())
        .neq('status', 'cancelled');

      if (userBookingsError) throw userBookingsError;

      if (userBookings && userBookings.length > 0) {
        result.isValid = false;
        result.errors.push('Je hebt al een boeking op deze dag');
      }

    } catch (error) {
      console.error('Error validating booking:', error);
      result.isValid = false;
      result.errors.push('Er is een fout opgetreden bij het valideren van de boeking');
    }

    return result;
  };

  const checkAvailability = async (date: Date): Promise<string[]> => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('date_time')
        .gte('date_time', startOfDay.toISOString())
        .lte('date_time', endOfDay.toISOString())
        .neq('status', 'cancelled');

      if (error) throw error;

      return existingBookings?.map(booking => 
        new Date(booking.date_time).toTimeString().slice(0, 5)
      ) || [];
    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  };

  return {
    validateBooking,
    checkAvailability
  };
};

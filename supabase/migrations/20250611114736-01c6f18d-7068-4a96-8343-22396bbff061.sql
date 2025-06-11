
-- Fix the bulk_update_bookings function to properly handle missing attendance_status
CREATE OR REPLACE FUNCTION public.bulk_update_bookings(
  booking_ids uuid[],
  update_data jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_id uuid;
  success boolean := true;
BEGIN
  -- Start transaction is implicit in function
  
  -- Loop through each booking ID
  FOREACH booking_id IN ARRAY booking_ids
  LOOP
    -- Update booking with provided data
    UPDATE bookings 
    SET 
      status = COALESCE((update_data->>'status')::booking_status, status),
      payment_status = COALESCE((update_data->>'payment_status')::payment_status, payment_status),
      internal_notes = COALESCE(update_data->>'internal_notes', internal_notes),
      session_notes = COALESCE(update_data->>'session_notes', session_notes),
      date_time = CASE 
        WHEN update_data->>'date_time' IS NOT NULL THEN (update_data->>'date_time')::timestamp with time zone
        ELSE date_time
      END,
      attendance_status = CASE 
        WHEN update_data ? 'attendance_status' THEN
          CASE
            WHEN update_data->>'attendance_status' IS NULL OR update_data->>'attendance_status' = '' THEN NULL
            WHEN update_data->>'attendance_status' IN ('present', 'absent', 'late') THEN (update_data->>'attendance_status')
            ELSE attendance_status
          END
        ELSE attendance_status
      END,
      updated_at = now()
    WHERE id = booking_id;
    
    -- Log the bulk operation
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      'bulk_booking_update',
      'booking',
      booking_id::text,
      update_data
    );
  END LOOP;
  
  RETURN success;
EXCEPTION
  WHEN OTHERS THEN
    -- Transaction will be rolled back automatically
    RETURN false;
END;
$$;


-- Add indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_status_date ON bookings(status, date_time);

-- Add text search index for user names and emails
CREATE INDEX IF NOT EXISTS idx_users_name_email ON users USING gin(to_tsvector('dutch', name || ' ' || email));

-- Create trigger for audit logging on booking modifications
CREATE OR REPLACE FUNCTION log_booking_modifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log significant changes
  IF TG_OP = 'UPDATE' AND (
    OLD.status != NEW.status OR 
    OLD.payment_status != NEW.payment_status OR
    OLD.date_time != NEW.date_time OR
    OLD.internal_notes != NEW.internal_notes OR
    OLD.session_notes != NEW.session_notes OR
    OLD.attendance_status != NEW.attendance_status
  ) THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      'booking_updated',
      'booking',
      NEW.id::text,
      jsonb_build_object(
        'old_values', jsonb_build_object(
          'status', OLD.status,
          'payment_status', OLD.payment_status,
          'date_time', OLD.date_time,
          'internal_notes', OLD.internal_notes,
          'session_notes', OLD.session_notes,
          'attendance_status', OLD.attendance_status
        ),
        'new_values', jsonb_build_object(
          'status', NEW.status,
          'payment_status', NEW.payment_status,
          'date_time', NEW.date_time,
          'internal_notes', NEW.internal_notes,
          'session_notes', NEW.session_notes,
          'attendance_status', NEW.attendance_status
        )
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_log_booking_modifications ON bookings;
CREATE TRIGGER trigger_log_booking_modifications
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_modifications();

-- Create function for bulk booking operations with transaction support
CREATE OR REPLACE FUNCTION bulk_update_bookings(
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


-- Fix the log_booking_modifications function to properly handle NULL values in attendance_status
CREATE OR REPLACE FUNCTION public.log_booking_modifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log significant changes
  IF TG_OP = 'UPDATE' AND (
    OLD.status != NEW.status OR 
    OLD.payment_status != NEW.payment_status OR
    OLD.date_time != NEW.date_time OR
    COALESCE(OLD.internal_notes, '') != COALESCE(NEW.internal_notes, '') OR
    COALESCE(OLD.session_notes, '') != COALESCE(NEW.session_notes, '') OR
    COALESCE(OLD.attendance_status, '') != COALESCE(NEW.attendance_status, '')
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

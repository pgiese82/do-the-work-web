
-- Fix the is_booking_allowed function to include ELSE clause in CASE statement
CREATE OR REPLACE FUNCTION public.is_booking_allowed(service_id_param uuid, booking_datetime timestamp with time zone, user_id_param uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
  rule RECORD;
  booking_date DATE;
  booking_time TIME;
  booking_dow INTEGER;
  hours_notice INTEGER;
  daily_bookings INTEGER;
  max_bookings INTEGER;
BEGIN
  booking_date := booking_datetime::DATE;
  booking_time := booking_datetime::TIME;
  booking_dow := EXTRACT(DOW FROM booking_datetime)::INTEGER;
  
  -- Check all active availability rules for this service
  FOR rule IN 
    SELECT rule_type, rule_value
    FROM public.availability_rules
    WHERE service_id = service_id_param AND is_active = true
  LOOP
    CASE rule.rule_type
      WHEN 'booking_notice' THEN
        hours_notice := EXTRACT(EPOCH FROM (booking_datetime - now())) / 3600;
        IF hours_notice < (rule.rule_value->>'min_hours')::INTEGER THEN
          RETURN FALSE;
        END IF;
        
      WHEN 'max_bookings' THEN
        SELECT COUNT(*) INTO daily_bookings
        FROM public.bookings
        WHERE service_id = service_id_param
          AND date_time::DATE = booking_date
          AND status NOT IN ('cancelled', 'no_show');
          
        max_bookings := (rule.rule_value->>'max_per_day')::INTEGER;
        IF daily_bookings >= max_bookings THEN
          RETURN FALSE;
        END IF;
        
      WHEN 'schedule' THEN
        -- Check if booking time falls within allowed schedule
        IF NOT (
          booking_dow = ANY(((rule.rule_value->>'days_of_week')::TEXT)::INTEGER[]) AND
          booking_time >= (rule.rule_value->>'start_time')::TIME AND
          booking_time <= (rule.rule_value->>'end_time')::TIME
        ) THEN
          RETURN FALSE;
        END IF;
        
      WHEN 'blackout' THEN
        -- Check if booking date falls within blackout period
        IF booking_date >= (rule.rule_value->>'start_date')::DATE AND
           booking_date <= (rule.rule_value->>'end_date')::DATE THEN
          RETURN FALSE;
        END IF;
        
      ELSE
        -- Handle unknown rule types by ignoring them
        CONTINUE;
    END CASE;
  END LOOP;
  
  RETURN TRUE;
END;
$function$

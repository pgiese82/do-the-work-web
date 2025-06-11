
-- Check and fix the attendance_status constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_attendance_status_check;

-- Add the correct constraint for attendance_status
ALTER TABLE bookings ADD CONSTRAINT bookings_attendance_status_check 
CHECK (attendance_status IS NULL OR attendance_status IN ('present', 'absent', 'late'));

-- Also make sure we have proper indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status_payment ON bookings(status, payment_status);

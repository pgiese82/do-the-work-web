
-- Check if the booking_status enum has all required values
DO $$ 
BEGIN
    -- Add 'pending' to booking_status enum if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'booking_status' AND e.enumlabel = 'pending'
    ) THEN
        ALTER TYPE booking_status ADD VALUE 'pending';
    END IF;
END $$;

-- Check if the modification_type enum exists and has required values
DO $$
BEGIN
    -- Create modification_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'modification_type') THEN
        CREATE TYPE modification_type AS ENUM ('reschedule', 'cancel');
    END IF;
    
    -- Create modification_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'modification_status') THEN
        CREATE TYPE modification_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

-- Ensure the booking_modifications table uses the correct enum types
ALTER TABLE booking_modifications 
ALTER COLUMN modification_type TYPE modification_type USING modification_type::text::modification_type,
ALTER COLUMN status TYPE modification_status USING status::text::modification_status;

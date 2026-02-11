-- Migration script to add full_name column to users table
-- Run this if you get error: column "full_name" of relation "users" does not exist

-- Check if the column exists before adding it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'full_name'
    ) THEN
        -- Add the full_name column
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
        
        -- Update existing records with a default value (change as needed)
        UPDATE users SET full_name = 'User' WHERE full_name IS NULL;
        
        -- Make the column NOT NULL after updating existing records
        ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
        
        RAISE NOTICE 'Column full_name added successfully';
    ELSE
        RAISE NOTICE 'Column full_name already exists, no migration needed';
    END IF;
END $$;

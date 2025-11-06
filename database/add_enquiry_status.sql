-- Migration: Add status column to enquiries table
-- Run this script in Neon SQL Editor to add the status field to existing enquiries table

-- Add status column with default 'pending'
ALTER TABLE enquiries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL;

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Update existing enquiries to have 'pending' status if they don't have one
UPDATE enquiries SET status = 'pending' WHERE status IS NULL;

-- Verify the column was added
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'enquiries' AND column_name = 'status';


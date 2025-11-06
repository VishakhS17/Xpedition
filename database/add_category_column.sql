-- Migration: Add category column to bikes table
-- Run this script in Neon SQL Editor to add the category field to existing bikes table

-- Add category column as array
ALTER TABLE bikes 
ADD COLUMN IF NOT EXISTS category TEXT[] DEFAULT '{}';

-- Add index for category filtering (using GIN index for array operations)
CREATE INDEX IF NOT EXISTS idx_bikes_category ON bikes USING GIN(category);

-- Verify the column was added
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'bikes' AND column_name = 'category';


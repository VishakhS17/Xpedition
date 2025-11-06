-- Fix enquiries table to allow NULL bike_model for general enquiries
-- Run this in Neon SQL Editor

ALTER TABLE enquiries 
ALTER COLUMN bike_model DROP NOT NULL;


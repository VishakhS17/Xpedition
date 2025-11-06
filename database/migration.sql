-- Xpedition Database Migration
-- Run this script in Neon SQL Editor

-- ============================================
-- BIKES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  
  -- Images (stored as URLs in Cloudflare R2)
  image TEXT NOT NULL,                    -- Main image URL
  images TEXT[] DEFAULT '{}',             -- Array of additional image URLs
  
  -- Basic Information
  price TEXT NOT NULL,                    -- e.g., "₹6,25,000"
  model TEXT NOT NULL,                    -- e.g., "KAWASAKI Z900 ABS"
  brand TEXT NOT NULL,                    -- e.g., "Kawasaki"
  category TEXT[] DEFAULT '{}',            -- Array of categories: ["Adventure", "Sport"], ["Cruiser", "Touring"], etc.
  
  -- Registration Details
  reg_year TEXT NOT NULL,                 -- e.g., "2020"
  reg_state TEXT NOT NULL,                -- e.g., "Maharashtra"
  
  -- Bike Details
  kms TEXT NOT NULL,                      -- e.g., "15,000"
  color TEXT,                             -- e.g., "Metallic Spark Black"
  fuel_type TEXT,                         -- e.g., "Petrol"
  engine TEXT,                            -- e.g., "948cc, 4-Cylinder"
  condition TEXT,                         -- e.g., "Excellent", "Like New", "Mint"
  
  -- Description
  description TEXT,                       -- Full description text
  
  -- Features (stored as array)
  features TEXT[] DEFAULT '{}',          -- e.g., ["ABS", "LED Lighting", ...]
  
  -- Owner Information
  owner TEXT,                             -- e.g., "First Owner", "Second Owner"
  contact TEXT,                           -- Phone number
  
  -- Availability Status
  status TEXT DEFAULT 'available' NOT NULL, -- 'available', 'sold', 'reserved', 'pending'
  sold_at TIMESTAMP WITH TIME ZONE,       -- When the bike was sold (if sold)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT bikes_model_check CHECK (char_length(model) > 0),
  CONSTRAINT bikes_brand_check CHECK (char_length(brand) > 0),
  CONSTRAINT bikes_price_check CHECK (char_length(price) > 0)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bikes_brand ON bikes(brand);
CREATE INDEX IF NOT EXISTS idx_bikes_reg_year ON bikes(reg_year);
CREATE INDEX IF NOT EXISTS idx_bikes_reg_state ON bikes(reg_state);
CREATE INDEX IF NOT EXISTS idx_bikes_created_at ON bikes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bikes_model ON bikes(model);
CREATE INDEX IF NOT EXISTS idx_bikes_status ON bikes(status); -- For filtering available bikes
CREATE INDEX IF NOT EXISTS idx_bikes_category ON bikes USING GIN(category); -- For filtering by category (GIN index for array operations)

-- ============================================
-- TRIGGER FOR UPDATED_AT TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bikes_updated_at 
    BEFORE UPDATE ON bikes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- OPTIONAL: ADMIN USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- ENQUIRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  
  -- Customer Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Bike Information (optional - can be null if general enquiry)
  bike_id INTEGER REFERENCES bikes(id) ON DELETE SET NULL,
  bike_model TEXT, -- Store bike model for tracking popularity even if bike is sold/deleted (nullable for general enquiries)
  bike_brand TEXT, -- Store brand for better tracking
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT enquiries_email_check CHECK (char_length(email) > 0),
  CONSTRAINT enquiries_phone_check CHECK (char_length(phone) > 0)
);

-- Indexes for enquiries
CREATE INDEX IF NOT EXISTS idx_enquiries_bike_id ON enquiries(bike_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);

-- ============================================
-- HELPER VIEW: POPULAR BIKES (by enquiry count - current available bikes)
-- ============================================

CREATE OR REPLACE VIEW popular_bikes AS
SELECT 
  b.*,
  COUNT(e.id) as enquiry_count,
  MAX(e.created_at) as last_enquiry_at
FROM bikes b
LEFT JOIN enquiries e ON b.id = e.bike_id
WHERE b.status = 'available' -- Only show available bikes
GROUP BY b.id
ORDER BY enquiry_count DESC, last_enquiry_at DESC NULLS LAST;

-- ============================================
-- HELPER VIEW: POPULAR BIKE MODELS (by enquiry count - all time)
-- ============================================
-- This tracks popularity by MODEL, not specific bike instances
-- Even if a bike is sold, we can still see model popularity

CREATE OR REPLACE VIEW popular_bike_models AS
SELECT 
  bike_model,
  bike_brand,
  COUNT(*) as total_enquiries,
  COUNT(DISTINCT bike_id) as bike_instances,
  MAX(created_at) as last_enquiry_at,
  MIN(created_at) as first_enquiry_at
FROM enquiries
WHERE bike_model IS NOT NULL
GROUP BY bike_model, bike_brand
ORDER BY total_enquiries DESC, last_enquiry_at DESC;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify tables are created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Uncomment to see bikes table structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'bikes' 
-- ORDER BY ordinal_position;


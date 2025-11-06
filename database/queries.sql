-- Useful Queries for Admin Dashboard
-- These queries can be used in your admin panel

-- ============================================
-- GET MOST POPULAR BIKES (by enquiry count)
-- ============================================

-- Get top 10 most popular bikes
SELECT 
  b.id,
  b.brand,
  b.model,
  b.price,
  b.image,
  b.status,
  COUNT(e.id) as enquiry_count,
  MAX(e.created_at) as last_enquiry_at
FROM bikes b
LEFT JOIN enquiries e ON b.id = e.bike_id
WHERE b.status = 'available'
GROUP BY b.id
ORDER BY enquiry_count DESC, last_enquiry_at DESC NULLS LAST
LIMIT 10;

-- ============================================
-- GET ALL BIKES WITH ENQUIRY COUNTS
-- ============================================

SELECT 
  b.*,
  COUNT(e.id) as enquiry_count,
  MAX(e.created_at) as last_enquiry_at
FROM bikes b
LEFT JOIN enquiries e ON b.id = e.bike_id
GROUP BY b.id
ORDER BY enquiry_count DESC, b.created_at DESC;

-- ============================================
-- GET RECENT ENQUIRIES FOR A SPECIFIC BIKE
-- ============================================

SELECT 
  e.*,
  b.brand,
  b.model,
  b.price
FROM enquiries e
LEFT JOIN bikes b ON e.bike_id = b.id
WHERE e.bike_id = 1 -- Replace with actual bike ID
ORDER BY e.created_at DESC
LIMIT 20;

-- ============================================
-- GET ALL ENQUIRIES (for admin dashboard)
-- ============================================

SELECT 
  e.*,
  b.brand,
  b.model,
  b.price,
  b.image
FROM enquiries e
LEFT JOIN bikes b ON e.bike_id = b.id
ORDER BY e.created_at DESC;

-- ============================================
-- GET ENQUIRY STATISTICS
-- ============================================

-- Total enquiries
SELECT COUNT(*) as total_enquiries FROM enquiries;

-- Enquiries today
SELECT COUNT(*) as enquiries_today 
FROM enquiries 
WHERE DATE(created_at) = CURRENT_DATE;

-- Enquiries this week
SELECT COUNT(*) as enquiries_this_week 
FROM enquiries 
WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE);

-- Enquiries this month
SELECT COUNT(*) as enquiries_this_month 
FROM enquiries 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- ============================================
-- GET BIKES WITH NO ENQUIRIES (might need attention)
-- ============================================

SELECT b.*
FROM bikes b
LEFT JOIN enquiries e ON b.id = e.bike_id
WHERE e.id IS NULL 
  AND b.status = 'available'
ORDER BY b.created_at DESC;

-- ============================================
-- GET MOST POPULAR BIKE MODELS (all time - by model, not specific bike)
-- ============================================
-- This shows popularity by MODEL, even if specific bikes are sold
-- Example: "KAWASAKI Z900 ABS" has 50 enquiries total (across all instances)

SELECT 
  bike_model,
  bike_brand,
  COUNT(*) as total_enquiries,
  COUNT(DISTINCT bike_id) as bike_instances,
  MAX(created_at) as last_enquiry_at
FROM enquiries
WHERE bike_model IS NOT NULL
GROUP BY bike_model, bike_brand
ORDER BY total_enquiries DESC, last_enquiry_at DESC
LIMIT 10;

-- ============================================
-- GET POPULAR MODELS FOR CURRENTLY AVAILABLE BIKES
-- ============================================
-- Shows popular models that you currently have in stock

SELECT 
  e.bike_model,
  e.bike_brand,
  COUNT(*) as enquiry_count,
  COUNT(DISTINCT e.bike_id) as available_instances,
  MAX(e.created_at) as last_enquiry_at
FROM enquiries e
INNER JOIN bikes b ON e.bike_id = b.id
WHERE b.status = 'available'
  AND e.bike_model IS NOT NULL
GROUP BY e.bike_model, e.bike_brand
ORDER BY enquiry_count DESC, last_enquiry_at DESC;

-- ============================================
-- USE THE VIEW: POPULAR BIKE MODELS (simplest way)
-- ============================================

SELECT * FROM popular_bike_models LIMIT 10;


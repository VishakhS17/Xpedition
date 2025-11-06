"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BikeCard from "@/components/BikeCard";
import Link from "next/link";

interface Bike {
  id: number;
  image: string;
  price: string;
  model: string;
  regYear: string;
  kms: string;
  regState: string;
  brand?: string;
  status?: 'available' | 'sold' | 'reserved' | 'pending';
  category?: string[];
}

function InventoryContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [allBikes, setAllBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, and Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [yearRange, setYearRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all bikes (including sold/reserved for visibility)
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch('/api/bikes');
        if (response.ok) {
          const data = await response.json();
          setAllBikes(data.bikes || []);
        }
      } catch (error) {
        console.error('Error fetching bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  // Extract unique values for filters
  const uniqueBrands = useMemo(() => {
    const brands = allBikes
      .map(bike => bike.brand)
      .filter((brand): brand is string => Boolean(brand));
    return Array.from(new Set(brands)).sort();
  }, [allBikes]);

  const uniqueStates = useMemo(() => {
    const states = allBikes.map(bike => bike.regState);
    return Array.from(new Set(states)).sort();
  }, [allBikes]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allBikes.forEach(bike => {
      if (bike.category) {
        bike.category.forEach(cat => categories.add(cat));
      }
    });
    return Array.from(categories).sort();
  }, [allBikes]);

  // Helper function to parse price string to number
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[₹,]/g, '').trim();
    return parseInt(cleaned) || 0;
  };

  // Filter and sort bikes
  const filteredAndSortedBikes = useMemo(() => {
    let filtered = [...allBikes];

    // Apply category filter from URL or selected category
    if (selectedCategory) {
      filtered = filtered.filter(bike => 
        bike.category?.includes(selectedCategory)
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bike => 
        bike.model.toLowerCase().includes(query) ||
        bike.brand?.toLowerCase().includes(query) ||
        `${bike.brand} ${bike.model}`.toLowerCase().includes(query)
      );
    }

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(bike => bike.brand === selectedBrand);
    }

    // Apply state filter
    if (selectedState) {
      filtered = filtered.filter(bike => bike.regState === selectedState);
    }

    // Apply price range filter
    if (priceRange.min) {
      const minPrice = parsePrice(priceRange.min);
      filtered = filtered.filter(bike => parsePrice(bike.price) >= minPrice);
    }
    if (priceRange.max) {
      const maxPrice = parsePrice(priceRange.max);
      filtered = filtered.filter(bike => parsePrice(bike.price) <= maxPrice);
    }

    // Apply year range filter
    if (yearRange.min) {
      const minYear = parseInt(yearRange.min);
      filtered = filtered.filter(bike => parseInt(bike.regYear) >= minYear);
    }
    if (yearRange.max) {
      const maxYear = parseInt(yearRange.max);
      filtered = filtered.filter(bike => parseInt(bike.regYear) <= maxYear);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-high":
          return parsePrice(b.price) - parsePrice(a.price);
        case "year-newest":
          return parseInt(b.regYear) - parseInt(a.regYear);
        case "year-oldest":
          return parseInt(a.regYear) - parseInt(b.regYear);
        case "kms-low":
          return parseInt(a.kms.replace(/,/g, '')) - parseInt(b.kms.replace(/,/g, ''));
        case "kms-high":
          return parseInt(b.kms.replace(/,/g, '')) - parseInt(a.kms.replace(/,/g, ''));
        default:
          return 0;
      }
    });

    return filtered;
  }, [allBikes, searchQuery, selectedCategory, selectedBrand, selectedState, priceRange, yearRange, sortBy]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(categoryParam || "");
    setSelectedBrand("");
    setSelectedState("");
    setPriceRange({ min: "", max: "" });
    setYearRange({ min: "", max: "" });
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading text-center mb-4 tracking-wider">
              {categoryParam ? `${categoryParam.toUpperCase()} BIKES` : 'OUR INVENTORY'}
            </h1>
            {categoryParam && (
              <div className="text-center mb-4">
                <Link
                  href="/inventory"
                  className="text-primary-red hover:underline text-sm font-heading tracking-wider"
                >
                  ← VIEW ALL BIKES
                </Link>
              </div>
            )}
          </div>

          {/* Search, Filter, and Sort Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar, Sort, and Filters Button Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-full">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="year-oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="kms-low">Kms: Low to High</option>
                  <option value="kms-high">Kms: High to Low</option>
                </select>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full px-6 py-3 border-2 rounded-lg font-heading font-semibold tracking-wider transition-all duration-200 ${
                  showFilters
                    ? "bg-primary-red text-white border-primary-red hover:bg-primary-red-dark"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary-red hover:text-primary-red"
                }`}
              >
                {showFilters ? "HIDE FILTERS" : "FILTERS"}
              </button>
            </div>

            {/* Filters Section with Animation */}
            {showFilters && (
              <div
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-slideDown"
                style={{
                  animation: "slideDown 0.3s ease-out"
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-800 tracking-wider">FILTERS</h3>
                  {(searchQuery || selectedCategory || selectedBrand || selectedState || priceRange.min || priceRange.max || yearRange.min || yearRange.max) && (
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                    >
                      <option value="">All Categories</option>
                      {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                    >
                      <option value="">All Brands</option>
                      {uniqueBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Registration State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                    >
                      <option value="">All States</option>
                      {uniqueStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                      />
                      <span className="self-center text-gray-500">-</span>
                      <input
                        type="text"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={yearRange.min}
                        onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                      />
                      <span className="self-center text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={yearRange.max}
                        onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none font-sans bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bikes...</p>
            </div>
          ) : filteredAndSortedBikes.length > 0 ? (
            <>
              <p className="text-center text-gray-600 mb-8 font-sans">
                Showing {filteredAndSortedBikes.length} {filteredAndSortedBikes.length === 1 ? 'bike' : 'bikes'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
                {filteredAndSortedBikes.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl font-sans">
                No bikes found matching your criteria.
              </p>
              <p className="text-gray-500 mt-2 font-sans">
                Try adjusting your filters or{' '}
                <button
                  onClick={resetFilters}
                  className="text-primary-red hover:underline font-semibold"
                >
                  reset all filters
                </button>
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Inventory() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <InventoryContent />
    </Suspense>
  );
}

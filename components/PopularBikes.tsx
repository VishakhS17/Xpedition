"use client";

import { useState, useEffect } from "react";
import BikeCard from "./BikeCard";
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
}

export default function PopularBikes() {
  const [popularBikes, setPopularBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBikes = async () => {
      try {
        const response = await fetch('/api/popular-bikes?limit=4');
        if (response.ok) {
          const data = await response.json();
          setPopularBikes(data.bikes || []);
        }
      } catch (error) {
        console.error('Error fetching popular bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBikes();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 bg-black overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-red/5 to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
            <p className="text-gray-400">Loading popular bikes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (popularBikes.length === 0) {
    return null; // Don't show section if no popular bikes
  }

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Animated red gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-red/10 to-transparent animate-pulse"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 animate-gridMove"
            style={{
              backgroundImage: `
                linear-gradient(rgba(253, 1, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(253, 1, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          ></div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-4 py-2 bg-primary-red/20 border border-primary-red/50 text-primary-red text-sm font-heading tracking-wider">
              HOT RIGHT NOW
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-4 tracking-wider">
            POPULAR <span className="text-primary-red">BIKES</span>
          </h2>
          <div className="w-24 h-1 bg-primary-red mx-auto mt-4"></div>
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {popularBikes.map((bike, index) => (
            <div
              key={bike.id}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              className="animate-fadeInUp"
            >
              <BikeCard bike={bike} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/inventory"
            className="inline-block bg-transparent text-white font-heading font-bold py-4 px-8 rounded-lg hover:bg-primary-red transition-all duration-200 text-lg border-2 border-primary-red hover:border-primary-red-dark tracking-wider"
          >
            VIEW ALL BIKES →
          </Link>
        </div>
      </div>
    </section>
  );
}

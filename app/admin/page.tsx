"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

interface Stats {
  totalForSale: number;
  totalSold: number;
  availableCount: number;
  soldCount: number;
}

interface PopularBike {
  id: number;
  brand: string;
  model: string;
  price: string;
  image: string;
  status: string;
  enquiryCount: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [popularBikes, setPopularBikes] = useState<PopularBike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setPopularBikes(data.popularBikes || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-gray-900 mb-2 tracking-wider">OVERVIEW</h1>
        <div className="w-24 h-1 bg-primary-red"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">TOTAL FOR SALE</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatPrice(stats.totalForSale.toString()) : "₹0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats?.availableCount || 0} bikes</p>
            </div>
            <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-red">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75m16.5 1.5v-.75A.75.75 0 0018 15h-.75m-16.5 1.5v1.125c0 .621.504 1.125 1.125 1.125H20.25a1.125 1.125 0 001.125-1.125V19.5m0-2.25v.75c0 .414.336.75.75.75h.75M4.5 15H3m13.5-2.25H21" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">TOTAL SOLD</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatPrice(stats.totalSold.toString()) : "₹0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats?.soldCount || 0} bikes</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">AVAILABLE BIKES</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.availableCount || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Currently listed</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m16.5 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-9 5.25v-1.875m0-12.75h.008v.037c0 .027.002.055.004.083m-.004 0c.01.136.024.283.046.431.013.14.03.285.05.434.02.15.043.3.07.45.026.15.056.3.09.45.033.15.07.3.11.44.04.14.084.28.13.42.047.14.098.28.15.42.053.14.11.28.17.42.06.14.124.28.19.42.067.14.138.28.21.42.073.14.15.28.23.42.08.14.163.28.25.42.087.14.178.28.27.42.093.14.19.28.29.42.1.14.204.28.31.42.106.14.216.28.33.42.114.14.232.28.35.42.119.14.242.28.37.42.128.14.26.28.4.42.14.14.285.28.43.42.145.14.295.28.45.42.155.14.315.28.48.42.165.14.335.28.51.42.175.14.355.28.54.42.185.14.375.28.57.42.195.14.395.28.6.42.205.14.415.28.63.42.215.14.435.28.66.42.225.14.455.28.69.42.235.14.475.28.72.42.245.14.495.28.75.42.255.14.515.28.78.42.265.14.535.28.81.42.275.14.555.28.84.42.285.14.575.28.87.42.295.14.595.28.9.42.305.14.615.28.93.42.315.14.635.28.96.42.325.14.655.28.99.42.335.14.675.28 1.02.42.345.14.695.28 1.05.42.355.14.715.28 1.08.42.365.14.735.28 1.11.42.375.14.755.28 1.14.42.385.14.775.28 1.17.42.395.14.795.28 1.2.42.405.14.815.28 1.23.42.415.14.835.28 1.26.42.425.14.855.28 1.29.42.435.14.875.28 1.32.42.445.14.895.28 1.35.42.455.14.915.28 1.38.42.465.14.935.28 1.41.42.475.14.955.28 1.44.42.485.14.975.28 1.47.42.495.14.995.28 1.5.42.505.14 1.015.28 1.53.42.515.14 1.035.28 1.56.42.525.14 1.055.28 1.59.42.535.14 1.075.28 1.62.42.545.14 1.095.28 1.65.42.555.14 1.115.28 1.68.42.565.14 1.135.28 1.71.42.575.14 1.155.28 1.74.42.585.14 1.175.28 1.77.42.595.14 1.195.28 1.8.42.605.14 1.215.28 1.83.42.615.14 1.235.28 1.86.42.625.14 1.255.28 1.89.42.635.14 1.275.28 1.92.42.645.14 1.295.28 1.95.42.655.14 1.315.28 1.98.42.665.14 1.335.28 2.01.42.675.14 1.355.28 2.04.42.685.14 1.375.28 2.07.42.695.14 1.395.28 2.1.42.705.14 1.415.28 2.13.42.715.14 1.435.28 2.16.42.725.14 1.455.28 2.19.42.735.14 1.475.28 2.22.42.745.14 1.495.28 2.25.42.755.14 1.515.28 2.28.42.765.14 1.535.28 2.31.42.775.14 1.555.28 2.34.42.785.14 1.575.28 2.37.42.795.14 1.595.28 2.4.42.805.14 1.615.28 2.43.42.815.14 1.635.28 2.46.42.825.14 1.655.28 2.49.42.835.14 1.675.28 2.52.42.845.14 1.695.28 2.55.42.855.14 1.715.28 2.58.42.865.14 1.735.28 2.61.42.875.14 1.755.28 2.64.42.885.14 1.775.28 2.67.42.895.14 1.795.28 2.7.42.905.14 1.815.28 2.73.42.915.14 1.835.28 2.76.42.925.14 1.855.28 2.79.42.935.14 1.875.28 2.82.42.945.14 1.895.28 2.85.42.955.14 1.915.28 2.88.42.965.14 1.935.28 2.91.42.975.14 1.955.28 2.94.42.985.14 1.975.28 2.97.42.995.14 1.995.28 3 .42" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">SOLD BIKES</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.soldCount || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total sold</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Bikes Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-heading text-gray-900 mb-6 tracking-wider">
          🔥 POPULAR <span className="text-primary-red">BIKES</span>
        </h2>
        {popularBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularBikes.map((bike) => (
              <Link
                key={bike.id}
                href={`/admin/listings?edit=${bike.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={bike.image}
                    alt={bike.model}
                    fill
                    className="object-cover rounded"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-bold text-sm">{bike.brand} {bike.model}</h3>
                <p className="text-primary-red font-semibold">{formatPrice(bike.price)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  🔥 {bike.enquiryCount} enquiries
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No popular bikes yet.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatPrice";

interface BikeCardProps {
  bike: {
    id: number;
    image: string;
    price: string;
    model: string;
    brand?: string;
    regYear: string;
    kms: string;
    regState: string;
    status?: 'available' | 'sold' | 'reserved' | 'pending';
  };
}

export default function BikeCard({ bike }: BikeCardProps) {
  return (
    <Link href={`/inventory/${bike.id}`} scroll={false}>
      <motion.div
        className={`group relative bg-gray-900 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer h-full flex flex-col ${
          bike.status === 'sold' 
            ? 'border-gray-700 opacity-75' 
            : bike.status === 'reserved'
            ? 'border-yellow-500/50'
            : 'border-gray-800 hover:border-primary-red/50'
        }`}
        whileHover={bike.status !== 'sold' ? { y: -8, scale: 1.02 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/0 via-primary-red/0 to-primary-red/0 group-hover:from-primary-red/10 group-hover:via-primary-red/5 group-hover:to-primary-red/10 transition-all duration-300 pointer-events-none"></div>
        
        {/* Image container with overlay */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden flex-shrink-0">
          <Image
            src={bike.image}
            alt={bike.model}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Status badge */}
          {bike.status && bike.status !== 'available' && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-heading font-bold shadow-lg ${
              bike.status === 'sold' 
                ? 'bg-gray-800 text-white' 
                : bike.status === 'reserved'
                ? 'bg-yellow-500 text-white'
                : 'bg-orange-500 text-white'
            }`}>
              {bike.status.toUpperCase()}
            </div>
          )}
          
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-primary-red text-white font-heading font-bold px-4 py-2 rounded-lg shadow-lg shadow-primary-red/50">
            {formatPrice(bike.price)}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 bg-gray-900 relative flex-1 flex flex-col">
          <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-3 group-hover:text-primary-red transition-colors duration-300 min-h-[3.5rem]">
            {bike.brand && <span className="text-primary-red">{bike.brand}</span>} {bike.model}
          </h3>
          <div className="space-y-2 text-sm text-gray-400 flex-grow">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Reg. Year:</span>
              <span className="text-white">{bike.regYear}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Kms:</span>
              <span className="text-white">{bike.kms}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Reg. State:</span>
              <span className="text-white">{bike.regState}</span>
            </div>
          </div>
          
          {/* View details link */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex-shrink-0">
            <span className="text-primary-red text-sm font-heading font-semibold tracking-wider group-hover:tracking-widest transition-all duration-300">
              VIEW DETAILS →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}


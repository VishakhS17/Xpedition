"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <Navbar />
      
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
          {/* Fallback image if video doesn't load */}
          <Image
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80"
            alt="Super Bike"
            fill
            className="object-cover"
            priority
          />
        </video>
        {/* Overlay to darken video */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      


      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary-red/20 border border-primary-red/50 text-primary-red text-sm font-heading tracking-wider mb-4">
              EXOTIC SUPER BIKES
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-white mb-6 leading-tight">
            WHERE DREAMS
            <br />
            <span className="text-primary-red">RIDE AGAIN</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 font-semibold max-w-xl">
            WE ARE THE BEST WHEN IT COMES TO EXOTIC SUPER BIKES
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/inventory"
              className="bg-primary-red text-white font-heading font-bold py-4 px-8 rounded-lg hover:bg-primary-red-dark transition-all duration-200 text-center text-lg tracking-wider shadow-lg shadow-primary-red/50 hover:shadow-primary-red/70"
            >
              BROWSE COLLECTION
            </Link>
            <Link
              href="/sell-us"
              className="bg-transparent text-white font-heading font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-all duration-200 text-center text-lg border-2 border-white/50 hover:border-white tracking-wider"
            >
              SELL US
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}



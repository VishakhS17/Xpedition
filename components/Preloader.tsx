"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Hide preloader when page is loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Small delay for smooth transition
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Desktop Preloader */}
      <div className="hidden md:block absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Animated red gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-red/20 to-transparent animate-pulse"></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0 animate-gridMove"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(253, 1, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(253, 1, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            ></div>
          </div>

          {/* Animated lines */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red/50 to-transparent animate-slideRight"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red/30 to-transparent animate-slideLeft"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red/40 to-transparent animate-slideRight"></div>
          </div>

          {/* Glow effects */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-red/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary-red/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Desktop Preloader Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="flex items-center gap-4">
            {['X', 'P', 'E', 'D', 'I', 'T', 'I', 'O', 'N'].map((letter, index) => (
              <span
                key={index}
                className="text-8xl lg:text-9xl font-heading font-bold text-white tracking-wider"
                style={{
                  animation: `fadeInLetter 0.8s ease-out forwards`,
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Preloader */}
      <div className="md:hidden absolute inset-0">
        {/* Simplified gradient background for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Subtle red gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-red/10 to-transparent animate-pulse"></div>
          
          {/* Simple glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-red/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Mobile Preloader Content - Compact version */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="flex items-center gap-1">
            {['X', 'P', 'E', 'D', 'I', 'T', 'I', 'O', 'N'].map((letter, index) => (
              <span
                key={index}
                className="text-4xl font-heading font-bold text-white tracking-wider"
                style={{
                  animation: `fadeInLetter 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


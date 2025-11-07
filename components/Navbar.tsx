"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // On home page: transparent when at top, glassmorphism when scrolled
  // On other pages: always solid black background
  const shouldShowBackground = !isHomePage || isScrolled;
  const useGlassmorphism = isHomePage && isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useGlassmorphism
          ? "bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : shouldShowBackground
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      {/* Glassmorphism overlay effect - only on homepage when scrolled */}
      {useGlassmorphism && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-primary-red/5 pointer-events-none"></div>
        </>
      )}
      
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-heading text-white tracking-wider drop-shadow-lg group-hover:text-primary-red transition-colors duration-300">
              <span className="text-3xl font-black text-primary-red">X</span>PEDITION
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/inventory"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider relative group"
            >
              <span className="relative z-10">INVENTORY</span>
              <span className="absolute inset-0 bg-primary-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
            </Link>
            <Link
              href="/sell-us"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider relative group"
            >
              <span className="relative z-10">SELL US</span>
              <span className="absolute inset-0 bg-primary-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
            </Link>
            <Link
              href="/family"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider relative group"
            >
              <span className="relative z-10">FAMILY</span>
              <span className="absolute inset-0 bg-primary-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider relative group"
            >
              <span className="relative z-10">ABOUT</span>
              <span className="absolute inset-0 bg-primary-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider relative group"
            >
              <span className="relative z-10">CONTACT</span>
              <span className="absolute inset-0 bg-primary-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
            </Link>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-primary-red transition-colors z-50 relative"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              // Close icon (X)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-black z-[60] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <nav className="flex flex-col space-y-6">
            <Link
              href="/inventory"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider text-xl py-3 border-b border-gray-800 hover:border-primary-red/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              INVENTORY
            </Link>
            <Link
              href="/sell-us"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider text-xl py-3 border-b border-gray-800 hover:border-primary-red/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SELL US
            </Link>
            <Link
              href="/family"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider text-xl py-3 border-b border-gray-800 hover:border-primary-red/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAMILY
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider text-xl py-3 border-b border-gray-800 hover:border-primary-red/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-primary-red transition-all duration-300 font-heading font-semibold tracking-wider text-xl py-3 border-b border-gray-800 hover:border-primary-red/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}



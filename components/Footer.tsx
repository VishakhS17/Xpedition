"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400 mb-4">
              We are the best when it comes to exotic super bikes. Where dreams ride again.
              Experience the finest collection of premium motorcycles.
            </p>
            <Link
              href="/about"
              className="text-primary-red hover:text-primary-red-dark transition-colors font-semibold"
            >
              Read More →
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/family"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  Family
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-us"
                  className="text-gray-400 hover:text-primary-red transition-colors"
                >
                  Sell Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <p>
                  123 Motorcycle Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
              </li>
              <li>
                <p>Email: info@xpedition.com</p>
              </li>
              <li>
                <p>Phone: +91 12345 67890</p>
              </li>
              <li>
                <p>Phone: +91 98765 43210</p>
              </li>
            </ul>
          </div>

          {/* Google Maps */}
          <div>
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.587732627458!2d72.8776559!3d19.0759837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce6e6e6e6e6e%3A0x6e6e6e6e6e6e6e6e!2sMumbai!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="bg-primary-red py-4 px-4 rounded-lg mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-2 md:mb-0">
                <span className="text-xl font-heading tracking-wider">XPEDITION</span>
              </div>
              <div className="text-sm">
                © {new Date().getFullYear()} Xpedition. All rights reserved.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <Link
              href="/privacy-policy"
              className="hover:text-primary-red transition-colors"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="/credits"
              className="hover:text-primary-red transition-colors"
            >
              Credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CustomerTestimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      quote: "Thank you for meeting my requirements... The machine is awesome...",
    },
    {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      quote: "Thank you for meeting my requirements... The machine is awesome...",
    },
    {
      name: "Amit Patel",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      quote: "Thank you for meeting my requirements... The machine is awesome...",
    },
    {
      name: "Sneha Reddy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      quote: "Thank you for meeting my requirements... The machine is awesome...",
    },
  ];

  // Brand logos - matching image filenames to brands
  const brandLogos = [
    { name: "Ducati", image: "/images/logos/Ducati.png" },
    { name: "Harley-Davidson", image: "/images/logos/HarleyDavidson.png" },
    { name: "BMW", image: "/images/logos/BMW.png" },
    { name: "Kawasaki", image: "/images/logos/Kawasaki.png" },
    { name: "Honda", image: "/images/logos/Honda.png" },
    { name: "KTM", image: "/images/logos/KTM.png" },
    { name: "Royal Enfield", image: "/images/logos/Royal Enfield.png" },
    { name: "Triumph", image: "/images/logos/Triumph.png" },
    { name: "Yamaha", image: "/images/logos/yamaha.png" },
    { name: "Suzuki", image: "/images/logos/suzuki.png" },
    { name: "Aprilia", image: "/images/logos/aprillia.png" },
    { name: "Benelli", image: "/images/logos/benelli-logo-png_seeklogo-448394.png" },
  ];

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
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-4 py-2 bg-primary-red/20 border border-primary-red/50 text-primary-red text-sm font-heading tracking-wider">
              TRUSTED BY RIDERS
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white mb-4 tracking-wider">
            WHAT OUR <span className="text-primary-red">CUSTOMERS</span> SAY
          </h2>
          <div className="w-24 h-1 bg-primary-red mx-auto mt-4"></div>
        </div>

        {/* Customer testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-primary-red/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-red/0 via-primary-red/0 to-primary-red/0 group-hover:from-primary-red/10 group-hover:via-primary-red/5 group-hover:to-primary-red/10 transition-all duration-300 rounded-lg pointer-events-none"></div>
              
              {/* Customer image */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-primary-red transform rotate-45 rounded-lg group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative w-full h-full transform -rotate-45 overflow-hidden rounded-lg">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="80px"
                  />
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm italic mb-4 text-center leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Customer name */}
              <p className="text-primary-red font-heading font-bold text-center text-sm tracking-wider">
                - {testimonial.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Featured quote */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="relative bg-gray-900 rounded-lg p-8 md:p-12 border border-gray-800">
            {/* Quote icon */}
            <div className="absolute top-4 left-4 text-primary-red/20 text-6xl font-heading">"</div>
            <p className="text-xl md:text-2xl lg:text-3xl text-white italic mb-6 relative z-10 leading-relaxed">
              Thank you for meeting my requirements... The machine is awesome...
            </p>
            <p className="text-primary-red font-heading font-bold text-lg tracking-wider">
              - Satisfied Customer
            </p>
          </div>
        </div>

        {/* Brand logos section */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm font-heading tracking-wider mb-6">
            TRUSTED BRANDS WE DEAL WITH
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {brandLogos.map((brand, index) => (
              <motion.div
                key={brand.name}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <div className="relative w-24 h-16 md:w-32 md:h-20">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrowseByCategory() {
  const categories = [
    { name: "Adventure", image: "/images/categories/Adventure.avif" },
    { name: "Cruiser", image: "/images/categories/Cruiser.png" },
    { name: "Roadster", image: "/images/categories/Streetfighter.webp" },
    { name: "Sport", image: "/images/categories/Sport.png" },
    { name: "Touring", image: "/images/categories/Touring.png" },
    { name: "Classics", image: "/images/categories/Classic.png" },
  ];

  return (
    <section className="relative py-20 bg-gray-900 overflow-hidden">
      {/* Background image with overlay - using first category image as fallback */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src={categories[0].image}
          alt="Motorcycles background"
          fill
          className="object-cover"
          loading="lazy"
          priority={false}
        />
      </div>
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          BROWSE BY CATEGORY
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/inventory?category=${encodeURIComponent(category.name)}`}
            >
              <motion.div
                className="flex flex-col items-center cursor-pointer group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.1, borderColor: "#fd0100" }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </motion.div>
                <h3 className="text-white font-bold text-lg group-hover:text-primary-red transition-colors">
                  {category.name}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



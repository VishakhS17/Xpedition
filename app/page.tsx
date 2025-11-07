"use client";

import { Suspense, lazy, useEffect } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

// Lazy load components below the fold for better initial load performance
const PopularBikes = lazy(() => import("@/components/PopularBikes"));
const BrowseByCategory = lazy(() => import("@/components/BrowseByCategory"));
const CustomerTestimonials = lazy(() => import("@/components/CustomerTestimonials"));

// Loading component for lazy loaded sections
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
  </div>
);

export default function Home() {
  useEffect(() => {
    // Restore scroll position if coming back from detail page
    const wasNavigatingToDetail = sessionStorage.getItem('navigatingToDetail');
    if (wasNavigatingToDetail === 'true') {
      const savedScrollPosition = sessionStorage.getItem('/ScrollPosition');
      if (savedScrollPosition) {
        // Wait for page to fully load before restoring scroll
        const restoreScroll = () => {
          window.scrollTo({
            top: parseInt(savedScrollPosition, 10),
            behavior: 'auto'
          });
          sessionStorage.removeItem('navigatingToDetail');
          sessionStorage.removeItem('/ScrollPosition');
        };
        
        // Wait for lazy-loaded components to render
        requestAnimationFrame(() => {
          setTimeout(restoreScroll, 100);
        });
      } else {
        sessionStorage.removeItem('navigatingToDetail');
      }
    }
  }, []);

  return (
    <main>
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <PopularBikes />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BrowseByCategory />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CustomerTestimonials />
      </Suspense>
      <Footer />
    </main>
  );
}



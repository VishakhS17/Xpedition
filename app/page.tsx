import { Suspense, lazy } from "react";
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



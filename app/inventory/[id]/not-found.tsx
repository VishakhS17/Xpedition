import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-red mb-4">404</h1>
          <h2 className="text-3xl font-bold text-black mb-4">
            Bike Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The bike you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/inventory"
            className="inline-block bg-primary-red text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-red-dark transition-colors"
          >
            Browse All Bikes
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}


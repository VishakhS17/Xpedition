import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Credits() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            CREDITS
          </h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 mb-4">
                This is a placeholder credits page. Content will be added later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



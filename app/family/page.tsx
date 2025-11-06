import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Family() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            OUR FAMILY
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 text-center mb-8">
              Welcome to the Xpedition family. This is where passion meets excellence.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 text-center">
                Content coming soon...
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            ABOUT US
          </h1>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Where Dreams Ride Again</h2>
              <p className="text-gray-700 mb-4">
                We are the best when it comes to exotic super bikes. At Xpedition, we believe
                that every rider deserves a machine that matches their passion and dreams.
              </p>
              <p className="text-gray-700 mb-4">
                Our commitment to excellence has made us a trusted name in the world of premium
                motorcycles. We curate the finest collection of exotic super bikes, ensuring
                quality and authenticity in every ride.
              </p>
              <p className="text-gray-700">
                Whether you're looking to buy your dream bike or sell your current one, we're
                here to make the process seamless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



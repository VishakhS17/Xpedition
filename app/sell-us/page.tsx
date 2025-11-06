import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SellUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            SELL US YOUR BIKE
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bikeModel" className="block text-sm font-semibold mb-2">
                  Bike Model *
                </label>
                <input
                  type="text"
                  id="bikeModel"
                  name="bikeModel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-semibold mb-2">
                  Registration Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="kms" className="block text-sm font-semibold mb-2">
                  Kilometers Driven *
                </label>
                <input
                  type="number"
                  id="kms"
                  name="kms"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold mb-2">
                  Registration State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-semibold mb-2">
                  Upload Bike Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-red text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-red-dark transition-colors duration-200 text-lg"
              >
                SUBMIT DETAILS
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



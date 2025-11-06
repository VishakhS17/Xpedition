"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/formatPrice";

interface Bike {
  id: number;
  brand: string;
  model: string;
  price: string;
}

export default function Contact() {
  const [availableBikes, setAvailableBikes] = useState<Bike[]>([]);
  const [selectedBikeId, setSelectedBikeId] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch available bikes from API
  useEffect(() => {
    const fetchAvailableBikes = async () => {
      try {
        const response = await fetch('/api/bikes/available');
        if (response.ok) {
          const data = await response.json();
          setAvailableBikes(data.bikes || []);
        }
      } catch (error) {
        console.error('Error fetching available bikes:', error);
      }
    };

    fetchAvailableBikes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedBike = selectedBikeId
      ? availableBikes.find((b) => b.id.toString() === selectedBikeId)
      : null;

    const data = {
      name: formData.get("contactName"),
      email: formData.get("contactEmail"),
      phone: formData.get("contactPhone"),
      bikeId: selectedBikeId || null,
      bikeModel: selectedBike?.model || null,
      bikeBrand: selectedBike?.brand || null,
    };

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Thank you for your enquiry! We'll get back to you soon.");
        if (formRef.current) {
          formRef.current.reset();
        }
        setSelectedBikeId("");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to submit enquiry'}`);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            CONTACT US
          </h1>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-700">
                    123 Motorcycle Street<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">info@xpedition.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-700">
                    +91 12345 67890<br />
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Send us an Enquiry</h2>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-semibold mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-semibold mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-semibold mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    required
                    placeholder="+91 12345 67890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bikeSelection"
                    className="block text-sm font-semibold mb-2"
                  >
                    Interested In (Select a Bike)
                  </label>
                  <select
                    id="bikeSelection"
                    name="bikeSelection"
                    value={selectedBikeId}
                    onChange={(e) => setSelectedBikeId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent bg-white"
                  >
                    <option value="">-- Select a bike (optional) --</option>
                    {availableBikes.map((bike) => (
                      <option key={bike.id} value={bike.id.toString()}>
                        {bike.brand} {bike.model} - {formatPrice(bike.price)}
                      </option>
                    ))}
                  </select>
                  {selectedBikeId && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected:{" "}
                      {
                        availableBikes.find(
                          (b) => b.id.toString() === selectedBikeId
                        )?.model
                      }
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-red text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-red-dark transition-colors duration-200"
                >
                  SEND ENQUIRY
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



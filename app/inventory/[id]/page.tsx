import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import { formatPrice } from "@/lib/formatPrice";
import { sql } from "@/lib/db";

interface BikeDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Bike {
  id: number;
  image: string;
  images?: string[];
  price: string;
  model: string;
  brand: string;
  regYear: string;
  kms: string;
  regState: string;
  color?: string;
  fuelType?: string;
  engine?: string;
  description?: string;
  features?: string[];
  condition?: string;
  owner?: string;
  contact?: string;
  status?: string;
}

async function getBikeById(id: number): Promise<Bike | null> {
  try {
    // Validate ID
    if (!id || isNaN(id) || id <= 0) {
      console.error('Invalid bike ID:', id);
      return null;
    }

    // Directly query the database instead of making HTTP request
    const bikes = await sql`
      SELECT 
        id, image, images, price, model, brand, category,
        reg_year, kms, reg_state, color, fuel_type, engine,
        description, features, condition, owner, contact,
        status, sold_at, created_at, updated_at
      FROM bikes 
      WHERE id = ${id}
      LIMIT 1
    `;

    if (bikes.length === 0) {
      console.log(`Bike with ID ${id} not found in database`);
      return null;
    }

    const bike = bikes[0];

    // Format bike data to match interface
    const formattedBike: Bike = {
      id: bike.id,
      image: bike.image,
      images: Array.isArray(bike.images) ? bike.images : (bike.images ? [bike.images] : []),
      price: bike.price,
      model: bike.model,
      brand: bike.brand,
      regYear: bike.reg_year,
      kms: bike.kms,
      regState: bike.reg_state,
      color: bike.color || undefined,
      fuelType: bike.fuel_type || undefined,
      engine: bike.engine || undefined,
      description: bike.description || undefined,
      features: Array.isArray(bike.features) ? bike.features : (bike.features ? [bike.features] : []),
      condition: bike.condition || undefined,
      owner: bike.owner || undefined,
      contact: bike.contact || undefined,
      status: bike.status || 'available',
    };

    return formattedBike;
  } catch (error) {
    console.error('Error fetching bike:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export async function generateMetadata({ params }: BikeDetailPageProps) {
  const { id } = await params;
  const bike = await getBikeById(Number(id));

  if (!bike) {
    return {
      title: "Bike Not Found",
    };
  }

  return {
    title: `${bike.model} - Xpedition`,
    description: bike.description || `Buy ${bike.model} at ${formatPrice(bike.price)}`,
  };
}

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { id } = await params;
  const bike = await getBikeById(Number(id));

  if (!bike) {
    notFound();
  }

  const images = bike.images && bike.images.length > 0 ? bike.images : [bike.image];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-red transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/inventory"
                scroll={false}
                className="hover:text-primary-red transition-colors"
              >
                Inventory
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{bike.model}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={images} bikeModel={bike.model} />
            </div>

            {/* Bike Details */}
            <div className="space-y-6">
              {/* Price and Model */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-black">
                    {bike.model}
                  </h1>
                  {bike.status && bike.status !== 'available' && (
                    <span className={`px-4 py-2 rounded-lg text-sm font-heading font-bold ${
                      bike.status === 'sold' 
                        ? 'bg-gray-800 text-white' 
                        : bike.status === 'reserved'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      {bike.status.toUpperCase()}
                    </span>
                  )}
                  {(!bike.status || bike.status === 'available') && (
                    <span className="px-4 py-2 rounded-lg text-sm font-heading font-bold bg-green-500 text-white">
                      AVAILABLE
                    </span>
                  )}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-red mb-4">
                  {formatPrice(bike.price)}
                </div>
                {bike.brand && (
                  <p className="text-xl text-gray-600 font-semibold">
                    {bike.brand}
                  </p>
                )}
              </div>

              {/* Key Specifications */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-black">
                  Key Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-semibold">
                      Registration Year:
                    </span>
                    <p className="text-black font-bold">{bike.regYear}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">
                      Kilometers:
                    </span>
                    <p className="text-black font-bold">{bike.kms}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">
                      Registration State:
                    </span>
                    <p className="text-black font-bold">{bike.regState}</p>
                  </div>
                  {bike.condition && (
                    <div>
                      <span className="text-gray-600 font-semibold">
                        Condition:
                      </span>
                      <p className="text-black font-bold">{bike.condition}</p>
                    </div>
                  )}
                  {bike.owner && (
                    <div>
                      <span className="text-gray-600 font-semibold">Owner:</span>
                      <p className="text-black font-bold">{bike.owner}</p>
                    </div>
                  )}
                  {bike.color && (
                    <div>
                      <span className="text-gray-600 font-semibold">Color:</span>
                      <p className="text-black font-bold">{bike.color}</p>
                    </div>
                  )}
                  {bike.fuelType && (
                    <div>
                      <span className="text-gray-600 font-semibold">
                        Fuel Type:
                      </span>
                      <p className="text-black font-bold">{bike.fuelType}</p>
                    </div>
                  )}
                  {bike.engine && (
                    <div>
                      <span className="text-gray-600 font-semibold">Engine:</span>
                      <p className="text-black font-bold">{bike.engine}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {bike.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-black">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {bike.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {bike.features && bike.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-black">
                    Features
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bike.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <span className="text-primary-red font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Section */}
              <div className={`rounded-lg p-6 ${
                bike.status === 'sold' 
                  ? 'bg-gray-400 text-white' 
                  : 'bg-primary-red text-white'
              }`}>
                {bike.status === 'sold' ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">This bike has been sold</h2>
                    <p className="mb-4">
                      This bike is no longer available. Check out our other listings!
                    </p>
                    <Link
                      href="/inventory"
                      scroll={false}
                      className="inline-block bg-white text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      View Other Bikes
                    </Link>
                  </>
                ) : bike.status === 'reserved' ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">This bike is reserved</h2>
                    <p className="mb-4">
                      This bike is currently reserved. Contact us to be notified if it becomes available.
                    </p>
                    {bike.contact && (
                      <div className="mb-4">
                        <span className="font-semibold">Phone: </span>
                        <a
                          href={`tel:${bike.contact}`}
                          className="hover:underline font-bold"
                        >
                          {bike.contact}
                        </a>
                      </div>
                    )}
                    <Link
                      href="/contact"
                      className="inline-block bg-white text-primary-red font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Interested in this bike?</h2>
                    <p className="mb-4">
                      Contact us to schedule a viewing or get more information.
                    </p>
                    {bike.contact && (
                      <div className="mb-4">
                        <span className="font-semibold">Phone: </span>
                        <a
                          href={`tel:${bike.contact}`}
                          className="hover:underline font-bold"
                        >
                          {bike.contact}
                        </a>
                      </div>
                    )}
                    <Link
                      href="/contact"
                      className="inline-block bg-white text-primary-red font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </>
                )}
              </div>

              {/* Back to Inventory */}
              <Link
                href="/inventory"
                scroll={false}
                className="inline-flex items-center text-primary-red hover:text-primary-red-dark font-semibold transition-colors"
              >
                ← Back to Inventory
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

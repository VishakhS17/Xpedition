export interface Bike {
  id: number;
  image: string;
  images?: string[]; // Multiple images for detail page
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
  status?: 'available' | 'sold' | 'reserved' | 'pending'; // Availability status
  soldAt?: string; // ISO date string when bike was sold
}

export const bikes: Bike[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
    ],
    price: "₹6,25,000",
    model: "KAWASAKI Z900 ABS",
    brand: "Kawasaki",
    regYear: "2020",
    kms: "15,000",
    regState: "Maharashtra",
    color: "Metallic Spark Black",
    fuelType: "Petrol",
    engine: "948cc, 4-Cylinder",
    condition: "Excellent",
    owner: "First Owner",
    description:
      "Well-maintained Kawasaki Z900 ABS with excellent service history. This powerful naked sportbike delivers exceptional performance and handling. All original parts, no modifications. Regular servicing done at authorized service center.",
    features: [
      "ABS Braking System",
      "LED Lighting",
      "Digital Instrument Cluster",
      "Traction Control",
      "Multiple Riding Modes",
      "Quick Shifter",
    ],
    contact: "+91 98765 43210",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=800",
    images: [
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
    ],
    price: "₹8,50,000",
    model: "DUCATI PANIGALE V4",
    brand: "Ducati",
    regYear: "2021",
    kms: "8,500",
    regState: "Karnataka",
    color: "Ducati Red",
    fuelType: "Petrol",
    engine: "1103cc, V4",
    condition: "Like New",
    owner: "First Owner",
    description:
      "Exceptional Ducati Panigale V4 - the ultimate Italian superbike. This track-focused machine combines cutting-edge technology with breathtaking performance. Immaculately maintained with full service history.",
    features: [
      "Desmodromic Valves",
      "Cornering ABS",
      "Wheelie Control",
      "Launch Control",
      "Ducati Quick Shift",
      "Full LED Lighting",
      "TFT Display",
    ],
    contact: "+91 98765 43211",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
    ],
    price: "₹12,00,000",
    model: "BMW S1000RR",
    brand: "BMW",
    regYear: "2022",
    kms: "5,000",
    regState: "Delhi",
    color: "Racing Red",
    fuelType: "Petrol",
    engine: "999cc, 4-Cylinder",
    condition: "Mint",
    owner: "First Owner",
    description:
      "Pristine BMW S1000RR with minimal mileage. This German engineering masterpiece offers unparalleled performance and technology. Garage kept, always serviced at authorized BMW service center.",
    features: [
      "Dynamic Traction Control",
      "ABS Pro",
      "Launch Control",
      "Pit Lane Limiter",
      "Hill Start Control",
      "Shift Assist Pro",
      "Full Color TFT Display",
    ],
    contact: "+91 98765 43212",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
    ],
    price: "₹5,75,000",
    model: "YAMAHA MT-09",
    brand: "Yamaha",
    regYear: "2019",
    kms: "20,000",
    regState: "Gujarat",
    color: "Storm Fluo",
    fuelType: "Petrol",
    engine: "847cc, 3-Cylinder",
    condition: "Very Good",
    owner: "Second Owner",
    description:
      "Well-ridden Yamaha MT-09 with complete service history. The legendary triple-cylinder engine delivers incredible torque and character. All maintenance up to date, ready to ride.",
    features: [
      "Traction Control System",
      "ABS",
      "Yamaha D-Mode",
      "LED Headlight",
      "Digital Instrument Panel",
      "Quick Shift System",
    ],
    contact: "+91 98765 43213",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200",
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
    ],
    price: "₹9,50,000",
    model: "HARLEY-DAVIDSON STREET 750",
    brand: "Harley-Davidson",
    regYear: "2020",
    kms: "12,000",
    regState: "Maharashtra",
    color: "Vivid Black",
    fuelType: "Petrol",
    engine: "749cc, V-Twin",
    condition: "Excellent",
    owner: "First Owner",
    description:
      "Authentic Harley-Davidson Street 750 with that classic American cruiser character. Well-maintained with all original accessories. Perfect for city riding and highway cruising.",
    features: [
      "V-Twin Revolution X Engine",
      "Digital Speedometer",
      "LED Taillight",
      "Anti-lock Braking System",
      "Low Seat Height",
      "Customizable Accessories",
    ],
    contact: "+91 98765 43214",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
    ],
    price: "₹7,25,000",
    model: "TRIUMPH SPEED TRIPLE",
    brand: "Triumph",
    regYear: "2021",
    kms: "10,000",
    regState: "Punjab",
    color: "Crystal White",
    fuelType: "Petrol",
    engine: "1050cc, 3-Cylinder",
    condition: "Excellent",
    owner: "First Owner",
    description:
      "Stunning Triumph Speed Triple with the iconic triple-cylinder engine. British craftsmanship meets modern performance. Fully serviced and maintained to perfection.",
    features: [
      "Triumph Traction Control",
      "ABS",
      "Ride-by-Wire Throttle",
      "TFT Display",
      "LED Lighting",
      "Quick Shifter",
      "Multiple Riding Modes",
    ],
    contact: "+91 98765 43215",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=800",
    images: [
      "https://images.unsplash.com/photo-1558980664-1db506751c6a?w=1200",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
    ],
    price: "₹6,00,000",
    model: "SUZUKI GSX-R750",
    brand: "Suzuki",
    regYear: "2019",
    kms: "18,000",
    regState: "Tamil Nadu",
    color: "Pearl Mirage White",
    fuelType: "Petrol",
    engine: "749cc, 4-Cylinder",
    condition: "Very Good",
    owner: "Second Owner",
    description:
      "Legendary Suzuki GSX-R750 - the iconic sportbike that defined a generation. Track-ready performance with street-legal comfort. Well-maintained with regular servicing.",
    features: [
      "Suzuki Advanced Traction Control",
      "ABS",
      "Low RPM Assist",
      "Easy Start System",
      "LED Position Light",
      "Digital Instrument Cluster",
    ],
    contact: "+91 98765 43216",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200",
    ],
    price: "₹11,50,000",
    model: "APRILIA RSV4",
    brand: "Aprilia",
    regYear: "2022",
    kms: "6,000",
    regState: "Kerala",
    color: "Lava Red",
    fuelType: "Petrol",
    engine: "1099cc, V4",
    condition: "Mint",
    owner: "First Owner",
    description:
      "Exotic Aprilia RSV4 - Italian engineering at its finest. This track-focused superbike offers championship-winning technology. Barely used, garage kept, immaculate condition.",
    features: [
      "Aprilia Performance Ride Control",
      "Cornering ABS",
      "Wheelie Control",
      "Launch Control",
      "Quick Shifter",
      "Full TFT Display",
      "LED Lighting",
      "Öhlins Suspension",
    ],
    contact: "+91 98765 43217",
  },
];

// Helper function to get bike by ID
export function getBikeById(id: number): Bike | undefined {
  return bikes.find((bike) => bike.id === id);
}



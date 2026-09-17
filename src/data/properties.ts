export interface Property {
  id: string;
  title: string;
  type: "House" | "Apartment" | "Condo" | "Villa" | "Townhouse";
  status: "For Sale" | "For Rent" | "Sold";
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  description: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  featured: boolean;
  listingDate: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Waterfront Estate",
    type: "Villa",
    status: "For Sale",
    price: 2750000,
    address: "42 Oceanview Drive",
    city: "Malibu",
    state: "CA",
    zip: "90265",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    yearBuilt: 2021,
    description:
      "Stunning contemporary waterfront estate with panoramic ocean views. Floor-to-ceiling windows, chef's kitchen with Wolf appliances, primary suite with spa-like bathroom, infinity pool, and private dock access. Smart home automation throughout.",
    features: [
      "Ocean view",
      "Infinity pool",
      "Smart home",
      "Private dock",
      "Wine cellar",
      "Home theater",
      "EV charger",
      "Solar panels",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "Sarah Mitchell",
      phone: "(310) 555-0142",
      email: "sarah@pmproperties.com",
    },
    featured: true,
    listingDate: "2026-06-01",
  },
  {
    id: "2",
    title: "Downtown Luxury Penthouse",
    type: "Condo",
    status: "For Sale",
    price: 1850000,
    address: "100 Broadway, Unit 4501",
    city: "New York",
    state: "NY",
    zip: "10006",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    yearBuilt: 2020,
    description:
      "Corner-unit penthouse with sweeping views of the Manhattan skyline. Designed by renowned architect, this home features 12-foot ceilings, Italian marble floors, a custom chef's kitchen, and a expansive terrace perfect for entertaining.",
    features: [
      "City view",
      "Private terrace",
      "Concierge",
      "Gym access",
      "Doorman",
      "Rooftop pool",
      "Parking included",
      "Pet friendly",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "James Chen",
      phone: "(212) 555-0187",
      email: "james@pmproperties.com",
    },
    featured: true,
    listingDate: "2026-06-05",
  },
  {
    id: "3",
    title: "Charming Family Home",
    type: "House",
    status: "For Sale",
    price: 725000,
    address: "284 Maple Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2400,
    yearBuilt: 2018,
    description:
      "Beautiful family home in the heart of Austin's most desirable neighborhood. Open-concept layout, gourmet kitchen with quartz countertops, hardwood floors throughout, spacious backyard with covered patio, and top-rated schools nearby.",
    features: [
      "Hardwood floors",
      "Gourmet kitchen",
      "Backyard",
      "Covered patio",
      "Attached garage",
      "Walk-in closets",
      "Smart thermostat",
      "Sprinkler system",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "(512) 555-0192",
      email: "emily@pmproperties.com",
    },
    featured: true,
    listingDate: "2026-06-10",
  },
  {
    id: "4",
    title: "Mid-Century Modern Retreat",
    type: "House",
    status: "For Sale",
    price: 1150000,
    address: "750 Hillside Avenue",
    city: "Portland",
    state: "OR",
    zip: "97201",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    yearBuilt: 1957,
    description:
      "Recently restored mid-century modern gem. Original architectural details preserved and enhanced with modern amenities. Floor-to-ceiling windows frame mature garden views. Updated kitchen and bathrooms, new HVAC, and detached studio.",
    features: [
      "Original hardwood",
      "Stone fireplace",
      "Garden views",
      "Detached studio",
      "Updated kitchen",
      "New HVAC",
      "Rainwater system",
      "EV charger",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "Sarah Mitchell",
      phone: "(310) 555-0142",
      email: "sarah@pmproperties.com",
    },
    featured: false,
    listingDate: "2026-06-12",
  },
  {
    id: "5",
    title: "Luxury Ski Chalet",
    type: "Villa",
    status: "For Sale",
    price: 3200000,
    address: "10 Alpine Way",
    city: "Aspen",
    state: "CO",
    zip: "81611",
    bedrooms: 6,
    bathrooms: 5,
    sqft: 5100,
    yearBuilt: 2019,
    description:
      "Exceptional ski-in/ski-out chalet with breathtaking mountain views. Grand great room with 25-foot vaulted ceilings, massive stone fireplace, gourmet kitchen, home spa with sauna and hot tub, and a game room. The ultimate mountain retreat.",
    features: [
      "Ski-in/ski-out",
      "Mountain views",
      "Home spa",
      "Sauna",
      "Hot tub",
      "Game room",
      "Wine cellar",
      "Heated driveway",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "James Chen",
      phone: "(212) 555-0187",
      email: "james@pmproperties.com",
    },
    featured: false,
    listingDate: "2026-05-20",
  },
  {
    id: "6",
    title: "Beachfront Bungalow",
    type: "House",
    status: "For Rent",
    price: 5500,
    address: "88 Shoreline Drive",
    city: "Santa Monica",
    state: "CA",
    zip: "90401",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    yearBuilt: 1940,
    description:
      "Quintessential California beach bungalow steps from the sand. Renovated open-plan living, modern kitchen with sea-foam tile backsplash, cozy fireplace, outdoor shower, and a sun-drenched patio perfect for al fresco dining.",
    features: [
      "Steps to beach",
      "Outdoor shower",
      "Fireplace",
      "Patio",
      "Renovated kitchen",
      "Hardwood floors",
      "Washer/dryer",
      "Parking",
    ],
    images: [
      "/images/property-1.jpg",
      "/images/property-1.jpg",
      "/images/property-1.jpg",
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "(512) 555-0192",
      email: "emily@pmproperties.com",
    },
    featured: false,
    listingDate: "2026-06-15",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Michael & Lisa Thompson",
    location: "Malibu, CA",
    content:
      "PM Properties made our dream of owning a waterfront home a reality. Sarah guided us through every step and negotiated a deal we didn't think was possible. We're customers for life.",
    rating: 5,
  },
  {
    id: 2,
    name: "David Park",
    location: "New York, NY",
    content:
      "As a first-time buyer, I was nervous. James took the time to explain everything, found me the perfect penthouse, and got me an incredible rate. Professional, patient, and results-driven.",
    rating: 5,
  },
  {
    id: 3,
    name: "Jennifer Walsh",
    location: "Austin, TX",
    content:
      "We sold our home in 5 days above asking price thanks to Emily's marketing strategy. Her staging advice and photographer recommendations made all the difference. Absolutely stellar service.",
    rating: 5,
  },
  {
    id: 4,
    name: "Robert & Karen Mills",
    location: "Portland, OR",
    content:
      "We've bought and sold several properties over the years, and PM Properties is by far the best agency we've worked with. Their market knowledge and negotiation skills are unmatched.",
    rating: 5,
  },
];

export const teamMembers = [
  {
    name: "Sarah Mitchell",
    title: "Founder & Lead Agent",
    bio: "15+ years in luxury real estate. Specializes in waterfront and high-end residential properties.",
    email: "sarah@pmproperties.com",
    phone: "(310) 555-0142",
  },
  {
    name: "James Chen",
    title: "Senior Agent",
    bio: "Former investment banker turned top-producing agent. Expert in urban properties and market analysis.",
    email: "james@pmproperties.com",
    phone: "(212) 555-0187",
  },
  {
    name: "Emily Rodriguez",
    title: "Senior Agent",
    bio: "Specializing in residential family homes. Known for exceptional client service and community connections.",
    email: "emily@pmproperties.com",
    phone: "(512) 555-0192",
  },
  {
    name: "Michael Torres",
    title: "Marketing Director",
    bio: "Digital marketing expert who creates stunning property presentations and targeted ad campaigns.",
    email: "michael@pmproperties.com",
    phone: "(310) 555-0165",
  },
];

export const faqs = [
  {
    q: "What areas do you serve?",
    a: "We currently operate primarily in Kalyan, Dombivli, Thane, Ambernath, and Badlapur. We have deep local expertise in these markets to help you find the perfect property.",
  },
  {
    q: "Do you provide assistance with legal documentation and property verification?",
    a: "Yes, we offer complete end-to-end support. Our team ensures thorough verification of property titles, RERA registrations, and handles all the necessary legal documentation to ensure a secure and hassle-free transaction.",
  },
  {
    q: "What's the typical timeline for buying?",
    a: "From initial search to closing, the process typically takes 30-60 days. Cash purchases can close in as little as 14 days. We'll provide a detailed timeline during our first meeting.",
  },
  {
    q: "How are your fees structured?",
    a: "Our fee structure is completely transparent with no hidden charges:\n\n• New Projects: No brokerage for buyers.\n• Resale Properties: 2% brokerage applicable for buyers.\n• Property Sellers: 2% brokerage applicable based on the agreement value.",
  },
  {
    q: "Do you help with selling my current home?",
    a: "Absolutely. We offer comprehensive sell-and-buy services, including home preparation advice, staging, professional photography, virtual tours, and strategic pricing to maximize your sale price.",
  },
];

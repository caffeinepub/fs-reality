import { ListingType, PropertyType } from "../backend.d";

export const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Noida",
];

export const INDIAN_STATES: Record<string, string> = {
  Mumbai: "Maharashtra",
  Delhi: "Delhi",
  Bangalore: "Karnataka",
  Chennai: "Tamil Nadu",
  Hyderabad: "Telangana",
  Pune: "Maharashtra",
  Kolkata: "West Bengal",
  Ahmedabad: "Gujarat",
  Jaipur: "Rajasthan",
  Noida: "Uttar Pradesh",
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.buy]: "For Sale",
  [ListingType.rent]: "For Rent",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  [PropertyType.apartment]: "Apartment",
  [PropertyType.villa]: "Villa",
  [PropertyType.plot]: "Plot",
  [PropertyType.commercial]: "Commercial",
};

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

export const PRICE_RANGES = [
  { label: "Under ₹30L", min: 0, max: 3_000_000 },
  { label: "₹30L – ₹60L", min: 3_000_000, max: 6_000_000 },
  { label: "₹60L – ₹1Cr", min: 6_000_000, max: 10_000_000 },
  { label: "₹1Cr – ₹2Cr", min: 10_000_000, max: 20_000_000 },
  { label: "Above ₹2Cr", min: 20_000_000, max: 999_999_999 },
];

// Sample seed data for frontend display
export interface SampleProperty {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  contactName: string;
  contactPhone: string;
  image: string;
}

export const SAMPLE_PROPERTIES: SampleProperty[] = [
  {
    id: 1,
    title: "Spacious 3BHK in Bandra West",
    description:
      "A beautifully designed 3BHK apartment in the heart of Bandra West. Features a large living room, modern kitchen, and stunning sea-view balcony. The building has a rooftop garden, gym, and 24/7 security. Walking distance to Linking Road and the best restaurants in Mumbai.",
    price: 18_500_000,
    location: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    propertyType: PropertyType.apartment,
    listingType: ListingType.buy,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1850,
    contactName: "Priya Sharma",
    contactPhone: "+91 98765 43210",
    image: "/assets/generated/property-apartment.dim_800x500.jpg",
  },
  {
    id: 2,
    title: "Independent Villa in Koramangala",
    description:
      "Stunning 4BHK independent villa with private pool and lush garden in premium Koramangala locality. Designed by award-winning architect with an open-plan kitchen, home theatre, and smart home automation. Located in a gated community with tennis court and clubhouse.",
    price: 42_000_000,
    location: "Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    propertyType: PropertyType.villa,
    listingType: ListingType.buy,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 4200,
    contactName: "Rajesh Kumar",
    contactPhone: "+91 87654 32109",
    image: "/assets/generated/property-villa.dim_800x500.jpg",
  },
  {
    id: 3,
    title: "Modern 2BHK Near Cyber City",
    description:
      "Premium 2BHK apartment steps from Cyber City in Gurugram. High-end finishes, modular kitchen, and a private balcony overlooking the city. The complex offers a swimming pool, gym, and concierge services. Ideal for working professionals.",
    price: 45_000,
    location: "DLF Phase 2",
    city: "Delhi",
    state: "Delhi",
    propertyType: PropertyType.apartment,
    listingType: ListingType.rent,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    contactName: "Anita Verma",
    contactPhone: "+91 76543 21098",
    image: "/assets/generated/property-apartment.dim_800x500.jpg",
  },
  {
    id: 4,
    title: "Commercial Shop in Connaught Place",
    description:
      "Prime commercial space in the iconic Connaught Place, New Delhi. Ground floor unit with excellent footfall, suitable for retail, F&B, or showroom. The property has been recently renovated with modern interiors.",
    price: 75_000,
    location: "Connaught Place",
    city: "Delhi",
    state: "Delhi",
    propertyType: PropertyType.commercial,
    listingType: ListingType.rent,
    bedrooms: 0,
    bathrooms: 1,
    areaSqFt: 800,
    contactName: "Suresh Patel",
    contactPhone: "+91 65432 10987",
    image: "/assets/generated/property-commercial.dim_800x500.jpg",
  },
  {
    id: 5,
    title: "Residential Plot in Wakad",
    description:
      "Clear title residential plot in the rapidly developing Wakad locality of Pune. All approvals in place. Surrounded by residential buildings, close to schools, hospitals, and IT parks. Excellent investment opportunity.",
    price: 8_500_000,
    location: "Wakad",
    city: "Pune",
    state: "Maharashtra",
    propertyType: PropertyType.plot,
    listingType: ListingType.buy,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 2400,
    contactName: "Deepak Nair",
    contactPhone: "+91 54321 09876",
    image: "/assets/generated/property-plot.dim_800x500.jpg",
  },
  {
    id: 6,
    title: "Sea-Facing 4BHK Penthouse",
    description:
      "Rare sea-facing penthouse on the 32nd floor in Worli. Panoramic views of the Arabian Sea and Mumbai skyline. Private terrace, butler kitchen, and premium European finishes throughout. The building is a landmark in Mumbai's skyline.",
    price: 120_000_000,
    location: "Worli",
    city: "Mumbai",
    state: "Maharashtra",
    propertyType: PropertyType.apartment,
    listingType: ListingType.buy,
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 5600,
    contactName: "Vikram Malhotra",
    contactPhone: "+91 43210 98765",
    image: "/assets/generated/property-apartment.dim_800x500.jpg",
  },
];

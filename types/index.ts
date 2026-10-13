export type UserRole = 'USER' | 'OWNER' | 'AGENT' | 'ADMIN';

export type PropertyListingType = 'FOR_SALE' | 'FOR_RENT' | 'FOR_LEASE';

export type PropertyType =
  | 'Apartment'
  | 'Flat'
  | 'Villa'
  | 'Independent House'
  | 'Builder Floor'
  | 'Studio Apartment'
  | 'Plot'
  | 'Farm House'
  | 'Office'
  | 'Shop'
  | 'Showroom'
  | 'Warehouse'
  | 'Commercial Building'
  | 'Industrial Property';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SOLD'
  | 'RENTED'
  | 'INACTIVE';

export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'RERA_APPROVED';

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CLOSED';

export type VisitStatus = 'PENDING' | 'ACCEPTED' | 'RESCHEDULED' | 'REJECTED' | 'COMPLETED';

export interface PropertyImageDTO {
  id?: string;
  url: string;
  caption?: string | null;
  isFeatured?: boolean;
  order?: number;
}

export interface AmenityDTO {
  id: string;
  name: string;
  slug: string;
  icon: string;
  category: string;
}

export interface AgentDTO {
  id: string;
  userId?: string | null;
  name: string;
  photo?: string | null;
  email: string;
  phone: string;
  bio?: string | null;
  experience: number;
  specialization: string;
  licenseNumber?: string | null;
  rating: number;
  reviewCount: number;
  activeListings: number;
  city: string;
  state: string;
  isVerified: boolean;
  whatsapp?: string | null;
}

export interface PropertyDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  listingType: PropertyListingType | string;
  price: number;
  pricePerSqFt?: number | null;
  area: number;
  areaUnit: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  furnishedStatus?: string | null;
  parking?: string | null;
  facing?: string | null;
  constructionYear?: number | null;
  propertyAge?: string | null;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  ownerId?: string | null;
  agentId?: string | null;
  status: PropertyStatus | string;
  verificationStatus: VerificationStatus | string;
  reraNumber?: string | null;
  featured: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  images?: PropertyImageDTO[];
  amenities?: { amenity: AmenityDTO }[];
  agent?: AgentDTO | null;
  owner?: { id: string; name: string; email: string; phone?: string | null } | null;
  isFavorited?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
}

export interface FilterParams {
  city?: string;
  locality?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  furnishedStatus?: string;
  verified?: boolean | string;
  featured?: boolean | string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'views_desc';
  page?: number;
  limit?: number;
}

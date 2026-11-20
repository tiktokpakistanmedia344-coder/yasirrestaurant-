export type MenuCategoryId =
  | 'burgers'
  | 'tikka_bbq'
  | 'steaks_grills'
  | 'pizza'
  | 'pasta'
  | 'rice_traditional'
  | 'starters_desserts';

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
  count?: number;
}

export interface SpecialtyItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
}

export interface ReservationFormData {
  fullName: string;
  phone?: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
}


export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryId;
  price: number;
  priceDisplay: string;
  shortDescription: string;
  description: string;
  image: string;
  alt: string;
  rating: number;
  reviews: number;
  badge?: string;
  isChefSpecial?: boolean;
}

export interface DealItem {
  id: string;
  title: string;
  dealNumber: string;
  badge: string;
  price: number;
  priceDisplay: string;
  originalPrice: number;
  originalPriceDisplay: string;
  savingsDisplay: string;
  servings: string;
  shortDescription: string;
  description: string;
  includes: string[];
  image: string;
  alt: string;
}

export interface SeatingOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  features: string[];
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  specialInstructions?: string;
}

export interface OrderRecord {
  referenceId: string;
  itemType: 'menu_item' | 'deal';
  itemId: string;
  itemName: string;
  itemImage: string;
  category: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  customer: OrderCustomerInfo;
  createdAt: string;
  status: 'PENDING DEMO PAYMENT' | 'DEMO PAYMENT SUCCESSFUL';
}

export interface TableReservationData {
  tableId: string;
  tableName: string;
  tableImage: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  guests: string;
  specialInstructions?: string;
}

export interface BookingRecord extends TableReservationData {
  bookingReference: string;
  createdAt: string;
  status: 'PENDING DEMO PAYMENT' | 'DEMO BOOKING REQUEST RECEIVED';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'bbq' | 'steaks' | 'burgers' | 'ambience' | 'traditional';
  image: string;
  alt: string;
}

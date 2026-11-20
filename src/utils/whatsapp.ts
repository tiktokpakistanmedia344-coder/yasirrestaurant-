import type { ReservationFormData, DealItem } from '../types/restaurant';

export const BUSINESS_INFO = {
  name: 'Yasir Restaurant & Grill House',
  shortName: 'YASIR',
  subTitle: 'RESTAURANT & GRILL HOUSE',
  rating: '4.7',
  ratingMax: '5',
  reviewsCount: '580+',
  category: 'Fine Dining, Continental & Traditional BBQ',
  address: 'Plot 45-C, Main Boulevard, Gulberg III, Lahore, Pakistan',
  phoneDisplay: '+92 329 3179587',
  phoneRaw: '923293179587',
  openingHoursDisplay: 'Monday – Sunday, 12:30 PM – 01:00 AM',
  primaryMessage: 'Hello Yasir Restaurant, I would like to reserve a table / order food delivery.',
  primaryWhatsAppUrl:
    'https://wa.me/923293179587?text=Hello%20Yasir%20Restaurant%2C%20I%20would%20like%20to%20reserve%20a%20table%20%2F%20order%20food%20delivery.',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Yasir%20Restaurant%20%26%20Grill%20House%2C%20Plot%2045-C%2C%20Main%20Boulevard%2C%20Gulberg%20III%2C%20Lahore',
};

/**
 * Builds the standard WhatsApp URL or an encoded custom message URL
 */
export function buildWhatsAppUrl(message?: string): string {
  if (!message || message.trim() === '') {
    return BUSINESS_INFO.primaryWhatsAppUrl;
  }
  return `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates structured deal order message for WhatsApp
 */
export function buildDealWhatsAppMessage(deal: DealItem, quantity = 1, specialNote = ''): string {
  const parts = [
    `Hello Yasir Restaurant, I would like to order this Big Deal:`,
    ``,
    `🔥 Deal: ${deal.title}`,
    `💰 Price: ${deal.priceDisplay || `Rs. ${deal.price}`} (Qty: ${quantity})`,
    `👥 Servings: ${deal.servings}`,
    ``,
    `Included Items:`,
    ...deal.includes.map((item) => `• ${item}`),
  ];

  if (specialNote && specialNote.trim()) {
    parts.push(``, `Special Note: ${specialNote.trim()}`);
  }

  parts.push(``, `Please confirm my order and share estimated delivery/pickup time. Thank you!`);
  return parts.join('\n');
}

/**
 * Generates structured reservation message for WhatsApp
 */
export function buildReservationWhatsAppMessage(data: ReservationFormData): string {
  const parts = [
    `Hello Yasir Restaurant, I would like to reserve a table.`,
    ``,
    `📋 Reservation Details:`,
    `• Name: ${data.fullName.trim()}`,
    `• Date: ${data.date.trim()}`,
    `• Time: ${data.time.trim()}`,
    `• Guests: ${data.guests.trim()}`,
  ];

  if (data.notes && data.notes.trim()) {
    parts.push(`• Special Request: ${data.notes.trim()}`);
  }

  parts.push(``, `Please confirm availability. Thank you!`);

  return parts.join('\n');
}

/**
 * Validates reservation form fields
 */
export function validateReservationForm(data: Partial<ReservationFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters)';
  }

  if (!data.date || data.date.trim() === '') {
    errors.date = 'Please select a reservation date';
  }

  if (!data.time || data.time.trim() === '') {
    errors.time = 'Please select a reservation time';
  }

  if (!data.guests || data.guests.trim() === '') {
    errors.guests = 'Please select the number of guests';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Determines if restaurant is currently open based on 12:30 PM to 01:00 AM (next day)
 * In Lahore time (PKT, UTC+5)
 */
export function isRestaurantOpenNow(date = new Date()): {
  isOpen: boolean;
  statusText: string;
  nextTransition: string;
} {
  // Convert current time to Pakistan Time (UTC + 5 hours)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const pktDate = new Date(utc + 3600000 * 5);

  const hours = pktDate.getHours();
  const minutes = pktDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Open: 12:30 PM (750 minutes) until 1:00 AM after midnight (60 minutes)
  // Between 00:00 (0m) and 01:00 (60m) -> Open from previous night
  // Between 12:30 (750m) and 23:59 (1439m) -> Open
  // Between 01:01 (61m) and 12:29 (749m) -> Closed
  const isOpen = totalMinutes < 60 || totalMinutes >= 750;

  if (isOpen) {
    return {
      isOpen: true,
      statusText: 'Open Now',
      nextTransition: 'Closes tonight at 1:00 AM',
    };
  }

  return {
    isOpen: false,
    statusText: 'Closed Now',
    nextTransition: 'Opens today at 12:30 PM',
  };
}

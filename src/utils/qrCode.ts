import QRCode from 'qrcode';
import type { OrderRecord, BookingRecord } from '../types/restaurant';

export const NOTIFICATION_EMAIL = 'tiktokpakitanmedia344@gmail.com';

/**
 * Generates high-resolution QR code data URL
 */
export async function generateQrCodeUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    // Fallback simple SVG data URI
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%23fff"/><text x="150" y="150" font-family="sans-serif" font-size="14" text-anchor="middle" fill="%23000">DEMO QR CODE</text></svg>';
  }
}

/**
 * Persist order to localStorage
 */
export function saveOrderToStorage(order: OrderRecord): void {
  try {
    const existingRaw = localStorage.getItem('yasir_orders_v1');
    const orders: OrderRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    orders.unshift(order);
    localStorage.setItem('yasir_orders_v1', JSON.stringify(orders.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save order to localStorage:', e);
  }
}

/**
 * Persist booking to localStorage
 */
export function saveBookingToStorage(booking: BookingRecord): void {
  try {
    const existingRaw = localStorage.getItem('yasir_bookings_v1');
    const bookings: BookingRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    bookings.unshift(booking);
    localStorage.setItem('yasir_bookings_v1', JSON.stringify(bookings.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save booking to localStorage:', e);
  }
}

/**
 * Generates fallback email link for orders
 */
export function buildOrderMailtoLink(order: OrderRecord): string {
  const subject = encodeURIComponent(
    `[DEMO ORDER ${order.referenceId}] ${order.itemName} x${order.quantity} - Yasir Restaurant`
  );
  const body = encodeURIComponent(
    `Order Reference: ${order.referenceId}\n` +
      `Item: ${order.itemName} (Qty: ${order.quantity})\n` +
      `Total: Rs. ${order.totalAmount.toLocaleString()}\n` +
      `Customer: ${order.customer.fullName}\n` +
      `Phone: ${order.customer.phone}\n` +
      `Email: ${order.customer.email}\n` +
      `Address: ${order.customer.address}\n` +
      (order.customer.specialInstructions
        ? `Special Instructions: ${order.customer.specialInstructions}\n`
        : '') +
      `Status: ${order.status}\n\n` +
      `* NOTE: This is a demo transaction created on Yasir Restaurant & Grill House showcase website.`
  );
  return `mailto:${NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Generates fallback email link for bookings
 */
export function buildBookingMailtoLink(booking: BookingRecord): string {
  const subject = encodeURIComponent(
    `[DEMO BOOKING ${booking.bookingReference}] ${booking.tableName} on ${booking.date} at ${booking.time} - Yasir Restaurant`
  );
  const body = encodeURIComponent(
    `Booking Reference: ${booking.bookingReference}\n` +
      `Table: ${booking.tableName}\n` +
      `Date: ${booking.date}\n` +
      `Time: ${booking.time}\n` +
      `Guests: ${booking.guests}\n` +
      `Customer Name: ${booking.fullName}\n` +
      `Phone: ${booking.phone}\n` +
      `Email: ${booking.email}\n` +
      `Location Preference: ${booking.location}\n` +
      (booking.specialInstructions
        ? `Special Requests: ${booking.specialInstructions}\n`
        : '') +
      `Status: ${booking.status}\n\n` +
      `* NOTE: This is a demo booking request created on Yasir Restaurant & Grill House showcase website.`
  );
  return `mailto:${NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}

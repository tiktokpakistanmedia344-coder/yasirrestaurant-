import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUSINESS_INFO,
  buildWhatsAppUrl,
  buildReservationWhatsAppMessage,
  buildDealWhatsAppMessage,
  validateReservationForm,
  isRestaurantOpenNow,
} from './whatsapp';
import { BUSINESS_DETAILS } from '../data/restaurantData';
import type { DealItem } from '../types/restaurant';

test('BUSINESS_INFO matches required specifications', () => {
  assert.equal(BUSINESS_INFO.name, 'Yasir Restaurant & Grill House');
  assert.equal(BUSINESS_INFO.phoneRaw, '923293179587');
  assert.equal(BUSINESS_INFO.phoneDisplay, '+92 329 3179587');
  assert.equal(BUSINESS_DETAILS.phoneRaw, '923293179587');
  assert.equal(BUSINESS_DETAILS.phoneDisplay, '+92 329 3179587');
  assert.equal(BUSINESS_DETAILS.primaryWhatsAppUrl, BUSINESS_INFO.primaryWhatsAppUrl);
  assert.equal(BUSINESS_INFO.rating, '4.7');
  assert.equal(BUSINESS_INFO.reviewsCount, '580+');
  assert.equal(
    BUSINESS_INFO.primaryMessage,
    'Hello Yasir Restaurant, I would like to reserve a table / order food delivery.'
  );
  assert.equal(
    BUSINESS_INFO.primaryWhatsAppUrl,
    'https://wa.me/923293179587?text=Hello%20Yasir%20Restaurant%2C%20I%20would%20like%20to%20reserve%20a%20table%20%2F%20order%20food%20delivery.'
  );
});

test('buildWhatsAppUrl returns primary link on empty input and properly encodes custom messages', () => {
  assert.equal(buildWhatsAppUrl(), BUSINESS_INFO.primaryWhatsAppUrl);
  assert.equal(buildWhatsAppUrl(''), BUSINESS_INFO.primaryWhatsAppUrl);
  assert.equal(buildWhatsAppUrl('   '), BUSINESS_INFO.primaryWhatsAppUrl);

  const custom = buildWhatsAppUrl('Reserve for 4 persons');
  assert.ok(custom.startsWith('https://wa.me/923293179587?text='));
  assert.ok(custom.includes('Reserve%20for%204%20persons'));
});

test('buildReservationWhatsAppMessage formats structured reservation text', () => {
  const msg = buildReservationWhatsAppMessage({
    fullName: 'Hamza Khan',
    date: '2026-11-10',
    time: '20:30',
    guests: '4 Guests',
    notes: 'Window table please',
  });

  assert.ok(msg.includes('Hamza Khan'));
  assert.ok(msg.includes('2026-11-10'));
  assert.ok(msg.includes('20:30'));
  assert.ok(msg.includes('4 Guests'));
  assert.ok(msg.includes('Window table please'));
});

test('validateReservationForm correctly detects missing fields and valid entries', () => {
  const invalidResult = validateReservationForm({});
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.fullName);
  assert.ok(invalidResult.errors.date);
  assert.ok(invalidResult.errors.time);
  assert.ok(invalidResult.errors.guests);

  const validResult = validateReservationForm({
    fullName: 'Ayesha Malik',
    date: '2026-11-12',
    time: '20:00',
    guests: '2 Guests',
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('isRestaurantOpenNow handles opening hours accurately in PKT', () => {
  // Test afternoon (14:00 UTC = 19:00 PKT) -> Should be Open
  const afternoonDate = new Date('2026-11-07T14:00:00Z');
  const resOpen = isRestaurantOpenNow(afternoonDate);
  assert.equal(resOpen.isOpen, true);
  assert.equal(resOpen.statusText, 'Open Now');

  // Test morning (04:00 UTC = 09:00 PKT) -> Should be Closed
  const morningDate = new Date('2026-11-07T04:00:00Z');
  const resClosed = isRestaurantOpenNow(morningDate);
  assert.equal(resClosed.isOpen, false);
  assert.equal(resClosed.statusText, 'Closed Now');
});

test('buildDealWhatsAppMessage formats custom deal order message accurately', () => {
  const dummyDeal: DealItem = {
    id: 'test-deal',
    dealNumber: 'DEAL 01',
    title: 'Smoked Sultan BBQ Platter',
    badge: 'Chef Choice',
    price: 3450,
    priceDisplay: 'Rs. 3,450',
    originalPrice: 4200,
    originalPriceDisplay: 'Rs. 4,200',
    savingsDisplay: 'SAVE RS. 750',
    servings: 'Serves 3-4 Persons',
    shortDescription: 'Smoked platter with fresh sides',
    description: 'Smoked platter with fresh sides',
    includes: ['Chicken Malai Boti', 'Beef Seekh Kebabs', 'Roghni Naan'],
    image: 'https://example.com/image.jpg',
    alt: 'Test deal image',
  };

  const message = buildDealWhatsAppMessage(dummyDeal, 2, 'Extra spicy please');
  assert.ok(message.includes('Smoked Sultan BBQ Platter'));
  assert.ok(message.includes('Rs. 3,450 (Qty: 2)'));
  assert.ok(message.includes('Serves 3-4 Persons'));
  assert.ok(message.includes('Chicken Malai Boti'));
  assert.ok(message.includes('Beef Seekh Kebabs'));
  assert.ok(message.includes('Extra spicy please'));
  assert.ok(message.includes('+92 329 3179587') === false); // Phone is in URL, not body
});

import type { SpecialtyItem, GalleryItem, DealItem, SeatingOption } from '../types/restaurant';

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85';

export const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85';

export const BUSINESS_DETAILS = {
  name: 'Yasir Restaurant & Grill House',
  shortName: 'Yasir',
  subTitle: 'RESTAURANT & GRILL HOUSE',
  tagline: 'Good Food GOOD MOOD',
  subTagline: 'Delicious meals made with fresh ingredients, served with love.',
  rating: 4.7,
  reviewsCount: '580+',
  category: 'Fine Dining, Continental & Traditional BBQ',
  address: 'Plot 45-C, Main Boulevard, Gulberg III, Lahore, Pakistan',
  phoneDisplay: '+92 329 3179587',
  phoneRaw: '923293179587',
  hoursDisplay: 'Mon - Sun: 12:30 PM - 01:00 AM',
  destinationEmail: 'tiktokpakitanmedia344@gmail.com',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Yasir%20Restaurant%20%26%20Grill%20House%2C%20Plot%2045-C%2C%20Main%20Boulevard%2C%20Gulberg%20III%2C%20Lahore',
  primaryWhatsAppUrl:
    'https://wa.me/923293179587?text=Hello%20Yasir%20Restaurant%2C%20I%20would%20like%20to%20reserve%20a%20table%20%2F%20order%20food%20delivery.',
};

export const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'smoked-bbq-platter',
    title: 'Smoked BBQ Platter',
    description:
      'Tender malai boti, spicy seekh kebabs, marinated mutton chops and smoked wings glazed over hot coals.',
    image:
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80',
    alt: 'Smoked BBQ Platter featuring tender grilled meats, ribs, and savory accompaniments',
    category: 'bbq',
  },
  {
    id: 'charcoal-grilled-steaks',
    title: 'Charcoal Grilled Steaks',
    description:
      'Premium thick-cut ribeye, tenderloin, and T-bone steaks seared over charcoal with herbed garlic butter.',
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    alt: 'Charcoal grilled steak with distinctive sear marks and fresh rosemary garnish',
    category: 'steak',
  },
  {
    id: 'handcrafted-burgers',
    title: 'Handcrafted Burgers',
    description:
      'Smash prime beef and crispy buttermilk chicken burgers on toasted brioche with house smokey relish.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    alt: 'Gourmet handcrafted burger with toasted sesame bun and juicy grilled patty',
    category: 'burger',
  },
];

export const BIG_DEALS: DealItem[] = [
  {
    id: 'deal-01',
    dealNumber: 'DEAL 01',
    title: 'FAMILY BBQ FEAST',
    badge: '🔥 HOT COMBO',
    price: 3450,
    priceDisplay: 'Rs. 3,450',
    originalPrice: 4200,
    originalPriceDisplay: 'Rs. 4,200',
    savingsDisplay: 'SAVE RS. 750',
    servings: 'Serves 4 - 5 Persons',
    shortDescription: 'Grand royal barbecue feast featuring malai boti, seekh kebabs, wings, roghni naans & drinks.',
    description:
      'The ultimate royal barbecue experience for families and party gatherings in Lahore. Freshly marinated chicken malai boti skewers, flame-grilled beef seekh kebabs, charcoal-smoked wings, piping-hot tandoori roghni naans, traditional mint raita, crisp garden salad, and chilled soft drinks.',
    includes: [
      '1x Chicken Malai Boti Skewer (8 large pcs)',
      '4x Flame-Seared Beef Seekh Kebabs',
      '6x Smoked BBQ Chicken Wings',
      '4x Fresh Roghni Tandoori Naans',
      'Special Mint Raita & Fresh Garden Salad',
      '1x 1.5L Chilled Soft Drink',
    ],
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    alt: 'Family BBQ Feast platter with kebabs and naans',
  },
  {
    id: 'deal-02',
    dealNumber: 'DEAL 02',
    title: 'BURGER LOVERS COMBO',
    badge: '⚡ CROWD FAVORITE',
    price: 1950,
    priceDisplay: 'Rs. 1,950',
    originalPrice: 2450,
    originalPriceDisplay: 'Rs. 2,450',
    savingsDisplay: 'SAVE RS. 500',
    servings: 'Serves 2 Persons',
    shortDescription: 'Two handcrafted smash burgers, basket of peri peri fries, dips & chilled drinks.',
    description:
      'Designed for true burger lovers who demand artisanal quality and generous portions. Enjoy two gourmet double-patty smash burgers stacked with melted aged cheddar, caramelized onions, crisp lettuce, paired with an oversized basket of loaded peri peri fries and signature dipping sauces.',
    includes: [
      '2x Artisan Smash Cheeseburgers (Prime Beef or Grilled Chicken)',
      '1x Jumbo Basket Loaded Peri Peri Fries',
      '2x Signature Garlic Mayo & Smokey BBQ Dips',
      '2x 345ml Chilled Soft Drinks',
    ],
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Burger lovers duo combo with loaded peri peri fries',
  },
  {
    id: 'deal-03',
    dealNumber: 'DEAL 03',
    title: 'STEAK NIGHT SPECIAL',
    badge: '🥩 CHEF SIGNATURE',
    price: 2850,
    priceDisplay: 'Rs. 2,850',
    originalPrice: 3500,
    originalPriceDisplay: 'Rs. 3,500',
    savingsDisplay: 'SAVE RS. 650',
    servings: 'Serves 1 - 2 Persons',
    shortDescription: 'Prime cut ribeye steak seared over charcoal with BBQ ribs, garlic mashed potatoes & drink.',
    description:
      'Treat yourself to a fine-dining continental spectacle prepared on our charcoal hearth. A prime aged beef ribeye steak charbroiled to medium-rare or medium perfection, complemented with glazed BBQ ribs, velvety garlic mashed potatoes, char-grilled veggies, and peppercorn reduction.',
    includes: [
      '1x Prime Cut Charcoal Seared Ribeye Steak (300g)',
      '2x Slow-Cooked Smoked Beef Ribs',
      '1x Creamy Garlic Mashed Potatoes & Butter Corn',
      'Signature Wild Mushroom & Black Pepper Gravy',
      '2x Fresh Artisan Dinner Rolls & Garlic Butter',
      '2x 345ml Chilled Beverages',
    ],
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
    alt: 'Prime charcoal steak with barbecue ribs and gourmet sides',
  },
  {
    id: 'deal-04',
    dealNumber: 'DEAL 04',
    title: 'FRIENDS PARTY PLATTER',
    badge: '🎉 PARTY SPECIAL',
    price: 3890,
    priceDisplay: 'Rs. 3,890',
    originalPrice: 4700,
    originalPriceDisplay: 'Rs. 4,700',
    savingsDisplay: 'SAVE RS. 810',
    servings: 'Serves 4 - 6 Persons',
    shortDescription: 'Huge party platter loaded with pizza slices, pasta bowls, crispy chicken strips & loaded nachos.',
    description:
      'The party centerpiece designed for friends sharing laughs and great times. Features a large pepperoni or BBQ chicken pizza, bowls of rich creamy alfredo fettuccine, golden crunchy chicken tenders, loaded Mexican cheese nachos with jalapeños, and refreshing soft drinks.',
    includes: [
      '1x Large 14-Inch Artisan Hand-Tossed Pizza (Any Flavor)',
      '1x Creamy Alfredo Fettuccine Pasta Bowl',
      '6x Golden Crispy Buttermilk Chicken Tenders',
      '1x Supreme Loaded Cheesy Nachos Platter',
      '3x Gourmet Dipping Sauces (Honey Mustard, Garlic Aioli, Salsa)',
      '1x 1.5L Chilled Soft Drink',
    ],
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    alt: 'Friends party platter with pizza, pasta, and appetizers',
  },
  {
    id: 'deal-05',
    dealNumber: 'DEAL 05',
    title: 'YASIR GRAND FEAST',
    badge: '👑 ROYAL SUPREME',
    price: 4950,
    priceDisplay: 'Rs. 4,950',
    originalPrice: 6200,
    originalPriceDisplay: 'Rs. 6,200',
    savingsDisplay: 'SAVE RS. 1,250',
    servings: 'Serves 6 - 8 Persons',
    shortDescription: 'The pinnacle dining feast: Mutton chops, fish tikka, chicken reshmi boti, biryani & desserts.',
    description:
      'A true gastronomic masterpiece bringing together the best of our traditional charcoal hearth and royal Mughlai kitchen. Tender smoked mutton chops, juicy fish tikka skewers, chicken reshmi kebabs, aromatic royal dumpukht biryani, hot roghni naans, and gourmet chocolate lava cakes.',
    includes: [
      '4x Charcoal Grilled Tender Mutton Chops',
      '2x Fragrant Fish Tikka Skewers',
      '1x Skewer Chicken Reshmi Boti (8 pcs)',
      '1x Royal Dumpukht Mutton/Chicken Biryani Handi',
      '6x Freshly Baked Roghni Naans & Fresh Raita',
      '2x Molten Chocolate Lava Cakes with Vanilla Ice Cream',
      '2x 1.5L Chilled Soft Drinks',
    ],
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    alt: 'Yasir grand feast with mutton chops, skewers, and biryani',
  },
];

export const SEATING_OPTIONS: SeatingOption[] = [
  {
    id: 'outdoor-dining',
    name: 'OUTDOOR DINING',
    tagline: 'Open-Air Starlight Terrace',
    description:
      'Enjoy Gulberg’s evening breeze under ambient warm fairy lights, surrounded by lush potted greenery and the aroma of live charcoal grills.',
    image:
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80',
    badge: 'Breezy & Atmospheric',
    features: ['Open-air starlight ambiance', 'Comfortable cushioned patio seating', 'Live BBQ aroma & view', 'Heaters in winter'],
  },
  {
    id: 'indoor-dining',
    name: 'INDOOR DINING',
    tagline: 'Sophisticated Central Hall',
    description:
      'Immerse in fine-dining comfort featuring dark acoustic architecture, warm glowing pendant lights, and climate-controlled elegance.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    badge: 'Cozy & Refined',
    features: ['Acoustic low-noise dining hall', 'Plush leather booth seating', 'Full climate control & AC', 'Soft instrumental music'],
  },
  {
    id: 'family-dining',
    name: 'FAMILY DINING',
    tagline: 'Spacious Multi-Table Enclaves',
    description:
      'Tailor-made for large Pakistani family dinners, birthdays, and celebrations with privacy, dedicated servers, and kid-friendly seating.',
    image:
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=80',
    badge: 'Spacious & Private',
    features: ['High-backed secluded family booths', 'High-chairs available on request', 'Dedicated table captain', 'Accommodates 6 to 16 guests'],
  },
  {
    id: 'premium-private-dining',
    name: 'PREMIUM PRIVATE DINING',
    tagline: 'Exclusive VIP Luxury Suite',
    description:
      'A secluded luxury dining room designed for high-profile business dinners, anniversaries, and VIP private gatherings.',
    image:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80',
    badge: 'VIP Exclusive',
    features: ['100% Private enclosed lounge', 'Personal butler & executive chef service', 'Customizable curated multi-course menu', 'Audio/visual setup available'],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Signature Smoked Meat Platter',
    category: 'bbq',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    alt: 'Lavish smoked BBQ platter served on rustic dark board',
  },
  {
    id: 'g-2',
    title: 'Charcoal Seared Prime Cut',
    category: 'steaks',
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
    alt: 'Prime beef steak sliced to perfection with charred edges',
  },
  {
    id: 'g-3',
    title: 'Artisan Gourmet Cheeseburger',
    category: 'burgers',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Handcrafted artisan burger with melted aged cheddar and crisp greens',
  },
  {
    id: 'g-4',
    title: 'Fine Dining Ambient Hall',
    category: 'ambience',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Atmospheric dining hall with warm chandelier lighting and elegant tables',
  },
  {
    id: 'g-5',
    title: 'Live Charcoal Grilling',
    category: 'bbq',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    alt: 'Skewers and ribs over glowing embers and live grill flames',
  },
  {
    id: 'g-6',
    title: 'Sizzling Tenderloin Plating',
    category: 'steaks',
    image:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
    alt: 'Gourmet steak plating with micro herbs and savory reduction',
  },
  {
    id: 'g-7',
    title: 'Wood-Fired Neapolitan Pizza',
    category: 'traditional',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan pizza with bubbly blistered crust and fresh mozzarella',
  },
  {
    id: 'g-8',
    title: 'Intimate Evening Setting',
    category: 'ambience',
    image:
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sophisticated dining table with warm candlelight and fine tableware',
  },
];

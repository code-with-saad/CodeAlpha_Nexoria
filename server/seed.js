import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const PRODUCTS = [
  {
    name: 'Nexoria Pro Wireless ANC Headphones',
    description: 'Engineered with 40mm dynamic bio-cellulose drivers, hybrid active noise cancellation (ANC), transparency mode, and ultra-plush memory foam earcups. Bluetooth 5.3 multi-point connectivity with up to 40 hours of playback on a single charge.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Electronics',
    stock: 28
  },
  {
    name: 'True Wireless Sport Earbuds',
    description: 'IPX5-rated wireless earbuds with deep bass, 8mm drivers, 30h total battery with charging case, and an ear-wing design that stays secure during intense workouts.',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'Ultra-Slim 4K Portable Monitor',
    description: 'Professional-grade 15.6in IPS 4K HDR portable display at just 5.9mm thin. USB-C and mini HDMI connectivity, 400-nit brightness, 100% sRGB color accuracy.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    category: 'Electronics',
    stock: 12
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Full-size TKL mechanical keyboard with hot-swappable linear switches, per-key RGB lighting, aluminum top plate, and N-key rollover for zero ghosting.',
    price: 119.50,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    category: 'Electronics',
    stock: 18
  },
  {
    name: 'Wireless Charging Pad Trio',
    description: 'Charge your phone, earbuds, and smartwatch simultaneously. Qi-certified 15W fast wireless charging with intelligent load detection and FOD safety circuitry.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    category: 'Electronics',
    stock: 40
  },
  {
    name: 'Smart Home Security Camera',
    description: 'AI-powered 2K outdoor security camera with 360 motorised pan-tilt, colour night vision, two-way audio, IP67 weatherproofing, and motion zone alerts.',
    price: 89.95,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
    category: 'Electronics',
    stock: 22
  },
  {
    name: 'Ergonomic Vertical Mouse',
    description: 'Natural handshake grip vertical mouse reduces forearm strain by 57%. 6 programmable buttons, dual-mode wireless and Bluetooth, 400-4000 DPI adjustable.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
    category: 'Accessories',
    stock: 35
  },
  {
    name: 'Leather Cable Organiser Set',
    description: 'Premium full-grain vegetable-tanned leather cable management organiser with 8 magnetic cable clips and a zippered travel case.',
    price: 29.00,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    category: 'Accessories',
    stock: 60
  },
  {
    name: 'Multi-Port USB-C Hub 11-in-1',
    description: 'Expands to 4K HDMI, 2x USB-A 3.0, 2x USB-C PD 100W, SD/microSD reader, 3.5mm audio, and Gigabit Ethernet. Compact aluminium shell.',
    price: 64.95,
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800&q=80',
    category: 'Accessories',
    stock: 27
  },
  {
    name: 'Artisan Wrist Rest Desk Mat Bundle',
    description: 'Large 900x400mm XXL desk mat with stitched edges paired with a contoured memory-foam wrist rest. Non-slip rubber base, machine-washable cover.',
    price: 38.50,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    category: 'Accessories',
    stock: 45
  },
  {
    name: 'Minimalist Chronograph Wristwatch',
    description: 'Precision Japanese VK64 meca-quartz movement in surgical-grade 316L stainless steel with anti-reflective sapphire crystal, 5 ATM water resistance.',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Lifestyle',
    stock: 9,
    isFeatured: true
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted matte ceramic dripper, server, and two cups. Designed for the perfect 93C bloom extraction for specialty single-origin coffee. Includes 40 natural-fibre filters.',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    category: 'Lifestyle',
    stock: 20
  },
  {
    name: 'Insulated Stainless Water Bottle 1L',
    description: 'Triple-walled vacuum insulation keeps beverages cold for 48h or hot for 24h. BPA-free 18/8 food-grade stainless steel with leakproof magnetic lid.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    category: 'Lifestyle',
    stock: 55
  },
  {
    name: 'Aromatherapy Diffuser and Essential Oil Kit',
    description: 'Ultrasonic 300ml aroma diffuser with 7-colour mood LED, auto-shutoff, whisper-quiet operation, and 6 pure essential oils: lavender, eucalyptus, peppermint and more.',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    category: 'Lifestyle',
    stock: 30
  },
  {
    name: 'Slim Cardholder Wallet Midnight Black',
    description: 'RFID-blocking full-grain cowhide leather cardholder with rigid pull-tab mechanism for fast card access. Holds 6 cards and folded cash. Satin interior.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    category: 'Lifestyle',
    stock: 65
  },
  {
    name: 'Hardshell Travel Backpack 28L',
    description: 'Military-grade polycarbonate hybrid shell backpack. TSA-friendly lay-flat laptop compartment up to 17in, hidden magnetic pockets, USB-A pass-through.',
    price: 148.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    category: 'Lifestyle',
    stock: 14
  },
  {
    name: 'Smart Ambient LED Studio Lamp',
    description: 'Touch and app-controlled desk lamp with 16M colour RGBWW LEDs, stepless 2700K-6500K colour temperature, Qi wireless charging base, and native Alexa/Google/HomeKit support.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    category: 'Home',
    stock: 19
  },
  {
    name: 'Borosilicate Glass French Press 1L',
    description: 'Double-wall borosilicate glass french press keeps coffee warm 30 minutes longer. 4-layer stainless micro-filter system for sediment-free coffee. Dishwasher-safe.',
    price: 34.95,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80',
    category: 'Home',
    stock: 33
  },
  {
    name: 'Air Purifier HEPA 13 Plus Carbon',
    description: 'Medical-grade True HEPA 13 filtration removes 99.97% of particles 0.3 micron and larger. Activated carbon layer eliminates VOCs and odours. Covers 500 sqft in under 30 minutes.',
    price: 179.00,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    category: 'Home',
    stock: 10
  },
  {
    name: 'Modular Floating Shelf System',
    description: 'Solid walnut modular wall shelf that expands in any configuration. Each plank spans 90cm and carries up to 25kg. Hidden steel brackets with drill template. No visible fixings.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    category: 'Home',
    stock: 8
  },
  {
    name: 'Organic Cotton Weighted Blanket 8kg',
    description: 'GOTS-certified 100% organic cotton shell with glass microbeads in 400 individual pockets. Deep-pressure stimulation for reduced anxiety and improved sleep quality.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    category: 'Home',
    stock: 17
  },
  {
    name: 'Cast Iron Skillet 12-inch',
    description: 'Pre-seasoned with organic flaxseed oil. Builds a naturally non-stick patina with every use. Compatible with all cooktops including induction. Oven-safe to 260C.',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    category: 'Home',
    stock: 25
  },
  {
    name: 'Scented Soy Candle Forest and Cedar',
    description: 'Hand-poured 100% natural soy wax candle with crackling wooden wick. Forest and Cedar fragrance: pine, vetiver, sandalwood. 60-hour burn time. Reusable ceramic vessel.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
    category: 'Home',
    stock: 70
  },
  {
    name: 'Smart Plug Wi-Fi 4-Pack',
    description: 'Turn any outlet smart. 2.4GHz Wi-Fi, 16A/3840W max load, real-time energy monitoring, countdown timers, remote control. Works with Alexa, Google Assistant, SmartThings.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Home',
    stock: 42
  }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Product.countDocuments();
    if (existing >= 20 && !process.argv.includes('--force')) {
      console.log('Database already has ' + existing + ' products. Use --force to re-seed.');
      process.exit(0);
    }

    if (process.argv.includes('--force')) {
      await Product.deleteMany({});
      console.log('Cleared existing products');
    }

    const inserted = await Product.insertMany(PRODUCTS);
    console.log('Seeded ' + inserted.length + ' products successfully!');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();

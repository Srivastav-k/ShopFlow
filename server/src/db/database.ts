import type { Product, Category, User, Order, OrderItem } from '../types/index.js';

// ---- Auto-increment counters ----
let nextProductId = 31;
let nextCategoryId = 7;
let nextOrderId = 11;
let nextOrderItemId = 20;

// ---- In-memory tables ----
export const products: Product[] = [];
export const categories: Category[] = [];
export const users: User[] = [];
export const orders: Order[] = [];

// ---- Seed data ----
export function seedDatabase(): void {
  // Skip if already seeded
  if (products.length > 0) return;

  // --- Categories ---
  categories.push(
    { id: 1, name: 'Keyboards', description: 'Mechanical and membrane keyboards for every typing style', createdAt: '2026-01-01T00:00:00Z' },
    { id: 2, name: 'Mice', description: 'Ergonomic and gaming mice for precision and comfort', createdAt: '2026-01-01T00:00:00Z' },
    { id: 3, name: 'Monitors', description: 'High-resolution displays for work and gaming', createdAt: '2026-01-01T00:00:00Z' },
    { id: 4, name: 'Headphones', description: 'Over-ear, on-ear, and in-ear audio solutions', createdAt: '2026-01-01T00:00:00Z' },
    { id: 5, name: 'Laptops', description: 'Portable computing for professionals and gamers', createdAt: '2026-01-01T00:00:00Z' },
    { id: 6, name: 'Accessories', description: 'Cables, stands, mats, and other peripherals', createdAt: '2026-01-01T00:00:00Z' },
  );

  // --- Products ---
  const now = '2026-09-01T00:00:00Z';
  const seedProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Keyboards (5)
    { name: 'Mechanical Keyboard Pro', category: 'Keyboards', price: 2499, description: '75% mechanical keyboard with hot-swappable switches and RGB backlighting. Compact layout perfect for both gaming and productivity.', imageUrl: 'https://picsum.photos/seed/keyboard1/400/300', stock: 24 },
    { name: 'Wireless Ergonomic Keyboard', category: 'Keyboards', price: 3299, description: 'Split ergonomic design with cushioned palm rest. Bluetooth 5.0 with 6-month battery life.', imageUrl: 'https://picsum.photos/seed/keyboard2/400/300', stock: 15 },
    { name: 'Compact 60% Keyboard', category: 'Keyboards', price: 1899, description: 'Ultra-compact 60% layout with Cherry MX Blue switches. Detachable USB-C cable included.', imageUrl: 'https://picsum.photos/seed/keyboard3/400/300', stock: 38 },
    { name: 'Full-Size Office Keyboard', category: 'Keyboards', price: 899, description: 'Quiet membrane keyboard with full numpad. Spill-resistant design with adjustable feet.', imageUrl: 'https://picsum.photos/seed/keyboard4/400/300', stock: 52 },
    { name: 'Gaming Mechanical Keyboard', category: 'Keyboards', price: 4599, description: 'Full-size mechanical keyboard with Cherry MX Red switches. Per-key RGB, dedicated macro keys, and magnetic wrist rest.', imageUrl: 'https://picsum.photos/seed/keyboard5/400/300', stock: 0 },

    // Mice (5)
    { name: 'Precision Gaming Mouse', category: 'Mice', price: 1799, description: 'Lightweight gaming mouse with 25K DPI sensor. Programmable buttons and customizable RGB.', imageUrl: 'https://picsum.photos/seed/mouse1/400/300', stock: 30 },
    { name: 'Ergonomic Vertical Mouse', category: 'Mice', price: 1299, description: 'Vertical design reduces wrist strain. 6 buttons with adjustable DPI up to 4000.', imageUrl: 'https://picsum.photos/seed/mouse2/400/300', stock: 20 },
    { name: 'Wireless Travel Mouse', category: 'Mice', price: 699, description: 'Compact wireless mouse with nano receiver. 3 DPI levels and 12-month battery life.', imageUrl: 'https://picsum.photos/seed/mouse3/400/300', stock: 45 },
    { name: 'Pro Ambidextrous Mouse', category: 'Mice', price: 2999, description: 'Symmetric design for left and right-handed users. 16K DPI sensor with adjustable weight system.', imageUrl: 'https://picsum.photos/seed/mouse4/400/300', stock: 12 },
    { name: 'Trackball Mouse', category: 'Mice', price: 2199, description: 'Thumb-operated trackball for precise cursor control. Bluetooth and USB dongle connectivity.', imageUrl: 'https://picsum.photos/seed/mouse5/400/300', stock: 0 },

    // Monitors (5)
    { name: '27" 4K IPS Monitor', category: 'Monitors', price: 28999, description: '27-inch 4K UHD IPS panel with 99% sRGB coverage. USB-C with 65W power delivery, height-adjustable stand.', imageUrl: 'https://picsum.photos/seed/monitor1/400/300', stock: 8 },
    { name: '34" Ultrawide Curved Monitor', category: 'Monitors', price: 42999, description: '34-inch UWQHD curved VA panel. 144Hz refresh rate, 1ms response time, AMD FreeSync Premium.', imageUrl: 'https://picsum.photos/seed/monitor2/400/300', stock: 5 },
    { name: '24" Full HD Monitor', category: 'Monitors', price: 12499, description: '24-inch 1080p IPS panel. 75Hz, anti-glare coating, VESA mountable, thin bezel design.', imageUrl: 'https://picsum.photos/seed/monitor3/400/300', stock: 22 },
    { name: '32" QHD Gaming Monitor', category: 'Monitors', price: 35999, description: '32-inch QHD IPS panel. 165Hz, 1ms GtG, NVIDIA G-Sync compatible, HDR400.', imageUrl: 'https://picsum.photos/seed/monitor4/400/300', stock: 3 },
    { name: 'Portable 15.6" Monitor', category: 'Monitors', price: 15999, description: '15.6-inch portable FHD IPS display. USB-C powered, built-in speakers, foldable magnetic cover.', imageUrl: 'https://picsum.photos/seed/monitor5/400/300', stock: 18 },

    // Headphones (5)
    { name: 'Studio Monitor Headphones', category: 'Headphones', price: 5999, description: 'Over-ear open-back design for accurate audio reproduction. 250 ohm impedance, velour ear pads.', imageUrl: 'https://picsum.photos/seed/headphone1/400/300', stock: 14 },
    { name: 'Active Noise Cancelling Headphones', category: 'Headphones', price: 8499, description: 'Premium ANC with 30-hour battery life. Multipoint Bluetooth, foldable design, carrying case included.', imageUrl: 'https://picsum.photos/seed/headphone2/400/300', stock: 25 },
    { name: 'Gaming Headset 7.1', category: 'Headphones', price: 3499, description: 'Virtual 7.1 surround sound gaming headset. Detachable boom mic, memory foam ear cushions, RGB lighting.', imageUrl: 'https://picsum.photos/seed/headphone3/400/300', stock: 32 },
    { name: 'Wireless Earbuds Pro', category: 'Headphones', price: 4999, description: 'True wireless earbuds with ANC and transparency mode. IPX5 water resistance, 8-hour battery.', imageUrl: 'https://picsum.photos/seed/headphone4/400/300', stock: 40 },
    { name: 'Budget On-Ear Headphones', category: 'Headphones', price: 999, description: 'Lightweight on-ear headphones with inline mic and controls. 3.5mm jack, foldable design.', imageUrl: 'https://picsum.photos/seed/headphone5/400/300', stock: 0 },

    // Laptops (5)
    { name: 'Developer Ultrabook 14"', category: 'Laptops', price: 74999, description: '14-inch FHD IPS, Intel i7 13th Gen, 16GB RAM, 512GB NVMe SSD. Thunderbolt 4, fingerprint reader, 1.3kg.', imageUrl: 'https://picsum.photos/seed/laptop1/400/300', stock: 6 },
    { name: 'Gaming Laptop 15.6"', category: 'Laptops', price: 89999, description: '15.6-inch QHD 165Hz, AMD Ryzen 9, RTX 4060, 32GB RAM, 1TB SSD. Per-key RGB keyboard, advanced cooling.', imageUrl: 'https://picsum.photos/seed/laptop2/400/300', stock: 4 },
    { name: 'Budget Student Laptop', category: 'Laptops', price: 34999, description: '15.6-inch FHD, AMD Ryzen 5, 8GB RAM, 256GB SSD. Long battery life, lightweight at 1.7kg.', imageUrl: 'https://picsum.photos/seed/laptop3/400/300', stock: 15 },
    { name: 'Creative Pro Laptop 16"', category: 'Laptops', price: 129999, description: '16-inch 4K OLED, Intel i9, RTX 4070, 32GB RAM, 1TB SSD. Color-calibrated display, SD card reader.', imageUrl: 'https://picsum.photos/seed/laptop4/400/300', stock: 2 },
    { name: 'Convertible 2-in-1 Laptop', category: 'Laptops', price: 54999, description: '13.3-inch FHD touchscreen, Intel i5, 16GB RAM, 512GB SSD. 360° hinge, stylus included, 12hr battery.', imageUrl: 'https://picsum.photos/seed/laptop5/400/300', stock: 10 },

    // Accessories (5)
    { name: 'USB-C Docking Station', category: 'Accessories', price: 6499, description: '12-in-1 USB-C hub with dual HDMI, Ethernet, SD reader, 100W passthrough charging. Aluminum body.', imageUrl: 'https://picsum.photos/seed/acc1/400/300', stock: 20 },
    { name: 'Monitor Arm Mount', category: 'Accessories', price: 3299, description: 'Single monitor arm supporting up to 32". Gas spring mechanism, cable management, VESA 75/100.', imageUrl: 'https://picsum.photos/seed/acc2/400/300', stock: 28 },
    { name: 'Extended Desk Mat', category: 'Accessories', price: 1299, description: '900x400mm desk mat with stitched edges. Water-resistant surface, non-slip rubber base.', imageUrl: 'https://picsum.photos/seed/acc3/400/300', stock: 50 },
    { name: 'Webcam 4K', category: 'Accessories', price: 4999, description: '4K webcam with auto-focus and built-in ring light. Dual noise-cancelling mics, privacy shutter.', imageUrl: 'https://picsum.photos/seed/acc4/400/300', stock: 16 },
    { name: 'Laptop Stand Adjustable', category: 'Accessories', price: 1999, description: 'Adjustable aluminum laptop stand. Supports 10-17" laptops, foldable and portable, ventilated design.', imageUrl: 'https://picsum.photos/seed/acc5/400/300', stock: 35 },
  ];

  for (let i = 0; i < seedProducts.length; i++) {
    products.push({
      id: i + 1,
      ...seedProducts[i],
      createdAt: now,
      updatedAt: now,
    });
  }

  // --- User ---
  users.push({
    id: 1,
    name: 'Alex Kumar',
    email: 'alex@example.com',
    phone: '+91 9876543210',
    address: {
      street: '12 MG Road',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500001',
      country: 'India',
    },
    createdAt: '2026-01-01T00:00:00Z',
  });

  // --- Historical Orders ---
  const seedOrders: { subtotal: number; status: Order['status']; createdAt: string; items: Omit<OrderItem, 'id' | 'orderId'>[] }[] = [
    { subtotal: 4298, status: 'DELIVERED', createdAt: '2026-08-01T10:30:00Z', items: [
      { productId: 1, name: 'Mechanical Keyboard Pro', quantity: 1, price: 2499 },
      { productId: 6, name: 'Precision Gaming Mouse', quantity: 1, price: 1799 },
    ]},
    { subtotal: 28999, status: 'DELIVERED', createdAt: '2026-08-05T14:15:00Z', items: [
      { productId: 11, name: '27" 4K IPS Monitor', quantity: 1, price: 28999 },
    ]},
    { subtotal: 9498, status: 'SHIPPED', createdAt: '2026-08-20T09:00:00Z', items: [
      { productId: 17, name: 'Active Noise Cancelling Headphones', quantity: 1, price: 8499 },
      { productId: 20, name: 'Budget On-Ear Headphones', quantity: 1, price: 999 },
    ]},
    { subtotal: 6499, status: 'PROCESSING', createdAt: '2026-09-01T16:45:00Z', items: [
      { productId: 26, name: 'USB-C Docking Station', quantity: 1, price: 6499 },
    ]},
    { subtotal: 3597, status: 'PLACED', createdAt: '2026-09-10T11:20:00Z', items: [
      { productId: 3, name: 'Compact 60% Keyboard', quantity: 1, price: 1899 },
      { productId: 8, name: 'Wireless Travel Mouse', quantity: 1, price: 699 },
      { productId: 20, name: 'Budget On-Ear Headphones', quantity: 1, price: 999 },
    ]},
    { subtotal: 74999, status: 'DELIVERED', createdAt: '2026-07-15T08:30:00Z', items: [
      { productId: 21, name: 'Developer Ultrabook 14"', quantity: 1, price: 74999 },
    ]},
    { subtotal: 42999, status: 'CANCELLED', createdAt: '2026-08-12T13:10:00Z', items: [
      { productId: 12, name: '34" Ultrawide Curved Monitor', quantity: 1, price: 42999 },
    ]},
    { subtotal: 2598, status: 'DELIVERED', createdAt: '2026-06-25T17:00:00Z', items: [
      { productId: 28, name: 'Extended Desk Mat', quantity: 2, price: 1299 },
    ]},
    { subtotal: 54999, status: 'SHIPPED', createdAt: '2026-09-05T10:00:00Z', items: [
      { productId: 25, name: 'Convertible 2-in-1 Laptop', quantity: 1, price: 54999 },
    ]},
    { subtotal: 9997, status: 'PLACED', createdAt: '2026-09-15T19:30:00Z', items: [
      { productId: 16, name: 'Studio Monitor Headphones', quantity: 1, price: 5999 },
      { productId: 30, name: 'Laptop Stand Adjustable', quantity: 2, price: 1999 },
    ]},
  ];

  let orderItemId = 1;
  for (let i = 0; i < seedOrders.length; i++) {
    const orderId = i + 1;
    const orderItems: OrderItem[] = seedOrders[i].items.map((item) => ({
      id: orderItemId++,
      orderId,
      ...item,
    }));
    orders.push({
      id: orderId,
      userId: 1,
      items: orderItems,
      subtotal: seedOrders[i].subtotal,
      status: seedOrders[i].status,
      createdAt: seedOrders[i].createdAt,
    });
  }
  nextOrderItemId = orderItemId;

  console.log('In-memory database seeded:');
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${users.length} user`);
  console.log(`  - ${orders.length} orders`);
}

// ---- ID generators ----
export function getNextProductId(): number { return nextProductId++; }
export function getNextCategoryId(): number { return nextCategoryId++; }
export function getNextOrderId(): number { return nextOrderId++; }
export function getNextOrderItemId(): number { return nextOrderItemId++; }

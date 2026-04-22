require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80';

const products = [
  {
    name: 'Blazer Charbon Structuré',
    description: 'Un blazer tailleur en laine mélangée avec une silhouette épurée. Parfait pour les occasions formelles comme décontractées.',
    price: 289,
    category: 'men',
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 4 }],
    colors: [{ name: 'Charbon', hex: '#1C1C1C' }, { name: 'Gris Clair', hex: '#BDBDBD' }],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4bbc7e?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['blazer', 'formel', 'laine', 'structuré'],
    isFeatured: true
  },
  {
    name: 'Robe Midi Ivoire Éditorial',
    description: 'Robe midi en soie lavée avec des détails plissés subtils. Une pièce intemporelle pour la femme moderne.',
    price: 345,
    category: 'women',
    sizes: [{ size: 'XS', stock: 5 }, { size: 'S', stock: 10 }, { size: 'M', stock: 8 }, { size: 'L', stock: 3 }],
    colors: [{ name: 'Ivoire', hex: '#FAF9F6' }, { name: 'Sable', hex: '#C9A98A' }],
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['robe', 'midi', 'soie', 'élégant'],
    isFeatured: true
  },
  {
    name: 'Manteau Camel Long',
    description: 'Manteau en laine camel brossée, coupe longue et droite. La pièce signature de la saison.',
    price: 520,
    category: 'women',
    sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 5 }],
    colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Noir', hex: '#1C1C1C' }],
    images: ['https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['manteau', 'camel', 'hiver', 'long'],
    isFeatured: true
  },
  {
    name: 'Pantalon Tailleur Anthracite',
    description: 'Pantalon à plis à taille haute en tissu technique léger. Coupe ample et fluide.',
    price: 195,
    category: 'men',
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 9 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Anthracite', hex: '#3D3D3D' }, { name: 'Beige', hex: '#E8DCC8' }],
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['pantalon', 'tailleur', 'formel'],
    isFeatured: false
  },
  {
    name: 'Veste Enfant Laine Douce',
    description: 'Veste en laine douce avec doublure en satin pour les petits explorateurs. Coupe confortable et élégante.',
    price: 145,
    category: 'kids',
    sizes: [{ size: '4A', stock: 10 }, { size: '6A', stock: 8 }, { size: '8A', stock: 6 }, { size: '10A', stock: 4 }],
    colors: [{ name: 'Bleu Marine', hex: '#1B3A6B' }, { name: 'Rouge Bordeaux', hex: '#7B1D1D' }],
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format'],
    brand: 'DRAPE Kids',
    tags: ['enfant', 'veste', 'laine', 'confort'],
    isFeatured: false
  },
  {
    name: 'Sac Cuir Grain Or',
    description: 'Sac à main en cuir grainé avec fermoir doré et bandoulière amovible. Capacité idéale pour le quotidien.',
    price: 390,
    category: 'accessories',
    sizes: [{ size: 'Unique', stock: 15 }],
    colors: [{ name: 'Or Champagne', hex: '#C9A84C' }, { name: 'Noir', hex: '#1C1C1C' }],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['sac', 'cuir', 'accessoire', 'doré'],
    isFeatured: true
  },
  {
    name: 'Chemise Lin Blanc Optique',
    description: 'Chemise oversize en lin lavé à col ouvert. L\'essentiel du vestiaire minimaliste.',
    price: 165,
    category: 'men',
    sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 7 }],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Bleu Glacier', hex: '#B8D4E0' }],
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['chemise', 'lin', 'minimaliste', 'été'],
    isFeatured: false
  },
  {
    name: 'Jupe Plissée Soleil',
    description: 'Jupe midi plissée en crêpe léger. Taille élastique pour un confort optimal et un tombé parfait.',
    price: 175,
    category: 'women',
    sizes: [{ size: 'XS', stock: 6 }, { size: 'S', stock: 9 }, { size: 'M', stock: 7 }, { size: 'L', stock: 4 }],
    colors: [{ name: 'Or Pâle', hex: '#F0D589' }, { name: 'Terracotta', hex: '#CB6843' }],
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['jupe', 'plissée', 'été', 'légère'],
    isFeatured: false
  },
  {
    name: 'Sneakers Cuir Blanc Signature',
    description: 'Sneakers minimalistes en cuir pleine fleur avec semelle légère. Le luxe discret au quotidien.',
    price: 280,
    category: 'men',
    sizes: [{ size: '40', stock: 5 }, { size: '41', stock: 8 }, { size: '42', stock: 10 }, { size: '43', stock: 7 }, { size: '44', stock: 4 }],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Beige', hex: '#E8DCC8' }],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['sneakers', 'cuir', 'blanc', 'casual'],
    isFeatured: false
  },
  {
    name: 'Robe Petite Fille Brodée',
    description: 'Robe en coton doux avec broderies florales délicates. Pour les petites princesses de 2 à 10 ans.',
    price: 95,
    category: 'kids',
    sizes: [{ size: '2A', stock: 8 }, { size: '4A', stock: 10 }, { size: '6A', stock: 7 }, { size: '8A', stock: 5 }],
    colors: [{ name: 'Rose Poudré', hex: '#F2A8B8' }, { name: 'Lavande', hex: '#C4AEDC' }],
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format'],
    brand: 'DRAPE Kids',
    tags: ['robe', 'enfant', 'broderie', 'coton'],
    isFeatured: false
  },
  {
    name: 'Ceinture Cuir Dorée',
    description: 'Ceinture en cuir lisse avec boucle rectangulaire plaquée or. L\'accent final qui élève chaque tenue.',
    price: 120,
    category: 'accessories',
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 12 }, { size: 'L', stock: 8 }],
    colors: [{ name: 'Fauve', hex: '#C19A6B' }, { name: 'Noir', hex: '#1C1C1C' }],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['ceinture', 'cuir', 'doré', 'accessoire'],
    isFeatured: false
  },
  {
    name: 'Pull Cachemire Côtelé',
    description: 'Pull en cachemire pur côtelé, col roulé. Le luxe ultime pour les jours frais.',
    price: 420,
    category: 'women',
    sizes: [{ size: 'XS', stock: 4 }, { size: 'S', stock: 8 }, { size: 'M', stock: 6 }, { size: 'L', stock: 3 }],
    colors: [{ name: 'Crème', hex: '#FAF9F6' }, { name: 'Camel', hex: '#C19A6B' }, { name: 'Noir', hex: '#1C1C1C' }],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format'],
    brand: 'DRAPE',
    tags: ['pull', 'cachemire', 'hiver', 'luxe'],
    isFeatured: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin DRAPE',
      email: 'admin@drape.tn',
      password: 'Admin123!',
      phone: '21650000000',
      role: 'admin'
    });

    const client1 = await User.create({
      name: 'Sarra Ben Ali',
      email: 'sarra@example.com',
      password: 'Client123!',
      phone: '21650000001',
      role: 'client',
      address: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });

    const client2 = await User.create({
      name: 'Youssef Trabelsi',
      email: 'youssef@example.com',
      password: 'Client123!',
      phone: '21650000002',
      role: 'client',
      address: { street: 'Avenue Habib Bourguiba', city: 'Sousse', postalCode: '4000', country: 'Tunisia' }
    });

    console.log('👥 Users created');

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`👗 ${createdProducts.length} products created`);

    // Create sample orders
    const order1 = await Order.create({
      user: client1._id,
      items: [
        { product: createdProducts[0]._id, size: 'M', color: 'Charbon', quantity: 1, price: createdProducts[0].price },
        { product: createdProducts[5]._id, size: 'Unique', color: 'Or Champagne', quantity: 1, price: createdProducts[5].price }
      ],
      totalAmount: createdProducts[0].price + createdProducts[5].price,
      status: 'pending',
      shippingAddress: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });

    const order2 = await Order.create({
      user: client1._id,
      items: [
        { product: createdProducts[1]._id, size: 'S', color: 'Ivoire', quantity: 2, price: createdProducts[1].price }
      ],
      totalAmount: createdProducts[1].price * 2,
      status: 'confirmed',
      confirmedAt: new Date(),
      shippingAddress: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });

    const order3 = await Order.create({
      user: client2._id,
      items: [
        { product: createdProducts[2]._id, size: 'M', color: 'Camel', quantity: 1, price: createdProducts[2].price }
      ],
      totalAmount: createdProducts[2].price,
      status: 'delivered',
      shippingAddress: { street: 'Avenue Habib Bourguiba', city: 'Sousse', postalCode: '4000', country: 'Tunisia' }
    });

    console.log('📦 Orders created');

    // Create notifications
    await Notification.insertMany([
      { user: client1._id, message: 'Bienvenue chez DRAPE ! Découvrez notre nouvelle collection.', type: 'promo' },
      { user: client1._id, message: `Votre commande #${order1._id.toString().slice(-6).toUpperCase()} a été reçue.`, type: 'order_update' },
      { user: client1._id, message: `Votre commande #${order2._id.toString().slice(-6).toUpperCase()} est maintenant confirmée.`, type: 'order_update', isRead: true },
      { user: client2._id, message: 'Bienvenue chez DRAPE ! 10% de réduction sur votre première commande.', type: 'promo' },
      { user: client2._id, message: `Votre commande #${order3._id.toString().slice(-6).toUpperCase()} a été livrée.`, type: 'order_update', isRead: true }
    ]);

    console.log('🔔 Notifications created');

    console.log('\n✨ Seed complete!\n');
    console.log('Admin credentials:');
    console.log('  Email:    admin@drape.tn');
    console.log('  Password: Admin123!\n');
    console.log('Client credentials:');
    console.log('  Email:    sarra@example.com / Password: Client123!');
    console.log('  Email:    youssef@example.com / Password: Client123!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();

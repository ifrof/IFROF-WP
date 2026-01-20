import * as db from "./server/db";

async function seedData() {
  console.log("Seeding database with sample data...");

  // 1. Create Factories
  const factories = [
    {
      name: "Shenzhen Tech Manufacturing",
      description: "Leading electronics manufacturer in Shenzhen specializing in consumer gadgets.",
      location: "Shenzhen, Guangdong",
      contactEmail: "contact@sztech.com",
      verificationStatus: "verified",
      rating: 5,
      productCategories: "Electronics, Gadgets",
    },
    {
      name: "Ningbo Textile Co.",
      description: "High-quality textile and apparel manufacturer with 20 years of experience.",
      location: "Ningbo, Zhejiang",
      contactEmail: "sales@ningbotextile.com",
      verificationStatus: "verified",
      rating: 4,
      productCategories: "Apparel, Textiles",
    },
    {
      name: "Guangzhou Furniture Hub",
      description: "Modern furniture manufacturer providing ergonomic office and home solutions.",
      location: "Guangzhou, Guangdong",
      contactEmail: "info@gzfurniture.com",
      verificationStatus: "verified",
      rating: 4,
      productCategories: "Furniture, Home Decor",
    },
    {
      name: "Dongguan Precision Tools",
      description: "Specialized in industrial tools and precision machinery components.",
      location: "Dongguan, Guangdong",
      contactEmail: "tools@dgprecision.com",
      verificationStatus: "verified",
      rating: 5,
      productCategories: "Industrial, Tools",
    }
  ];

  const createdFactories = [];
  for (const f of factories) {
    const factory = await db.createFactory(f);
    createdFactories.push(factory);
    console.log(`Created factory: ${factory.name}`);
  }

  // 2. Create Products
  const productTemplates = [
    { name: "Wireless Earbuds Pro", category: "Electronics", price: 2500, desc: "High-fidelity wireless earbuds with noise cancellation." },
    { name: "Smart Watch Series X", category: "Electronics", price: 4500, desc: "Advanced fitness tracker and smartwatch." },
    { name: "Cotton T-Shirt Premium", category: "Apparel", price: 800, desc: "100% organic cotton premium t-shirt." },
    { name: "Denim Jacket Classic", category: "Apparel", price: 3500, desc: "Classic blue denim jacket with reinforced stitching." },
    { name: "Ergonomic Office Chair", category: "Furniture", price: 12000, desc: "Fully adjustable ergonomic chair for long working hours." },
    { name: "Modern Coffee Table", category: "Furniture", price: 8500, desc: "Minimalist coffee table with oak finish." },
    { name: "Precision Screwdriver Set", category: "Tools", price: 1500, desc: "24-piece precision screwdriver set for electronics." },
    { name: "Industrial Drill Machine", category: "Industrial", price: 25000, desc: "Heavy-duty industrial drill for professional use." },
    { name: "Portable Power Bank", category: "Electronics", price: 3000, desc: "20000mAh fast-charging portable power bank." },
    { name: "Yoga Mat Eco-Friendly", category: "Apparel", price: 1200, desc: "Non-slip eco-friendly yoga mat." },
    { name: "LED Desk Lamp", category: "Electronics", price: 2200, desc: "Dimmable LED desk lamp with eye protection." },
    { name: "Bluetooth Speaker Mini", category: "Electronics", price: 1800, desc: "Compact waterproof bluetooth speaker." },
    { name: "Running Shoes Sport", category: "Apparel", price: 5500, desc: "Lightweight breathable running shoes." },
    { name: "Leather Wallet Slim", category: "Apparel", price: 2000, desc: "Genuine leather slim bi-fold wallet." },
    { name: "Standing Desk Electric", category: "Furniture", price: 35000, desc: "Electric height-adjustable standing desk." },
    { name: "Bookshelf 5-Tier", category: "Furniture", price: 9500, desc: "Sturdy 5-tier bookshelf for home office." },
    { name: "Digital Multimeter", category: "Tools", price: 4000, desc: "Professional digital multimeter with auto-ranging." },
    { name: "Solar Garden Lights", category: "Industrial", price: 3500, desc: "Set of 4 solar-powered waterproof garden lights." },
    { name: "Mechanical Keyboard", category: "Electronics", price: 7500, desc: "RGB backlit mechanical keyboard with blue switches." },
    { name: "Gaming Mouse RGB", category: "Electronics", price: 3500, desc: "High-precision gaming mouse with programmable buttons." },
    { name: "Winter Parka Jacket", category: "Apparel", price: 9500, desc: "Heavy-duty winter parka with faux fur hood." },
    { name: "Ceramic Vase Set", category: "Furniture", price: 4500, desc: "Handcrafted ceramic vase set for home decor." }
  ];

  for (let i = 0; i < productTemplates.length; i++) {
    const template = productTemplates[i];
    const factoryId = createdFactories[i % createdFactories.length].id;
    
    await db.createProduct({
      factoryId,
      name: template.name,
      description: template.desc,
      category: template.category,
      basePrice: template.price,
      minimumOrderQuantity: 10,
      imageUrls: JSON.stringify([`https://picsum.photos/seed/${i}/400/400`]),
      featured: i % 5 === 0 ? 1 : 0,
      active: 1,
      specifications: JSON.stringify({
        Material: "High-quality components",
        Warranty: "1 Year",
        Origin: "China"
      })
    });
    console.log(`Created product: ${template.name}`);
  }

  console.log("Seeding completed successfully!");
}

seedData().catch(console.error);

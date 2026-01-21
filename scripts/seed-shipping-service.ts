import * as db from '../server/db';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function seedShippingService() {
  try {
    console.log('🌱 Starting to seed International Shipping Service...');
    
    // 1. Find or create a generic factory for logistics services
    let logisticsFactory = await db.getFactoryById(999); // Using a high ID for system services
    
    if (!logisticsFactory) {
      console.log('Creating Logistics Service Provider...');
      logisticsFactory = await db.createFactory({
        id: 999,
        name: 'IFROF Logistics Solutions',
        description: 'Official logistics and international shipping partner for IFROF platform.',
        location: 'Guangzhou, China',
        contactEmail: 'logistics@ifrof.com',
        verificationStatus: 'verified',
        rating: 5,
        productCategories: 'Logistics, Shipping, Warehousing'
      });
    }

    // 2. Add the International Shipping Service
    const shippingService = {
      factoryId: 999,
      name: 'International Shipping from China (Air & Sea)',
      description: 'Comprehensive shipping solutions from any factory in China to your destination. Includes door-to-door delivery, customs clearance, and real-time tracking.',
      category: 'Logistics',
      basePrice: 5000, // $50.00 starting price
      imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=800']),
      active: 1
    };

    const dbInstance = await db.getDb();
    if (dbInstance) {
      // MySQL Mode
      const existingServices = await dbInstance.select().from(schema.services).where(eq(schema.services.name, shippingService.name));
      if (existingServices.length === 0) {
        await dbInstance.insert(schema.services).values(shippingService);
        console.log('✅ International Shipping Service added successfully to MySQL!');
      } else {
        console.log('ℹ️ International Shipping Service already exists in MySQL.');
      }
    } else {
      // JSON Mode fallback
      const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");
      const dbData = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
      
      if (!dbData.services.find((s: any) => s.name === shippingService.name)) {
        dbData.services.push({ id: 1, ...shippingService, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(dbData, null, 2));
        console.log('✅ International Shipping Service added successfully to JSON DB!');
      } else {
        console.log('ℹ️ International Shipping Service already exists in JSON DB.');
      }
    }

    console.log('✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding shipping service:', error);
  }
}

seedShippingService().then(() => process.exit(0));

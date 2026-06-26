import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding aggregated trade data into PostgreSQL...');

  const dataDir = path.resolve(__dirname, '../data/aggregated');
  
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Data directory not found: ${dataDir}. Did you run aggregate_trade_data.py?`);
    process.exit(1);
  }

  // 1. Get Admin User ID to associate opportunities with
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@globex.ai' }
  });

  if (!admin) {
    console.error('❌ Admin user not found. Please run regular seed first (npm run db:seed).');
    process.exit(1);
  }

  // 2. Load and insert Buyers
  const buyersPath = path.join(dataDir, 'buyers.json');
  if (fs.existsSync(buyersPath)) {
    console.log('Loading buyers...');
    const buyersData = JSON.parse(fs.readFileSync(buyersPath, 'utf8'));
    
    const CHUNK_SIZE = 5000;
    for (let i = 0; i < buyersData.length; i += CHUNK_SIZE) {
      const chunk = buyersData.slice(i, i + CHUNK_SIZE);
      const inserted = await prisma.buyer.createMany({
        data: chunk.map((b: any) => {
          let cc = 'XX';
          if (b.tags && b.tags.length > 2) {
            cc = b.tags[2].substring(0, 2).toUpperCase();
          }
          return {
            companyName: b.companyName,
            country: b.country,
            countryCode: cc,
            industry: b.industry,
            website: b.website,
            email: b.email,
            leadScore: b.leadScore,
            importVolume: b.importVolume,
            tags: b.tags || [],
            isVerified: true
          };
        }),
        skipDuplicates: true
      });
      console.log(`Inserted ${inserted.count} buyers (Chunk ${Math.floor(i/CHUNK_SIZE) + 1})`);
    }
  }

  // 3. Load and insert Opportunities
  const oppsPath = path.join(dataDir, 'opportunities.json');
  if (fs.existsSync(oppsPath)) {
    console.log('Loading opportunities...');
    const oppsData = JSON.parse(fs.readFileSync(oppsPath, 'utf8'));
    
    const CHUNK_SIZE = 5000;
    for (let i = 0; i < oppsData.length; i += CHUNK_SIZE) {
      const chunk = oppsData.slice(i, i + CHUNK_SIZE);
      const inserted = await prisma.opportunity.createMany({
        data: chunk.map((o: any) => ({
          userId: admin.id,
          country: o.country,
          countryCode: o.country.substring(0, 2).toUpperCase(),
          demandScore: o.demandScore,
          growthRate: o.growthRate,
          competition: o.competition,
          marketSize: o.marketSize,
          trend: o.trend,
          insights: o.insights,
          source: 'Dataset:' + o.productName, // store product name in source for filtering
        })),
        skipDuplicates: true
      });
      console.log(`Inserted ${inserted.count} opportunities (Chunk ${Math.floor(i/CHUNK_SIZE) + 1})`);
    }
  }

  console.log('✅ Aggregated data successfully seeded into PostgreSQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

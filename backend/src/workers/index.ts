import { Worker } from 'bullmq';
import IORedis from 'ioredis';

// Import actual agent processor logic
import { marketResearchProcessor } from '../agents/market-research';
import { buyerDiscoveryProcessor } from '../agents/buyer-discovery';
import { leadQualificationProcessor } from '../agents/lead-qualification';
import { complianceProcessor } from '../agents/compliance';
import { outreachProcessor } from '../agents/outreach';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

console.log('[Workers] Initializing Background Workers...');

export const workers = {
  marketResearch: new Worker('MarketResearch', marketResearchProcessor, { connection: redisConnection as any }),
  buyerDiscovery: new Worker('BuyerDiscovery', buyerDiscoveryProcessor, { connection: redisConnection as any }),
  leadQualification: new Worker('LeadQualification', leadQualificationProcessor, { connection: redisConnection as any }),
  compliance: new Worker('Compliance', complianceProcessor, { connection: redisConnection as any }),
  outreach: new Worker('Outreach', outreachProcessor, { connection: redisConnection as any }),
};

// Error handling
Object.values(workers).forEach(worker => {
  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
  });
  
  worker.on('error', (err) => {
    console.error(`[Worker] Connection error: ${err.message}`);
  });
});

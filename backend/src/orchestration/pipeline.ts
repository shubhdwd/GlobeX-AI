import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PipelineState } from '../shared/types';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Queue definitions
export const Queues = {
  MarketResearch: new Queue('MarketResearch', { connection: redisConnection as any }),
  BuyerDiscovery: new Queue('BuyerDiscovery', { connection: redisConnection as any }),
  LeadQualification: new Queue('LeadQualification', { connection: redisConnection as any }),
  Compliance: new Queue('Compliance', { connection: redisConnection as any }),
  Outreach: new Queue('Outreach', { connection: redisConnection as any }),
};

export class PipelineOrchestrator {
  
  /**
   * Transitions a lead or target to the next state, and enqueues the appropriate job.
   */
  static async transition(
    targetType: 'MARKET_SEGMENT' | 'COMPANY' | 'LEAD' | 'OUTREACH',
    targetId: string,
    currentState: PipelineState,
    nextState: PipelineState
  ) {
    console.log(`[Pipeline] Transitioning ${targetType} ${targetId} from ${currentState} to ${nextState}`);
    
    // Enqueue to the next agent based on the new state
    switch (nextState) {
      case 'DISCOVERING':
        await Queues.BuyerDiscovery.add('discover-buyers', { segmentId: targetId });
        break;
      case 'QUALIFYING':
        await Queues.LeadQualification.add('qualify-lead', { targetId });
        break;
      case 'COMPLIANCE_REVIEW':
      case 'COMPLIANCE_PRE_SEND':
        await Queues.Compliance.add('compliance-check', { targetType, targetId, nextStateIfPass: nextState });
        break;
      case 'OUTREACH_DRAFTED':
        await Queues.Outreach.add('draft-outreach', { qualifiedLeadId: targetId });
        break;
      case 'SENDING':
        // Actually execute the outreach sending here or enqueue to an email sending worker
        console.log(`[Pipeline] Ready to send outreach for target ${targetId}`);
        break;
      case 'FAILED':
      case 'NEEDS_REVIEW':
        console.log(`[Pipeline] Target ${targetId} halted in state ${nextState}`);
        break;
      default:
        console.log(`[Pipeline] No specific queue mapped for state ${nextState}`);
    }
  }
}

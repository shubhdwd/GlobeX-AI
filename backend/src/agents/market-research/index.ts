import { Job } from 'bullmq';
import { MarketResearchJob, MarketSegmentData } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';

export const marketResearchProcessor = async (job: Job<MarketResearchJob>) => {
  const { segmentId, icpDefinition } = job.data;
  console.log(`[MarketResearchAgent] Processing segment ${segmentId}`);

  try {
    // 1. Fetch Segment
    const segmentRef = Collections.MarketSegments.doc(segmentId);
    const segmentDoc = await segmentRef.get();
    
    if (!segmentDoc.exists) {
      throw new Error(`Segment ${segmentId} not found`);
    }

    // 2. Mocking LLM-driven research using the ICP
    console.log(`[MarketResearchAgent] Enriching ICP data...`);
    const insights = {
      marketSize: "10B",
      trends: ["AI Adoption", "Automation"],
      competitors: ["Legacy Corp", "Manual Systems LLC"]
    };
    const confidenceScore = 0.85;

    // 3. Update the database
    await segmentRef.update({
      insights,
      confidenceScore,
      updatedAt: new Date().toISOString()
    });

    // 4. Transition to Buyer Discovery
    await PipelineOrchestrator.transition('MARKET_SEGMENT', segmentId, 'RESEARCHING', 'DISCOVERING');
    
    return { success: true, segmentId };
  } catch (error: any) {
    console.error(`[MarketResearchAgent] Failed: ${error.message}`);
    // Halting pipeline transition here, leaving it in RESEARCHING or moving to FAILED
    await PipelineOrchestrator.transition('MARKET_SEGMENT', segmentId, 'RESEARCHING', 'FAILED');
    throw error;
  }
};

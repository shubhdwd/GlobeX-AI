import { Request, Response } from 'express';
import { Queues } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';

export const startPipeline = async (req: Request, res: Response) => {
  try {
    const { icpDefinition, segmentName } = req.body;

    if (!icpDefinition) {
      return res.status(400).json({ error: 'icpDefinition is required' });
    }

    // 1. Create a new Market Segment in Firebase
    const segmentRef = Collections.MarketSegments.doc();
    await segmentRef.set({
      name: segmentName || 'Unnamed Segment',
      icpDefinition,
      insights: null,
      confidenceScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Enqueue the Market Research Job
    await Queues.MarketResearch.add('research-market', {
      segmentId: segmentRef.id,
      icpDefinition,
    });

    return res.status(202).json({
      message: 'Pipeline started successfully',
      segmentId: segmentRef.id,
    });
  } catch (error: any) {
    console.error(`[PipelineController] Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { Request, Response } from 'express';
import { Queues } from '../../orchestration/pipeline';
import { prisma } from '../../config/database';

export const startPipeline = async (req: Request, res: Response) => {
  try {
    const { icpDefinition, segmentName } = req.body;

    if (!icpDefinition) {
      return res.status(400).json({ error: 'icpDefinition is required' });
    }

    // 1. Create a new Market Segment in Prisma
    const segment = await prisma.marketSegment.create({
      data: {
        name: segmentName || 'Unnamed Segment',
        icpDefinition,
        insights: {},
        confidenceScore: 0,
      }
    });

    // 2. Enqueue the Market Research Job
    await Queues.MarketResearch.add('research-market', {
      segmentId: segment.id,
      icpDefinition,
    });

    return res.status(202).json({
      message: 'Pipeline started successfully',
      segmentId: segment.id,
    });
  } catch (error: any) {
    console.error(`[PipelineController] Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { Job } from 'bullmq';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { prisma } from '../../config/database';
import { LeadQualificationJob } from '../../shared/types';

export const leadQualificationProcessor = async (job: Job<LeadQualificationJob>) => {
  const targetId = (job.data as any).targetId;
  console.log(`[LeadQualificationAgent] Qualifying lead ${targetId}`);

  try {
    const lead = await prisma.qualifiedLead.findUnique({
      where: { id: targetId },
      include: { contact: true }
    });

    if (!lead) throw new Error(`Lead ${targetId} not found`);

    // 1. Rule-based + LLM Scoring Logic
    console.log(`[LeadQualificationAgent] Applying scoring rubric...`);
    
    // Mock logic
    const score = 85;
    const isPassing = score > 75;
    
    const rubricReasoning = {
      titleMatch: lead.contact?.title?.includes('CEO') ? 'High fit for persona' : 'Low fit',
      companySizeMatch: 'Fits ICP constraints',
      intentSignals: 'No current intent signals',
    };

    // 2. Update Lead
    await prisma.qualifiedLead.update({
      where: { id: targetId },
      data: {
        score,
        rubricReasoning,
        status: isPassing ? 'PASS' : 'FAIL',
        pipelineState: isPassing ? 'COMPLIANCE_REVIEW' : 'FAILED',
      }
    });

    // 3. Transition if passing
    if (isPassing) {
      await PipelineOrchestrator.transition(
        'LEAD', 
        targetId, 
        'QUALIFYING', 
        'COMPLIANCE_REVIEW'
      );
    } else {
      console.log(`[LeadQualificationAgent] Lead ${targetId} failed qualification. Retained in DB.`);
    }

    return { success: true, score, status: isPassing ? 'PASS' : 'FAIL' };
  } catch (error: any) {
    console.error(`[LeadQualificationAgent] Failed: ${error.message}`);
    throw error;
  }
};

import { Job } from 'bullmq';
import { OutreachJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { prisma } from '../../config/database';

export const outreachProcessor = async (job: Job<OutreachJob>) => {
  const { qualifiedLeadId } = job.data;
  console.log(`[OutreachAgent] Drafting outreach for lead ${qualifiedLeadId}`);

  try {
    const lead = await prisma.qualifiedLead.findUnique({
      where: { id: qualifiedLeadId },
      include: { contact: true, company: true }
    });
    if (!lead) throw new Error(`Lead ${qualifiedLeadId} not found`);

    // 1. Mocking LLM Drafting Logic
    const subject = `Opportunities for ${lead.company?.name}`;
    const body = `Hi ${lead.contact?.firstName},\n\nWe noticed ${lead.company?.name} is growing... [Personalized based on: ${JSON.stringify(lead.rubricReasoning)}]\n\nReply to unsubscribe.`;
    
    // 2. Default to Human-in-the-Loop (autoSend = false)
    const message = await prisma.outreachMessage.create({
      data: {
        qualifiedLeadId: lead.id,
        channel: 'EMAIL',
        subject,
        body,
        status: 'DRAFTED',
        autoSend: false, // Explicit requirement: Default is draft-only
      }
    });

    // 3. Update Lead State
    await prisma.qualifiedLead.update({
      where: { id: qualifiedLeadId },
      data: {
        pipelineState: 'OUTREACH_DRAFTED',
      }
    });

    // 4. Transition to Compliance Pre-Send Gate
    await PipelineOrchestrator.transition('OUTREACH', message.id, 'OUTREACH_DRAFTED', 'COMPLIANCE_PRE_SEND');

    return { success: true, messageId: message.id };
  } catch (error: any) {
    console.error(`[OutreachAgent] Failed: ${error.message}`);
    throw error;
  }
};

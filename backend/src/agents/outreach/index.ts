import { Job } from 'bullmq';
import { OutreachJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';

export const outreachProcessor = async (job: Job<OutreachJob>) => {
  const { qualifiedLeadId } = job.data;
  console.log(`[OutreachAgent] Drafting outreach for lead ${qualifiedLeadId}`);

  try {
    const leadDoc = await Collections.QualifiedLeads.doc(qualifiedLeadId).get();
    if (!leadDoc.exists) throw new Error(`Lead ${qualifiedLeadId} not found`);
    const leadData = leadDoc.data()!;

    const contactDoc = await Collections.Contacts.doc(leadData.contactId).get();
    const companyDoc = await Collections.Companies.doc(leadData.companyId).get();

    // 1. Mocking LLM Drafting Logic
    const subject = `Opportunities for ${companyDoc.data()?.name}`;
    const body = `Hi ${contactDoc.data()?.firstName},\n\nWe noticed ${companyDoc.data()?.name} is growing... [Personalized based on: ${JSON.stringify(leadData.rubricReasoning)}]\n\nReply to unsubscribe.`;
    
    // 2. Default to Human-in-the-Loop (autoSend = false)
    const messageRef = Collections.OutreachMessages.doc();
    await messageRef.set({
      qualifiedLeadId: leadDoc.id,
      channel: 'EMAIL',
      subject,
      body,
      status: 'DRAFTED',
      autoSend: false, // Explicit requirement: Default is draft-only
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 3. Update Lead State
    await leadDoc.ref.update({
      pipelineState: 'OUTREACH_DRAFTED',
      updatedAt: new Date().toISOString()
    });

    // 4. Transition to Compliance Pre-Send Gate
    await PipelineOrchestrator.transition('OUTREACH', messageRef.id, 'OUTREACH_DRAFTED', 'COMPLIANCE_PRE_SEND');

    return { success: true, messageId: messageRef.id };
  } catch (error: any) {
    console.error(`[OutreachAgent] Failed: ${error.message}`);
    throw error;
  }
};

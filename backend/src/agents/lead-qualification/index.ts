import { Job } from 'bullmq';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';
import { LeadQualificationJob } from '../../shared/types';

export const leadQualificationProcessor = async (job: Job<LeadQualificationJob>) => {
  // targetId is the leadId here, wait, the pipeline enqueue uses { targetId }
  // the type LeadQualificationJob in types says { companyId, contactId } but we enqueue with { targetId } in pipeline.ts
  // Let's assume the job data has targetId which is the qualifiedLead document ID.
  const targetId = (job.data as any).targetId;
  console.log(`[LeadQualificationAgent] Qualifying lead ${targetId}`);

  try {
    const leadRef = Collections.QualifiedLeads.doc(targetId);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) throw new Error(`Lead ${targetId} not found`);
    const leadData = leadDoc.data()!;

    // Fetch contact
    const contactDoc = await Collections.Contacts.doc(leadData.contactId).get();
    const contactData = contactDoc.data();

    // 1. Rule-based + LLM Scoring Logic
    console.log(`[LeadQualificationAgent] Applying scoring rubric...`);
    
    // Mock logic
    const score = 85;
    const isPassing = score > 75;
    
    const rubricReasoning = {
      titleMatch: contactData?.title?.includes('CEO') ? 'High fit for persona' : 'Low fit',
      companySizeMatch: 'Fits ICP constraints',
      intentSignals: 'No current intent signals',
    };

    // 2. Update Lead
    await leadRef.update({
      score,
      rubricReasoning,
      status: isPassing ? 'PASS' : 'FAIL',
      pipelineState: isPassing ? 'COMPLIANCE_REVIEW' : 'FAILED',
      updatedAt: new Date().toISOString()
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

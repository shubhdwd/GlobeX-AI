import { Job } from 'bullmq';
import { BuyerDiscoveryJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';

export const buyerDiscoveryProcessor = async (job: Job<BuyerDiscoveryJob>) => {
  const { segmentId } = job.data;
  console.log(`[BuyerDiscoveryAgent] Discovering buyers for segment ${segmentId}`);

  try {
    const segmentDoc = await Collections.MarketSegments.doc(segmentId).get();
    if (!segmentDoc.exists) throw new Error(`Segment ${segmentId} not found`);

    // 1. Mocking Company discovery (Firestore doesn't have upsert exactly like Prisma, we do set with merge)
    // Here we'd query by domain usually. For mock simplicity, we just use a fixed ID or create one.
    const companyRef = Collections.Companies.doc('example-corp-id');
    await companyRef.set({
      name: 'Example Corp',
      domain: 'example.com',
      marketSegmentId: segmentId,
      industry: 'Software',
      confidenceScore: 0.9,
      provenance: 'Apollo API',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 2. Mocking Contact discovery for this Company
    const contactRef = Collections.Contacts.doc('ceo-example-com-id');
    await contactRef.set({
      companyId: companyRef.id,
      firstName: 'John',
      lastName: 'Doe',
      title: 'CEO',
      email: 'ceo@example.com',
      confidenceScore: 0.95,
      provenance: 'Apollo API',
      consentStatus: 'UNKNOWN',
      dataSource: 'Apollo API',
      legalBasis: 'LEGITIMATE_INTEREST',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 3. Create un-scored QualifiedLead entry to track pipeline state
    const leadRef = Collections.QualifiedLeads.doc();
    await leadRef.set({
      companyId: companyRef.id,
      contactId: contactRef.id,
      pipelineState: 'DISCOVERING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 4. Transition Lead to QUALIFYING state
    await PipelineOrchestrator.transition('LEAD', leadRef.id, 'DISCOVERING', 'QUALIFYING');

    return { success: true, companyId: companyRef.id, contactId: contactRef.id };
  } catch (error: any) {
    console.error(`[BuyerDiscoveryAgent] Failed: ${error.message}`);
    throw error;
  }
};

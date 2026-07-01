import { Job } from 'bullmq';
import { BuyerDiscoveryJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { prisma } from '../../config/database';

export const buyerDiscoveryProcessor = async (job: Job<BuyerDiscoveryJob>) => {
  const { segmentId } = job.data;
  console.log(`[BuyerDiscoveryAgent] Discovering buyers for segment ${segmentId}`);

  try {
    const segment = await prisma.marketSegment.findUnique({
      where: { id: segmentId }
    });
    if (!segment) throw new Error(`Segment ${segmentId} not found`);

    // 1. Mocking Company discovery using upsert on domain
    const company = await prisma.company.upsert({
      where: { domain: 'example.com' },
      update: {
        name: 'Example Corp',
        marketSegmentId: segmentId,
        industry: 'Software',
        confidenceScore: 0.9,
        provenance: 'Apollo API',
      },
      create: {
        name: 'Example Corp',
        domain: 'example.com',
        marketSegmentId: segmentId,
        industry: 'Software',
        confidenceScore: 0.9,
        provenance: 'Apollo API',
      }
    });

    // 2. Mocking Contact discovery for this Company using upsert on email
    const contact = await prisma.contact.upsert({
      where: { email: 'ceo@example.com' },
      update: {
        companyId: company.id,
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        confidenceScore: 0.95,
        provenance: 'Apollo API',
        consentStatus: 'UNKNOWN',
        dataSource: 'Apollo API',
        legalBasis: 'LEGITIMATE_INTEREST',
      },
      create: {
        companyId: company.id,
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        email: 'ceo@example.com',
        confidenceScore: 0.95,
        provenance: 'Apollo API',
        consentStatus: 'UNKNOWN',
        dataSource: 'Apollo API',
        legalBasis: 'LEGITIMATE_INTEREST',
      }
    });

    // 3. Create un-scored QualifiedLead entry to track pipeline state
    // To make this idempotent, we can check if a QualifiedLead already exists for this contact and company
    let lead = await prisma.qualifiedLead.findFirst({
      where: {
        companyId: company.id,
        contactId: contact.id,
      }
    });

    if (!lead) {
      lead = await prisma.qualifiedLead.create({
        data: {
          companyId: company.id,
          contactId: contact.id,
          pipelineState: 'DISCOVERING',
        }
      });
    } else {
      lead = await prisma.qualifiedLead.update({
        where: { id: lead.id },
        data: {
          pipelineState: 'DISCOVERING',
        }
      });
    }

    // 4. Transition Lead to QUALIFYING state
    await PipelineOrchestrator.transition('LEAD', lead.id, 'DISCOVERING', 'QUALIFYING');

    return { success: true, companyId: company.id, contactId: contact.id };
  } catch (error: any) {
    console.error(`[BuyerDiscoveryAgent] Failed: ${error.message}`);
    throw error;
  }
};

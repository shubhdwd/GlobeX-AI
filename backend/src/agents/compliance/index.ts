import { Job } from 'bullmq';
import { ComplianceGateJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { prisma } from '../../config/database';

export const complianceProcessor = async (job: Job<ComplianceGateJob>) => {
  const { targetType, targetId, nextStateIfPass } = job.data;
  console.log(`[ComplianceAgent] Running gate for ${targetType} ${targetId}`);

  try {
    let passed = true;
    let ruleTriggered: string | null = null;
    let reasoning = 'Passed all compliance checks.';

    if (targetType === 'LEAD') {
      const lead = await prisma.qualifiedLead.findUnique({
        where: { id: targetId },
        include: { contact: true }
      });
      if (!lead) throw new Error(`Lead ${targetId} not found`);
      
      const contactData = lead.contact;

      // Mock DNC / Consent check
      if (contactData.consentStatus === 'OPT_OUT') {
        passed = false;
        ruleTriggered = 'DO_NOT_CONTACT';
        reasoning = 'Contact has explicitly opted out.';
      }
    } else if (targetType === 'OUTREACH') {
      const outreach = await prisma.outreachMessage.findUnique({
        where: { id: targetId }
      });
      if (!outreach) throw new Error(`Outreach ${targetId} not found`);

      // Mock content check
      if (outreach.body.includes('GUARANTEE')) {
        passed = false;
        ruleTriggered = 'PROHIBITED_CLAIM';
        reasoning = 'Content contains prohibited guarantee language.';
      } else if (!outreach.body.includes('unsubscribe')) {
        passed = false;
        ruleTriggered = 'MISSING_DISCLOSURE';
        reasoning = 'Missing unsubscribe link.';
      }
    }

    // 1. Immutable Audit Log (ComplianceCheck)
    await prisma.complianceCheck.create({
      data: {
        targetType,
        targetId,
        status: passed ? 'PASS' : 'FAIL',
        ruleTriggered,
        reasoning,
        outreachMessageId: targetType === 'OUTREACH' ? targetId : null,
      }
    });

    // 2. Transition State
    if (passed) {
      console.log(`[ComplianceAgent] ${targetType} ${targetId} PASS. Proceeding to ${nextStateIfPass}`);
      
      if (targetType === 'LEAD') {
        await prisma.qualifiedLead.update({
          where: { id: targetId },
          data: {
            pipelineState: nextStateIfPass,
          }
        });
      } else if (targetType === 'OUTREACH') {
        await prisma.outreachMessage.update({
          where: { id: targetId },
          data: {
            status: nextStateIfPass,
          }
        });
      }

      await PipelineOrchestrator.transition(targetType, targetId, 'COMPLIANCE_REVIEW', nextStateIfPass);
    } else {
      console.log(`[ComplianceAgent] ${targetType} ${targetId} FAIL. Rule: ${ruleTriggered}`);
      if (targetType === 'LEAD') {
        await prisma.qualifiedLead.update({
          where: { id: targetId },
          data: {
            pipelineState: 'NEEDS_REVIEW',
            status: 'NEEDS_REVIEW',
          }
        });
      } else if (targetType === 'OUTREACH') {
        await prisma.outreachMessage.update({
          where: { id: targetId },
          data: {
            status: 'FAILED',
          }
        });
      }
    }

    return { success: true, passed, ruleTriggered };
  } catch (error: any) {
    console.error(`[ComplianceAgent] Failed: ${error.message}`);
    throw error;
  }
};

import { Job } from 'bullmq';
import { ComplianceGateJob } from '../../shared/types';
import { PipelineOrchestrator } from '../../orchestration/pipeline';
import { Collections } from '../../shared/db/firebase';

export const complianceProcessor = async (job: Job<ComplianceGateJob>) => {
  const { targetType, targetId, nextStateIfPass } = job.data;
  console.log(`[ComplianceAgent] Running gate for ${targetType} ${targetId}`);

  try {
    let passed = true;
    let ruleTriggered: string | null = null;
    let reasoning = 'Passed all compliance checks.';

    if (targetType === 'LEAD') {
      const leadDoc = await Collections.QualifiedLeads.doc(targetId).get();
      if (!leadDoc.exists) throw new Error(`Lead ${targetId} not found`);
      
      const contactDoc = await Collections.Contacts.doc(leadDoc.data()!.contactId).get();
      const contactData = contactDoc.data()!;

      // Mock DNC / Consent check
      if (contactData.consentStatus === 'OPT_OUT') {
        passed = false;
        ruleTriggered = 'DO_NOT_CONTACT';
        reasoning = 'Contact has explicitly opted out.';
      }
    } else if (targetType === 'OUTREACH') {
      const outreachDoc = await Collections.OutreachMessages.doc(targetId).get();
      if (!outreachDoc.exists) throw new Error(`Outreach ${targetId} not found`);
      const outreachData = outreachDoc.data()!;

      // Mock content check
      if (outreachData.body.includes('GUARANTEE')) {
        passed = false;
        ruleTriggered = 'PROHIBITED_CLAIM';
        reasoning = 'Content contains prohibited guarantee language.';
      } else if (!outreachData.body.includes('unsubscribe')) {
        passed = false;
        ruleTriggered = 'MISSING_DISCLOSURE';
        reasoning = 'Missing unsubscribe link.';
      }
    }

    // 1. Immutable Audit Log (ComplianceCheck)
    await Collections.ComplianceChecks.add({
      targetType,
      targetId,
      status: passed ? 'PASS' : 'FAIL',
      ruleTriggered,
      reasoning,
      outreachMessageId: targetType === 'OUTREACH' ? targetId : null,
      createdAt: new Date().toISOString()
    });

    // 2. Transition State
    if (passed) {
      console.log(`[ComplianceAgent] ${targetType} ${targetId} PASS. Proceeding to ${nextStateIfPass}`);
      
      if (targetType === 'LEAD') {
        await Collections.QualifiedLeads.doc(targetId).update({
          pipelineState: nextStateIfPass,
          updatedAt: new Date().toISOString()
        });
      } else if (targetType === 'OUTREACH') {
        await Collections.OutreachMessages.doc(targetId).update({
          status: nextStateIfPass,
          updatedAt: new Date().toISOString()
        });
      }

      await PipelineOrchestrator.transition(targetType, targetId, 'COMPLIANCE_REVIEW', nextStateIfPass);
    } else {
      console.log(`[ComplianceAgent] ${targetType} ${targetId} FAIL. Rule: ${ruleTriggered}`);
      if (targetType === 'LEAD') {
        await Collections.QualifiedLeads.doc(targetId).update({
          pipelineState: 'NEEDS_REVIEW',
          status: 'NEEDS_REVIEW',
          updatedAt: new Date().toISOString()
        });
      } else if (targetType === 'OUTREACH') {
        await Collections.OutreachMessages.doc(targetId).update({
          status: 'FAILED',
          updatedAt: new Date().toISOString()
        });
      }
    }

    return { success: true, passed, ruleTriggered };
  } catch (error: any) {
    console.error(`[ComplianceAgent] Failed: ${error.message}`);
    throw error;
  }
};

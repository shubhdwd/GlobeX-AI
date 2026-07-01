export type PipelineState = 
  | 'RESEARCHING'
  | 'DISCOVERING'
  | 'QUALIFYING'
  | 'COMPLIANCE_REVIEW'
  | 'OUTREACH_DRAFTED'
  | 'COMPLIANCE_PRE_SEND'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'NEEDS_REVIEW';

export interface ICPDefinition {
  industry: string;
  companySize?: string;
  geography?: string;
  technographicSignals?: string[];
  additionalKeywords?: string[];
}

export interface MarketSegmentData {
  id?: string;
  name: string;
  criteria: ICPDefinition;
  insights: Record<string, any>;
  confidenceScore: number;
}

export interface CompanyData {
  id?: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  confidenceScore: number;
  provenance: string;
}

export interface ContactData {
  id?: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  linkedin?: string;
  confidenceScore: number;
  provenance: string;
  consentStatus: 'UNKNOWN' | 'OPT_IN' | 'OPT_OUT';
  dataSource?: string;
  legalBasis?: string;
}

export interface QualifiedLeadData {
  id?: string;
  companyId: string;
  contactId: string;
  score: number;
  rubricReasoning: Record<string, any>;
  status: 'PASS' | 'FAIL' | 'NEEDS_REVIEW';
  pipelineState: PipelineState;
}

export interface OutreachMessageData {
  id?: string;
  qualifiedLeadId: string;
  channel: 'EMAIL' | 'LINKEDIN';
  subject?: string;
  body: string;
  status: 'DRAFTED' | 'COMPLIANCE_PRE_SEND' | 'SENDING' | 'SENT' | 'FAILED';
  autoSend: boolean;
}

export interface ComplianceCheckData {
  id?: string;
  outreachMessageId?: string;
  targetType: 'LEAD' | 'OUTREACH';
  targetId: string;
  status: 'PASS' | 'FAIL' | 'FLAGGED';
  ruleTriggered?: string;
  reasoning: string;
}

// Job Payload Types for BullMQ Queues
export interface MarketResearchJob {
  segmentId: string;
  icpDefinition: ICPDefinition;
}

export interface BuyerDiscoveryJob {
  segmentId: string;
}

export interface LeadQualificationJob {
  companyId: string;
  contactId: string;
}

export interface ComplianceGateJob {
  targetType: 'LEAD' | 'OUTREACH';
  targetId: string;
  nextStateIfPass: PipelineState;
}

export interface OutreachJob {
  qualifiedLeadId: string;
}

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
// Assumes GOOGLE_APPLICATION_CREDENTIALS environment variable is set in production
// or pass a service account explicitly if needed.
if (!getApps().length) {
  initializeApp();
}

export const db = getFirestore();

// Collection References
export const Collections = {
  MarketSegments: db.collection('market_segments'),
  Companies: db.collection('companies'),
  Contacts: db.collection('contacts'),
  QualifiedLeads: db.collection('qualified_leads'),
  OutreachMessages: db.collection('outreach_messages'),
  ComplianceChecks: db.collection('compliance_checks'),
};

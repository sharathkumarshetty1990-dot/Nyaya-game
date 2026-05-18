import { Case, TrialStep, AuthenticityStatus, AdmissibilityStatus, EvidenceType } from '../types';

const trialFlow: TrialStep[] = [
  {
    id: 'intro',
    type: 'statement',
    speaker: 'Justice G. Singh',
    text: "We are here to evaluate the admissibility of digital exhibits in the matter of State vs Unknown. Prosecution, proceed.",
    impactOnPressure: 2
  },
  {
    id: 'victim-testimony-1',
    type: 'statement',
    speaker: 'Virendra Sharma',
    text: "He told me he was the Chief Justice of India! He was on a video call... it looked so real. I transferred the money because I was terrified.",
    impactOnPressure: 5
  },
  {
    id: 'defense-objection-1',
    type: 'objection',
    speaker: 'Defense Counsel',
    text: "Objection! Video calls are easily spoofed. Without a verified digital certificate under BSA Section 63, this testimony is mere hearsay of a digital shadow.",
    options: ["PRESENT_CERTIFIED_SCREENSHOT", "ARGUE_NARRATIVE_WEIGHT", "REQUEST_FORENSIC_DELAY"],
    requiredEvidenceIds: ['wa-ss'],
    impactOnPressure: 10
  },
  {
    id: 'perjury-check',
    type: 'statement',
    speaker: 'CBI Poser (Transcript)',
    text: "I was in the Lucknow High Court chambers during the afternoon of the 14th. You can check the logs.",
    contradictionEvidenceId: 'newspaper-cji',
    impactOnJustice: 20
  },
  {
    id: 'final-judgment',
    type: 'verdict_moment',
    speaker: 'Justice G. Singh',
    text: "The court is ready to deliver its ruling on the admissibility of the prosecution's docket.",
    impactOnPressure: 15
  }
];

export const CASE_01: Case = {
  id: 'case-01',
  title: 'The Digital Arrest',
  difficulty: 'Beginner',
  description: 'A retired principal is trapped in a "digital arrest" by scammers posing as CBI. Save him and his savings.',
  lawsTaught: ['BNS 318', 'BNS 308', 'BSA 63'],
  initialNPCs: ['principal-lucknow', 'cbi-poser'],
  evidenceIds: ['wa-ss', 'cbi-logo', 'newspaper-cji'],
  availableBnsSections: ['BNS 318', 'BNS 308'],
  narrativeUrgency: "The victim's bank account has been locked. Every hour delay risks the funds being moved offshore.",
  trialFlow
};

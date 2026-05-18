import { Case, Evidence, AuthenticityStatus, AdmissibilityStatus, EvidenceType, LawCard } from "./types";
import { CASE_01 } from "./cases/case01";

export const LAW_CARDS: LawCard[] = [
  // ... existing law cards
  { 
    id: 'bns-318', 
    section: 'BNS 318', 
    title: 'Cheating by Personation', 
    description: 'Whoever cheats by pretending to be some other person.', 
    cases: ['case-01'], 
    tier: 'BNS',
    effect: "Increases conviction probability if identity spoofing is proven."
  },
  { 
    id: 'bns-308', 
    section: 'BNS 308', 
    title: 'Extortion', 
    description: 'Intentionally putting any person in fear of any injury...', 
    cases: ['case-01', 'case-02'], 
    tier: 'BNS',
    effect: "Essential for cases involving coercion and financial pressure."
  },
  { 
    id: 'bsa-63', 
    section: 'BSA 63', 
    title: 'Special Provisions for Evidence', 
    description: 'Requires dual signature certificate for digital evidence.', 
    cases: ['case-01', 'case-02', 'case-03'], 
    tier: 'BSA',
    effect: "Mandatory for making digital screenshots admissible in trial." 
  },
  { 
    id: 'bnss-173', 
    section: 'BNSS 173', 
    title: 'Zero FIR', 
    description: 'Right to file FIR at any station regardless of jurisdiction.', 
    cases: ['case-01'], 
    tier: 'BNSS',
    effect: "Allows procedural bypass if local stations refuse registration."
  },
];

export const CASES: Case[] = [CASE_01];

export const EVIDENCE_POOL: Evidence[] = [
  {
    id: 'wa-ss',
    name: 'WhatsApp Call Screenshot',
    description: 'A screenshot showing the "+44" international number from the caller.',
    type: EvidenceType.DIGITAL,
    authenticity: AuthenticityStatus.UNVERIFIED,
    admissibility: AdmissibilityStatus.PENDING,
    courtConfidence: 0,
    hasBSACertificate: false,
    authenticityRisk: 'Timestamp may be manipulated',
    bsaSection: 'BSA 63',
    linkedEvidenceIds: ['cbi-logo'],
    contradicts: ['sho-alibi'],
    supports: ['newspaper-cji']
  },
  {
    id: 'cbi-logo',
    name: 'CBI Logo on Uniform',
    description: 'Zoom frame grab showing a pixelated CBI logo on the fraudster\'s vest.',
    type: EvidenceType.DIGITAL,
    authenticity: AuthenticityStatus.UNVERIFIED,
    admissibility: AdmissibilityStatus.PENDING,
    courtConfidence: 0,
    hasBSACertificate: false,
    authenticityRisk: 'Compression artifacts detected',
    bsaSection: 'BSA 63',
    linkedEvidenceIds: ['wa-ss']
  },
  {
    id: 'newspaper-cji',
    name: 'Lucknow Times Clipping',
    description: 'Physical newspaper excerpt confirming the actual CJI was in New Delhi, not Lucknow.',
    type: EvidenceType.PHYSICAL,
    authenticity: AuthenticityStatus.VERIFIED,
    admissibility: AdmissibilityStatus.ADMITTED,
    courtConfidence: 100,
    hasBSACertificate: false,
    linkedEvidenceIds: [],
    supports: ['wa-ss']
  }
];

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
    credibility: 25,
    admissibilityStrength: 10,
    judgeImpact: 75,
    hasBSACertificate: false,
    authenticityRisk: 'Timestamp mismatch detected. Possible causes: Manual edits, timezone sync issues, or server cache discrepancy.',
    bsaSection: 'BSA 63',
    factualProperties: [
      'Caller Identity Flag: Uses VoIP-spoofed country code prefix (+44 / UK)',
      'Timestamp: Recorded at 10:00 AM IST on April 14, 2026',
      'Device Origin: Screenshot metadata matches the victim\'s phone model'
    ],
    factualThemes: ['cyber_communication_channel', 'spoofed_identity_vector', 'temporal_spatial_alignment']
  },
  {
    id: 'cbi-logo',
    name: 'CBI Logo on Uniform',
    description: 'Zoom frame grab showing a pixelated CBI logo on the fraudster\'s vest.',
    type: EvidenceType.DIGITAL,
    authenticity: AuthenticityStatus.UNVERIFIED,
    admissibility: AdmissibilityStatus.PENDING,
    credibility: 30,
    admissibilityStrength: 5,
    judgeImpact: 60,
    hasBSACertificate: false,
    authenticityRisk: 'Possible counterfeit. The badge appears digitally altered or low quality.',
    bsaSection: 'BSA 63',
    factualProperties: [
      'Logo Geometry: The badge shape has irregular borders unlike real uniforms',
      'Resolution: Logo is pixelated and lacks official embroidery patterns',
      'Origin Profile: Extracted from a downloaded video recording'
    ],
    factualThemes: ['synthetic_imagery', 'spoofed_identity_vector']
  },
  {
    id: 'newspaper-cji',
    name: 'Lucknow Times Clipping',
    description: 'Physical newspaper excerpt confirming the actual CJI was in New Delhi, not Lucknow.',
    type: EvidenceType.PHYSICAL,
    authenticity: AuthenticityStatus.VERIFIED,
    admissibility: AdmissibilityStatus.ADMITTED,
    credibility: 95,
    admissibilityStrength: 90,
    judgeImpact: 85,
    hasBSACertificate: false,
    factualProperties: [
      'Publication Date: April 14, 2026, morning edition',
      'Physical Medium: Genuine newsprint stock with original ink saturation',
      'Factual Lead Text: Chief Justice G. Singh arrives at Supreme Court Room 1 in New Delhi at 11:00 AM IST for administrative dockets'
    ],
    factualThemes: ['physical_location_verification', 'temporal_spatial_alignment']
  },
  {
    id: 'zero-fir-receipt',
    name: 'Zero FIR Complaint Receipt',
    description: 'An official police stamp receipt registered under BNSS 173 showing the Hazratganj station registered the complaint despite regional jurisdiction limits.',
    type: EvidenceType.PHYSICAL,
    authenticity: AuthenticityStatus.VERIFIED,
    admissibility: AdmissibilityStatus.ADMITTED,
    credibility: 90,
    admissibilityStrength: 95,
    judgeImpact: 70,
    hasBSACertificate: false,
    factualProperties: [
      'Registration Status: Zero FIR Complaint entered in national portal with serial 822/BNSS173',
      'Transaction Nature: Purely electronic/cyber transaction targeting Lucknow resident from offsite nodes',
      'Station Coordinates: Hazratganj station signature stamp valid and catalogued'
    ],
    factualThemes: ['jurisdiction_bypass', 'cyber_communication_channel']
  }
];

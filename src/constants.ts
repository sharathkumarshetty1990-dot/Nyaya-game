import { Case, Evidence, EvidenceStatus, EvidenceType, LawCard } from "./types";

export const LAW_CARDS: LawCard[] = [
  { id: 'bns-318', section: 'BNS 318', title: 'Cheating by Personation', description: 'Whoever cheats by pretending to be some other person.', cases: ['case-01'], tier: 'BNS' },
  { id: 'bns-308', section: 'BNS 308', title: 'Extortion', description: 'Intentionally putting any person in fear of any injury...', cases: ['case-01', 'case-02'], tier: 'BNS' },
  { id: 'bsa-57', section: 'BSA 57', title: 'Admissibility of Electronic Records', description: 'Digital records are admissible as evidence in court.', cases: ['case-01', 'case-02', 'case-03'], tier: 'BSA' },
  { id: 'bsa-63', section: 'BSA 63', title: 'Special Provisions for Evidence', description: 'Requires dual signature certificate for digital evidence.', cases: ['case-01', 'case-02', 'case-03'], tier: 'BSA' },
  { id: 'bns-111', section: 'BNS 111', title: 'Organised Crime', description: 'Establishing a pattern of criminal behavior with multiple victims.', cases: ['case-02'], tier: 'BNS' },
  { id: 'bns-38', section: 'BNS 38', title: 'Good Samaritan', description: 'Protection for those who help accident victims.', cases: ['case-03'], tier: 'BNS' },
  { id: 'bnss-185', section: 'BNSS 185', title: 'Audio-Video Recording', description: 'Mandatory recording of searches by police.', cases: ['case-03'], tier: 'BNSS' },
  { id: 'bnss-173', section: 'BNSS 173', title: 'Zero FIR', description: 'Right to file FIR at any station regardless of jurisdiction.', cases: ['case-01'], tier: 'BNSS' },
];

export const CASES: Case[] = [
  {
    id: 'case-01',
    title: 'The Digital Arrest',
    difficulty: 'Beginner',
    description: 'A retired principal is trapped in a "digital arrest" by scammers posing as CBI. Save him and his savings.',
    lawsTaught: ['BNS 318', 'BNS 308', 'IT Act 66D'],
    initialNPCs: ['principal-lucknow', 'cbi-poser'],
    evidenceIds: ['wa-ss', 'cbi-logo', 'newspaper-cji', 'badge-check', 'cdr'],
    availableBnsSections: ['BNS 318', 'BNS 308'],
    maxActions: 8
  },
  {
    id: 'case-02',
    title: 'The Morphed Photo',
    difficulty: 'Intermediate',
    description: 'Sextortion syndicate targeting students. Trace the money and prove the manipulation.',
    lawsTaught: ['BNS 308', 'BNS 111', 'IT Act 67', 'BSA 39-45'],
    initialNPCs: ['meera-student', 'scammer-cambodia'],
    evidenceIds: ['morphed-vid', 'stock-img', 'upi-receipt', 'crypto-wallet', 'complaint-logs'],
    availableBnsSections: ['BNS 308', 'BNS 111'],
    maxActions: 10
  },
  {
    id: 'case-03',
    title: 'Hit and Run',
    difficulty: 'Advanced',
    description: 'A split-second decision at 2 AM. Will you stay or flee?',
    lawsTaught: ['BNS 106(1)', 'BNS 106(2)', 'BNS 38', 'BNSS 185'],
    initialNPCs: ['ramesh-trucker', 'suresh-witness'],
    evidenceIds: ['witness-vid', 'blood-test', 'gps-log', 'cctv-petrol'],
    availableBnsSections: ['BNS 106(1)', 'BNS 106(2)'],
    maxActions: 8
  }
];

export const INITIAL_EVIDENCE: Record<string, Evidence> = {
  'wa-ss': {
    id: 'wa-ss',
    name: 'WhatsApp Call Screenshot',
    description: 'A screenshot of the "CBI Officer" on WhatsApp.',
    type: EvidenceType.DIGITAL,
    status: EvidenceStatus.UNVERIFIED,
    hasBSACertificate: false,
    authenticityRisk: 'Timestamp may be manipulated',
    bsaSection: 'BSA 57'
  },
  'cbi-logo': {
    id: 'cbi-logo',
    name: 'CBI Logo on Uniform',
    description: 'Zoom frame grab showing the logo on the caller\'s uniform.',
    type: EvidenceType.DIGITAL,
    status: EvidenceStatus.UNVERIFIED,
    hasBSACertificate: false,
    authenticityRisk: 'Compression artifacts detected',
    bsaSection: 'BSA 57'
  },
  'newspaper-cji': {
    id: 'newspaper-cji',
    name: 'Newspaper with CJI Schedule',
    description: 'A physical newspaper from the day of the arrest.',
    type: EvidenceType.PHYSICAL,
    status: EvidenceStatus.VERIFIED,
    hasBSACertificate: false,
    bsaSection: 'None'
  },
  // Add more as needed...
};

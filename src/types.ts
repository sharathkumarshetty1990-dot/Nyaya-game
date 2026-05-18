/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GamePhase {
  BRIEFING = 'BRIEFING',
  INVESTIGATION = 'INVESTIGATION',
  VERIFICATION = 'VERIFICATION',
  STATION = 'STATION',
  COURTROOM = 'COURTROOM',
  VERDICT = 'VERDICT'
}

export enum EvidenceType {
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
  TESTIMONY = 'TESTIMONY'
}

export enum AuthenticityStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  FORGED = 'FORGED',
  TAMPERED = 'TAMPERED'
}

export enum AdmissibilityStatus {
  INADMISSIBLE = 'INADMISSIBLE',
  PENDING = 'PENDING',
  ADMITTED = 'ADMITTED',
  SUPPRESSED = 'SUPPRESSED'
}

export interface DigitalEvidenceMetadata {
  hash: string;
  timestamp: string;
  deviceOrigin: string;
  fileSize?: string;
  format?: string;
}

export interface PhysicalEvidenceMetadata {
  locationFound: string;
  custodyChain: string[];
  dimensions?: string;
}

export interface TestimonyMetadata {
  witnessId: string;
  reliabilityScore: number;
  dateOfStatement: string;
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  type: EvidenceType;
  authenticity: AuthenticityStatus;
  admissibility: AdmissibilityStatus;
  courtConfidence: number; // 0-100
  hasBSACertificate: boolean;
  metadata?: DigitalEvidenceMetadata | PhysicalEvidenceMetadata | TestimonyMetadata;
  authenticityRisk?: string;
  bsaSection?: string;
  contentUrl?: string;
  
  // Relational Depth
  linkedEvidenceIds: string[];
  contradicts?: string[];
  supports?: string[];
  requires?: string[];
}

export interface LawCard {
  id: string;
  section: string;
  title: string;
  description: string;
  cases: string[];
  tier: 'BNS' | 'BNSS' | 'BSA';
  effect?: string; // Tactical impact description
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  trustStars: number;
  avatarUrl?: string;
}

export interface TrialStep {
  id: string;
  type: 'statement' | 'objection' | 'evidence_request' | 'verdict_moment';
  speaker: string;
  text: string;
  options?: string[];
  requiredEvidenceIds?: string[];
  contradictionEvidenceId?: string;
  impactOnPressure?: number;
  impactOnJustice?: number;
}

export interface Case {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  lawsTaught: string[];
  initialNPCs: string[];
  evidenceIds: string[];
  availableBnsSections: string[];
  narrativeUrgency?: string; 
  trialFlow: TrialStep[];
}

export interface GameState {
  currentCaseId: string | null;
  phase: GamePhase;
  inventory: Evidence[];
  legalScore: number;
  justiceScore: number;
  unlockedLawCards: string[];
  completedCases: string[];
  npcTrust: Record<string, number>;
  pressureMeter: number; // 0-100, affects courtroom tension
  currentStationOfficer?: string;
  isGameOver: boolean;
}

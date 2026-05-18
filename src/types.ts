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

export enum EvidenceStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  CERTIFIED = 'CERTIFIED', // BSA Sec 63
  CONTESTED = 'CONTESTED'
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  type: EvidenceType;
  status: EvidenceStatus;
  hasBSACertificate: boolean;
  metadata?: Record<string, any>;
  authenticityRisk?: string;
  bsaSection?: string;
  contentUrl?: string; // For images/documents
}

export interface LawCard {
  id: string;
  section: string;
  title: string;
  description: string;
  cases: string[]; // IDs of cases it pertains to
  tier: 'BNS' | 'BNSS' | 'BSA';
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  trustStars: number;
  avatarUrl?: string;
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
  maxActions: number;
}

export interface GameState {
  currentCaseId: string | null;
  phase: GamePhase;
  inventory: Evidence[];
  actionTokens: number;
  legalScore: number;
  justiceScore: number;
  unlockedLawCards: string[]; // IDs
  completedCases: string[]; // IDs
  npcTrust: Record<string, number>;
  pressureMeter: number;
  currentStationOfficer?: string;
  isGameOver: boolean;
}

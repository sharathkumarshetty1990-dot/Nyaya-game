import * as ScoreSystem from './scoreSystem';
import * as PhaseManager from './phaseManager';
import * as EvidenceEngine from './evidenceEngine';

export const GameEngine = {
  // Score System
  calculateLegalScore: ScoreSystem.calculateLegalScore,
  calculateJusticeScore: ScoreSystem.calculateJusticeScore,

  // Phase Manager
  getNextPhase: PhaseManager.getNextPhase,

  // Evidence Engine
  verifyEvidence: EvidenceEngine.verifyEvidence,
  certifyEvidence: EvidenceEngine.certifyEvidence,
  findContradiction: EvidenceEngine.findContradiction,
  isEvidenceAdmissible: EvidenceEngine.isEvidenceAdmissible
};


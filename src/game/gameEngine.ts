import * as ScoreSystem from './scoreSystem';
import * as PhaseManager from './phaseManager';
import * as EvidenceEngine from './evidenceEngine';

export const GameEngine = {
  ...ScoreSystem,
  ...PhaseManager,
  ...EvidenceEngine
};

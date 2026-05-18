import { GameState, AuthenticityStatus } from '../types';

export const calculateLegalScore = (state: GameState): number => {
  let score = 0;
  const verifiedCount = state.inventory.filter(e => e.authenticity !== AuthenticityStatus.UNVERIFIED).length;
  const bsaCount = state.inventory.filter(e => e.hasBSACertificate).length;
  
  score = (verifiedCount * 10) + (bsaCount * 15);
  return Math.min(score, 100);
};

export const calculateJusticeScore = (state: GameState): number => {
  return Math.min(state.justiceScore || 0, 100);
};

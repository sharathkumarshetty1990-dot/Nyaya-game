import { Evidence, AuthenticityStatus, AdmissibilityStatus, GameState } from '../types';

/**
 * Verifies the authenticity of an evidence item.
 * Higher pressure level makes verification slightly harder or riskier.
 */
export const verifyEvidence = (evidence: Evidence, state: GameState): Evidence => {
  const pressurePenalty = state.pressureMeter > 50 ? 10 : 0;
  
  // Logical depth: if a supporting evidence is already verified, court confidence increases
  const supportVerified = evidence.supports?.some(id => 
    state.inventory.find(e => e.id === id)?.authenticity === AuthenticityStatus.VERIFIED
  );

  return { 
    ...evidence, 
    authenticity: AuthenticityStatus.VERIFIED,
    courtConfidence: Math.min(100, (evidence.courtConfidence || 50) + (supportVerified ? 20 : 10) - pressurePenalty)
  };
};

/**
 * Certifies digital evidence under BSA Sec 63.
 * Requires the evidence to be verified first.
 */
export const certifyEvidence = (evidence: Evidence): Evidence => {
  if (evidence.authenticity !== AuthenticityStatus.VERIFIED) {
    return evidence;
  }

  return { 
    ...evidence, 
    admissibility: AdmissibilityStatus.ADMITTED, 
    hasBSACertificate: true,
    courtConfidence: Math.min(100, (evidence.courtConfidence || 0) + 30)
  };
};

/**
 * Logical check for contradictions based on the entire inventory.
 */
export const findContradiction = (targetId: string, inventory: Evidence[]): Evidence | null => {
  const target = inventory.find(e => e.id === targetId);
  if (!target || !target.contradicts) return null;
  
  const contradictingItem = inventory.find(e => target.contradicts?.includes(e.id));
  return contradictingItem || null;
};

/**
 * Complex admissibility check.
 * Digital evidence MUST be certified. 
 * Physical evidence must be verified.
 */
export const isEvidenceAdmissible = (evidence: Evidence): boolean => {
  if (evidence.type === 'DIGITAL') {
    return evidence.hasBSACertificate && evidence.admissibility === AdmissibilityStatus.ADMITTED;
  }
  return evidence.authenticity === AuthenticityStatus.VERIFIED || evidence.admissibility === AdmissibilityStatus.ADMITTED;
};


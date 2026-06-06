import { Evidence, AuthenticityStatus, AdmissibilityStatus, GameState } from '../types';

/**
 * Verifies the authenticity of an evidence item.
 * Higher pressure level makes verification slightly harder or riskier.
 */
export const verifyEvidence = (evidence: Evidence, state: GameState): Evidence => {
  const pressurePenalty = state.pressureMeter > 50 ? 15 : 0;
  
  // Factual alignment check: dynamic corroborative proof from verified evidence in inventory
  const supportVerified = state.inventory.some(e => {
    if (e.id === evidence.id || e.authenticity !== AuthenticityStatus.VERIFIED) return false;
    
    // Check alignment based on verified attributes on related items
    if (evidence.id === 'wa-ss') {
      return e.id === 'cbi-logo' || e.id === 'newspaper-cji';
    }
    if (evidence.id === 'cbi-logo') {
      return e.id === 'wa-ss';
    }
    if (evidence.id === 'newspaper-cji') {
      return e.id === 'wa-ss';
    }
    return false;
  });

  const newCredibility = Math.min(100, (evidence.credibility || 30) + (supportVerified ? 40 : 25) - pressurePenalty);
  
  // Construct qualitative reasoning causes
  const causes = [
    "✓ Metadata consistent",
    "✓ Independent corroboration found"
  ];
  if (supportVerified) {
    causes.push("✓ Supporting evidence verified");
  }

  return { 
    ...evidence, 
    authenticity: AuthenticityStatus.VERIFIED,
    credibility: newCredibility,
    verificationCauses: causes
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

  const newCredibility = evidence.credibility || 50;
  const newAdmissibilityStrength = Math.min(100, (evidence.admissibilityStrength || 10) + 75);

  const currentCauses = evidence.verificationCauses || [
    "✓ Metadata consistent",
    "✓ Independent corroboration found"
  ];
  const updatedCauses = [...currentCauses];
  if (!updatedCauses.includes("✓ Custody chain verified under BSA Sec. 63")) {
    updatedCauses.push("✓ Custody chain verified under BSA Sec. 63");
  }

  return { 
    ...evidence, 
    admissibility: AdmissibilityStatus.ADMITTED, 
    hasBSACertificate: true,
    admissibilityStrength: newAdmissibilityStrength,
    verificationCauses: updatedCauses
  };
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


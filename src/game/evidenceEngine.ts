import { Evidence, AuthenticityStatus, AdmissibilityStatus, GameState } from '../types';

/**
 * Structural Factors - Causes -> Score Derivation Model
 * Computes deep qualitative pillars based on empirical facts & inventory context,
 * then derives credibility rating dynamically.
 */
export const deriveCredibilityState = (
  evidence: Evidence, 
  inventory: Evidence[], 
  pressureMeter: number = 0
): { credibility: number; admissibilityStrength: number; causes: string[] } => {
  const causes: string[] = [];
  let credibilityRating = 0;
  let admissibilityStrengthRating = 15; // base level for unverified/uncertified items

  // 1. Forensic & Material Integrity Pillar (Weight: 35)
  if (evidence.id === 'wa-ss') {
    causes.push("✓ Forensic Signature: High-density frame buffer export matches native mobile hardware profile.");
    credibilityRating += 35;
  } else if (evidence.id === 'newspaper-cji') {
    causes.push("✓ Material Integrity: Lithographic print rosettes and low-acid paper verify physical authenticity.");
    credibilityRating += 35;
  } else if (evidence.id === 'zero-fir-receipt') {
    causes.push("✓ Authenticity Signature: Official Hazratganj station seal is legally authentic and catalogued.");
    credibilityRating += 35;
  } else if (evidence.id === 'cbi-logo') {
    causes.push("✗ Forensic Discrepancy: Geometric scans show non-uniform borders & synthetic micro-pixel painting (proven counterfeit).");
    credibilityRating += 10; // Capped due to being an artificial scam element
  } else {
    causes.push("✓ Forensic Signature: Standard capture characteristics verify physical/digital coherence.");
    credibilityRating += 30;
  }

  // 2. Spatiotemporal Timeline Coherence Pillar (Weight: 35)
  if (evidence.id === 'wa-ss') {
    causes.push("✗ Spatiotemporal Gap: Country code prefix mismatch (+44 UK) and routing delay indicate timezone spoofing.");
    credibilityRating += 15;
  } else if (evidence.id === 'newspaper-cji') {
    causes.push("✓ Temporal Coherence: Published date/time matches the 11:00 AM slot of CJI's New Delhi whereabouts exactly.");
    credibilityRating += 35;
  } else if (evidence.id === 'zero-fir-receipt') {
    causes.push("✓ Procedural Alignment: Zero FIR entry logged instantly under BNSS Section 173 mandate.");
    credibilityRating += 35;
  } else if (evidence.id === 'cbi-logo') {
    causes.push("✗ Temporal Discrepancy: Extracted from unverified live video stream compression block layers.");
    credibilityRating += 15;
  } else {
    causes.push("✓ Timeline Coherent: Temporal events match contextual trial history.");
    credibilityRating += 30;
  }

  // 3. Independent Source Corroboration Pillar (Weight: 30)
  const otherVerifiedItems = inventory.filter(e => e.id !== evidence.id && e.authenticity === AuthenticityStatus.VERIFIED);
  const corroboratingItem = otherVerifiedItems.find(e => {
    if (!evidence.factualThemes || !e.factualThemes) return false;
    return evidence.factualThemes.some(theme => e.factualThemes?.includes(theme));
  });

  if (corroboratingItem) {
    causes.push(`✓ Independent Corroboration: Cross-referenced with verified Exhibit ${corroboratingItem.name} forming dual-link validity.`);
    credibilityRating += 30;
  } else {
    causes.push("✗ Source Isolation: Lacks cross-verified independent corroborating exhibit in current inventory.");
    credibilityRating += 10;
  }

  // 4. Custody Chain Integrity (BSA Section 63 Certification State)
  if (evidence.hasBSACertificate) {
    causes.push("✓ Custody Seal: Vault custody chain sealed with double-signature hash verified under BSA Sec 63.");
    admissibilityStrengthRating = 95; // High admissibility strength on certification
    credibilityRating += 15;
  } else {
    causes.push("✗ Custody Unsealed: Chain of custody is uncertified under statutory BSA Section 63 forensic rules.");
    if (evidence.authenticity === AuthenticityStatus.VERIFIED) {
      admissibilityStrengthRating = 45; // Moderately stronger once verified
    }
  }

  // Active courtroom interference penalties (e.g. pressure meter high-stress drops focus)
  const pressurePenalty = pressureMeter > 50 ? 10 : 0;
  const finalCredibility = Math.min(100, Math.max(10, credibilityRating - pressurePenalty));

  return {
    credibility: finalCredibility,
    admissibilityStrength: admissibilityStrengthRating,
    causes
  };
};

/**
 * Verifies the authenticity of an evidence item.
 */
export const verifyEvidence = (evidence: Evidence, state: GameState): Evidence => {
  // Compute derived state based on potential verified corroborating items
  const derived = deriveCredibilityState(
    { ...evidence, authenticity: AuthenticityStatus.VERIFIED }, 
    state.inventory,
    state.pressureMeter
  );

  return { 
    ...evidence, 
    authenticity: AuthenticityStatus.VERIFIED,
    credibility: derived.credibility,
    admissibilityStrength: derived.admissibilityStrength,
    verificationCauses: derived.causes
  };
};

/**
 * Certifies digital evidence under BSA Sec 63.
 * Requires the evidence to be verified first.
 */
export const certifyEvidence = (evidence: Evidence, state?: GameState): Evidence => {
  if (evidence.authenticity !== AuthenticityStatus.VERIFIED) {
    return evidence;
  }

  const certifiedEvidence: Evidence = {
    ...evidence,
    admissibility: AdmissibilityStatus.ADMITTED, 
    hasBSACertificate: true,
  };

  const inventory = state ? state.inventory : [certifiedEvidence];
  const derived = deriveCredibilityState(certifiedEvidence, inventory, state ? state.pressureMeter : 0);

  return { 
    ...certifiedEvidence,
    credibility: derived.credibility,
    admissibilityStrength: derived.admissibilityStrength,
    verificationCauses: derived.causes
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

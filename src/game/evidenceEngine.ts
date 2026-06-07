import { Evidence, AuthenticityStatus, AdmissibilityStatus, GameState } from '../types';

interface EvaluationRule {
  themeTrigger?: string;
  propertyKeyTriggers?: string[];
  score: number;
  message: string;
}

const INTEGRITY_RULES: EvaluationRule[] = [
  {
    themeTrigger: 'synthetic_imagery',
    score: 10,
    message: "✗ Forensic Discrepancy: Sharp, perfectly straight digital edges indicate the badge was superimposed (counterfeit uniform)."
  },
  {
    propertyKeyTriggers: ['Device Origin', 'Screenshot metadata', 'phone model'],
    score: 35,
    message: "✓ Forensic Signature: Screenshot metadata matches the victim's phone hardware and original file details."
  },
  {
    propertyKeyTriggers: ['Physical Medium', 'newsprint', 'paper texture'],
    score: 35,
    message: "✓ Material Integrity: Physical newsprint paper texture and print ink match authentic newspaper stock."
  },
  {
    propertyKeyTriggers: ['Station Coordinates', 'police stamp', 'seal', 'signature stamp'],
    score: 35,
    message: "✓ Authenticity Signature: Hazratganj station seal and officer signature are authentic and verified."
  }
];

const TIMELINE_RULES: EvaluationRule[] = [
  {
    themeTrigger: 'spoofed_identity_vector',
    propertyKeyTriggers: ['Uses VoIP-spoofed', 'VoIP-spoofed', '+44'],
    score: 15,
    message: "✗ Spatiotemporal Gap: The +44 UK calling prefix on the virtual account indicates country-code spoofing."
  },
  {
    themeTrigger: 'synthetic_imagery',
    score: 15,
    message: "✗ Temporal Discrepancy: Extracted from an unverified third-party video recording stream."
  },
  {
    themeTrigger: 'physical_location_verification',
    score: 35,
    message: "✓ Temporal Coherence: Published arrival time matches the official New Delhi administrative schedule."
  },
  {
    themeTrigger: 'jurisdiction_bypass',
    score: 35,
    message: "✓ Procedural Alignment: Complaint logged or verified under Zero FIR guidelines."
  }
];

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
  const integrityMatch = INTEGRITY_RULES.find(rule => {
    const themeMatches = rule.themeTrigger && evidence.factualThemes?.includes(rule.themeTrigger);
    const propMatches = rule.propertyKeyTriggers && evidence.factualProperties?.some(prop => 
      rule.propertyKeyTriggers?.some(trigger => prop.toLowerCase().includes(trigger.toLowerCase()))
    );
    return themeMatches || propMatches;
  });

  if (integrityMatch) {
    causes.push(integrityMatch.message);
    credibilityRating += integrityMatch.score;
  } else {
    causes.push("✓ Forensic Signature: Basic capture metadata verified.");
    credibilityRating += 30;
  }

  // 2. Spatiotemporal Timeline Coherence Pillar (Weight: 35)
  const timelineMatch = TIMELINE_RULES.find(rule => {
    const themeMatches = rule.themeTrigger && evidence.factualThemes?.includes(rule.themeTrigger);
    const propMatches = rule.propertyKeyTriggers && evidence.factualProperties?.some(prop => 
      rule.propertyKeyTriggers?.some(trigger => prop.toLowerCase().includes(trigger.toLowerCase()))
    );
    
    if (rule.themeTrigger && rule.propertyKeyTriggers) {
      return themeMatches && propMatches;
    }
    return themeMatches || propMatches;
  });

  if (timelineMatch) {
    causes.push(timelineMatch.message);
    credibilityRating += timelineMatch.score;
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
    causes.push("✓ Custody Seal: Digital certificate of authenticity signed and verified under BSA Section 63.");
    admissibilityStrengthRating = 95; // High admissibility strength on certification
    credibilityRating += 15;
  } else {
    causes.push("✗ Custody Unsealed: Digital evidence lacks the required certification under BSA Section 63.");
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

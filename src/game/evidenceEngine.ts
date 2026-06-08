import { Evidence, AuthenticityStatus, AdmissibilityStatus, GameState } from '../types';

/**
 * Structural Factors - Causes -> Score Derivation Model
 * Computes deep qualitative pillars based on empirical facts & inventory context,
 * then derives credibility rating dynamically.
 * Refactored to operate generically on evidence properties (factualProperties)
 * rather than hardcoded lists of rules to prevent rule list explosion.
 */
export const deriveCredibilityState = (
  evidence: Evidence, 
  inventory: Evidence[], 
  pressureMeter: number = 0
): { credibility: number; admissibilityStrength: number; causes: string[] } => {
  const causes: string[] = [];
  let credibilityRating = 0;
  let admissibilityStrengthRating = 15; // base level for unverified/uncertified items

  const props = evidence.factualProperties || [];
  
  let integrityMatch: { score: number; message: string } | null = null;
  let timelineMatch: { score: number; message: string } | null = null;

  for (const prop of props) {
    const colonIdx = prop.indexOf(':');
    if (colonIdx === -1) continue;
    
    const label = prop.substring(0, colonIdx).trim().toLowerCase();
    const value = prop.substring(colonIdx + 1).trim();
    
    const textToSearch = prop.toLowerCase();
    // Broad, robust semantic indicators for negative/fraudulent details
    const isNegative = textToSearch.includes('irregular') || 
                       textToSearch.includes('spoofed') || 
                       textToSearch.includes('counterfeit') || 
                       textToSearch.includes('unverified') || 
                       textToSearch.includes('discrepancy') || 
                       textToSearch.includes('mismatch') || 
                       textToSearch.includes('pixelated') ||
                       textToSearch.includes('lack') ||
                       textToSearch.includes('synthetic') ||
                       textToSearch.includes('downloaded') ||
                       textToSearch.includes('video') ||
                       textToSearch.includes('bypass') ||
                       textToSearch.includes('+44');

    // Classify as Integrity Property
    const isIntegrity = label.includes('origin') || 
                        label.includes('medium') || 
                        label.includes('geometry') || 
                        label.includes('resolution') || 
                        label.includes('coordinates') || 
                        label.includes('stamp') || 
                        label.includes('seal') || 
                        label.includes('signature');
                        
    // Classify as Timeline/Procedural/Spatiotemporal Property
    const isTimeline = label.includes('time') || 
                       label.includes('date') || 
                       label.includes('temporal') || 
                       label.includes('status') || 
                       label.includes('nature') || 
                       label.includes('prefix') || 
                       label.includes('identity') || 
                       label.includes('lead text') || 
                       label.includes('arrival') ||
                       label.includes('profile');

    if (isIntegrity && !integrityMatch) {
      if (isNegative) {
        integrityMatch = {
          score: 10,
          message: `✗ Discrepancy: ${value}`
        };
      } else {
        const themeLabel = label.includes('medium') ? 'Material checks out' : 
                           (label.includes('coordinates') || label.includes('stamp') || label.includes('signature') || label.includes('seal')) ? 'Authenticity confirmed' :
                           'Forensic matches';
        integrityMatch = {
          score: 35,
          message: `✓ ${themeLabel}: ${value}`
        };
      }
    }
    
    if (isTimeline && !timelineMatch) {
      if (isNegative) {
        timelineMatch = {
          score: 15,
          message: `✗ Temporal gap: ${value}`
        };
      } else {
        const themeLabel = label.includes('status') ? 'Procedural match' : 'Timeline matches';
        timelineMatch = {
          score: 35,
          message: `✓ ${themeLabel}: ${value}`
        };
      }
    }
  }

  // 1. Forensic & Material Integrity Pillar (Weight: 35)
  if (integrityMatch) {
    causes.push(integrityMatch.message);
    credibilityRating += integrityMatch.score;
  } else {
    causes.push("✓ Artifact matches capture metadata.");
    credibilityRating += 30;
  }

  // 2. Spatiotemporal Timeline Coherence Pillar (Weight: 35)
  if (timelineMatch) {
    causes.push(timelineMatch.message);
    credibilityRating += timelineMatch.score;
  } else {
    causes.push("✓ Timeline matches contextual trial history.");
    credibilityRating += 30;
  }

  // 3. Independent Source Corroboration Pillar (Weight: 30)
  const otherVerifiedItems = inventory.filter(e => e.id !== evidence.id && e.authenticity === AuthenticityStatus.VERIFIED);
  const corroboratingItem = otherVerifiedItems.find(e => {
    if (!evidence.factualThemes || !e.factualThemes) return false;
    return evidence.factualThemes.some(theme => e.factualThemes?.includes(theme));
  });

  if (corroboratingItem) {
    causes.push(`✓ Supported by another verified exhibit (${corroboratingItem.name})`);
    credibilityRating += 30;
  } else {
    causes.push("✗ Lacks supporting corroboration in current inventory.");
    credibilityRating += 10;
  }

  // 4. Custody Chain Integrity (BSA Section 63 Certification State)
  if (evidence.hasBSACertificate) {
    causes.push("✓ Certificate of authenticity verified under BSA Section 63.");
    admissibilityStrengthRating = 95; // High admissibility strength on certification
    credibilityRating += 15;
  } else {
    causes.push("✗ Lacks certificate of authenticity under BSA Section 63.");
    if (evidence.authenticity === AuthenticityStatus.VERIFIED) {
      admissibilityStrengthRating = 45; // Moderately stronger once verified
    }
  }

  // Active courtroom pressure affects interpretation difficulty rather than credibility scores directly
  const finalCredibility = Math.min(100, Math.max(10, credibilityRating));

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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  baseBehavior: string;
  pressureTippingPoint: number;
  
  /**
   * Generates custom, highly atmospheric dialogue modified by pressure level.
   */
  getDynamicDialogue: (originalText: string, pressure: number) => string;
}

export const CHARACTER_REGISTRY: Record<string, CharacterProfile> = {
  'Justice G. Singh': {
    id: 'judge-singh',
    name: 'Justice G. Singh',
    role: 'Presiding High Court Judge',
    baseBehavior: 'Strict textualist bound by BSA Sec 63. Demands impeccable procedural hygiene.',
    pressureTippingPoint: 50,
    getDynamicDialogue: (originalText, pressure) => {
      if (pressure > 75) {
        return `[shuffling legal briefs sternly] ${originalText} [gavel bangs twice] This bench demands strict statutory proof, Counselor. No procedural deviations will be tolerated under Section 63!`;
      }
      if (pressure > 50) {
        return `[tapping pen impatiently] Counselor, let us maintain protocol. ${originalText} We must stick to legally admissible evidence.`;
      }
      return originalText;
    }
  },
  'Virendra Sharma': {
    id: 'virendra-sharma',
    name: 'Virendra Sharma',
    role: 'Retired Principal (Victim)',
    baseBehavior: 'Earnest, vulnerable, highly formal, deeply traumatized by the scam.',
    pressureTippingPoint: 45,
    getDynamicDialogue: (originalText, pressure) => {
      if (pressure > 75) {
        const distorted = originalText
          .replace(/I /g, "I... I ")
          .replace(/my /g, "m-my ")
          .replace(/me /g, "m-me ")
          .replace(/\. /g, ". ... [wipes hands shakingly] ... ");
        return `[breathing heavily, voice cracking] ${distorted} [pauses] ... I... I was terrified... they had my full name and details... is... is my pension gone?`;
      }
      if (pressure > 50) {
        const distorted = originalText.replace(/\. /g, ". [shivers slightly] ... ");
        return `${distorted} [wipes brow nervously] ... if my memory recalls.`;
      }
      return originalText;
    }
  },
  'CBI Poser (Transcript)': {
    id: 'cbi-poser',
    name: 'CBI Poser (Transcript)',
    role: 'Fraud Coordinator (Impersonator)',
    baseBehavior: 'Authoritative, imposing, using psychological coercion tactics.',
    pressureTippingPoint: 60,
    getDynamicDialogue: (originalText, pressure) => {
      if (pressure > 75) {
        return `[glitched transcript feed] ${originalText} [robotic interference tone] COMPLIANCE MEASURES MANDATORY -- PROSECUTION EVIDENCE INVALIDATION DETECTED.`;
      }
      if (pressure > 50) {
        return `[audio noise lines] ${originalText} [severe static sound] TRANSCRIPT UNADMITTED: SECTION 63 CUSTODY WARNING.`;
      }
      return originalText;
    }
  },
  'Defense Counsel': {
    id: 'defense-counsel',
    name: 'Defense Counsel',
    role: 'Opposing Counselor',
    baseBehavior: 'Smug, opportunistic, eager to abuse procedural gaps for easy dismissals.',
    pressureTippingPoint: 50,
    getDynamicDialogue: (originalText, pressure) => {
      if (pressure > 75) {
        return `[slams hand on defense table] ${originalText} This is a procedural farce! We object to these groundless digital insertions!`;
      }
      if (pressure > 50) {
        return `[smirks thinly, fixing cuffs] ${originalText} Our guidelines are clear, Counsel. Where is the dual-signature hash?`;
      }
      return originalText;
    }
  }
};

/**
 * Returns dynamic text modified by character profile and current pressure meter.
 */
export function resolveDynamicDialogue(speaker: string, originalText: string, pressureMeter: number): string {
  const profile = CHARACTER_REGISTRY[speaker];
  if (profile) {
    return profile.getDynamicDialogue(originalText, pressureMeter);
  }
  
  return originalText;
}

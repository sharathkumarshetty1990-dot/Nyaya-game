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
        return `Counselor, let's get to the point. Is this certified under Section 63 or not? Yes or no... I am waiting.`;
      }
      if (pressure > 50) {
        return `Counselor, state your admissibility ground clearly. We cannot spend all afternoon on...`;
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
        return `I... I cannot... they said... ${originalText.substring(0, Math.min(originalText.length, 60))}... and then... I don't...`;
      }
      if (pressure > 50) {
        const simplified = originalText.substring(0, Math.min(originalText.length, 110));
        return `${simplified}... I... I couldn't...`;
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
        return `Logs... on April 14... after... wait, no... at Lucknow...`;
      }
      if (pressure > 50) {
        const simplified = originalText.substring(0, Math.min(originalText.length, 90));
        return `${simplified}... we...`;
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
        return `This is... we cannot base a criminal trial on unverified captures! I... I object to...`;
      }
      if (pressure > 50) {
        return `Opposing counsel is guessing. Where is the actual, certified proof? This is...`;
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

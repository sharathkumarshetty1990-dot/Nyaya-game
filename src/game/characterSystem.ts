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
        return `How can the Court be certain of this exhibit's authenticity, Counselor? Under Section 63, is this certified or not?`;
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
        return `I am not sure anymore. Everything happened so fast, and I was too terrified to check the details. I cannot be certain of the sequence.`;
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
        return `We logged the dispatch from Lucknow on April 14. Any apparent timezone or location discrepancy is likely just a network synchronization issue.`;
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
        return `This is highly speculative, Your Honor. Impeaching this position requires undeniable proof. This uncertified exhibit leaves too much room for uncertainty.`;
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

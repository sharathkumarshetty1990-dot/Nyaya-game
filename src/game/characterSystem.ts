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
        return `*(Staring down with icy, lethal calm)* "Counsel, answer the question. This bench concerns itself solely with iron-clad, statutory evidence. If you expect this court to accept raw uncertified pixels, you are mistaken. Present admissibility clearance immediately."`;
      }
      if (pressure > 50) {
        return `*(Gazing coldly at you)* "You are testing my patience, Counsel. The BSA is not a suggestion; it is the law. Stick to the certified evidence. No more narratives."`;
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
        return `*(Trembling, swallowing hard)* "They sent a video-arrest warrant. Because it had my own signature habit—'Regards, Principal Sharma'—I was utterly frozen. I thought they were real authorities. My savings are gone."`;
      }
      if (pressure > 50) {
        return `*(Staring down at his hands)* "I was grading exam papers when they called. They looked so official. I believed them when they mentioned Lucknow."`;
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
        return `"You are under absolute arrest. The Supreme Court database has locked your account. Attempting to contest this sovereign cyber-warrant constitutes contempt. Transfer safe-keeping funds immediately."`;
      }
      if (pressure > 50) {
        return `"We are acting under closed judicial supervision from the Lucknow cyber barracks. Provide authentication to the safekeeping fund now."`;
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
        return `*(Sweating slightly, losing his smirk)* "Objection! The prosecution is relying on irrelevant clock offsets. This is a simple timezone quirk. Do not throw out our defense on a triviality."`;
      }
      if (pressure > 50) {
        return `*(Leaning forward smugly)* "No dual-signature certificate, no evidence. This screenshot is legally non-existent under the BSA."`;
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

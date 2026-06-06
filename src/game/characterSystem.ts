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
        return `[Bench Memorandum Review] ${originalText} This court requires precise chronological and statutory consistency. Any procedural or forensic ambiguity under Section 63 must be addressed before this exhibit can be formally admitted.`;
      }
      if (pressure > 50) {
        return `Counselor, let us preserve procedural protocol. ${originalText} We must restrict our focus strictly to certified, legally admissible entries.`;
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
          .replace(/immediately/g, "at some point... or perhaps later... I cannot confirm")
          .replace(/fully/g, "partially... or maybe fully")
          .replace(/\. /g, "... I think. ... ");
        return `${distorted} ...the exact sequence of events is becoming difficult to isolate. There were multiple concurrent calls... was my pension targeted first, or did the federal claims happen prior?`;
      }
      if (pressure > 50) {
        const distorted = originalText.replace(/\. /g, "... if my memory serves me correctly... ");
        return `${distorted} ...there was high cognitive load during that hour. Is there any objective digital log to confirm that part?`;
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
        return `[LATENCY DEVIATION SIGNALET] ${originalText} [FORENSIC METADATA: Source trunk identifies as international gateway +44; subscriber profile unverified].`;
      }
      if (pressure > 50) {
        return `[TRANSMISSION ARTIFACTS] ${originalText} [FORENSIC METADATA: Local timezone offset mismatch detected].`;
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
        return `We object to this reading! ${originalText} The prosecution's timeline contains clear, unaccounted chronological lapses. To rely on this would be a major procedural misstep!`;
      }
      if (pressure > 50) {
        return `A highly tenuous connection, Counsel. ${originalText} Where is the verifiable, dual-signature hash to support this timeline?`;
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

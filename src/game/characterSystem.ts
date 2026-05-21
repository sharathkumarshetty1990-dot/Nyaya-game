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
        return `*(Slamming his heavy brass gavel down with an aggressive, deafening crash, adjusting his gold-rimmed spectacles)* "Counsel! Enough of this procedural play-acting! This bench rules on iron-clad, dual-signature statutory evidence. If the prosecution brings raw pixelated screenshots without valid BSA Section 63 certification, I will exclude them with prejudice! Present admissibility clearance or expect immediate compliance warnings!"`;
      }
      if (pressure > 50) {
        return `*(Frowning sternly, looking down from his elevated teak podium)* "Counsel, my patience has statutory boundaries. The Bharatiya Sakshya Adhiniyam is not a guideline; it is the legislative command. Your arguments are becoming worryingly narrative-heavy. Stick strictly to the evidentiary corpus!"`;
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
        return `*(Clutching a folded linen handkerchief, wiping cold sweat from his neck as his voice rises in a trembling register)* "...I... I can't think. The courtroom is spinny... They said they were Lucknow Cyber CID... they knew my address, my old school ledger! I always sign my formal notes with 'Regards, Principal Sharma' and when they showed me that official digital warrant with those exact words... my chest went cold. Those monsters... please, they have locked everything... my pension is gone!"`;
      }
      if (pressure > 50) {
        return `*(Staring down at his shaking, weathered hands, a tremor in his lip)* "Yes, I... I grading old matriculation sheets under my desk lamp... when the calling screen turned that cold, metallic gray. They spoke of money laundering in Lucknow High Court barracks. I thought I was assisting the national interest... They were so authoritative..."`;
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
        return `*(Digital transcript terminal flashes amber, signaling protocol anomaly)* "[SYSTEM WARNING: PACKET ROUTE GLITCH] // CBI_Lucknow_Barracks: 'You are under absolute arrest. The Supreme Court database is locked on escrow ID 4402. Attempting to contest this sovereign cyber-warrant constitutes direct contempt. Secure the liquid assets immediately or suffer immediate state suppression.'"`;
      }
      if (pressure > 50) {
        return `*(Projected transcript text jittering)* "[PROTOCOL MIGRATION] // Inspector Amit Sen: 'We are acting under closed judicial supervision from the cyber barracks. Personal attendance is forbidden under national security parity. Provide biometric authorization to the safe-keeping fund now.'"`;
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
        return `*(Perspiring slightly, desperately flipping through a thick leather folder, losing his smug tone)* "Objection, Your Honor! The prosecution is using... technical anomalies and minor clock offsets to confuse the court! Yes, the timestamp shows UTC metadata, but... but that is a simple regional sync quirk! Human error! We must not reject the foundational testimony on frivolous technicalities!"`;
      }
      if (pressure > 50) {
        return `*(Tapping on the thick mahogany desk, throwing a smug glance at the gallery)* "A tragedy does not substitute legal certitude, Your Honor. The prosecution offers raw digital files with zero validated certificates. Under the strict authority of BSA, this screenshot is legally non-existent. It must be thrown out!"`;
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
  
  // Generic character compression under severe pressure
  if (pressureMeter > 80) {
    return `*(Stuttering under immense pressure)* "... ${originalText.replace(/ the /gi, ' ... the ').replace(/\. /g, '... I... ')} [ATMOSPHERE: EXTENSE TENSION]"`;
  }
  
  return originalText;
}

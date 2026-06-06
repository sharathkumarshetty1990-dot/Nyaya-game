import { Case, TrialStep, AuthenticityStatus, AdmissibilityStatus, EvidenceType } from '../types';

const trialFlow: TrialStep[] = [
  {
    id: 'intro',
    type: 'statement',
    speaker: 'Justice G. Singh',
    text: "Evaluating digital exhibits in State vs Unknown. Cyber fraud targeting a senior citizen. Lay out your case, Prosecution. We are bound strictly by BSA Section 63.",
    impactOnPressure: 2,
    narrativeStateNote: "The court is seated."
  },
  {
    id: 'witness-virendra-opening',
    type: 'statement',
    speaker: 'Virendra Sharma',
    text: "On April 14, I received a video call claiming pension link to money laundering. They sent a digital arrest warrant signed 'Regards, Principal Sharma'—reproducing my own WhatsApp signature. Confused by this habit, I complied.",
    impactOnPressure: 5,
    narrativeStateNote: "Witness is under oath."
  },
  {
    id: 'defense-objection-1',
    type: 'objection',
    speaker: 'Defense Counsel',
    text: "Objection! The prosecution relies on a raw JPEG screenshot of a WhatsApp chat. Under BSA Section 63, electronic files are inadmissible without a dual-signature certificate. This screenshot is uncertified. It must be excluded.",
    narrativeStateNote: "Defense objects.",
    options: [
      {
        id: 'opt-submit-certified',
        text: "Submit Certified WhatsApp Screenshot",
        description: "Present the WhatsApp call screenshot along with the valid BSA Sec 63 digital certificate verifying the device's cryptographic signature.",
        risks: "Requires active BSA certification of the WhatsApp screenshot. If you forgot to certify this in the forensic suite, the judge will reject it.",
        evidenceRequiredId: 'wa-ss',
        requiresBsaCertificate: true,
        impactOnPressure: -15,
        impactOnJustice: 25,
        impactOnLegal: 30,
        outcomeDialogue: "Excellent. The clerk enters the dual-signed digital certificate. The Defense Counsel's objection is overruled, and the screenshot is admitted."
      },
      {
        id: 'opt-argue-common-law',
        text: "Argue Common Law Circumstances",
        description: "Argue that the extreme cyber-coercion context justifies bypassing strict certification requirements.",
        risks: "Justice G. Singh is a textualist and heavily penalizes procedural deviations.",
        impactOnPressure: 15,
        impactOnJustice: 10,
        impactOnLegal: 5,
        outcomeDialogue: "The judge sighs. 'Procedural lapses do not override statutory requirements. This screenshot weight is zero without certification.'"
      },
      {
        id: 'opt-provoke-scammer',
        text: "Expose CBI Poser Logo Analysis",
        description: "Submit the CBI Logo analysis to prove the technical masquerading was high-grade fraud.",
        risks: "Highlighting the logo without certification is informative but legally weaker.",
        evidenceRequiredId: 'cbi-logo',
        requiresBsaCertificate: false,
        impactOnPressure: 5,
        impactOnJustice: 15,
        impactOnLegal: 15,
        outcomeDialogue: "You submit the CBI Logo showing specific counterfeit pixel structures. While technically uncertified, the forgery is too clear to ignore."
      }
    ]
  },
  {
    id: 'virendra-pressure-check',
    type: 'statement',
    speaker: 'Virendra Sharma',
    text: "They forced me to transfer funds and sign a 'voluntary' declaration over video call, threatening my daughter. Does a coerced digital statement hold?",
    contradictionEvidenceId: 'wa-ss',
    reliabilityReason: 'pressure',
    impactOnJustice: 15,
    narrativeStateNote: "The witness stands."
  },
  {
    id: 'mishra-memory-check',
    type: 'statement',
    speaker: 'Sub-Inspector Mishra',
    text: "In the April 14 raid, we recovered a gold CBI stamp. I recall it centered on their papers. They must have physical stamps.",
    contradictionEvidenceId: 'cbi-logo',
    reliabilityReason: 'memory_error',
    impactOnJustice: 15,
    narrativeStateNote: "The officer is under oath."
  },
  {
    id: 'perjury-check',
    type: 'statement',
    speaker: 'CBI Poser (Transcript)',
    text: "Surveillance logs showed foreign node communication. I verified this from Lucknow cyber barracks on April 14 after meeting the CJI.",
    contradictionEvidenceId: 'newspaper-cji',
    reliabilityReason: 'deception',
    impactOnJustice: 15,
    narrativeStateNote: "Transcript projected."
  },
  {
    id: 'dixit-procedural-check',
    type: 'statement',
    speaker: 'Station Officer Dixit',
    text: "Complaint registration is strictly region-locked. Hazratganj lacks territorial authority over Gomti Nagar. We could not register on April 14.",
    contradictionEvidenceId: 'zero-fir-receipt',
    reliabilityReason: 'procedural_confusion',
    impactOnJustice: 15,
    narrativeStateNote: "The officer is under oath."
  },
  {
    id: 'final-judgment',
    type: 'verdict_moment',
    speaker: 'Justice G. Singh',
    text: "Arguments are concluded. The court will now rule on the admissibility and truth of the exhibits under the strict letters of the BSA. Clerk, prepare the docket.",
    impactOnPressure: 15,
    narrativeStateNote: "The court waits."
  }
];

export const CASE_01: Case = {
  id: 'case-01',
  title: 'The Digital Arrest',
  difficulty: 'Beginner',
  description: 'A retired principal is trapped in a "digital arrest" by scammers posing as CBI. Save him and his savings.',
  lawsTaught: ['BNS 318', 'BNS 308', 'BSA 63'],
  initialNPCs: ['principal-lucknow', 'cbi-poser'],
  evidenceIds: ['wa-ss', 'cbi-logo', 'newspaper-cji', 'zero-fir-receipt'],
  availableBnsSections: ['BNS 318', 'BNS 308'],
  narrativeUrgency: "The victim's bank account has been locked. Every hour delay risks the funds being moved offshore.",
  trialFlow
};

import { Case, TrialStep, AuthenticityStatus, AdmissibilityStatus, EvidenceType } from '../types';

const trialFlow: TrialStep[] = [
  {
    id: 'intro',
    type: 'statement',
    speaker: 'Justice G. Singh',
    text: "We are evaluating digital exhibits in State vs Unknown. Scammers targeted a senior citizen posing as CBI. Prosecution, lay out your case. Remember, this court is bound strictly by the provisions of BSA Sec 63.",
    impactOnPressure: 2,
    narrativeStateNote: "The judge adjusts his spectacles, looking sternly at the counsel table."
  },
  {
    id: 'witness-virendra-opening',
    type: 'statement',
    speaker: 'Virendra Sharma',
    text: "On April 14, they video-called claiming my pension was linked to money laundering. They sent a digital arrest warrant signed 'Regards, Principal Sharma'—my own WhatsApp signature habit! That is how they tricked me into compliance.",
    impactOnPressure: 5,
    narrativeStateNote: "Virendra's voice breaks. He grips a folded handkerchief, staring down at his hands."
  },
  {
    id: 'defense-objection-1',
    type: 'objection',
    speaker: 'Defense Counsel',
    text: "Objection, Your Honor! The prosecution relies on a raw JPEG screenshot of a WhatsApp conversation. Under BSA Sec 63, electronic files are inadmissible without a dual-signature certificate. This screenshot is uncertified and must be excluded!",
    narrativeStateNote: "The defense attorney taps a heavy legal binder on the desk.",
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
    text: "They coerced me to transfer funds and sign a declaration saying it was voluntary. I was terrified for my daughter's safety. Does a statement signed under live video-call coercion hold anyway?",
    contradictionEvidenceId: 'wa-ss',
    reliabilityReason: 'pressure',
    impactOnJustice: 15,
    narrativeStateNote: "Virendra stands trembling, pleading with the court."
  },
  {
    id: 'mishra-memory-check',
    type: 'statement',
    speaker: 'Sub-Inspector Mishra',
    text: "During our high-stress raid on April 14, we recovered a pristine, physical CBI boss stamp. I distinctly recall the golden metal seal centered on the scammers' papers, proving they used high-grade physical stamps.",
    contradictionEvidenceId: 'cbi-logo',
    reliabilityReason: 'memory_error',
    impactOnJustice: 15,
    narrativeStateNote: "The Sub-Inspector sits upright, confident in his visual recollections."
  },
  {
    id: 'perjury-check',
    type: 'statement',
    speaker: 'CBI Poser (Transcript)',
    text: "Surveillance logs show the victim communicating with foreign hostile nodes. I, Inspector Amit Sen, personally verified this from Lucknow cyber barracks on April 14 after meeting the CJI.",
    contradictionEvidenceId: 'newspaper-cji',
    reliabilityReason: 'deception',
    impactOnJustice: 15,
    narrativeStateNote: "The transcript is displayed on the screen."
  },
  {
    id: 'dixit-procedural-check',
    type: 'statement',
    speaker: 'Station Officer Dixit',
    text: "We refused to record the case on April 14 because Hazratganj has no territorial authority over Gomti Nagar. Stations are strictly region-locked, regardless of any digital context.",
    contradictionEvidenceId: 'zero-fir-receipt',
    reliabilityReason: 'procedural_confusion',
    impactOnJustice: 15,
    narrativeStateNote: "Dixit folds his arms, defending his station's delay."
  },
  {
    id: 'final-judgment',
    type: 'verdict_moment',
    speaker: 'Justice G. Singh',
    text: "Arguments are concluded. The court will now rule on the admissibility and truth of the exhibits under the strict letters of the BSA. Clerk, prepare the docket.",
    impactOnPressure: 15,
    narrativeStateNote: "The judge has his pen ready. The courtroom is silent."
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

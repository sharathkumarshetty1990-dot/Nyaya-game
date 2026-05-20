import { Case, TrialStep, AuthenticityStatus, AdmissibilityStatus, EvidenceType } from '../types';

const trialFlow: TrialStep[] = [
  {
    id: 'intro',
    type: 'statement',
    speaker: 'Justice G. Singh',
    text: "We are here to evaluate the admissibility of digital exhibits in the matter of State vs Unknown. Scammers posing as CBI targeted a senior citizen. Prosecution, lay out your case or submit your initial digital exhibits. Remember, my court is bound by the strictures of BSA Sec 63.",
    impactOnPressure: 2,
    narrativeStateNote: "The judge adjusts his gold-rimmed spectacles, looking unimpressed by the procedural sloppiness of the prosecution so far."
  },
  {
    id: 'witness-virendra-opening',
    type: 'statement',
    speaker: 'Virendra Sharma',
    text: "I was sitting in my dusty study, grading old examination sheets on the 14th of April... I am retired, you see, but I still sign every single WhatsApp message to my former pupils with 'Regards, Principal Sharma.' It is a habit of forty years. Those monsters... they used that signature back against me on the video call. They said my old pension fund was linked to money laundering in Lucknow! I... I believed their digital arrest warrant because they signed it 'Regards, Principal Sharma' in mock sympathy.",
    impactOnPressure: 5,
    narrativeStateNote: "Virendra's voice breaks. He tightly grips a crumpled linen handkerchief, staring down at his weathered hands."
  },
  {
    id: 'defense-objection-1',
    type: 'objection',
    speaker: 'Defense Counsel',
    text: "Objection, Your Honor! The prosecution relies heavily on a simple JPEG screenshot of a alleged WhatsApp conversation. Digital files are mere arrangements of pixels, susceptible into infinite forgery! Without a dual-signature certificate as strictly demanded under Bharatiya Sakshya Adhiniyam Sec 63, this 'WhatsApp screenshot' is a digital ghost. It must be summarily excluded!",
    narrativeStateNote: "The Defense Counsel smugly taps a thick legal binder on the mahogany desk, sensing an open-and-shut exclusion.",
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
        outcomeDialogue: "Perfect! The clerk enters the dual-signed digital certificate under Exhibit A-1. The Defense Counsel's smirk vanishes as the judge declares the screenshot authentic and admitted."
      },
      {
        id: 'opt-argue-common-law',
        text: "Argue Common Law Circumstances",
        description: "Argue that the digital arrest context is so extreme that minor procedural gaps should be overlooked to serve the interests of immediate justice.",
        risks: "Increases judicial pressure. Justice G. Singh is a strict textualist and loathes procedural deviations.",
        impactOnPressure: 15,
        impactOnJustice: 10,
        impactOnLegal: 5,
        outcomeDialogue: "The judge sighs deeply. 'Counsel, a tragic story does not rewrite BSA statute. I will temporarily allow you to speak of it, but without a certificate, its court weight remains absolute zero.'"
      },
      {
        id: 'opt-provoke-scammer',
        text: "Expose CBI Poser Logo Analysis",
        description: "Point pointing directly to the CBI Logo frame grab. True, it lacks certificates, but it contains specific pixelated compression artifacts that match scammers' known software.",
        risks: "May trigger panic. Scammer might object, but it proves the technical spoofing was real and specific.",
        evidenceRequiredId: 'cbi-logo',
        requiresBsaCertificate: false,
        impactOnPressure: 5,
        impactOnJustice: 15,
        impactOnLegal: 15,
        outcomeDialogue: "You present the pixel artifacts on the scammer's counterfeit CBI vest. Although uncertified, the visual evidence of forgery is so stark that even the defense counselor remains silent."
      }
    ]
  },
  {
    id: 'perjury-check',
    type: 'statement',
    speaker: 'CBI Poser (Transcript)',
    text: "Mr. Sharma was legally detained because our cyber surveillance logs showed his machine communicating with foreign nodes. I, Inspector Amit Sen, personally verified this from the Lucknow High Court cyber barracks on the morning of April 14th.",
    contradictionEvidenceId: 'newspaper-cji',
    impactOnJustice: 10,
    narrativeStateNote: "The transcript log is projected on the courtroom screen. The digital signature on the warrant reads 'Amit_Sen_CBI'."
  },
  {
    id: 'final-judgment',
    type: 'verdict_moment',
    speaker: 'Justice G. Singh',
    text: "Both sides have laid out their cards. It is time for this court to measure the authenticity of the prosecution's digital assertions against the strict standard of the law. Clerk, tally our confidence docket.",
    impactOnPressure: 15,
    narrativeStateNote: "The judge holds his heavy brass gavel. The silence in the stone-walled room is absolute."
  }
];

export const CASE_01: Case = {
  id: 'case-01',
  title: 'The Digital Arrest',
  difficulty: 'Beginner',
  description: 'A retired principal is trapped in a "digital arrest" by scammers posing as CBI. Save him and his savings.',
  lawsTaught: ['BNS 318', 'BNS 308', 'BSA 63'],
  initialNPCs: ['principal-lucknow', 'cbi-poser'],
  evidenceIds: ['wa-ss', 'cbi-logo', 'newspaper-cji'],
  availableBnsSections: ['BNS 318', 'BNS 308'],
  narrativeUrgency: "The victim's bank account has been locked. Every hour delay risks the funds being moved offshore.",
  trialFlow
};

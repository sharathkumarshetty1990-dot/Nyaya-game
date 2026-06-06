import { motion } from 'motion/react';
import { GameState, Case } from '../../types';
import { Scale, Award, RefreshCcw } from 'lucide-react';

interface VerdictScreenProps {
  gameState: GameState;
  currentCase: Case;
  onReset: () => void;
}

export default function VerdictScreen({ gameState, currentCase, onReset }: VerdictScreenProps) {
  const isJustOutcome = gameState.justiceScore >= 80;
  const isLawfulOutcome = gameState.legalScore >= 80;

  // Process selected reliability interpretations
  const interpretations = gameState.reliabilityInterpretations || {};
  let perfectCount = 0;
  if (interpretations['virendra-pressure-check'] === 'pressure') perfectCount++;
  if (interpretations['mishra-memory-check'] === 'memory_error') perfectCount++;
  if (interpretations['perjury-check'] === 'deception') perfectCount++;
  if (interpretations['dixit-procedural-check'] === 'procedural_confusion') perfectCount++;

  // Count distribution of answers
  const choices = Object.values(interpretations);
  const counts = {
    deception: 0,
    memory_error: 0,
    pressure: 0,
    procedural_confusion: 0
  };
  choices.forEach(val => {
    if (val in counts) {
      counts[val as keyof typeof counts]++;
    }
  });

  // Get dominant interpretation style
  let dominant: string = 'deception';
  let maxCount = -1;
  (Object.keys(counts) as Array<keyof typeof counts>).forEach(key => {
    if (counts[key] > maxCount) {
      maxCount = counts[key];
      dominant = key;
    }
  });

  // Determine profile title and description
  let profileTitle = '';
  let profileDesc = '';

  if (perfectCount === 4) {
    profileTitle = 'Distinguished Forensic Jurist';
    profileDesc = 'You flawlessly analyzed every witness encounter. You correctly identified extortionate pressure under BNS 308, human cognitive reconstruction under stress, malicious digital deception under BSA 63, and modern cross-jurisdictional Zero FIR procedural mandates under BNSS 173. A masterclass of forensic analysis.';
  } else if (dominant === 'deception' && counts.deception >= 2) {
    profileTitle = 'Cynical Forensic Inquisitor';
    profileDesc = 'You favor malice and pre-meditated fraud as explanations. While vital for uncovering deep scams like fake CBI phantoms, you risk misjudging honest cognitive errors (like SI Mishra\'s memory reconstructive bias) as deliberate perjury.';
  } else if (dominant === 'pressure' && counts.pressure >= 2) {
    profileTitle = 'Empathic Reform-Centric Counsel';
    profileDesc = 'You are highly sensitive to duress, threats, and coercion of citizens. While this perfectly diagnoses the victim\'s extreme digital sequestration, you tend to project threats onto purely outdated administrative delays or cognitive gaps.';
  } else if (dominant === 'memory_error' && counts.memory_error >= 2) {
    profileTitle = 'Cognitive Skeptic Analyst';
    profileDesc = 'You prioritize the fragility of human memory and psychological stress. While correct about SI Mishra\'s memory error under raid tension, you risk naively treating active, malicious cyber spoofing and fabricated schedules as mere honest mistakes.';
  } else if (dominant === 'procedural_confusion' && counts.procedural_confusion >= 2) {
    profileTitle = 'Bureaucratic Jurisdictional Textualist';
    profileDesc = 'You analyze cases strictly through administrative frameworks and territorial rules. Highly detail-oriented for resolving local police delays under BNSS 173, you occasionally miss the human elements of direct extortion and fear.';
  } else {
    profileTitle = 'Pragmatic Balanced Advocate';
    profileDesc = 'You evaluated the witnesses individually with a blend of approaches. While you secured the core conviction and protected the victim, your technical-legal reasoning was adaptive rather than unified. Sizable room exists for theoretical refinement.';
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-paper-dark p-4 md:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white border-2 border-line p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] md:shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] relative"
      >
        <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-accent text-white p-3 md:p-4 shadow-lg">
           <Scale size={24} className="md:w-8 md:h-8" />
        </div>

        <div className="text-center mb-8 md:mb-10">
          <div className="col-header border-none opacity-100 font-bold mb-2 tracking-[0.4em] text-accent uppercase text-[9px] md:text-sm">Judicial Verdict</div>
          <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none mb-4">{isLawfulOutcome && isJustOutcome ? 'Justice Delivered' : 'Case Adjourned'}</h2>
          <div className="mono text-[8px] md:text-[11px] opacity-40 font-bold flex items-center justify-center gap-3 md:gap-4">
            <span>DOCKET_CLOSED</span>
            <div className="w-1 h-1 rounded-full bg-line" />
            <span>FINAL_ADJUDICATION_v1.0</span>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
           {/* Score Panels */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-paper-dark p-2 border border-line">
                    <span className="mono text-[8px] md:text-[10px] font-bold opacity-60 uppercase font-sans">Legal Compliance</span>
                    <span className="mono text-sm md:text-base font-bold">{gameState.legalScore}%</span>
                 </div>
                 <div className="score-bar h-1.5">
                    <div className="score-fill font-sans" style={{ width: `${gameState.legalScore}%` }}></div>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-paper-dark p-2 border border-line">
                    <span className="mono text-[8px] md:text-[10px] font-bold opacity-60 uppercase font-sans">Justice Radius</span>
                    <span className="mono text-sm md:text-base font-bold text-accent font-sans">{gameState.justiceScore}%</span>
                 </div>
                 <div className="score-bar h-1.5">
                    <div className="score-fill !bg-accent font-sans" style={{ width: `${gameState.justiceScore}%` }}></div>
                 </div>
              </div>
           </div>

           {/* Forensic Profiling Card */}
           <div className="border-[#5A3D2D]/35 bg-[#FAF6F0] p-5 border-2 text-left space-y-3">
              <div className="flex items-center gap-2 text-stone-500 font-mono text-[9px] uppercase tracking-wider font-bold">
                 <Award size={14} className="text-accent shrink-0" />
                 Forensic Diagnosis Profile
              </div>
              <div>
                 <h4 className="text-sm md:text-base font-serif font-bold text-accent italic leading-tight">
                    {profileTitle}
                 </h4>
                 <p className="text-[11px] leading-relaxed text-stone-600 mt-1">
                    {profileDesc}
                 </p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-stone-200 text-center text-[8px] font-mono">
                 <div>
                    <span className="opacity-50 block uppercase text-[7px]">Deception</span>
                    <span className="font-bold block text-[10px] text-red-700">{counts.deception}</span>
                 </div>
                 <div>
                    <span className="opacity-50 block uppercase text-[7px]">Memory</span>
                    <span className="font-bold block text-[10px] text-amber-700">{counts.memory_error}</span>
                 </div>
                 <div>
                    <span className="opacity-50 block uppercase text-[7px]">Pressure</span>
                    <span className="font-bold block text-[10px] text-blue-700">{counts.pressure}</span>
                 </div>
                 <div>
                    <span className="opacity-50 block uppercase text-[7px]">Confuse</span>
                    <span className="font-bold block text-[10px] text-emerald-700">{counts.procedural_confusion}</span>
                 </div>
              </div>
           </div>

           {/* Summary Text Panel */}
           <div className="p-4 md:p-6 border-2 border-line bg-paper-dark/50 italic serif-italic text-xs md:text-sm leading-relaxed text-center relative shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 md:px-4 mono text-[7px] md:text-[8px] font-bold opacity-40 uppercase tracking-widest border border-line">Verdict Ruling</div>
              "{isJustOutcome && isLawfulOutcome ? 
                "Your meticulous adherence to the BSA certification guidelines combined with correct testimony analysis has placed the case beyond reproach. The digital network has been exposed, and the offender has been remanded to custody." : 
                "The defense successfully argued that the digital assets lacked authenticated, certified chains under BSA Section 63. Justice is compromised due to uncertified legal files, leaving the network active."}"
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={onReset}
            className="btn-primary py-4 text-[10px] md:text-xs shadow-[4px_4px_0px_0px_rgba(20,20,20,0.1)] active:scale-95 transition-transform font-bold tracking-wider"
          >
            NEW_INVESTIGATION
          </button>
          <button 
             onClick={onReset}
             className="btn-accent py-4 text-[10px] md:text-xs shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] uppercase tracking-widest font-bold active:shadow-none active:translate-x-1 active:translate-y-1"
          >
             Reset_System_Console
          </button>
        </div>
      </motion.div>

      <div className="mt-8 md:mt-12 mono text-[8px] md:text-[9px] opacity-20 uppercase tracking-[0.5em] font-bold text-center">
        Nyaya Justice Engine // Build 812.2024
      </div>
    </div>
  );
}

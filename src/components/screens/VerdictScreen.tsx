import { motion } from 'motion/react';
import { GameState, Case } from '../../types';
import { Scale, Gavel, Award, RefreshCcw, Info } from 'lucide-react';

interface VerdictScreenProps {
  gameState: GameState;
  currentCase: Case;
  onReset: () => void;
}

export default function VerdictScreen({ gameState, currentCase, onReset }: VerdictScreenProps) {
  const isJustOutcome = gameState.justiceScore >= 80;
  const isLawfulOutcome = gameState.legalScore >= 80;

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

        <div className="text-center mb-8 md:mb-12">
          <div className="col-header border-none opacity-100 font-bold mb-2 tracking-[0.4em] text-accent uppercase text-[9px] md:text-sm">Judicial Verdict</div>
          <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none mb-4">{isLawfulOutcome && isJustOutcome ? 'Justice Delivered' : 'Case Adjourned'}</h2>
          <div className="mono text-[8px] md:text-[11px] opacity-40 font-bold flex items-center justify-center gap-3 md:gap-4">
            <span>DOCKET_CLOSED</span>
            <div className="w-1 h-1 rounded-full bg-line" />
            <span>FINAL_ADJUDICATION_v1.0</span>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10 mb-8 md:mb-12">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-4">
                 <div className="flex justify-between items-center bg-paper-dark p-2 md:p-3 border border-line">
                    <span className="mono text-[8px] md:text-[10px] font-bold opacity-60 uppercase">Legal Compliance</span>
                    <span className="mono text-base md:text-lg font-bold">{gameState.legalScore}%</span>
                 </div>
                 <div className="score-bar h-1.5 md:h-2">
                    <div className="score-fill" style={{ width: `${gameState.legalScore}%` }}></div>
                 </div>
              </div>
              <div className="space-y-2 md:space-y-4">
                 <div className="flex justify-between items-center bg-paper-dark p-2 md:p-3 border border-line">
                    <span className="mono text-[8px] md:text-[10px] font-bold opacity-60 uppercase">Justice Radius</span>
                    <span className="mono text-base md:text-lg font-bold text-accent">{gameState.justiceScore}%</span>
                 </div>
                 <div className="score-bar h-1.5 md:h-2">
                    <div className="score-fill !bg-accent" style={{ width: `${gameState.justiceScore}%` }}></div>
                 </div>
              </div>
           </div>

           <div className="p-6 md:p-8 border-2 border-line bg-paper-dark/50 italic serif-italic text-sm md:text-lg leading-relaxed text-center relative shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 md:px-4 mono text-[7px] md:text-[9px] font-bold opacity-40 uppercase tracking-widest border border-line">Summary Statement</div>
              "{isJustOutcome && isLawfulOutcome ? 
                "Your meticulous adherence to the BSA certification guidelines ensured the digital exhibits were beyond reproach. The offender has been remanded to custody." : 
                "The defense successfully argued that the digital artifacts lacked non-tempered certification under BSA Sec 63. The case faces institutional collapse."}"
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={onReset}
            className="btn-primary py-4 md:py-5 text-[10px] md:text-xs shadow-[4px_4px_0px_0px_rgba(20,20,20,0.1)] active:scale-95 transition-transform"
          >
            NEW_INVESTIGATION
          </button>
          <button 
            className="btn-accent py-4 md:py-5 text-[10px] md:text-xs shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] uppercase tracking-widest font-bold active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Archive_to_Cloud
          </button>
        </div>
      </motion.div>

      <div className="mt-8 md:mt-12 mono text-[8px] md:text-[9px] opacity-20 uppercase tracking-[0.5em] font-bold text-center">
        Nyaya Justice Engine // Build 812.2024
      </div>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, Scale, AlertTriangle, ShieldCheck, ChevronRight, VolumeX, Volume2 } from 'lucide-react';
import { GameState, TrialStepOption } from '../../../types';

interface JudgePanelProps {
  objectionFlash: boolean;
  selectedOptionOutcome: TrialStepOption | null;
  onConfirmOptionOutcome: () => void;
  gameState: GameState;
  onToggleMute: () => void;
  isMuted: boolean;
}

export default function JudgePanel({
  objectionFlash,
  selectedOptionOutcome,
  onConfirmOptionOutcome,
  gameState,
  onToggleMute,
  isMuted
}: JudgePanelProps) {

  return (
    <>
      {/* High-impact Phoenix Wright Styled Objection Splash Screen */}
      <AnimatePresence>
        {objectionFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/95 pointer-events-none overflow-hidden select-none"
          >
            {/* Pulsing hazard strobe bands */}
            <div className="absolute inset-x-0 h-48 bg-accent rotate-[-6deg] flex items-center justify-center shadow-[0_0_100px_rgba(218,61,44,0.9)] border-y-4 border-white animate-pulse">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)]" />
            </div>
            
            {/* Dramatic popping core text */}
            <motion.div
              initial={{ y: 80, rotate: -6, scale: 0.7 }}
              animate={{ y: 0, rotate: -6, scale: 1.25 }}
              transition={{ type: 'spring', damping: 6, stiffness: 120 }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              {/* Back Drop Shadow */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black text-[65px] md:text-[100px] font-sans font-black tracking-wider uppercase italic select-none">
                OBJECTION!
              </div>
              
              {/* Core Text */}
              <div className="text-[65px] md:text-[100px] font-sans font-black tracking-wider uppercase italic text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] leading-none select-none">
                OBJECTION!
              </div>
              
              {/* Danger Warning Protocol bar */}
              <div className="px-4 py-1.5 bg-black border-2 border-amber-500 text-amber-500 text-[9px] md:text-[11px] uppercase font-mono tracking-[0.25em] font-bold mt-3 rotate-[1deg]">
                ⚡ DOCKET CONTRADICTION DETECTED ⚡
              </div>
            </motion.div>
            
            {/* Laser beams across the view */}
            <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-white/40 shadow-[0_0_20px_#fff] rotate-[25deg]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-white/40 shadow-[0_0_20px_#fff] rotate-[25deg]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Objections Option Outcome Overlay Modal */}
      <AnimatePresence>
        {selectedOptionOutcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#1A0D08] p-8 md:p-10 border-2 border-[#5A3D2D] flex flex-col gap-6 max-w-xl w-full text-left shadow-[20px_20px_0px_0px_rgba(42,24,16,1)] animate-fadeIn"
            >
              <div>
                <span className="mono text-[9px] text-[#A67C52] uppercase font-bold tracking-widest block mb-1">OBJECTION RESOLUTION // DIRECTED SPECTRUM</span>
                <h4 className="text-xl md:text-2xl font-serif font-bold text-amber-100 leading-snug">
                  "{selectedOptionOutcome.text}"
                </h4>
              </div>
              
              <p className="text-xs md:text-sm italic font-medium leading-relaxed text-amber-100/70 bg-[#26150F] p-4 border border-amber-950/40">
                {selectedOptionOutcome.outcomeDialogue}
              </p>

              {/* Reason-focused outcome parameters instead of score numbers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-black/40 border border-[#5A3D2D] flex flex-col justify-between min-h-[70px]">
                  <span className="mono text-[8px] opacity-45 uppercase block mb-1">Bench Alignment</span>
                  <p className={`text-[10px] font-semibold leading-tight ${selectedOptionOutcome.impactOnJustice >= 0 ? 'text-[#6FCF97]' : 'text-red-400'}`}>
                    {selectedOptionOutcome.impactOnJustice >= 0 
                      ? '✓ Material claims accepted by court' 
                      : '✗ Bench rejects framing value'}
                  </p>
                </div>
                <div className="p-3 bg-black/40 border border-[#5A3D2D] flex flex-col justify-between min-h-[70px]">
                  <span className="mono text-[8px] opacity-45 uppercase block mb-1">Statute Compliancy</span>
                  <p className={`text-[10px] font-semibold leading-tight ${selectedOptionOutcome.impactOnLegal >= 0 ? 'text-[#66FCF1]' : 'text-amber-500'}`}>
                    {selectedOptionOutcome.impactOnLegal >= 0 
                      ? '✓ Code compliant statutory briefing' 
                      : '✗ Improper citation / warning logged'}
                  </p>
                </div>
                <div className="p-3 bg-black/40 border border-[#5A3D2D] flex flex-col justify-between min-h-[70px]">
                  <span className="mono text-[8px] opacity-45 uppercase block mb-1">Court Atmosphere</span>
                  <p className={`text-[10px] font-semibold leading-tight ${selectedOptionOutcome.impactOnPressure <= 0 ? 'text-[#6FCF97]' : 'text-red-400'}`}>
                    {selectedOptionOutcome.impactOnPressure <= 0 
                      ? '✓ Judicial irritation minimized' 
                      : '✗ Tension escalation alert'}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={onConfirmOptionOutcome}
                className="bg-accent text-white mono font-bold text-[10px] w-full py-4 border-2 border-[#5A3D2D] hover:bg-black uppercase tracking-[0.2em] transition-all shadow-md active:translate-y-0.5 cursor-pointer"
              >
                RECORD STATEMENT & PROCEED <ChevronRight size={14} className="inline opacity-60" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

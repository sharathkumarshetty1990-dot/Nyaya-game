import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, BookOpen, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GameState, TrialStepOption } from '../../../types';
import { GameEngine } from '../../../game/gameEngine';
import { audioService } from '../../../game/audio';
import Typewriter from '../../Typewriter';

interface TestimonyPanelProps {
  step: number;
  trialStep: any;
  gameState: GameState;
  getDynamicDialogue: (speaker: string, originalText: string) => string;
  onSelectOption: (opt: TrialStepOption) => void;
  onNextStep: () => void;
  showContradiction: boolean;
}

export default function TestimonyPanel({
  step,
  trialStep,
  gameState,
  getDynamicDialogue,
  onSelectOption,
  onNextStep,
  showContradiction
}: TestimonyPanelProps) {

  const renderOptionCard = (opt: TrialStepOption) => {
    const isMissingEvidence = opt.evidenceRequiredId && !gameState.inventory.some(e => e.id === opt.evidenceRequiredId);
    const requiredItem = opt.evidenceRequiredId ? gameState.inventory.find(e => e.id === opt.evidenceRequiredId) : null;
    const isMissingCertification = opt.requiresBsaCertificate && requiredItem && !GameEngine.isEvidenceAdmissible(requiredItem);

    return (
      <button 
        key={opt.id}
        disabled={!!isMissingEvidence}
        onClick={() => onSelectOption(opt)}
        className={`w-full flex flex-col p-4 md:p-5 border-2 text-left relative transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:scale-98 ${
          isMissingEvidence 
            ? 'bg-[#1e130f] border-red-950/40 opacity-40 cursor-not-allowed'
            : isMissingCertification
              ? 'bg-[#2D1B13] border-amber-900/60 hover:border-red-500'
              : 'bg-[#221008] border-[#5A3D2D] hover:border-accent'
        }`}
      >
        <div className="flex justify-between items-start w-full mb-2 gap-2">
           <span className="mono text-[10px] md:text-[11px] font-bold text-amber-100 tracking-tight leading-none">{opt.text}</span>
           {opt.evidenceRequiredId && <BookOpen size={12} className="text-accent shrink-0" />}
        </div>
        <p className="text-[9px] md:text-[10px] text-amber-100/50 leading-tight mb-3 italic">{opt.description}</p>
        
        {isMissingEvidence ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-red-500 uppercase mono bg-red-950/30 px-2 py-1 border border-red-900/40 w-fit">
            <ShieldAlert size={10} />
            LOCKED: Missing required exhibit
          </div>
        ) : isMissingCertification ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-red-400 uppercase mono bg-red-950/30 px-2 py-1 border border-red-900/40 w-fit">
            <AlertTriangle size={10} className="animate-pulse" />
            RISK: Exhibit uncertified under BSA Sec 63
          </div>
        ) : opt.evidenceRequiredId ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-accent-green uppercase mono bg-green-950/20 px-2 py-1 border border-green-950/40 w-fit">
            <ShieldCheck size={10} />
            PROVISION APPROVED: {requiredItem?.name} Ready
          </div>
        ) : null}
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-6 md:mb-8 max-w-5xl mx-auto w-full">
      {/* Speaker Box */}
      <div className="w-full md:w-72 flex flex-row md:flex-col gap-4 shrink-0">
        <div className="w-20 h-20 md:w-full md:aspect-square bg-ink border-2 border-[#5A3D2D] relative overflow-hidden group shadow-2xl">
          <img 
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${trialStep.speaker.replace(/ /g, '_')}`} 
            className={`w-full h-full object-cover grayscale brightness-75 transition-all duration-300 ${gameState.pressureMeter > 60 && trialStep.speaker === 'Virendra Sharma' ? 'scale-105 animate-pulse' : ''}`} 
            alt={trialStep.speaker}
          />
          <div className="absolute inset-0 bg-accent/10 opacity-20" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="hidden md:block h-1 bg-accent w-full opacity-50 shadow-[0_0_10px_rgba(218,61,44,0.5)] transition-all" style={{ opacity: gameState.pressureMeter / 100, transform: `scaleX(${gameState.pressureMeter / 100})` }} />
          <div className="mono text-[8px] bg-[#1A0D08] px-2 py-1 text-amber-100/60 border border-[#5A3D2D] uppercase font-bold tracking-widest leading-none truncate">{trialStep.speaker}</div>
          <p className="text-[8px] md:text-[9px] text-amber-100/40 italic leading-tight max-w-xs">
            {trialStep.speaker === 'Justice G. Singh' ? "Strict constitutional text under old vs new codes." : trialStep.speaker === 'Virendra Sharma' ? '"Regards, Principal Sharma..."' : "Formal statutory arguments."}
          </p>
        </div>
      </div>

      {/* Dialogue Bubble */}
      <div className="flex-1 space-y-6 md:space-y-8 min-w-0 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`bg-[#1A0D08] p-6 md:p-10 relative shadow-[0px_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center border-2 border-[#5A3D2D] ${
              gameState.pressureMeter > 70 ? 'border-red-900/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-shake' : ''
            }`}
          >
            <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-accent text-white p-2 md:p-3 shadow-lg">
               <Gavel size={18} className="md:w-5 md:h-5" />
            </div>
            
            <div className="flex justify-between items-center mb-4 border-b border-[#5A3D2D] pb-2">
               <span className="mono text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">{trialStep.type}</span>
               <div className="mono text-[8px] text-amber-100/20">LOG_ID: {trialStep.id}</div>
            </div>

            {/* Narrative Frame Note */}
            {trialStep.narrativeStateNote && (
              <p className="text-[10px] text-amber-500/60 italic mono mb-4 border-l border-amber-900/60 pl-3">
                 {trialStep.narrativeStateNote}
              </p>
            )}

            <p className={`text-xl md:text-2xl font-serif leading-snug italic tracking-tight text-amber-50 relative ${gameState.pressureMeter > 80 ? 'blur-[0.3px]' : ''}`}>
              "
              <Typewriter 
                key={step} 
                text={getDynamicDialogue(trialStep.speaker, trialStep.text)} 
                speed={10} 
                playTickSound={!audioService.getIsMuted()} 
              />
              "
            </p>

            {trialStep.type === 'objection' && trialStep.options && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {trialStep.options.map(opt => renderOptionCard(opt))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!showContradiction && trialStep.type !== 'objection' && (
          <button 
            type="button"
            onClick={onNextStep}
            className="btn-accent w-full py-4 text-[9px] md:text-[10px] border-2 border-[#5A3D2D] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase font-bold tracking-[0.2em] cursor-pointer"
          >
            ADVANCE TRIAL // STEP_{step}
          </button>
        )}
      </div>
    </div>
  );
}

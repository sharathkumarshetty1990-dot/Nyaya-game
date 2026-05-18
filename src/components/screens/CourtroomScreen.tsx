import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, AuthenticityStatus, AdmissibilityStatus } from '../../types';
import { GameEngine } from '../../game/gameEngine';
import { 
  Gavel, 
  Scale, 
  Clock, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface CourtroomScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentCase: Case;
}

export default function CourtroomScreen({ gameState, setGameState, currentCase }: CourtroomScreenProps) {
  const [step, setStep] = useState(0);
  const [showContradiction, setShowContradiction] = useState(false);
  const [pressureAnim, setPressureAnim] = useState(false);

  const trialStep = currentCase.trialFlow[step];

  const handleNextStep = () => {
    if (step < currentCase.trialFlow.length - 1) {
      const currentStep = currentCase.trialFlow[step];
      
      setGameState(prev => ({
        ...prev,
        pressureMeter: Math.min(100, Math.max(0, prev.pressureMeter + (currentStep.impactOnPressure || 0))),
        justiceScore: Math.min(100, prev.justiceScore + (currentStep.impactOnJustice || 0))
      }));

      if (currentStep.contradictionEvidenceId) {
        setShowContradiction(true);
      } else {
        setStep(step + 1);
      }
    } else {
        const nextPhase = GameEngine.getNextPhase(gameState.phase);
        setGameState(prev => ({ ...prev, phase: nextPhase }));
    }
  };

  const handleContradictionSuccess = () => {
    const contradictionEvidence = gameState.inventory.find(e => e.id === trialStep.contradictionEvidenceId);
    
    if (contradictionEvidence && GameEngine.isEvidenceAdmissible(contradictionEvidence)) {
        setShowContradiction(false);
        setStep(step + 1);
        setGameState(prev => ({ 
            ...prev, 
            justiceScore: prev.justiceScore + 20,
            pressureMeter: Math.max(0, prev.pressureMeter - 10)
        }));
    } else {
        setGameState(prev => ({ ...prev, pressureMeter: prev.pressureMeter + 15 }));
        setPressureAnim(true);
        setTimeout(() => setPressureAnim(false), 500);
    }
  };

  const renderOption = (opt: string) => {
    return (
      <button 
        key={opt}
        onClick={() => {
            setGameState(prev => ({ ...prev, legalScore: prev.legalScore + 5 }));
            setStep(step + 1);
        }}
        className="btn-legal bg-[#2A1810] text-amber-100/60 border-[#5A3D2D] hover:border-accent hover:text-white py-3 md:py-4 text-[10px] uppercase font-bold tracking-widest active:scale-95 transition-transform"
      >
        {opt}
      </button>
    );
  };

  return (
    <div className={`flex-1 flex flex-col bg-[#2A1810] overflow-hidden transition-colors duration-500 ${pressureAnim ? 'bg-red-900/20' : ''}`}>
      {/* Courtroom Header */}
      <div className="h-14 md:h-16 border-b-2 border-[#1A0D08] bg-[#3D251C] flex items-center px-4 md:px-8 justify-between shrink-0 text-amber-50 shadow-lg">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-accent lg:block hidden" />
          <div>
            <h2 className="mono font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase">High Court // Lucknow</h2>
            <span className="mono text-[7px] md:text-[10px] opacity-40 italic font-bold">STATE_VS_UNKNOWN // BNSS_PROTOCOL</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-4">
              <span className="mono text-[8px] opacity-40 uppercase">Tension</span>
              <div className="w-24 h-1 bg-[#1A0D08] mt-1 border border-[#5A3D2D]">
                 <div className="h-full bg-accent transition-all duration-700" style={{ width: `${gameState.pressureMeter}%` }} />
              </div>
           </div>
           <div className="status-chip bg-[#1A0D08] text-amber-200 border-[#5A3D2D] text-[8px] tracking-widest uppercase">In Session</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        {/* Trial Area */}
        <main className="flex-1 flex flex-col p-4 md:p-12 bg-[#2A1810] min-h-0 overflow-y-auto">
           <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-12 items-start mb-6 md:mb-12 max-w-5xl mx-auto w-full">
             
             {/* Speaker Box */}
             <div className="w-full md:w-80 flex flex-row md:flex-col gap-4 shrink-0">
               <div className="w-24 h-24 md:w-full md:aspect-square bg-ink border-2 border-[#5A3D2D] relative overflow-hidden group shadow-2xl">
                  <img 
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${trialStep.speaker.replace(/ /g, '_')}`} 
                    className="w-full h-full object-cover grayscale brightness-75" 
                    alt={trialStep.speaker}
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-20" />
               </div>
               <div className="flex-1 flex flex-col justify-center gap-2">
                  <div className="hidden md:block h-1.5 bg-accent w-full opacity-50 shadow-[0_0_10px_rgba(218,61,44,0.5)] transition-opacity" style={{ opacity: gameState.pressureMeter / 100 }} />
                  <div className="mono text-[8px] bg-[#1A0D08] px-2 py-1 text-amber-100/60 border border-[#5A3D2D] uppercase font-bold tracking-widest leading-none truncate">{trialStep.speaker}</div>
                  <p className="text-[9px] md:text-[11px] text-amber-100/40 italic leading-tight">
                    "Truth is the daughter of time, not of authority."
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
                    className="bg-[#1A0D08] p-8 md:p-12 relative shadow-[0px_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center border-2 border-[#5A3D2D]"
                  >
                    <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-accent text-white p-2 md:p-3 shadow-lg">
                       <Gavel size={20} className="md:w-6 md:h-6" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-[#5A3D2D] pb-2">
                       <span className="mono text-[10px] md:text-[11px] font-bold text-amber-500 uppercase tracking-[0.3em]">{trialStep.type}</span>
                       <div className="mono text-[8px] md:text-[9px] text-amber-100/20">LOG_ID: {trialStep.id}</div>
                    </div>

                    <p className={`text-2xl md:text-3xl font-serif leading-snug italic tracking-tight text-amber-50 ${gameState.pressureMeter > 80 ? 'blur-[0.5px]' : ''}`}>
                      "{trialStep.text}"
                    </p>

                    {trialStep.type === 'objection' && trialStep.options && (
                        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {trialStep.options.map(opt => renderOption(opt))}
                        </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!showContradiction && trialStep.type !== 'objection' && (
                    <button 
                        onClick={handleNextStep}
                        className="btn-accent w-full py-4 md:py-6 text-[9px] md:text-[11px] border-2 border-[#5A3D2D] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase font-bold tracking-[0.2em]"
                    >
                        CONTINUE // STEP_{step}
                    </button>
                )}
             </div>
           </div>

           {/* Admissible Exhibits */}
           <div className="mt-4">
              <div className="col-header border-amber-900/40 text-amber-500 text-[9px] mb-3 uppercase tracking-widest">Admissible Exhibits</div>
              <div className="flex gap-3 overflow-x-auto pb-4 touch-pan-x">
                {gameState.inventory.map(item => (
                  <div 
                     key={item.id}
                     className={`p-3 border shrink-0 w-32 md:w-40 transition-all ${GameEngine.isEvidenceAdmissible(item) ? 'bg-[#1A0D08] border-accent/50' : 'opacity-20 grayscale border-[#5A3D2D]'}`}
                  >
                    <div className="mono text-[8px] font-bold text-amber-100/60 truncate mb-1">{item.name}</div>
                    <div className="flex justify-between items-center">
                       <span className="mono text-[7px] text-accent font-bold">{GameEngine.isEvidenceAdmissible(item) ? 'ADMITTED' : 'EXCLUDED'}</span>
                       {item.hasBSACertificate && <ShieldCheck size={10} className="text-accent" />}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </main>

        {/* Action Sidebar - Desktop only */}
        <aside className="hidden md:flex w-96 border-l-2 border-[#1A0D08] bg-[#1A0D08] p-6 flex-col overflow-y-auto shrink-0">
            <div className="col-header border-amber-900/40 text-amber-500 tracking-widest font-bold mb-6 text-[10px] uppercase">Trial Docket</div>

            <div className="grid grid-cols-1 gap-3">
                {gameState.inventory.map(item => (
                    <div 
                        key={item.id}
                        className={`p-4 border-2 transition-all cursor-default ${GameEngine.isEvidenceAdmissible(item) ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.2)]' : 'bg-[#1A0D08]/50 border-[#5A3D2D] opacity-60'}`}
                    >
                        <div className="flex justify-between mb-2">
                           <span className="mono text-[10px] font-bold text-amber-50 tracking-tighter">{item.name}</span>
                           <span className="mono text-[8px] opacity-40 uppercase">{item.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${GameEngine.isEvidenceAdmissible(item) ? 'bg-accent shadow-[0_0_10px_rgba(218,61,44,1)]' : 'bg-[#5A3D2D]'}`} />
                           <span className="mono text-[8px] text-amber-100/40 font-bold uppercase">{item.authenticity} // {item.admissibility}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 p-4 bg-[#2A1810] border border-[#5A3D2D] space-y-4">
               <div className="mono text-[9px] text-amber-500 font-bold uppercase tracking-widest">Judicial Notes</div>
               <p className="text-[10px] text-amber-100/40 leading-relaxed italic">
                 Court confidence is currently {(gameState.inventory.reduce((acc, curr) => acc + curr.courtConfidence, 0) / (gameState.inventory.length || 1)).toFixed(0)}%. 
                 Presentation of uncertified digital artifacts will provoke summary dismissal.
               </p>
            </div>
        </aside>

        {/* Global Contradiction Alert Flash */}
        <AnimatePresence>
            {showContradiction && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-accent/90 backdrop-blur-md flex items-center justify-center p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-8 md:p-12 border-4 border-accent-dark flex flex-col items-center gap-8 shadow-[20px_20px_0px_0px_rgba(42,24,16,1)] max-w-sm w-full"
                    >
                        <AlertCircle size={64} className="text-accent animate-bounce" />
                        <div className="text-center">
                           <h4 className="mono font-bold text-ink text-3xl leading-none mb-3 uppercase tracking-tighter">
                             Perjury_Detect
                           </h4>
                           <p className="text-xs text-ink/60 mono italic font-medium">The witness's claim has been flagged by judicial logic. Present contradicting exhibit to proceed.</p>
                        </div>
                        <button 
                            onClick={handleContradictionSuccess}
                            className="bg-accent text-white mono font-bold text-xs w-full py-5 border-2 border-accent hover:bg-ink hover:text-white transition-all uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(42,24,16,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                        >
                            Expose_Inconsistency
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="h-10 md:h-12 border-t-2 border-[#1A0D08] bg-[#1A0D08] px-4 md:px-12 flex items-center justify-between mono text-[8px] md:text-[10px] text-amber-100/20 font-bold relative z-10 uppercase tracking-widest shrink-0">
          <div className="flex gap-4 md:gap-6 truncate">
              <span className="truncate">STATE vs UNKNOWN</span>
              <span className="opacity-40 italic hidden sm:inline">BNSS_SESSION_{gameState.currentCaseId}</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             <div className="flex items-center gap-1.5 md:gap-2">
               <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent animate-pulse" />
               <span className="hidden sm:inline">REC_ON</span>
             </div>
             <Clock size={10} className="md:w-3 md:h-3" />
             <span>SESSION_{gameState.phase}</span>
          </div>
      </div>
    </div>
  );
}

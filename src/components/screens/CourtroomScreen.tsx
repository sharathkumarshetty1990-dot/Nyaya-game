import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, GamePhase, EvidenceStatus } from '../../types';
import { 
  Gavel, 
  Scale, 
  AlertCircle, 
  MessageCircle, 
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CourtroomScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentCase: Case;
}

export default function CourtroomScreen({ gameState, setGameState, currentCase }: CourtroomScreenProps) {
  const [step, setStep] = useState(0);
  const [showContradiction, setShowContradiction] = useState(false);
  const [objectionTarget, setObjectionTarget] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // Simulation parameters for Case 01
  const courtroomFlow = [
    { type: 'judge', text: "We are here for the matter of the Digital Arrest. Prosecution, present your opening." },
    { type: 'lawyer', text: "Your Honor, the victim was coherent. The callers used CBI insignia and symbols of the Supreme Court." },
    { type: 'witness', text: "I was on that call for 3 hours. The man in the background was a judge. He looked exactly like the Chief Justice." },
    { type: 'contradiction', text: "WAIT! The witness claims they saw the judge at 14:00. Check your evidence metadata." },
    { type: 'objection', text: "Prosecution: 'And surely you were terrified of the consequences, right?'", options: ['LEADING', 'HEARSAY', 'IRRELEVANT'] }
  ];

  const handleNextStep = () => {
    if (step < courtroomFlow.length - 1) {
      setStep(step + 1);
      if (courtroomFlow[step + 1].type === 'contradiction') {
        setShowContradiction(true);
      }
    } else {
        setGameState(prev => ({ ...prev, phase: GamePhase.VERDICT }));
    }
  };

  const handleContradictionSuccess = () => {
    // Check if player has the correct news paper or verified evidence
    const hasNewspaper = gameState.inventory.some(e => e.id === 'newspaper-cji');
    if (hasNewspaper) {
      setGameState(prev => ({ ...prev, justiceScore: prev.justiceScore + 20, legalScore: prev.legalScore + 10 }));
      setShowContradiction(false);
      handleNextStep();
    } else {
      // Penalty for no evidence
      setShowContradiction(false);
      handleNextStep();
    }
  };

  const currentDialogue = courtroomFlow[step];

  return (
    <div className="flex-1 flex flex-col bg-[#2A1810] overflow-hidden">
      {/* Courtroom Header - Compact */}
      <div className="h-14 md:h-16 border-b-2 border-[#1A0D08] bg-[#3D251C] flex items-center px-4 md:px-8 justify-between shrink-0 text-amber-50 shadow-lg">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-accent lg:block hidden" />
          <div>
            <h2 className="mono font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase">High Court // Lucknow</h2>
            <span className="mono text-[7px] md:text-[10px] opacity-40 italic font-bold">BSA_ADMISSIBILITY_PROTOCOL</span>
          </div>
        </div>
        <div className="status-chip bg-[#1A0D08] text-amber-200 border-[#5A3D2D] text-[8px] tracking-widest uppercase">In Session</div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        {/* Trial Area */}
        <main className="flex-1 flex flex-col p-4 md:p-12 bg-[#2A1810] min-h-0 overflow-y-auto">
           <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-12 items-start mb-6 md:mb-12 max-w-5xl mx-auto w-full">
             
             {/* Witness Box - Stacked or Top-aligned */}
             <div className="w-full md:w-80 flex flex-row md:flex-col gap-4 shrink-0">
               <div className="w-24 h-24 md:w-full md:aspect-square bg-ink border-2 border-[#5A3D2D] relative overflow-hidden group shadow-2xl">
                  <img 
                    src="https://api.dicebear.com/7.x/pixel-art/svg?seed=sharma" 
                    className="w-full h-full object-cover grayscale brightness-75" 
                    alt="Witness"
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-20" />
               </div>
               <div className="flex-1 flex flex-col justify-center gap-2">
                  <div className="hidden md:block h-1.5 bg-accent w-full opacity-50 shadow-[0_0_10px_rgba(218,61,44,0.5)]" />
                  <div className="mono text-[8px] bg-[#1A0D08] px-2 py-1 text-amber-100/60 border border-[#5A3D2D] uppercase font-bold tracking-widest leading-none">Victim_Testimony</div>
                  <p className="text-[9px] md:text-[11px] text-amber-100/40 italic leading-tight">
                    "Ground your case in forensics (BSA Sec 61)."
                  </p>
               </div>
             </div>

             {/* Dialogue Bubble - Primary focus */}
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
                       <span className="mono text-[10px] md:text-[11px] font-bold text-amber-500 uppercase tracking-[0.3em]">{currentDialogue.type}</span>
                       <div className="mono text-[8px] md:text-[9px] text-amber-100/20">#LKO-812</div>
                    </div>

                    <p className="text-2xl md:text-4xl font-serif leading-snug italic tracking-tight text-amber-50">
                      "{currentDialogue.text}"
                    </p>

                    {currentDialogue.type === 'objection' && (
                        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {currentDialogue.options?.map(opt => (
                               <button 
                                key={opt}
                                onClick={() => {
                                    setStep(step + 1);
                                    setGameState(prev => ({ ...prev, legalScore: prev.legalScore + 10 }));
                                }}
                                className="btn-legal bg-[#2A1810] text-amber-100/60 border-[#5A3D2D] hover:border-accent hover:text-white py-3 md:py-4 text-[10px] uppercase font-bold tracking-widest active:scale-95 transition-transform"
                               >
                                {opt}
                               </button>
                           ))}
                        </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!showContradiction && currentDialogue.type !== 'objection' && (
                    <button 
                        onClick={handleNextStep}
                        className="btn-accent w-full py-4 md:py-6 text-[9px] md:text-[11px] border-2 border-[#5A3D2D] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase font-bold tracking-[0.2em]"
                    >
                        CONTINUE // STEP_{step}
                    </button>
                )}
             </div>
           </div>

           {/* Mobile Exhibits List - Scrollable sideways or small grid */}
           <div className="md:hidden mt-4">
              <div className="col-header border-amber-900/40 text-amber-500 text-[9px] mb-3 uppercase tracking-widest">Active Exhibits</div>
              <div className="flex gap-3 overflow-x-auto pb-4 touch-pan-x">
                {gameState.inventory.map(item => (
                  <div 
                     key={item.id}
                     className={`p-3 border shrink-0 w-32 md:w-auto transition-all ${item.status === EvidenceStatus.CERTIFIED ? 'bg-[#1A0D08] border-[#5A3D2D]' : 'opacity-20 pointer-events-none grayscale'}`}
                  >
                    <div className="mono text-[8px] font-bold text-amber-100/60 truncate mb-1">{item.name}</div>
                    <div className="flex justify-between items-center">
                       <span className="mono text-[7px] text-accent font-bold">{item.status === EvidenceStatus.CERTIFIED ? 'VERIFIED' : 'PENDING'}</span>
                       {item.hasBSACertificate && <ShieldCheck size={10} className="text-accent" />}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </main>

        {/* Action Sidebar - Desktop only or collapsed on mobile */}
        <aside className="hidden md:flex w-96 border-l-2 border-[#1A0D08] bg-[#1A0D08] p-6 flex-col overflow-y-auto shrink-0">
            <div className="col-header border-amber-900/40 text-amber-500 tracking-widest font-bold mb-6 text-[10px] uppercase">Court Exhibits</div>

            <div className="grid grid-cols-1 gap-3">
                {gameState.inventory.map(item => (
                    <div 
                        key={item.id}
                        className={`p-4 border transition-all ${item.status === EvidenceStatus.CERTIFIED ? 'bg-[#2A1810] border-[#5A3D2D] opacity-100' : 'bg-transparent border-[#5A3D2D]/20 opacity-30 pointer-events-none'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                           <span className="mono text-[10px] font-bold text-amber-100/80">{item.name}</span>
                           <ShieldCheck size={14} className={item.hasBSACertificate ? 'text-accent' : 'text-amber-900'} />
                        </div>
                        <div className="flex gap-2">
                           <span className="mono text-[8px] bg-[#1A0D08] px-2 py-0.5 text-amber-100/40 uppercase border border-[#5A3D2D]">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>

        {/* Global Contradiction Alert Flash - Fullscreen on mobile */}
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
                           <p className="text-xs text-ink/60 mono italic font-medium">Testimony conflict observed. Cross-reference exhibits now.</p>
                        </div>
                        <button 
                            onClick={handleContradictionSuccess}
                            className="bg-accent text-white mono font-bold text-xs w-full py-5 border-2 border-accent hover:bg-ink hover:text-white transition-all uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(42,24,16,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                        >
                            Expose_Contradiction
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Footer Court Info - Compact for mobile */}
      <div className="h-10 md:h-12 border-t-2 border-[#1A0D08] bg-[#1A0D08] px-4 md:px-12 flex items-center justify-between mono text-[8px] md:text-[10px] text-amber-100/20 font-bold relative z-10 uppercase tracking-widest shrink-0">
          <div className="flex gap-4 md:gap-6 truncate">
              <span className="truncate">STATE OF UP VS UNKNOWN</span>
              <span className="opacity-40 italic hidden sm:inline">BNSS_A/24</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             <div className="flex items-center gap-1.5 md:gap-2">
               <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent animate-pulse" />
               <span className="hidden sm:inline">REC_ON</span>
             </div>
             <Clock size={10} className="md:w-3 md:h-3" />
             <span>17:00_EDT</span>
          </div>
      </div>
    </div>
  );
}

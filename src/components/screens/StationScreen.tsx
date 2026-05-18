import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, GamePhase } from '../../types';
import { 
  Building2, 
  UserCircle2, 
  MessageSquare, 
  Scale, 
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';

interface StationScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentCase: Case;
}

export default function StationScreen({ gameState, setGameState, currentCase }: StationScreenProps) {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fricitionStep, setFrictionStep] = useState(0); // For handling SHO refusal

  const handleFIRSubmission = () => {
    let bonus = 0;
    // Simple grading logic from GDD
    if (currentCase.id === 'case-01') {
       if (selectedSection === 'BNS 318') bonus = 15;
       else if (selectedSection === 'BNS 308') bonus = 5; // Partial
    }

    setGameState(prev => ({
      ...prev,
      legalScore: prev.legalScore + bonus,
      // In a real game we'd add justice score based on dialogue choices too
    }));
    setIsSubmitted(true);
  };

  const nextPhase = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.COURTROOM }));
  };

  return (
    <div className="flex-1 flex flex-col bg-paper overflow-hidden">
      {/* Station Header - Compact */}
      <div className="h-14 md:h-16 border-b-2 border-line bg-white flex items-center px-4 md:px-8 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-accent" />
          <div>
            <h2 className="mono font-bold text-[10px] md:text-sm tracking-widest uppercase">Hazratganj Station // 0812</h2>
            <span className="mono text-[7px] md:text-[10px] opacity-40 italic font-bold">BNSS_SEC_173_ACTIVE</span>
          </div>
        </div>
        <div className="status-chip hidden sm:flex bg-ink text-paper text-[8px]">Live Transmission</div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto overflow-x-hidden md:overflow-hidden">
        {/* Dialogue View */}
        <main className="flex-1 p-4 md:p-12 flex flex-col bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-12 items-start">
            
            {/* NPC Data Panel - Compact for mobile */}
            <div className="w-full md:w-[300px] flex flex-row md:flex-col gap-4">
              <div className="w-20 h-20 md:w-full md:aspect-square bg-ink border border-line shrink-0 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=sho" 
                  alt="SHO" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-accent/10" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="mono font-bold text-base md:text-lg tracking-tighter">SHO Bajpai</h3>
                <span className="mono text-[8px] md:text-[10px] opacity-50 block mb-2 md:mb-4 border-b border-line/20 pb-1 italic uppercase font-bold tracking-widest">Station Officer</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="data-row-inline flex gap-2">
                    <span className="mono text-[8px] opacity-40 uppercase font-bold">Posture:</span>
                    <span className="mono text-[8px] font-bold">DEFENSIVE</span>
                  </div>
                  <div className="data-row-inline flex gap-2">
                    <span className="mono text-[8px] opacity-40 uppercase font-bold">Authority:</span>
                    <span className="mono text-[8px] font-bold">TIER 2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 flex flex-col gap-4 md:gap-8 w-full">
              <div className="col-header tracking-[0.2em] text-[9px] mb-0 uppercase">Live Transcript</div>
              
              <div className="bg-paper-dark border-2 border-line p-6 md:p-10 relative shadow-[6px_6px_0px_0px_rgba(20,20,20,0.05)]">
                <div className="absolute -top-3 right-4 md:right-6 bg-ink text-paper px-2 py-0.5 mono text-[8px] font-bold">
                  SECURE_REC
                </div>
                
                {!isSubmitted ? (
                  <div className="space-y-6 md:space-y-8">
                    {fricitionStep === 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xl md:text-3xl font-serif italic leading-snug tracking-tight text-ink/90">
                          "This is a digital matter. Our station doesn't have the capacity for international calls. You're better off in New Delhi."
                        </p>
                        <div className="mt-8 md:mt-12 space-y-3">
                          <button 
                            onClick={() => setFrictionStep(1)}
                            className="btn-accent w-full py-4 justify-between group active:scale-[0.98] transition-transform"
                          >
                            <span className="text-[10px] tracking-widest font-bold">INVOKE_SEC_173_ZERO_FIR</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {fricitionStep === 1 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xl md:text-3xl font-serif italic leading-snug tracking-tight text-accent">
                          "Fine. I'll take it under Zero FIR procedure. But choose carefully... if it's bailable, he's out in hours."
                        </p>
                        
                        <div className="mt-8 md:mt-12 space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentCase.availableBnsSections.map(section => (
                              <button 
                                key={section}
                                onClick={() => setSelectedSection(section)}
                                className={`btn-legal py-4 md:py-6 transition-all border-2 text-xs md:text-sm font-bold mono active:scale-[0.98] ${selectedSection === section ? 'bg-ink text-paper border-accent' : 'bg-white'}`}
                              >
                                {section}
                              </button>
                            ))}
                          </div>
                          <button 
                            disabled={!selectedSection}
                            onClick={handleFIRSubmission}
                            className="btn-accent w-full py-5 md:py-6 mt-4 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] text-[10px] tracking-widest font-bold uppercase active:shadow-none active:translate-x-1 active:translate-y-1"
                          >
                            FILE_OFFICIAL_CHARGESHEET
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 md:py-12 flex flex-col items-center">
                    <CheckCircle size={48} className="text-accent-green mb-4 md:mb-6" />
                    <h4 className="text-3xl md:text-5xl font-serif italic mb-4 tracking-tighter">Docket Secured.</h4>
                    <p className="mono font-bold text-[10px] md:text-sm bg-ink text-paper px-4 py-1.5 mb-8 md:mb-12">REF: #NF-812-{gameState.legalScore}</p>
                    
                    <button 
                      onClick={nextPhase}
                      className="btn-primary px-8 md:px-12 py-4 md:py-5 text-[10px] tracking-widest"
                    >
                      PROCEED_TO_TRIAL
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Intel - Becomes stacked on mobile */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l-2 border-line p-6 flex flex-col bg-paper-dark shrink-0">
           <div className="col-header tracking-widest text-[9px] mb-4 uppercase">Station Protocol</div>
           
           <div className="space-y-6 md:space-y-8">
             <div className="p-4 bg-white border border-line shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
               <div className="mono text-[8px] font-bold text-accent mb-2 uppercase tracking-widest">Procedural Risk</div>
               <p className="text-[10px] leading-relaxed italic opacity-80">
                 BNS 318 is bailable; BNS 308 is non-bailable. The choice dictates the pressure exerted on the accused.
               </p>
             </div>

             <div className="space-y-3">
               <div className="col-header border-none opacity-100 font-bold mb-1 text-[9px] uppercase">Section_Ref</div>
               <div className="p-3 md:p-4 border border-line bg-white/50 space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-bold border-b border-line/10 pb-1 mono">
                   <span>BNS 318</span>
                   <span className="text-accent-green text-[8px]">BAILABLE</span>
                 </div>
                 <p className="text-[9px] opacity-60 leading-tight">Cheating by Personation. Identity theft.</p>
               </div>
               <div className="p-3 md:p-4 border border-line bg-white/50 space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-bold border-b border-line/10 pb-1 mono">
                   <span>BNS 308</span>
                   <span className="text-accent text-[8px]">NON-BAILABLE</span>
                 </div>
                 <p className="text-[9px] opacity-60 leading-tight">Extortion through coercion and fear.</p>
               </div>
             </div>
           </div>

           <div className="mt-8 md:mt-auto pt-4 md:pt-6 border-t border-line/20 md:border-none">
              <div className="mono text-[8px] opacity-40 italic lowercase leading-tight">
                * ZERO FIR procedure (BNSS 173) mandates registration regardless of station jurisdiction.
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}


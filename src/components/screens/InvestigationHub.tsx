import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, Evidence, GamePhase, EvidenceStatus, EvidenceType } from '../../types';
import { INITIAL_EVIDENCE } from '../../constants';
import { 
  Scale,
  FileSearch, 
  User, 
  MessageSquare, 
  Fingerprint, 
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  FileCheck,
  Search
} from 'lucide-react';

interface InvestigationHubProps {
  gameState: GameState;
  currentCase: Case;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function InvestigationHub({ gameState, currentCase, setGameState }: InvestigationHubProps) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const collectEvidence = (evidenceId: string) => {
    if (gameState.actionTokens <= 0) return;
    if (gameState.inventory.some(e => e.id === evidenceId)) return;

    const evidence = INITIAL_EVIDENCE[evidenceId];
    if (!evidence) return;

    setGameState(prev => ({
      ...prev,
      actionTokens: prev.actionTokens - 1,
      inventory: [...prev.inventory, evidence]
    }));
  };

  const nextPhase = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.VERIFICATION }));
  };

  const selectedEvidence = gameState.inventory.find(e => e.id === selectedEvidenceId);

  return (
    <div className="flex-1 flex flex-col bg-paper relative overflow-hidden">
      {/* Top Stats Bar - Responsive */}
      <div className="bg-white border-b border-line px-4 py-3 flex justify-between items-center shrink-0 z-10 shadow-sm">
         <div className="flex flex-col">
            <span className="mono text-[9px] opacity-40 font-bold uppercase leading-none mb-1 tracking-widest">Action Reserve</span>
            <div className="flex items-center gap-2">
               <div className="flex gap-1">
                 {[...Array(currentCase.maxActions)].map((_, i) => (
                   <div key={i} className={`h-3 w-1.5 border border-line/20 ${i < gameState.actionTokens ? 'bg-accent' : 'bg-paper-dark'}`} />
                 ))}
               </div>
               <span className="mono font-bold text-xs">{gameState.actionTokens}/{currentCase.maxActions}</span>
            </div>
         </div>
         <button 
           onClick={nextPhase}
           className="btn-accent py-2 px-6 text-[10px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center gap-2 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
         >
           NEXT_PHASE <ChevronRight size={14} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col p-4 gap-6 pb-20">
          
          {/* CASE INTEL - Compact for mobile */}
          <section className="bg-paper-dark border-2 border-line p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,0.1)]">
            <div className="col-header tracking-widest text-[9px] mb-2 uppercase">Subject Intelligence</div>
            <h2 className="text-2xl font-serif italic tracking-tighter leading-tight mb-2">{currentCase.title}</h2>
            <p className="text-[12px] opacity-70 leading-relaxed font-medium serif-italic line-clamp-3">
              {currentCase.description}
            </p>
          </section>

          {/* SCENE ANALYSIS */}
          <section className="space-y-3">
            <div className="col-header uppercase tracking-[0.2em] text-[9px] mb-0">Scene Analysis // Lucknow Residence</div>
            <div className="border-2 border-line p-1 bg-paper-dark relative group overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
               <img 
                  src="https://picsum.photos/seed/room-interior/1200/800" 
                  alt="Scene" 
                  className="w-full h-48 md:h-64 object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {currentCase.id === 'case-01' && (
                  <>
                    <SceneHotspot 
                      title="UNCLE'S PHONE" 
                      top="60%" left="45%" 
                      onClick={() => collectEvidence('wa-ss')}
                      isCollected={gameState.inventory.some(e => e.id === 'wa-ss')}
                    />
                    <SceneHotspot 
                      title="NEWSPAPER" 
                      top="55%" left="65%" 
                      onClick={() => collectEvidence('newspaper-cji')}
                      isCollected={gameState.inventory.some(e => e.id === 'newspaper-cji')}
                    />
                  </>
                )}
            </div>
          </section>

          {/* EVIDENCE GRID */}
          <section className="space-y-4">
            <div className="flex justify-between items-end border-b border-line pb-1">
               <div className="col-header border-none p-0 mb-0 uppercase tracking-[0.2em] text-[9px]">Evidence Vault</div>
               <span className="mono text-[9px] opacity-40 uppercase font-bold">{gameState.inventory.length} SECURED</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {gameState.inventory.length === 0 ? (
                <div className="col-span-2 h-32 border-2 border-dashed border-line bg-paper-dark/50 flex flex-col items-center justify-center opacity-30 text-center p-4">
                   <FileSearch size={24} className="mb-2" />
                   <span className="mono text-[8px] italic uppercase tracking-widest">Awaiting_Crime_Scene_Acquisition</span>
                </div>
              ) : (
                gameState.inventory.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    className={`border-2 cursor-pointer transition-all p-2 flex flex-col gap-2 group relative shadow-[4px_4px_0px_0px_rgba(20,20,20,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${selectedEvidenceId === item.id ? 'border-accent bg-accent/5' : 'border-line bg-white'}`}
                  >
                    <div className="aspect-square sm:aspect-video bg-paper-dark border border-line/10 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                       <Fingerprint className="opacity-10 absolute pointer-events-none" size={40} />
                       <span className="mono text-[7px] md:text-[8px] opacity-30 text-center relative z-10">[{item.id}]</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="mono font-bold text-[9px] md:text-[10px] truncate leading-none">{item.name}</span>
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] opacity-40 font-bold uppercase">{item.type}</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* METRICS - Bottom aligned on mobile */}
          <section className="mt-4 p-5 bg-paper-dark border-2 border-line space-y-6">
            <div className="col-header border-none p-0 mb-0 text-[9px]">Performance Metrics</div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between font-mono text-[9px] mb-1 font-bold">
                    <span className="opacity-40 uppercase tracking-widest">Legal Compliance</span>
                    <span>{gameState.legalScore}%</span>
                  </div>
                  <div className="score-bar h-1.5">
                    <div className="score-fill" style={{ width: `${gameState.legalScore}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between font-mono text-[9px] mb-1 font-bold">
                    <span className="opacity-40 uppercase tracking-widest">Justice Impact</span>
                    <span className="text-accent">{gameState.justiceScore}%</span>
                  </div>
                  <div className="score-bar h-1.5">
                    <div className="score-fill !bg-accent" style={{ width: `${gameState.justiceScore}%` }}></div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* Selection Overlay - Fully Mobile Responsive */}
      <AnimatePresence>
        {selectedEvidenceId && selectedEvidence && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/95 backdrop-blur-md z-[100] flex flex-col p-6 overflow-y-auto"
          >
             <div className="max-w-2xl w-full mx-auto my-auto bg-white border-2 border-line p-8 relative flex flex-col gap-8 shadow-[12px_12px_0px_0px_rgba(218,61,44,1)]">
                <button 
                  onClick={() => setSelectedEvidenceId(null)}
                  className="absolute -top-4 -right-4 bg-accent text-white w-10 h-10 flex items-center justify-center border-2 border-line active:scale-95 transition-transform font-bold"
                >
                  ✕
                </button>
                
                <div className="flex flex-col gap-6">
                  <div className="space-y-4">
                     <div className="col-header text-[9px]">Evidence Inspection // ID: {selectedEvidence.id}</div>
                     <h3 className="text-3xl md:text-5xl font-serif italic mb-2 tracking-tighter leading-none">{selectedEvidence.name}</h3>
                     <p className="text-sm md:text-base leading-relaxed opacity-70 serif-italic">{selectedEvidence.description}</p>
                     
                     <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-paper-dark p-3 border border-line">
                           <span className="mono text-[8px] opacity-40 font-bold block mb-1">Entity Tier</span>
                           <span className="mono font-bold text-xs">{selectedEvidence.type}</span>
                        </div>
                        <div className="bg-paper-dark p-3 border border-line">
                           <span className="mono text-[8px] opacity-40 font-bold block mb-1">Verification Status</span>
                           <span className={`mono font-bold text-xs ${selectedEvidence.status === EvidenceStatus.CERTIFIED ? 'text-accent-green' : 'text-accent'}`}>{selectedEvidence.status}</span>
                        </div>
                     </div>

                     <div className="p-5 border-2 border-accent border-dashed bg-accent/5 mt-4">
                        <div className="flex items-center gap-2 mb-2 text-accent">
                           <AlertTriangle size={14} />
                           <span className="mono text-[9px] font-bold uppercase tracking-widest">Critical Vulnerability</span>
                        </div>
                        <p className="text-xs md:text-sm italic leading-tight text-accent font-medium">"{selectedEvidence.authenticityRisk || "Incipient artifact authentication pending deep-packet metadata scan."}"</p>
                     </div>
                  </div>

                  <div className="aspect-video bg-paper-dark border-2 border-line flex flex-col items-center justify-center p-8 relative overflow-hidden">
                     <Scale size={120} className="text-ink/5 absolute rotate-12" />
                     <div className="z-10 text-center">
                        <ShieldCheck size={48} className="mx-auto mb-3 opacity-10" />
                        <p className="mono text-[8px] opacity-30 tracking-[0.2em] font-bold">SECURE_DOCKET_LOCKSCREEN</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setSelectedEvidenceId(null)}
                    className="btn-primary w-full py-5 text-[10px] tracking-[0.3em]"
                  >
                    RETURN_TO_HUB
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatrixItem({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 border border-line flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-accent-green' : 'bg-transparent'}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white" />}
      </div>
      <span className="text-[12px] mono opacity-80">{label}</span>
    </div>
  );
}

function SceneHotspot({ title, top, left, onClick, isCollected }: { title: string, top: string, left: string, onClick: () => void, isCollected: boolean }) {
  return (
    <div 
      style={{ top, left }} 
      className={`absolute group -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${isCollected ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
      onClick={!isCollected ? onClick : undefined}
    >
      <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center animate-pulse ${isCollected ? 'bg-green-500' : 'bg-accent'}`}>
        {isCollected ? <FileCheck size={14} className="text-white" /> : <Search size={14} className="text-white" />}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 mono text-[10px] whitespace-nowrap">
        {isCollected ? `[COLLECTED: ${title}]` : `[INVESTIGATE: ${title}]`}
      </div>
    </div>
  );
}

function NPCListItem({ name, role, trust, avatar }: { name: string, role: string, trust: number, avatar: string }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-line bg-white hover:bg-paper-dark transition-colors cursor-help">
      <img src={avatar} className="w-10 h-10 bg-ink p-0.5 rounded border border-line" alt={name} />
      <div className="flex-1">
        <h5 className="mono text-[10px] font-bold">{name}</h5>
        <span className="mono text-[8px] opacity-50">{role}</span>
        <div className="flex gap-0.5 mt-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= trust ? 'bg-accent' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>
      <MessageSquare size={12} className="opacity-20" />
    </div>
  );
}

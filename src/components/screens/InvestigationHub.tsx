import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, Evidence, GamePhase, AuthenticityStatus, AdmissibilityStatus, EvidenceType } from '../../types';
import { EVIDENCE_POOL } from '../../constants';
import { GameEngine } from '../../game/gameEngine';
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
  Search,
  Layers,
  Link2,
  Sparkles
} from 'lucide-react';

interface InvestigationHubProps {
  gameState: GameState;
  currentCase: Case;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface TestimonyFragment {
  id: string;
  speaker: string;
  role: string;
  text: string;
  avatar: string;
}

const TESTIMONY_FRAGMENTS: TestimonyFragment[] = [
  {
    id: 'frag-virendra',
    speaker: "Principal Virendra",
    role: "Target Victim",
    text: "The caller knew my retired credentials perfectly... and they insisted G. Singh, the Chief Justice, approved a digital arrest from his Hazratganj barracks at 10:45 AM!",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=virendra_sharma"
  },
  {
    id: 'frag-poser',
    speaker: "CBI Poser Transcript",
    role: "Accused/Suspect",
    text: "I personally executed the digital quarantine protocol at 10:45 AM from the Lucknow High Court cyber barracks under direct administrative warrant.",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sho"
  },
  {
    id: 'frag-sho',
    speaker: "SHO Hazratganj",
    role: "Station Authority",
    text: "Hazratganj digital logs confirm that the Lucknow High Court premises and cyber barracks were completely locked and closed on April 14th for the Ambedkar Jayanti holiday.",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sho_auth"
  },
  {
    id: 'frag-newspaper',
    speaker: "Lucknow Times Print",
    role: "Physical Media",
    text: "Front-page headlines confirm Chief Justice G. Singh was physically in New Delhi, presiding over continuous administrative hearings in Supreme Court Room 1 all morning or April 14th.",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=newspaper"
  }
];

export default function InvestigationHub({ gameState, currentCase, setGameState }: InvestigationHubProps) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  
  // Tactical interaction states
  const [activeTab, setActiveTab] = useState<'scene' | 'contradictions'>('scene');
  const [selectedFragIds, setSelectedFragIds] = useState<string[]>([]);
  const [deductionFeedback, setDeductionFeedback] = useState<{
    status: 'success' | 'failure' | 'idle';
    title: string;
    message: string;
  }>({ status: 'idle', title: '', message: '' });
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([]);

  const collectEvidence = (evidenceId: string) => {
    if (gameState.inventory.some(e => e.id === evidenceId)) return;

    const evidence = EVIDENCE_POOL.find(e => e.id === evidenceId);
    if (!evidence) return;

    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, evidence],
      pressureMeter: Math.min(prev.pressureMeter + 5, 100) // Finding evidence increases anticipation/pressure
    }));
  };

  const handleToggleFrag = (id: string) => {
    setDeductionFeedback({ status: 'idle', title: '', message: '' });
    setSelectedFragIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleConnectDeduction = () => {
    if (selectedFragIds.length !== 2) return;

    const [id1, id2] = selectedFragIds;
    
    // Case 1: CBI Poser (frag-poser) vs SHO Hazratganj (frag-sho) - Closed Barracks Fact
    if ((id1 === 'frag-poser' && id2 === 'frag-sho') || (id1 === 'frag-sho' && id2 === 'frag-poser')) {
      const fact = "Lucknow Barracks Shutter Proof";
      if (discoveredFacts.includes(fact)) {
        setDeductionFeedback({
          status: 'success',
          title: "ALREADY DISCOVERED",
          message: "You have already exposed that the Lucknow High Court cyber barracks were shut down on April 14th."
        });
        return;
      }

      setDiscoveredFacts(prev => [...prev, fact]);
      setDeductionFeedback({
        status: 'success',
        title: "✓ BARRACKS INACCESSIBILITY EXPOSED",
        message: "Logical Impossibility: CBI Poser claims he executed the digital warrant from Lucknow cyber barracks at 10:45 AM, but SHO Hazratganj records prove the entire premises were physically locked and dormant for the Ambedkar Jayanti holiday! Suspect's broadcast custody is a confirmed scam routing."
      });

      // Boost scores & ease pressure
      setGameState(prev => ({
        ...prev,
        legalScore: Math.min(100, prev.legalScore + 15),
        justiceScore: Math.min(100, prev.justiceScore + 10),
        pressureMeter: Math.max(0, prev.pressureMeter - 12)
      }));
    }
    // Case 2: Principal Virendra (frag-virendra) vs Lucknow Times (frag-newspaper) - CJI Delhi Alibi
    else if ((id1 === 'frag-virendra' && id2 === 'frag-newspaper') || (id1 === 'frag-newspaper' && id2 === 'frag-virendra')) {
      const fact = "CJI New Delhi Alibi Proof";
      if (discoveredFacts.includes(fact)) {
        setDeductionFeedback({
          status: 'success',
          title: "ALREADY DISCOVERED",
          message: "You have already proved that Chief Justice Singh was physically in New Delhi, not Lucknow."
        });
        return;
      }

      setDiscoveredFacts(prev => [...prev, fact]);
      setDeductionFeedback({
        status: 'success',
        title: "✓ CJI ALIBI CONTRADICTION ROOTED",
        message: "Temporal Paradox: The scammer threatened Principal Sharma that Chief Justice G. Singh was in his Lucknow chambers reviewing the digital arrest warrant. But the Lucknow Times confirms the CJI was at that exact minute presiding over official docket hearings in Supreme Court Room 1, New Delhi! The judicial threat is fully manufactured."
      });

      // Boost scores & ease pressure
      setGameState(prev => ({
        ...prev,
        legalScore: Math.min(100, prev.legalScore + 15),
        justiceScore: Math.min(100, prev.justiceScore + 15),
        pressureMeter: Math.max(0, prev.pressureMeter - 15)
      }));
    }
    // Otherwise: Failure
    else {
      setDeductionFeedback({
        status: 'failure',
        title: "✘ NO LOGICAL TENSION DETECTED",
        message: "These testimony fragments do not present a clean contradiction or alibi mismatch. Under legal scrutiny, connecting these lines would be called speculation by the defense. Choose facts that clash on space, time, or official capacity."
      });
      // Small pressure penalty for blind guessing
      setGameState(prev => ({
        ...prev,
        pressureMeter: Math.min(100, prev.pressureMeter + 5)
      }));
    }
  };

  const nextPhase = () => {
    const nextPhase = GameEngine.getNextPhase(gameState.phase);
    setGameState(prev => ({ ...prev, phase: nextPhase }));
  };

  const selectedEvidence = gameState.inventory.find(e => e.id === selectedEvidenceId);

  return (
    <div className="flex-1 flex flex-col bg-paper relative overflow-hidden">
      {/* Top Stats Bar - Responsive */}
      <div className="bg-white border-b border-line px-4 py-3 flex justify-between items-center shrink-0 z-10 shadow-sm">
         <div className="flex flex-col max-w-[60%]">
            <span className="mono text-[9px] opacity-40 font-bold uppercase leading-none mb-1 tracking-widest text-accent flex items-center gap-2">
               <AlertTriangle size={10} /> Case Urgency
            </span>
            <p className="mono font-bold text-[10px] md:text-sm leading-tight truncate md:whitespace-normal md:overflow-visible">
               {currentCase.narrativeUrgency}
            </p>
         </div>
         <button 
           onClick={nextPhase}
           className="btn-accent py-2 px-6 text-[10px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center gap-2 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
         >
           NEXT_PHASE <ChevronRight size={14} />
         </button>
      </div>

      {/* Elegant Interactive Tab System */}
      <div className="flex border-b-2 border-line bg-white shrink-0 z-10">
         <button 
           onClick={() => setActiveTab('scene')}
           className={`flex-1 py-3 text-center mono text-[10px] font-bold tracking-widest uppercase transition-all border-r-2 border-line ${activeTab === 'scene' ? 'bg-accent text-white' : 'bg-transparent text-ink/60 hover:bg-paper-dark'}`}
         >
            🔎 Evidence Scene & Vault
         </button>
         <button 
           onClick={() => setActiveTab('contradictions')}
           className={`flex-1 py-3 text-center mono text-[10px] font-bold tracking-widest uppercase transition-all ${activeTab === 'contradictions' ? 'bg-accent text-white' : 'bg-transparent text-ink/60 hover:bg-paper-dark'}`}
         >
            🧠 Testimony Paradox Board
         </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'scene' ? (
            <motion.div 
              key="scene-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col p-4 gap-6 pb-20"
            >
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
                        <SceneHotspot 
                          title="CBI BADGE VEST" 
                          top="35%" left="30%" 
                          onClick={() => collectEvidence('cbi-logo')}
                          isCollected={gameState.inventory.some(e => e.id === 'cbi-logo')}
                        />
                        <SceneHotspot 
                          title="POLICE DOCKET" 
                          top="45%" left="80%" 
                          onClick={() => collectEvidence('zero-fir-receipt')}
                          isCollected={gameState.inventory.some(e => e.id === 'zero-fir-receipt')}
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
            </motion.div>
          ) : (
            <motion.div 
              key="deduction-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col p-4 gap-6 pb-20 max-w-4xl mx-auto w-full"
            >
              {/* Introduction Instruction Card */}
              <section className="bg-paper-dark border-2 border-line p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,0.1)] space-y-2">
                 <div className="flex items-center gap-2 text-accent">
                    <Layers size={16} />
                    <span className="mono text-[9px] font-bold uppercase tracking-widest">Testimonial Mismatch Matrix</span>
                 </div>
                 <h2 className="text-xl font-serif font-black tracking-tight text-ink leading-tight">Compare & Link Case Contradictions</h2>
                 <p className="text-xs text-ink/70 leading-relaxed font-medium">
                    Analyze official witness statements and technical media in your case files. Choose any <strong>TWO</strong> testimony fragments that logically contradict each other, then execute the tension scan to establish an alibi paradox!
                 </p>
              </section>

              {/* Testimony Fragment Selection Grid */}
              <section className="space-y-3">
                 <div className="col-header uppercase tracking-[0.2em] text-[9px]">Case Testimony Files</div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TESTIMONY_FRAGMENTS.map(frag => {
                       const isSelected = selectedFragIds.includes(frag.id);
                       return (
                          <div 
                             key={frag.id}
                             onClick={() => handleToggleFrag(frag.id)}
                             className={`p-4 border-2 transition-all cursor-pointer relative flex flex-col justify-between h-44 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${isSelected ? 'border-accent bg-accent/5' : 'border-line bg-white'}`}
                          >
                             <div className="flex items-center gap-3 border-b border-line/10 pb-2 mb-2">
                                <img src={frag.avatar} alt={frag.speaker} className="w-8 h-8 rounded-full border border-line shrink-0" />
                                <div className="leading-tight">
                                   <div className="font-bold text-xs text-ink leading-none">{frag.speaker}</div>
                                   <span className="mono text-[8px] opacity-50 uppercase font-bold tracking-wider">{frag.role}</span>
                                </div>
                             </div>
                             <p className="text-xs text-ink/80 italic leading-snug flex-1 flex items-center">
                                "{frag.text}"
                             </p>
                             {isSelected && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-white font-mono text-[8.5px] uppercase font-bold animate-pulse">
                                   CONNECTED
                                </div>
                             )}
                          </div>
                       );
                    })}
                 </div>
              </section>

              {/* Interaction Engine Trigger Area */}
              <section className="space-y-4">
                 <button
                    disabled={selectedFragIds.length !== 2}
                    onClick={handleConnectDeduction}
                    className={`w-full py-4 text-xs font-bold uppercase tracking-widest border-2 font-mono flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] transition-all ${selectedFragIds.length === 2 ? 'bg-accent text-white border-accent hover:bg-ink' : 'bg-paper-dark border-line text-ink/30 cursor-not-allowed'}`}
                 >
                    <Link2 size={14} /> ANALYZE LOGICAL TENSION
                 </button>

                 {/* Real-time feed back */}
                 {deductionFeedback.status !== 'idle' && (
                    <div className={`p-5 border-2 transition-all shadow-[6px_6px_0px_0px_rgba(20,20,20,0.05)] ${deductionFeedback.status === 'success' ? 'bg-accent-green/5 border-accent-green text-emerald-900' : 'bg-red-500/5 border-accent text-red-950'}`}>
                       <div className="flex items-center gap-2 mb-2">
                          {deductionFeedback.status === 'success' ? <Sparkles size={14} className="text-accent-green" /> : <AlertTriangle size={14} className="text-accent" />}
                          <span className="mono text-[10px] uppercase font-bold tracking-wider leading-none">{deductionFeedback.title}</span>
                       </div>
                       <p className="text-xs font-medium leading-relaxed italic">{deductionFeedback.message}</p>
                    </div>
                 )}
              </section>

              {/* Discovered Paradox accomplishment deck */}
              <section className="p-4 bg-paper-dark border border-line space-y-3 mt-2">
                 <span className="mono text-[9px] uppercase tracking-widest opacity-60 font-bold block">Discovered Impeachment Keys</span>
                 <div className="flex flex-wrap gap-2">
                    {discoveredFacts.length === 0 ? (
                       <span className="mono text-[9px] text-ink/40 italic uppercase pb-1 border-b border-dashed border-line">No logical alibi paradox established yet. Cross-reference testimony files above!</span>
                    ) : (
                       discoveredFacts.map(fac => (
                          <div key={fac} className="px-3 py-1.5 bg-emerald-900 text-white font-mono text-[9px] font-bold uppercase border border-emerald-950 tracking-wider flex items-center gap-1.5 animate-bounce">
                             <ShieldCheck size={11} /> {fac}
                          </div>
                       ))
                    )}
                 </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
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
                           <span className="mono text-[8px] opacity-40 font-bold block mb-1">Admissibility Status</span>
                           <span className={`mono font-bold text-xs ${selectedEvidence.admissibility === AdmissibilityStatus.ADMITTED ? 'text-accent-green' : 'text-accent'}`}>{selectedEvidence.admissibility}</span>
                        </div>
                     </div>

                     <div className="p-5 border-2 border-accent border-dashed bg-accent/5 mt-4 space-y-4">
                        <div className="flex items-center justify-between text-accent border-b border-accent/20 pb-2">
                           <span className="mono text-[9px] font-bold uppercase tracking-widest">Forensic Value Breakdown</span>
                           <span className="mono font-bold text-sm bg-accent text-white px-2 py-0.5">STANDARDIZED</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-ink">
                           <div className="p-2 bg-paper border border-line">
                              <span className="mono text-[8px] opacity-50 block leading-tight">Credibility</span>
                              <span className="mono font-bold text-xs">{selectedEvidence.credibility || 30}%</span>
                           </div>
                           <div className="p-2 bg-paper border border-line">
                              <span className="mono text-[8px] opacity-50 block leading-tight">Admissibility</span>
                              <span className="mono font-bold text-xs">{selectedEvidence.admissibilityStrength || 10}%</span>
                           </div>
                           <div className="p-2 bg-paper border border-line">
                              <span className="mono text-[8px] opacity-50 block leading-tight">Bench Sway</span>
                              <span className="mono font-bold text-xs">{selectedEvidence.judgeImpact || 60}%</span>
                           </div>
                        </div>

                        <p className="text-xs italic leading-tight text-accent font-medium pt-2">"{selectedEvidence.authenticityRisk || "Incipient artifact authentication pending deep-packet metadata scan."}"</p>
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

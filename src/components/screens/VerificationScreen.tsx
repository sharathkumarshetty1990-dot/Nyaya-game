import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Evidence, AuthenticityStatus, AdmissibilityStatus } from '../../types';
import { GameEngine } from '../../game/gameEngine';
import { 
  Fingerprint, 
  ShieldCheck, 
  Cpu, 
  Binary, 
  FileCheck, 
  AlertOctagon,
  ChevronRight,
  Stamp
} from 'lucide-react';

interface VerificationScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function VerificationScreen({ gameState, setGameState }: VerificationScreenProps) {
  const [selectedEvidenceIdx, setSelectedEvidenceIdx] = useState<number>(0);
  const selectedEvidence = gameState.inventory[selectedEvidenceIdx];

  const updateEvidence = (id: string, updates: Partial<Evidence>) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const nextPhase = () => {
    const nextPhase = GameEngine.getNextPhase(gameState.phase);
    setGameState(prev => ({ ...prev, phase: nextPhase }));
  };

  return (
    <div className="flex-1 flex flex-col bg-paper overflow-hidden">
      {/* Evidence Strip - Scrollable */}
      <div className="h-14 md:h-16 border-b-2 border-line flex bg-white overflow-x-auto shrink-0 touch-pan-x">
        {gameState.inventory.map((item, idx) => (
            <button
            key={item.id}
            onClick={() => setSelectedEvidenceIdx(idx)}
            className={`min-w-[140px] md:min-w-48 border-r border-line p-3 md:p-4 flex flex-col justify-center transition-colors text-left shrink-0 ${
              idx === selectedEvidenceIdx ? 'bg-ink text-paper' : 'text-ink/40 hover:bg-paper-dark'
            }`}
          >
            <span className="mono text-[9px] md:text-[10px] font-bold truncate w-full">{item.name}</span>
            <span className={`mono text-[7px] md:text-[8px] italic ${idx === selectedEvidenceIdx ? 'opacity-60' : 'opacity-40'}`}>{item.authenticity}</span>
          </button>
        ))}
        {gameState.inventory.length === 0 && (
          <div className="flex items-center px-6 text-ink/20 mono text-[10px] italic font-bold">
            NO_DATA_SECURED
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto overflow-x-hidden">
        {/* Verification Area */}
        <main className="flex-1 p-6 md:p-8 bg-white min-h-0 overflow-y-auto">
          {selectedEvidence ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              <div className="space-y-8">
                <div className="border-2 border-line p-6 md:p-8 bg-paper-dark shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                  <div className="flex justify-between items-start mb-6 md:mb-8 border-b border-line pb-2">
                    <h2 className="mono font-bold text-lg md:text-xl flex items-center gap-3">
                      <Binary className="text-accent" size={18} />
                      FORENSIC_SUITE
                    </h2>
                    <div className="text-right">
                       <div className="mono text-[8px] opacity-40 uppercase">Court Confidence</div>
                       <div className="mono text-lg font-bold text-accent">{selectedEvidence.courtConfidence}%</div>
                    </div>
                  </div>

                  <div className="space-y-8 md:space-y-10">
                    <VerificationModule 
                      title="SHA-256 HASH VERIFICATION"
                      status={selectedEvidence.authenticity === AuthenticityStatus.UNVERIFIED ? 'PENDING' : 'COMPLETED'}
                      onVerify={() => updateEvidence(selectedEvidence.id, GameEngine.verifyEvidence(selectedEvidence, gameState))}
                    >
                      <div className="bg-ink p-3 md:p-4 border border-line text-[10px] md:text-[11px] mono text-accent-green font-bold space-y-2 overflow-hidden leading-snug">
                        <div className="opacity-40 uppercase tracking-tighter">Target Hash</div>
                        <div className="break-all opacity-80">7A5D812CF9E42B0102...</div>
                        <div className="border-t border-accent-green/20 pt-2 opacity-40 uppercase tracking-tighter">
                          Calc Hash
                        </div>
                        <div className="break-all px-2 py-1 bg-white/5">0x_{selectedEvidence.id}_SHA_SECURED</div>
                      </div>
                    </VerificationModule>

                    <VerificationModule 
                      title="BSA SEC 63 CERTIFICATION"
                      status={selectedEvidence.admissibility === AdmissibilityStatus.ADMITTED ? 'CERTIFIED' : 'UNCERTIFIED'}
                      onVerify={() => updateEvidence(selectedEvidence.id, GameEngine.certifyEvidence(selectedEvidence))}
                      disabled={selectedEvidence.authenticity === AuthenticityStatus.UNVERIFIED}
                    >
                      <div className="bg-white border border-line p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <Stamp size={20} className="text-accent opacity-20" />
                        <div className="flex-1">
                           <span className="mono text-[8px] font-bold block mb-1">LEGAL MANDATE // {selectedEvidence.bsaSection || 'BSA'}</span>
                           <p className="text-[9px] md:text-[10px] opacity-60 leading-tight italic">Digital signature linkage confirmed with local precinct certificate authority.</p>
                        </div>
                      </div>
                    </VerificationModule>
                  </div>
                </div>
              </div>


              {/* Preview & Info - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                <div className="aspect-square bg-paper-dark border-2 border-line flex flex-col items-center justify-center p-8 md:p-12 relative shadow-[4px_4px_0px_0px_rgba(20,20,20,0.05)]">
                   <Binary size={80} className="text-ink/5 absolute" />
                   <div className="z-10 text-center space-y-3">
                     <Fingerprint size={48} className="mx-auto text-ink/20" />
                     <div className="mono text-[9px] bg-white border border-line px-3 py-1 font-bold">ANALYSIS_MODE_v2</div>
                   </div>
                </div>

                <div className="border-2 border-line bg-accent text-white p-5 md:p-6 relative shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
                   <div className="absolute top-2 right-2 opacity-20"><AlertOctagon size={32} /></div>
                   <div className="mono font-bold text-[9px] mb-2 uppercase tracking-widest opacity-80">AUTHENTICITY_WARNING</div>
                   <p className="text-xs md:text-sm font-bold leading-relaxed italic">
                    "{selectedEvidence.authenticityRisk || "NO ADVERSARIAL RISK FLAGGED FOR THIS SEGMENT."}"
                   </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center mono opacity-10 italic">
              [NO_ITEM_MOUNTED]
            </div>
          )}
        </main>

        {/* Action Sidebar - Becomes a simple footer-like section or stacked section */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l-2 border-line p-6 bg-paper-dark flex flex-col shrink-0">
          <div className="col-header tracking-widest text-[9px] mb-4">Procedural Console</div>
          
          <div className="hidden md:flex flex-col space-y-4 flex-1">
            <button className="btn-legal w-full justify-start opacity-40 grayscale cursor-not-allowed text-[10px]">
              <Cpu size={14} />
              <span>METADATA_STRIPPER</span>
            </button>
            <button className="btn-legal w-full justify-start opacity-40 grayscale cursor-not-allowed text-[10px]">
              <Binary size={14} />
              <span>LOG_RECOVERY_MOD</span>
            </button>
            
            <div className="p-4 border border-line bg-white mt-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
              <div className="col-header opacity-100 border-none mb-1 text-[9px]">Protocol Insight</div>
              <p className="text-[10px] opacity-60 leading-relaxed italic">
                Timestamp cross-checks (BSA Sec 61) are mandatory for digital evidence integrity.
              </p>
            </div>
          </div>

          <button 
            onClick={nextPhase}
            className="btn-accent w-full py-5 text-[11px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] mt-auto"
          >
            COMMIT_TO_DOCKET
            <ChevronRight size={14} />
          </button>
        </aside>
      </div>
    </div>
  );
}

function VerificationModule({ title, children, status, onVerify, disabled }: { title: string, children: React.ReactNode, status: string, onVerify: () => void, disabled?: boolean }) {
  return (
    <div className={`space-y-4 ${disabled ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
      <div className="flex justify-between items-center bg-white border border-line p-2">
        <h4 className="mono text-[10px] font-bold tracking-tight">{title}</h4>
        <span className={`mono text-[9px] px-3 py-1 font-bold ${status === 'PENDING' || status === 'UNCERTIFIED' ? 'bg-accent text-white' : 'bg-accent-green text-white'}`}>
          {status}
        </span>
      </div>
      
      <div className="pl-4 border-l-2 border-line/20">
        {children}
      </div>

      {(status === 'PENDING' || status === 'UNCERTIFIED') && (
        <button 
          onClick={onVerify}
          className="btn-primary w-full py-2 text-[10px]"
        >
          EXECUTE_PROTOCOL
        </button>
      )}
    </div>
  );
}

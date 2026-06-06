import React from 'react';
import { ShieldCheck, ShieldAlert, BookOpen } from 'lucide-react';
import { Evidence, AuthenticityStatus } from '../../../types';
import { GameEngine } from '../../../game/gameEngine';

interface EvidencePanelProps {
  mode: 'admitted-tray' | 'sidebar' | 'modal-selector';
  inventory: Evidence[];
  selectedContradictionId?: string | null;
  onSelect?: (id: string) => void;
}

export default function EvidencePanel({
  mode,
  inventory,
  selectedContradictionId,
  onSelect
}: EvidencePanelProps) {
  
  if (mode === 'admitted-tray') {
    return (
      <div className="mt-4 border-t border-amber-950/40 pt-4">
        <div className="col-header border-amber-900/40 text-amber-500 text-[9px] mb-3 uppercase tracking-widest font-bold">
          Judicially Admitted Exhibits
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 touch-pan-x">
          {inventory.map(item => {
            const isAdmissible = GameEngine.isEvidenceAdmissible(item);
            return (
              <div 
                key={item.id}
                className={`p-3 border shrink-0 w-36 md:w-44 transition-all bg-[#1e130f]/60 ${
                  isAdmissible ? 'border-accent-green/40 shadow-[0_0_8px_rgba(34,197,94,0.1)]' : 'opacity-20 grayscale border-[#5A3D2D]'
                }`}
              >
                <div className="mono text-[9px] font-bold text-amber-200 truncate mb-1">{item.name}</div>
                <div className="flex justify-between items-center text-[8px]">
                  <span className={`mono font-bold ${isAdmissible ? 'text-[#6FCF97]' : 'text-red-500/60'}`}>
                    {isAdmissible ? 'ADMITTED' : 'EXCLUDED'}
                  </span>
                  {item.hasBSACertificate && <ShieldCheck size={11} className="text-[#6FCF97]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'sidebar') {
    return (
      <div className="grid grid-cols-1 gap-3">
        {inventory.map(item => {
          const isAdmissible = GameEngine.isEvidenceAdmissible(item);
          const isVerified = item.authenticity === AuthenticityStatus.VERIFIED;
          const isCertified = item.hasBSACertificate;

          return (
            <div 
              key={item.id}
              className={`p-4 border-2 transition-all cursor-default ${
                isAdmissible ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.2)]' : 'bg-[#1A0D08]/50 border-[#5A3D2D]'
              }`}
            >
              <div className="flex justify-between mb-2 pb-1 border-b border-[#2A1810]">
                <span className="mono text-[10px] font-bold text-amber-50 tracking-tighter">{item.name}</span>
                <span className="mono text-[8px] opacity-40 uppercase">{item.type}</span>
              </div>
              <div className="flex items-center justify-between text-[8px] mb-2.5">
                <span className="mono text-amber-100/40 font-bold uppercase">
                  {item.authenticity} // {item.admissibility}
                </span>
                <span className="mono text-amber-500 font-bold uppercase">REF_{item.id.toUpperCase()}</span>
              </div>
              
              {/* Reason-Focused Verification Pillars */}
              <div className="space-y-1 bg-black/30 p-2 border border-amber-950/20 text-[9px] text-left">
                {isVerified ? (
                  (item.verificationCauses || ["✓ Metadata consistent", "✓ Independent corroboration found"]).map((cause, causeIdx) => (
                    <div key={causeIdx} className="flex items-center gap-1.5">
                      <span className="text-[#6FCF97]">✓</span>
                      <span className="text-[#6FCF97]/80 font-mono text-[8.5px]">
                        {cause.replace("✓ ", "")}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C5C6C7]/30">✗</span>
                      <span className="text-[#C5C6C7]/30 font-mono text-[8px]">
                        Metadata Unverified
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C5C6C7]/30">✗</span>
                      <span className="text-[#C5C6C7]/30 font-mono text-[8px]">
                        Corroborating Evidence Missing
                      </span>
                    </div>
                  </>
                )}
                
                {/* Certify seal cause */}
                <div className="flex items-center gap-1.5 border-t border-amber-950/20 pt-1 mt-1">
                  <span className={isCertified ? 'text-[#66FCF1]' : 'text-[#C5C6C7]/30'}>
                    {isCertified ? '✓' : '✗'}
                  </span>
                  <span className={isCertified ? 'text-[#66FCF1]/80' : 'text-[#C5C6C7]/30 font-mono text-[8px]'}>
                    Custody Chain Sealed (BSA Sec 63)
                  </span>
                </div>
              </div>

              {/* Empirical Forensic Observations */}
              {item.factualProperties && (
                <div className="mt-2 text-left bg-black/10 p-1.5 border border-amber-950/10 text-[8.5px]">
                  <span className="mono text-[7px] text-amber-500/80 font-bold uppercase tracking-wider block mb-1">
                    EMPIRICAL FACTS (TESTED OBSERVATIONS)
                  </span>
                  <div className="space-y-1">
                    {item.factualProperties.map((prop, idx) => (
                      <div key={idx} className="text-amber-100/60 font-sans leading-snug pl-1.5 border-l border-amber-950/30">
                        • {prop}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // mode === 'modal-selector'
  return (
    <div className="space-y-2">
      <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">1. Select Forensic Exhibit</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
        {inventory.map(item => {
          const isSelected = selectedContradictionId === item.id;
          const isAdmissible = GameEngine.isEvidenceAdmissible(item);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className={`p-3 text-left border-2 transition-all relative flex flex-col justify-center cursor-pointer ${
                isSelected 
                  ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.15)]'
                  : 'bg-black/30 border-[#5A3D2D] hover:border-amber-900/60'
              }`}
            >
              <div className="font-bold text-[10px] text-amber-100 truncate w-full mb-1">{item.name}</div>
              <div className="flex justify-between items-center text-[8px] w-full">
                <span className="mono opacity-40 uppercase">{item.type}</span>
                <span className={`mono font-bold ${isAdmissible ? 'text-[#6FCF97]' : 'text-accent'}`}>
                  {isAdmissible ? 'ADMITTED // READY' : 'UNCERTIFIED // REJECTABLE'}
                </span>
              </div>
            </button>
          );
        })}
        {inventory.length === 0 && (
          <div className="text-center p-6 text-xs text-amber-100/40 italic bg-black/30 col-span-2 font-mono">
            You have collected zero materials in your case docket as legal basis. Go back and check hotspots.
          </div>
        )}
      </div>
    </div>
  );
}

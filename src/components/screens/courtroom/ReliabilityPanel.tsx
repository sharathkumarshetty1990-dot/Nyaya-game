import React from 'react';
import { Evidence } from '../../../types';

interface ReliabilityPanelProps {
  selectedReliability: 'deception' | 'memory_error' | 'pressure' | 'procedural_confusion' | null;
  onSelect: (r: 'deception' | 'memory_error' | 'pressure' | 'procedural_confusion') => void;
  selectedContradictionId: string | null;
  inventory: Evidence[];
  reliabilityReasonNeeded: boolean;
}

export default function ReliabilityPanel({
  selectedReliability,
  onSelect,
  selectedContradictionId,
  inventory,
  reliabilityReasonNeeded
}: ReliabilityPanelProps) {
  
  if (!reliabilityReasonNeeded) return null;

  const reliabilityOptions = [
    { id: 'deception', label: 'DECEPTION', color: 'border-red-500/30 text-red-100 hover:border-red-400', bg: 'bg-red-950/20', desc: 'Intentional lie / spoofing' },
    { id: 'memory_error', label: 'MEMORY ERROR', color: 'border-amber-500/30 text-amber-100 hover:border-amber-400', bg: 'bg-amber-950/20', desc: 'Honest memory recall gap' },
    { id: 'pressure', label: 'PRESSURE', color: 'border-blue-500/30 text-blue-100 hover:border-blue-400', bg: 'bg-blue-950/20', desc: 'Coercion / threat / fear' },
    { id: 'procedural_confusion', label: 'PROCEDURAL CONFUSION', color: 'border-emerald-500/30 text-emerald-100 hover:border-emerald-400', bg: 'bg-emerald-950/20', desc: 'Statutory or law mistake' }
  ];

  return (
    <div className="space-y-4 pt-3 border-t border-[#5A3D2D]/30">
      <div className="space-y-2">
        <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
          3. Evaluate Testimony Reliability Cause
        </div>
        <div className="grid grid-cols-2 gap-2">
          {reliabilityOptions.map(r => {
            const isSel = selectedReliability === r.id;
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => onSelect(r.id as any)}
                className={`p-2.5 text-left border-2 transition-all relative flex flex-col justify-center cursor-pointer ${
                  isSel 
                    ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.15)] bg-accent/20 border-accent/90' 
                    : `${r.bg} ${r.color}`
                }`}
              >
                <span className="font-bold text-[9px] tracking-wider block">{r.label}</span>
                <span className="text-[7.5px] opacity-40 italic mt-0.5">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedContradictionId && selectedReliability && (
        <div className="bg-[#26150F] border border-amber-950/60 p-3.5 space-y-1 text-left font-sans text-xs animate-fadeIn">
          <span className="mono text-[8.5px] text-amber-500 font-bold uppercase tracking-widest block">
            CONSTRUCTED ARGUMENT SYNTHESIS
          </span>
          <div className="text-amber-100 font-medium leading-relaxed font-serif">
            {(() => {
              const item = inventory.find(e => e.id === selectedContradictionId);
              const rName = selectedReliability.replace('_', ' ').toUpperCase();
              let synthesisText = "";
              if (selectedContradictionId === 'wa-ss' && selectedReliability === 'pressure') {
                synthesisText = `Exhibit ${item?.name} provides direct evidence of BNS Sec 308 (Extortion) coercion. The UTC timestamp shift proves VoIP spoofing was active during the forced declaration, demonstrating extreme psychological pressure.`;
              } else if (selectedContradictionId === 'cbi-logo' && selectedReliability === 'memory_error') {
                synthesisText = `SI Mishra recalled recovering a physical 'gold seal stamp'. However, spectral analysis of the CBI logo overlay proves the crest was entirely synthetic, demonstrating a classic cognitive memory error under high-stress pressure.`;
              } else if (selectedContradictionId === 'newspaper-cji' && selectedReliability === 'deception') {
                synthesisText = `The CBI Transcript claims Amit Sen met the CJI in Lucknow on April 14th. Challenging this with the physical Daily Newspaper proves CJI was actually presiding in New Delhi, confirming deliberate alibi deception (Perjury).`;
              } else if (selectedContradictionId === 'zero-fir-receipt' && selectedReliability === 'procedural_confusion') {
                synthesisText = `Officer Dixit refused complaint registration due to 'out-of-district' limits. The Zero FIR receipt and BNSS Sec 173 mandate instant digital complaint registration, demonstrating territorial procedural confusion.`;
              } else {
                synthesisText = `Supporting ${rName} with ${item?.name} to demonstrate a discrepancy in the testimony.`;
              }
              return (
                <>
                  <p className="leading-snug text-[11px] font-sans text-amber-100/90">{synthesisText}</p>
                  <p className="text-[9px] text-[#66FCF1]/80 italic mt-1 bg-black/30 p-1.5 border border-amber-950/40 font-mono">
                    ⚖️ FACTUAL COHERENCE: {item?.name || 'Exhibit'} is linked to {rName}.
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

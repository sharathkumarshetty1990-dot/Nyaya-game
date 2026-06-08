import React from 'react';
import { Evidence } from '../../../types';

interface ReliabilityPanelProps {
  selectedReliability: 'deception' | 'memory_error' | 'pressure' | 'procedural_confusion' | null;
  onSelect: (r: 'deception' | 'memory_error' | 'pressure' | 'procedural_confusion') => void;
  selectedContradictionId: string | null;
  selectedJustificationId: string | null;
  onSelectJustification: (id: string) => void;
  inventory: Evidence[];
  reliabilityReasonNeeded: boolean;
  pressureMeter?: number;
}

export default function ReliabilityPanel({
  selectedReliability,
  onSelect,
  selectedContradictionId,
  selectedJustificationId,
  onSelectJustification,
  inventory,
  reliabilityReasonNeeded,
  pressureMeter
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
          1. COMMIT TO AN INTERPRETIVE THEORY (Diagnose Source of Doubt First)
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

      {selectedReliability && (
        <div className="space-y-2 pt-3 border-t border-[#5A3D2D]/30 animate-fadeIn">
          <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
            2.1 Link Corroborating Evidence (Validate Theory)
          </div>
          <p className="text-[7.5px] text-amber-100/40 italic leading-snug">
            Choose an independent corroborating exhibit to complete the legal reasoning chain.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {inventory
              .filter(item => !selectedContradictionId || item.id !== selectedContradictionId)
              .map(item => {
                const isSelected = selectedJustificationId === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onSelectJustification(item.id)}
                    className={`p-1.5 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-amber-100'
                        : 'bg-black/30 border-amber-950/40 text-[#C5C6C7] hover:border-amber-900/40'
                    }`}
                  >
                    <span className="font-bold text-[8px] tracking-tight block truncate text-amber-100">
                      {item.name}
                    </span>
                    <span className="text-[6.5px] opacity-40 font-mono block uppercase mt-0.5">
                      REF_{item.id.replace('-', '_').toUpperCase()}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {selectedReliability && (
        <div className="bg-[#26150F] border border-amber-950/60 p-3.5 space-y-1 text-left font-sans text-xs animate-fadeIn">
          <span className="mono text-[8.5px] text-amber-500 font-bold uppercase tracking-widest block">
            CONSTRUCTED ARGUMENT SYNTHESIS
          </span>
          <div className="text-amber-100 font-medium leading-relaxed font-serif">
            {(() => {
              const mainItem = inventory.find(e => e.id === selectedContradictionId);
              const justificationItem = inventory.find(e => e.id === selectedJustificationId);
              const rName = selectedReliability.replace('_', ' ').toUpperCase();
              
              let synthesisText = "";
              let isExactChain = false;

              const isHighPressure = pressureMeter !== undefined && pressureMeter > 65;
              const mainName = mainItem ? mainItem.name : "[Select Primary Forensic Exhibit in Step 2]";

              if (selectedContradictionId === 'wa-ss' && selectedReliability === 'pressure') {
                if (selectedJustificationId === 'cbi-logo') {
                  isExactChain = true;
                  synthesisText = `The WhatsApp screenshot (${mainItem?.name}) shows direct coercion under BNS Section 308. This pressure is corroborated by the fake CBI logo (${justificationItem?.name}), proving the scammers used forged federal credentials to terrify Virendra and force his compliance.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The WhatsApp screenshot (${mainItem?.name}) shows digital threats. However, using ${justificationItem?.name} as justification does not help prove how fake federal authority was used to coerce him under BNS Section 308.`;
                } else {
                  synthesisText = `Select a supporting exhibit to complete the coercion argument under BNS Section 308.`;
                }
              } else if (selectedContradictionId === 'cbi-logo' && selectedReliability === 'memory_error') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `Sub-Inspector Mishra's memory of finding a physical 'gold seal stamp' is disproved by the fake CBI logo (${mainItem?.name}). This mistake is corroborated by the digital WhatsApp screenshot (${justificationItem?.name}), showing that Mishra mistook a digital overlay seen in phone screenshots for an actual physical stamp during the high-stress raid.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The CBI logo analysis (${mainItem?.name}) proves the physical crest never existed. However, using ${justificationItem?.name} as justification does not explain why the officer mistakenly remembered it as a physical stamp.`;
                } else {
                  synthesisText = `Select a supporting exhibit to explain the officer's memory error.`;
                }
              } else if (selectedContradictionId === 'newspaper-cji' && selectedReliability === 'deception') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `The newspaper report (${mainItem?.name}) proves the Chief Justice was in Delhi, not Lucknow. This directly disproves the CBI logs (${justificationItem?.name}) claiming a barracks custody meeting in Lucknow, establishing a deliberate lie and perjury under BNS Section 318.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The newspaper report (${mainItem?.name}) places the CJI in Delhi. To expose a deliberate lie, you must match this proof with the digital statements and logs (${justificationItem?.name}) that carried the fake Lucknow alibi.`;
                } else {
                  synthesisText = `Select a supporting exhibit to expose the perjury.`;
                }
              } else if (selectedContradictionId === 'zero-fir-receipt' && selectedReliability === 'procedural_confusion') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `The Zero FIR receipt (${mainItem?.name}) proves legal compliance under BNSS Section 173. Citing the WhatsApp screenshot (${justificationItem?.name}) as support proves the crime was purely online, which overrides physical district limits and regional borders.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The Zero FIR receipt (${mainItem?.name}) validates swift procedure. However, to override geographical borders, you must support this with direct proof of the electronic nature (${justificationItem?.name}) of the crime.`;
                } else {
                  synthesisText = `Select a supporting exhibit to override physical boundaries.`;
                }
              } else {
                synthesisText = `Diagnosing ${rName} with ${mainName}. ${justificationItem ? `Corroborating factor linked via ${justificationItem.name}.` : 'Choose a corroborating exhibit to complete your statement.'}`;
              }

              return (
                <>
                  <p className="leading-snug text-[10.5px] font-sans text-amber-100/90">{synthesisText}</p>
                  {isHighPressure ? (
                    <p className="text-[8.5px] mt-2 p-1.5 border font-mono flex items-center gap-1.5 bg-[#20100B] text-amber-500/60 border-amber-950/40 italic">
                      ⚖️ HIGH PRESSURE: Verification previews are suppressed under bench scrutiny. Trust your theory.
                    </p>
                  ) : (
                    <p className={`text-[8.5px] mt-2 p-1.5 border font-mono flex items-center gap-1.5 ${
                      isExactChain 
                        ? 'bg-emerald-950/20 text-[#6FCF97] border-[#6FCF97]/20' 
                        : 'bg-[#1A0D08] text-amber-500 border-amber-950/40'
                    }`}>
                      {isExactChain ? (
                        <>⚖️ LEGAL REASONING COHERENT (Double-Link chain formed!)</>
                      ) : (
                        <>⚖️ LOGICAL JUSTIFICATION: Pending complete legal reasoning chain...</>
                      )}
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

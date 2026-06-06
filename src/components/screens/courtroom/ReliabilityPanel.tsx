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
}

export default function ReliabilityPanel({
  selectedReliability,
  onSelect,
  selectedContradictionId,
  selectedJustificationId,
  onSelectJustification,
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
        <div className="space-y-2 pt-3 border-t border-[#5A3D2D]/30 animate-fadeIn">
          <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
            3.1 Specify Corroborating Evidence (Justification)
          </div>
          <p className="text-[7.5px] text-amber-100/40 italic leading-snug">
            Choose an independent corroborating exhibit to complete the legal reasoning chain.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {inventory
              .filter(item => item.id !== selectedContradictionId)
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

      {selectedContradictionId && selectedReliability && (
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

              if (selectedContradictionId === 'wa-ss' && selectedReliability === 'pressure') {
                if (selectedJustificationId === 'cbi-logo') {
                  isExactChain = true;
                  synthesisText = `The WhatsApp screenshot (${mainItem?.name}) provides primary proof of coercion (BNS Sec 308). This pressure is heavily corroborated by the counterfeit CBI logo analysis (${justificationItem?.name}), establishing that the threat actors deployed high-grade synthetic federal authority (impersonation badges) to completely hijack and override the schoolmaster's voluntary agency.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The WhatsApp screenshot (${mainItem?.name}) shows digital threats. However, utilizing ${justificationItem?.name} as justification fails to map the psychological weapon of false federal authority that overpowered the counselor under BNS 308.`;
                } else {
                  synthesisText = `Select a corroborating justification exhibit to complete the legal reasoning chain for high-pressure extortion.`;
                }
              } else if (selectedContradictionId === 'cbi-logo' && selectedReliability === 'memory_error') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `Sub-Inspector Mishra's memory of recovering a physical 'gold seal stamp' with this logo is discredited by the CBI logo analysis (${mainItem?.name}). This memory error is corroborated by the virtual environment of the WhatsApp screenshot (${justificationItem?.name}), proving the entire threat cycle was executed over a digital-only channel—causing cognitive source-monitoring error during the high-stress raid.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The CBI logo analysis (${mainItem?.name}) proves the physical crest is synthetic. However, citing ${justificationItem?.name} as justification does not establish the virtual interaction context (WhatsApp execution) that triggered the SI's memory reconstruction error.`;
                } else {
                  synthesisText = `Select a corroborating justification exhibit to explain the officer's visual memory error.`;
                }
              } else if (selectedContradictionId === 'newspaper-cji' && selectedReliability === 'deception') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `The Daily Newspaper report (${mainItem?.name}) proves Chief Justice G. Singh was presiding in Supreme Court Room 1 in New Delhi. This directly falsifies the CBI poser threat logs (${justificationItem?.name}) asserting Lucknow barracks custody warrant meetings, establishing deliberate, coordinated perjury and deception (BNS Sec 318).`;
                } else if (selectedJustificationId) {
                  synthesisText = `The Newspaper report (${mainItem?.name}) places the CJI in Delhi. However, to construct a complete perjury argument, this must be explicitly cross-referenced with the digital call logs and threat transcripts (${justificationItem?.name}) that carried the false alibi statements.`;
                } else {
                  synthesisText = `Select the primary call transcript or threat context as a corroborating exhibit to expose perjury.`;
                }
              } else if (selectedContradictionId === 'zero-fir-receipt' && selectedReliability === 'procedural_confusion') {
                if (selectedJustificationId === 'wa-ss') {
                  isExactChain = true;
                  synthesisText = `The Zero FIR receipt (${mainItem?.name}) proves legal compliance under BNSS Section 173. Citing the WhatsApp screenshot (${justificationItem?.name}) as corroborative support proves that the crime was purely electronic, which by supreme statute overrides all regional police jurisdiction codes and physical territory locks.`;
                } else if (selectedJustificationId) {
                  synthesisText = `The Zero FIR receipt (${mainItem?.name}) validates swift procedure. However, to rule Hazratganj's territorial boundary refusal void, you must corroborate the procedural confusion with direct proof of the electronic nature (${justificationItem?.name}) of the crime.`;
                } else {
                  synthesisText = `Select a corroborating justification exhibit to override physical territorial boundaries.`;
                }
              } else {
                synthesisText = `Diagnosing ${rName} on ${mainItem?.name}. ${justificationItem ? `Corroborating factor linked via ${justificationItem.name}.` : 'Choose a corroborating exhibit to complete your statement.'}`;
              }

              return (
                <>
                  <p className="leading-snug text-[10.5px] font-sans text-amber-100/90">{synthesisText}</p>
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

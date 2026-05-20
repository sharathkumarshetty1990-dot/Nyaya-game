import React, { useState, useEffect } from 'react';
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
  Stamp,
  RefreshCw,
  Clock,
  Eye,
  Sliders,
  AlertTriangle,
  ZoomIn,
  CheckCircle2,
  XCircle,
  Hash,
  Activity,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface VerificationScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface HypothesisOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

const HYPOTHESES: Record<string, HypothesisOption[]> = {
  'wa-ss': [
    {
      id: 'wa-h1',
      text: "The phone's internal clock automatically drifted backward from Lucknow NTP towers because the device was off for hours.",
      isCorrect: false,
      explanation: "Incorrect. Modern cellular devices synchronize with local cell carrier towers within microseconds. Drift errors are microscopic, not 5 hours 30 minutes exact integer steps."
    },
    {
      id: 'wa-h2',
      text: "International proxy routing relay. Scammers used VoIP trunk lines with custom India (+91) spoof maps, but original metadata headers expose standard UTC (London/Europe) timestamps localization errors.",
      isCorrect: true,
      explanation: "Outstanding Deduction! A classic 'Digital Arrest' calling mechanism using virtual VoIP trunk lines. While the display mask shows +91 coordinates, the original file-packets are GMT-registered."
    },
    {
      id: 'wa-h3',
      text: "Virendra Sharma manually changed his phone clock to GMT to support an alibi for his digital transaction timeline.",
      isCorrect: false,
      explanation: "Incorrect. Third-party central banking logs verify the liquid transfer was initiated from Sharma's local bank IP concurrently at 10:30 AM IST. Sharma is logically and factually a victim."
    }
  ],
  'cbi-logo': [
    {
      id: 'cbi-h1',
      text: "Normal camera sensor distortion. Uniform khakhi threads warped the lens's organic focus field, creating a jagged edge.",
      isCorrect: false,
      explanation: "Incorrect. Sensor focus and blur fields are mathematically progressive. Sudden rectangular vector shifts and pixel boundary isolation filters confirm synthetic overlay borders."
    },
    {
      id: 'cbi-h2',
      text: "Synthesized pixel overlay overlay. Spectral analysis maps isolated pixel groupings where a high-resolution digital CBI logo was superimposed onto generic khakhi cloth, proving physical fraud.",
      isCorrect: true,
      explanation: "Brilliant analysis! High-frequency filters reveal a perfect boundary line where the pixels do not match the low-grain organic fabric texture. The uniform was completely simulated."
    },
    {
      id: 'cbi-h3',
      text: "Camera lens dust landing exactly on the uniform boundary during the suspect's move, causing microburst shadows.",
      isCorrect: false,
      explanation: "Incorrect. Dust particles disperse randomly, creating soft-edge shadows. They never follow exact 90-degree synthetic resolution angles."
    }
  ],
  'newspaper-cji': [
    {
      id: 'news-h1',
      text: "Genuine high-acid paper offsets. Microscopically resolved cyan/yellow CMYK rosettes and hollow ink diffusion patterns match physical newspaper print, verifying raw April 14th daily authenticity.",
      isCorrect: true,
      explanation: "Excellent check! Genuine newspapers of high acid-index use high-pressure roller offset ink which displays capillary tooth bleed under microscopic resolution. This proves physical daily origin on April 14th."
    },
    {
      id: 'news-h2',
      text: "A highly complex offices spoof printed yesterday on standard office copy laser machines, mimicking traditional rosettes.",
      isCorrect: false,
      explanation: "Incorrect. High-resolution laser printers fuse micro-toner plastic powder onto paper at extreme heat, yielding perfectly round ink droplets with zero paper-tooth wood-pulp seeping."
    },
    {
      id: 'news-h3',
      text: "An ink-jet replica using water-based inks that naturally diffused across high-grade photo quality satin paper.",
      isCorrect: false,
      explanation: "Incorrect. Inkjet printers spray mist nozzles resulting in high saturation blotches, lacking the rigid honeycomb rosette pattern typical of physical news presses."
    }
  ]
};

interface TimelineItem {
  id: string;
  label: string;
  source: string;
  timeLabel: string;
  sortOrder: number;
}

export default function VerificationScreen({ gameState, setGameState }: VerificationScreenProps) {
  const [selectedEvidenceIdx, setSelectedEvidenceIdx] = useState<number>(0);
  const selectedEvidence = gameState.inventory[selectedEvidenceIdx];

  // Forensic Diagnostics State
  const [diagnosticTask, setDiagnosticTask] = useState<'idle' | 'scanning' | 'solved' | 'failed' | 'interpreting'>('idle');
  const [activeLens, setActiveLens] = useState<'none' | 'quantization' | 'gamma' | 'edge'>('none');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [timezoneDialOffset, setTimezoneDialOffset] = useState<number>(0); // dial for wa-ss EXIF timezone
  const [exifVerified, setExifVerified] = useState<boolean>(false);
  const [dotResolution, setDotResolution] = useState<number>(150); // slider for newspaper dots
  const [newspaperDotsScanned, setNewspaperDotsScanned] = useState<boolean>(false);

  // Uncertainty Logic / Interpretation states
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [hypothesisResult, setHypothesisResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Timeline Reconstruction Puzzle
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    { id: 't-safe', label: "Principal Sharma is forced to initiate safe-keeping escrow transfer", source: "Bank Wire Log", timeLabel: "10:30 AM IST", sortOrder: 0 },
    { id: 't-cbi', label: "Inspector Amit Sen starts live WhatsApp video call from claimed 'Lucknow Barracks'", source: "WhatsApp Screenshot", timeLabel: "10:00 AM IST", sortOrder: 0 },
    { id: 't-cji', label: "Chief Justice G. Singh arrives at Supreme Court Courtroom 1 in New Delhi", source: "Times Print Clipping", timeLabel: "11:00 AM IST", sortOrder: 0 }
  ]);
  const [timelineSolved, setTimelineSolved] = useState<boolean>(false);
  const [timelineFeedback, setTimelineFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Reset diagnostics whenever active evidence changes
    setDiagnosticTask('idle');
    setActiveLens('none');
    setSelectedHotspot(null);
    setExifVerified(false);
    setSelectedHypothesisId(null);
    setHypothesisResult(null);
  }, [selectedEvidenceIdx]);

  const updateEvidence = (id: string, updates: Partial<Evidence>) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const handleRunDiagnosticScan = () => {
    if (!selectedEvidence) return;
    setDiagnosticTask('scanning');
    
    setTimeout(() => {
      // Different resolution requirements based on the item
      if (selectedEvidence.id === 'wa-ss') {
        if (timezoneDialOffset === -330) { // Matching UTC-5:30 proxy offset
          setDiagnosticTask('interpreting');
          setExifVerified(true);
        } else {
          setDiagnosticTask('failed');
        }
      } else if (selectedEvidence.id === 'cbi-logo') {
        if (selectedHotspot === 'badge-edge' && activeLens === 'edge') {
          setDiagnosticTask('interpreting');
        } else {
          setDiagnosticTask('failed');
        }
      } else {
        // Newspaper
        if (dotResolution >= 280) {
          setDiagnosticTask('interpreting');
          setNewspaperDotsScanned(true);
        } else {
          setDiagnosticTask('failed');
        }
      }
    }, 1200);
  };

  const handleSelectHypothesis = (hyp: HypothesisOption) => {
    setSelectedHypothesisId(hyp.id);
    if (hyp.isCorrect) {
      setHypothesisResult({
        isCorrect: true,
        feedback: hyp.explanation
      });
      
      const verifiedItem = GameEngine.verifyEvidence(selectedEvidence, gameState);
      // Give a physical boost to credibility on correct interpretation
      const credibilityBoost = selectedEvidence.id === 'newspaper-cji' ? 100 : Math.min(100, (verifiedItem.credibility || 50) + 15);
      
      updateEvidence(selectedEvidence.id, {
        ...verifiedItem,
        credibility: credibilityBoost,
        authenticityRisk: `Verified Interpretive Dossier: ${hyp.text}`
      });

      // Grant legal score and ease pressure on outstanding truth determination
      setGameState(prev => ({
        ...prev,
        legalScore: Math.min(100, prev.legalScore + 15),
        justiceScore: Math.min(100, prev.justiceScore + 15),
        pressureMeter: Math.max(0, prev.pressureMeter - 10)
      }));

      setDiagnosticTask('solved');
    } else {
      setHypothesisResult({
        isCorrect: false,
        feedback: hyp.explanation
      });
      // Stiff penalty for speculative or incorrect narrative theories
      setGameState(prev => ({
         ...prev,
         pressureMeter: Math.min(100, prev.pressureMeter + 15)
      }));
    }
  };

  // Re-order timeline items manually
  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...timelineItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    
    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setTimelineItems(newItems);
  };

  // Verify chronology logic
  const handleVerifyTimeline = () => {
    // Correct absolute order should be:
    // 1. Amit Sen CBI Call (10:00 AM IST) - id: t-cbi
    // 2. Fund safe-keeping transfer (10:30 AM IST) - id: t-safe
    // 3. CJI Delhi Hearing (11:00 AM IST) - id: t-cji
    
    const correctIds = ['t-cbi', 't-safe', 't-cji'];
    const currentIds = timelineItems.map(item => item.id);
    const isCorrect = correctIds.every((id, idx) => currentIds[idx] === id);

    if (isCorrect) {
      setTimelineSolved(true);
      setTimelineFeedback("TIMELINE MATCH SUCCESSFUL! By arranging these events, you present the classic 'temporal impossibility'—Inspector Amit Sen claimed that as late as 10:45 AM, the Chief Justice was actively sitting with him in the Lucknow office. However, official records prove the CJI's New Delhi hearing convened at 11:00 AM, making a concurrent Lucknow alibi a physical and logistical fabrication. Excellent deduction! The court chain has been cryptographically certified under BSAC!");
      
      // Auto-certify all DIGITAL evidence in inventory as a major prize!
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 20),
        legalScore: Math.min(100, prev.legalScore + 15),
        inventory: prev.inventory.map(e => {
          if (e.type === 'DIGITAL') {
            return {
              ...e,
              authenticity: AuthenticityStatus.VERIFIED,
              admissibility: AdmissibilityStatus.ADMITTED,
              hasBSACertificate: true,
              admissibilityStrength: 95,
              courtConfidence: Math.round(0.6 * (e.credibility || 75) + 0.4 * 95)
            };
          }
          return e;
        })
      }));
    } else {
      setTimelineSolved(false);
      setTimelineFeedback("CHRONOLOGY ALIGNMENT ERROR: The metadata packets do not align. Look closely at the timestamps. Propping up a transaction *before* the scam call was placed would break immediate causality loops!");
      setGameState(prev => ({ ...prev, pressureMeter: Math.min(100, prev.pressureMeter + 8) }));
    }
  };

  const nextPhase = () => {
    const nextPhase = GameEngine.getNextPhase(gameState.phase);
    setGameState(prev => ({ ...prev, phase: nextPhase }));
  };

  const isUnderPressure = gameState.pressureMeter > 50;

  return (
    <div className={`flex-1 flex flex-col bg-[#0B0C10] text-[#C5C6C7] overflow-hidden ${isUnderPressure ? 'relative font-sans text-red-100' : ''}`}>
      {/* Glitch & Pressure Overlays */}
      {isUnderPressure && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-red-900 to-red-600 animate-pulse z-40" />
      )}

      {/* Extreme Pressure Distortions */}
      {isUnderPressure && (
        <div className="bg-red-950/40 border-y border-red-500/20 px-4 py-2 flex items-center justify-between text-[10px] text-red-400 font-bold tracking-widest uppercase animate-shake overflow-hidden select-none">
          <div className="flex items-center gap-2">
            <AlertOctagon size={12} className="animate-spin text-red-500" />
            <span>WARNING: BENCH PATIENCE BREAKING // OUT-OF-SEQUENCE DEVIATIONS FLAGGED</span>
          </div>
          <span className="mono text-[8px] animate-pulse">INTEGRITY_INDEX: {100 - gameState.pressureMeter}%</span>
        </div>
      )}

      {/* Evidence Strip */}
      <div className="h-16 border-b border-[#1F2833] bg-[#1F2833]/20 flex overflow-x-auto shrink-0 touch-pan-x select-none">
        {gameState.inventory.map((item, idx) => {
          const isSel = idx === selectedEvidenceIdx;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedEvidenceIdx(idx)}
              className={`min-w-[160px] md:min-w-56 border-r border-[#1F2833] p-4 flex flex-col justify-center transition-all text-left shrink-0 font-sans relative ${
                isSel ? 'bg-[#66FCF1]/10 border-b-2 border-b-[#66FCF1]' : 'opacity-40 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                 <span className={`mono text-[10px] md:text-[11px] font-bold truncate ${isSel ? 'text-[#66FCF1]' : 'text-[#C5C6C7]'}`}>{item.name}</span>
                 {item.hasBSACertificate && <ShieldCheck size={12} className="text-[#6FCF97]" />}
              </div>
              <span className="mono text-[8px] opacity-60 uppercase">{item.authenticity} // {item.type}</span>
            </button>
          );
        })}
        {gameState.inventory.length === 0 && (
          <div className="flex items-center px-6 text-red-500/40 mono text-[10px] italic font-bold">
            NO EVIDENCE SECURED // COLLECT EXHIBITS FROM THE CASE HUB
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Verification Board Container */}
        <main className="flex-1 p-4 md:p-6 bg-[#0B0C10] flex flex-col gap-6 overflow-y-auto">
          {selectedEvidence ? (
            <div className="max-w-5xl mx-auto w-full space-y-6">
              
              {/* Top Summary Frame */}
              <div className="border border-[#1F2833] bg-[#11141a] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                 <div className="space-y-1 max-w-xl">
                    <span className="mono text-[9px] text-[#66FCF1] font-bold uppercase tracking-widest flex items-center gap-1.5"><Fingerprint size={12}/> ANALYZING CASE FILE</span>
                    <h3 className="text-xl font-bold text-white tracking-wide">{selectedEvidence.name}</h3>
                    <p className="text-xs text-[#C5C6C7]/60 italic">"{selectedEvidence.description}"</p>
                 </div>

                 {/* Integrated Split Scores Display */}
                 <div className="grid grid-cols-3 gap-2 w-full md:w-auto shrink-0 max-w-md">
                    <div className="p-3 bg-black/40 border border-[#1F2833] text-left">
                       <span className="mono text-[8px] opacity-40 uppercase block leading-none mb-1">Authenticity</span>
                       <span className="mono font-bold text-xs text-[#6FCF97]">{selectedEvidence.credibility || 30}%</span>
                       <div className="w-12 h-1 bg-black/50 mt-1 relative overflow-hidden">
                          <div className="h-full bg-[#6FCF97]" style={{ width: `${selectedEvidence.credibility || 30}%` }} />
                       </div>
                    </div>
                    <div className="p-3 bg-black/40 border border-[#1F2833] text-left">
                       <span className="mono text-[8px] opacity-40 uppercase block leading-none mb-1">Admissibility</span>
                       <span className="mono font-bold text-xs text-[#66FCF1]">{selectedEvidence.admissibilityStrength || 10}%</span>
                       <div className="w-12 h-1 bg-black/50 mt-1 relative overflow-hidden">
                          <div className="h-full bg-[#66FCF1]" style={{ width: `${selectedEvidence.admissibilityStrength || 10}%` }} />
                       </div>
                    </div>
                    <div className="p-3 bg-black/40 border border-[#1F2833] text-left">
                       <span className="mono text-[8px] opacity-40 uppercase block leading-none mb-1">Bench Sway</span>
                       <span className="mono font-bold text-xs text-[#DC3D2C]">{selectedEvidence.judgeImpact || 60}%</span>
                       <div className="w-12 h-1 bg-black/50 mt-1 relative overflow-hidden">
                          <div className="h-full bg-[#DC3D2C]" style={{ width: `${selectedEvidence.judgeImpact || 60}%` }} />
                       </div>
                    </div>
                 </div>
              </div>              {/* Multi-Interactive Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                 
                 {/* Left Panel: Logic Constraints and Diagnostics Controls */}
                 <div className="border border-[#1F2833] bg-[#11141a]/60 p-5 space-y-6 flex flex-col justify-between">
                    <div className="space-y-5">
                       <span className="mono text-[10px] font-bold text-[#66FCF1] uppercase tracking-widest block border-b border-[#1F2833] pb-2">Forensic Interpretation Diagnostics</span>
                       
                       {diagnosticTask !== 'interpreting' && (
                         <>
                           {/* Diagnostic options based on selected evidence */}
                           {selectedEvidence.id === 'wa-ss' && (
                             <div className="space-y-4">
                                <p className="text-xs text-[#C5C6C7]/70 leading-relaxed">
                                  This WhatsApp screenshot displays <strong>10:14 AM IST</strong>. However, examine the timestamp server packet origin. Under the UTC timezone layer, the packet shows a local clock discrepant by <strong>minus 5 hours 30 minutes</strong>! Set the EXIF timezone correction dial to reveal the actual offset mask.
                                </p>
                                
                                <div className="p-4 bg-black/30 border border-[#1F2833] space-y-4">
                                   <div className="flex justify-between items-center text-xs">
                                      <span className="mono text-[#C5C6C7]/60">UTC dial adjustment</span>
                                      <span className="mono font-bold text-[#66FCF1]">{timezoneDialOffset === 0 ? "UTC (Original)" : timezoneDialOffset === -330 ? "UTC +5:30 (India Standard)" : `UTC Offset: ${timezoneDialOffset}m`}</span>
                                   </div>
                                   <input 
                                     type="range"
                                     min="-360"
                                     max="0"
                                     step="30"
                                     value={timezoneDialOffset}
                                     onChange={(e) => setTimezoneDialOffset(Number(e.target.value))}
                                     disabled={exifVerified || diagnosticTask === 'solved'}
                                     className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-[#66FCF1]"
                                   />
                                   <div className="flex justify-between text-[9px] mono opacity-40">
                                      <span>-6.0 hrs</span>
                                      <span>-5.5 hrs (IST)</span>
                                      <span>0.0 hrs (UTC)</span>
                                   </div>
                                </div>
                             </div>
                           )}

                           {selectedEvidence.id === 'cbi-logo' && (
                             <div className="space-y-4">
                                <p className="text-xs text-[#C5C6C7]/70 leading-relaxed">
                                  A low-resolution patch from the mock CBI jacket shows severe compression irregularities. Run a <strong>Frequency Lens Filter Scan</strong> over the stitching boundaries to verify edge pixel consistency.
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                   {['quantization', 'gamma', 'edge'].map((lens) => (
                                    <button
                                       key={lens}
                                       disabled={diagnosticTask === 'solved'}
                                       onClick={() => setActiveLens(lens as any)}
                                       className={`p-2 border mono text-[9px] font-bold uppercase ${activeLens === lens ? 'bg-[#66FCF1]/20 border-[#66FCF1] text-white' : 'bg-black/40 border-[#1F2833] text-[#C5C6C7]/50 hover:border-[#66FCF1]'}`}
                                    >
                                       {lens} lens
                                    </button>
                                   ))}
                                </div>
                             </div>
                           )}

                           {selectedEvidence.id === 'newspaper-cji' && (
                             <div className="space-y-4">
                                <p className="text-xs text-[#C5C6C7]/70 leading-relaxed">
                                   Verify this Lucknow Times print clipping by zooming deep into the cold-set offset ink. Adjust the DPI resolution dial above <strong>280 DPI</strong> to resolve physical scan artifacts vs synthetic print simulations.
                                </p>

                                <div className="p-4 bg-black/30 border border-[#1F2833] space-y-3">
                                   <div className="flex justify-between text-xs">
                                      <span className="mono">Micro-dot Resolution</span>
                                      <span className="mono font-bold text-[#66FCF1]">{dotResolution} DPI</span>
                                   </div>
                                   <input 
                                     type="range"
                                     min="150"
                                     max="350"
                                     step="10"
                                     value={dotResolution}
                                     disabled={diagnosticTask === 'solved'}
                                     onChange={(e) => setDotResolution(Number(e.target.value))}
                                     className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-[#66FCF1]"
                                   />
                                </div>
                             </div>
                           )}

                           {/* Adversarial Flaw Checklist */}
                           <div className="p-3 bg-black/40 border border-red-950/40 space-y-2">
                              <span className="mono text-[8.5px] text-red-400 font-bold uppercase tracking-widest block">Adversarial Integrity Check</span>
                              <p className="text-[10px] text-[#C5C6C7]/70 italic leading-snug">
                                 "{selectedEvidence.authenticityRisk}"
                              </p>
                           </div>
                         </>
                       )}

                       {/* Interactive Decisive Dilemma Hypotheses Choice */}
                       {diagnosticTask === 'interpreting' && (
                         <div className="space-y-4 border border-amber-500/30 bg-amber-950/20 p-4 transition-all duration-300">
                            <div className="flex items-center gap-2 text-amber-500">
                               <AlertTriangle size={14} className="animate-pulse" />
                               <span className="mono text-[10px] font-bold uppercase tracking-widest">Interpretation Action Required</span>
                            </div>
                            <p className="text-xs text-[#C5C6C7]/85 leading-relaxed">
                               Digital calibration verified! Select the correct legal or forensic interpretation of this technical anomaly under uncertainty:
                            </p>

                            <div className="space-y-3">
                               {HYPOTHESES[selectedEvidence.id]?.map(hyp => {
                                  const isSelected = selectedHypothesisId === hyp.id;
                                  return (
                                     <button
                                        key={hyp.id}
                                        onClick={() => handleSelectHypothesis(hyp)}
                                        className={`w-full p-3 border text-left text-xs transition-all relative flex flex-col justify-center ${
                                           isSelected
                                             ? hyp.isCorrect
                                               ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-lg'
                                               : 'bg-red-950/40 border-red-500 text-red-200'
                                             : 'bg-black/30 border-[#1F2833] hover:border-amber-500/50 text-[#C5C6C7]'
                                        }`}
                                     >
                                        <div className="flex items-start gap-2">
                                           <div className="w-3.5 h-3.5 mt-0.5 rounded-full border border-[#1F2833] flex items-center justify-center shrink-0">
                                              {isSelected && <div className={`w-1.5 h-1.5 rounded-full ${hyp.isCorrect ? 'bg-emerald-400' : 'bg-red-400'}`} />}
                                           </div>
                                           <span className="font-sans text-[11px] font-semibold leading-snug">{hyp.text}</span>
                                        </div>
                                     </button>
                                  );
                               })}
                            </div>

                            {hypothesisResult && (
                               <div className={`p-3 border text-xs leading-relaxed transition-all ${hypothesisResult.isCorrect ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' : 'bg-red-950/20 border-red-500/20 text-red-300'}`}>
                                  <div className="mono font-bold uppercase text-[9px] mb-1">{hypothesisResult.isCorrect ? "✓ CORPUS RESOLVED" : "✘ REDUCTIO SPECULATIVE"}</div>
                                  <p className="font-serif italic leading-snug">{hypothesisResult.feedback}</p>
                                  
                                  {!hypothesisResult.isCorrect && (
                                     <button 
                                        onClick={() => {
                                           setSelectedHypothesisId(null);
                                           setHypothesisResult(null);
                                        }}
                                        className="mt-2 text-[10px] text-red-400 uppercase font-mono tracking-wider hover:underline block"
                                     >
                                        Retry deduction theory
                                     </button>
                                  )}
                               </div>
                            )}
                         </div>
                       )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#1F2833]">
                       {diagnosticTask === 'scanning' ? (
                          <div className="h-11 bg-[#66FCF1]/5 border border-[#66FCF1]/30 flex items-center justify-center gap-2 text-xs mono text-[#66FCF1] tracking-widest font-bold">
                             <RefreshCw className="animate-spin text-[#66FCF1]" size={14} />
                             PROBING COALESCENT BYTES...
                          </div>
                       ) : diagnosticTask === 'interpreting' ? (
                          <div className="h-11 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-xs mono text-amber-500 tracking-widest font-bold">
                             <AlertCircle size={14} className="animate-pulse" />
                             DECIDE ANOMALY HYPOTHESIS
                          </div>
                       ) : diagnosticTask === 'solved' ? (
                          <div className="h-11 bg-[#6FCF97]/10 border border-[#6FCF97]/40 flex items-center justify-center gap-2 text-xs mono text-[#6FCF97] tracking-widest font-bold">
                             <CheckCircle2 size={14} />
                             DIAGNOSTIC PROTOCOL SOLVED
                          </div>
                       ) : (
                          <button
                            onClick={handleRunDiagnosticScan}
                            className="w-full py-3 bg-[#66FCF1] hover:bg-[#45a29e] text-black font-bold mono text-[10px] md:text-xs tracking-widest transition-all uppercase"
                          >
                             ACTIVATE COMPILER DIAGNOSTIC
                          </button>
                       )}

                       {diagnosticTask === 'failed' && (
                          <p className="text-[10px] text-red-400 font-bold tracking-tight mono text-center bg-red-950/20 p-2 border border-red-900/40 animate-pulse">
                             ✘ SCAN FAILED: Calibration vectors mismatch. Re-verify offsets and hotspots!
                          </p>
                       )}
                    </div>
                 </div>

                 {/* Right Panel: Immersive Interactive Diagnostic Board Canvas */}
                 <div className="border border-[#1F2833] bg-black/80 aspect-square flex flex-col justify-between p-4 relative overflow-hidden select-none">
                     
                     {/* Immersive Grid Canvas UI overlay */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2833_1px,transparent_1px),linear-gradient(to_bottom,#1f2833_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

                     <div className="flex justify-between items-center text-[9px] mono text-[#66FCF1] border-b border-[#1F2833]/40 pb-2 relative z-10">
                        <span>CANVAS DIAGNOSTIC WINDOW // CORE_RENDER</span>
                        <div className="flex items-center gap-1.5">
                           <Activity size={10} className="text-[#66FCF1] animate-pulse" />
                           <span>LIVE_VEC</span>
                        </div>
                     </div>

                     {/* Main Render based on Evidence */}
                     <div className="flex-1 flex items-center justify-center relative z-10 my-4">
                        {selectedEvidence.id === 'wa-ss' && (
                           <div className="max-w-[190px] md:max-w-xs w-full bg-[#1a1c23] border border-[#1F2833] p-4 flex flex-col justify-between text-xs space-y-4 shadow-2xl relative">
                              {/* Glowing signal dots */}
                              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#66FCF1] animate-ping" />
                              <div className="bg-[#0B0C10] p-2 border border-[#1F2833] text-[9.5px]">
                                 <div className="mono font-bold text-red-400 uppercase tracking-tighter mb-1 select-none">🚨 SECURITY PARITY DISCOVERY</div>
                                 <div className="font-bold text-white leading-tight mb-2 select-none">"CBI_Lucknow Cyber_Protocol locked Amit_Sen_CBI."</div>
                                 <div className="flex justify-between text-[8px] mono text-[#C5C6C7]/60">
                                    <span>Dial Angle: {timezoneDialOffset}°</span>
                                    <span>Offset Check: {timezoneDialOffset === -330 ? "PASS✓" : "FAIL✘"}</span>
                                 </div>
                              </div>
                              <div className="space-y-2 text-[10px]">
                                 <div className="flex justify-between border-b border-[#1f2833] pb-1 font-sans">
                                    <span className="opacity-40">Device Clock:</span>
                                    <span className="font-bold text-white font-mono">10:14 AM IST</span>
                                 </div>
                                 <div className="flex justify-between border-b border-[#1f2833] pb-1 font-sans">
                                    <span className="opacity-40">Actual Broadcast:</span>
                                    <span className={`font-bold font-mono ${timezoneDialOffset === -330 ? 'text-[#6FCF97]' : 'text-red-400'}`}>
                                       {timezoneDialOffset === -330 ? "04:44 AM UTC" : "Divergent Epoch Packet"}
                                    </span>
                                 </div>
                              </div>
                              <span className="mono text-[8px] opacity-20 block text-right">SEC_ENCRYPTED_WA_PROTOCOL</span>
                           </div>
                        )}

                        {selectedEvidence.id === 'cbi-logo' && (
                           <div className="relative w-56 h-56 border border-[#1F2833] bg-[#1a1c23] shadow-2xl flex flex-col justify-center items-center">
                              {/* Simulating CBI Crest pixel lens */}
                              <div className={`w-28 h-28 rounded-full border border-dashed flex items-center justify-center relative transition-all duration-300 ${activeLens === 'edge' ? 'border-[#66FCF1] bg-[#66FCF1]/5 scale-105' : 'border-white/20'}`}>
                                 <Fingerprint size={48} className={`opacity-80 transition-all ${activeLens === 'edge' ? 'text-[#66FCF1] animate-pulse' : 'text-[#C5C6C7]/50'}`} />
                                 {activeLens === 'edge' && (
                                    <button 
                                      onClick={() => setSelectedHotspot('badge-edge')}
                                      className={`absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white flex justify-center items-center text-[8px] font-bold ${selectedHotspot === 'badge-edge' ? 'bg-[#6FCF97] text-black font-serif' : 'bg-[#DC3D2C] text-white animate-bounce'}`}
                                    >
                                       !
                                    </button>
                                 )}
                              </div>
                              
                              <div className="mt-4 text-center">
                                 <span className="mono text-[9px] bg-black/60 border border-[#1F2833] px-2 py-0.5 text-[#C5C6C7]/80 block mb-1">CBI BADGE FRAME INTERACTIVE</span>
                                 <span className="mono text-[8px] text-[#66FCF1]/60">
                                    {activeLens === 'none' ? "Select specialized lens to scan hotspot" : `Active: ${activeLens} lens scan`}
                                 </span>
                              </div>
                           </div>
                        )}

                        {selectedEvidence.id === 'newspaper-cji' && (
                           <div className="w-56 h-56 border border-line bg-white text-[#2a2a2a] p-4 flex flex-col justify-between relative shadow-2xl">
                              <div className="inline-block px-1.5 py-0.5 bg-[#DC3D2C] text-white mono text-[8px] font-bold absolute top-2 right-2">
                                 PHYSICAL_100%
                              </div>
                              <div className="space-y-2">
                                 <span className="mono font-bold text-[8px] text-gray-400 block tracking-widest uppercase">THE LUCKNOW TIMES // APRIL 14, 2024</span>
                                 <h4 className="font-serif font-black text-xs md:text-sm tracking-tight leading-tight select-none">CJI PRESIDES OVER HISTORIC NATIONAL HEARING IN NEW DELHI</h4>
                                 <p className="text-[10px] leading-tight text-gray-600 italic select-none">
                                    "...Official benches confirm the Chief Justice was physically in Supreme Court Room 1, ruling on administrative mandates throughout the whole morning session."
                                 </p>
                              </div>
                              
                              {dotResolution >= 280 ? (
                                 <div className="flex items-center gap-1 text-[8px] font-bold text-[#6FCF97] bg-green-950 px-2 py-1 uppercase mono border border-green-800">
                                    <CheckCircle2 size={10} /> Valid Print Dot Matrix Resolved
                                 </div>
                              ) : (
                                 <span className="mono text-[8px] text-gray-400 animate-pulse text-center">DPI below print registration. Slider to enhance!</span>
                              )}
                           </div>
                        )}
                     </div>

                     <div className="flex justify-between text-[8px] mono text-[#C5C6C7]/30 border-t border-[#1F2833]/40 pt-2 relative z-10">
                        <span>LENS: {activeLens.toUpperCase()}</span>
                        <span>GRID_CALIBRATED_✓</span>
                     </div>
                 </div>
              </div>

              {/* TIMELINE RECONSTRUCTION GAME MODULE - Active Deduction */}
              <div className="border border-[#1F2833] bg-[#11141a] p-6 space-y-6">
                 <div className="flex justify-between items-center border-b border-[#1F2833] pb-3">
                    <div className="space-y-1">
                       <span className="mono text-[9px] text-[#66FCF1] font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={11} className="text-[#66FCF1]"/> TRUTH DOCKET SEQUENCE</span>
                       <h3 className="text-lg font-bold text-white">Chronological Alibi Cross-Check Suite</h3>
                       <p className="text-xs text-[#C5C6C7]/60">Re-verify the factual timeline of April 14th to prove contradiction and unlock digital custody clearance under BSA Section 63.</p>
                    </div>
                    {timelineSolved ? (
                       <span className="px-3 py-1 border border-[#6FCF97]/40 bg-[#6FCF97]/10 text-[#6FCF97] text-[10px] font-bold uppercase mono tracking-widest block self-start">✓ Sequence Verified</span>
                    ) : (
                       <span className="px-3 py-1 border border-amber-500/30 bg-amber-950/20 text-amber-500 text-[10px] font-bold uppercase mono tracking-widest block self-start animate-pulse">⚡ Chronology Unlocked</span>
                    )}
                 </div>

                 {/* Interactive timeline items box */}
                 <div className="space-y-3">
                    {timelineItems.map((item, index) => (
                       <div 
                         key={item.id}
                         className={`p-4 border border-[#1F2833] bg-[#1B222C]/70 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 ${timelineSolved ? 'border-[#6FCF97]/40 bg-[#6FCF97]/5' : ''}`}
                       >
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-black/50 border border-[#1F2833] flex items-center justify-center text-xs font-bold font-mono text-[#66FCF1]">
                               0{index + 1}
                            </div>
                            <div className="space-y-0.5 max-w-xl">
                               <div className="text-xs font-bold text-white leading-relaxed">{item.label}</div>
                               <div className="flex gap-2 text-[9px] mono text-[#C5C6C7]/50 uppercase">
                                  <span>Source: {item.source}</span>
                                  <span>//</span>
                                  <span className="text-[#66FCF1] font-bold">{item.timeLabel}</span>
                               </div>
                            </div>
                         </div>

                         {/* Arrow Sorting Controls */}
                         <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => moveTimelineItem(index, 'up')}
                              disabled={index === 0 || timelineSolved}
                              className="w-8 h-8 border border-[#1F2833] bg-black/40 text-[#C5C6C7]/60 hover:text-[#66FCF1] flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none"
                            >
                               ▲
                            </button>
                            <button 
                              onClick={() => moveTimelineItem(index, 'down')}
                              disabled={index === timelineItems.length - 1 || timelineSolved}
                              className="w-8 h-8 border border-[#1F2833] bg-black/40 text-[#C5C6C7]/60 hover:text-[#66FCF1] flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none"
                            >
                               ▼
                            </button>
                         </div>
                       </div>
                    ))}
                 </div>

                 {/* Timeline verification console output */}
                 {timelineFeedback && (
                    <div className={`p-4 border ${timelineSolved ? 'bg-[#6FCF97]/10 border-[#6FCF97]/30 text-[#6FCF97]' : 'bg-red-950/20 border-red-500/30 text-red-300'} text-xs leading-relaxed space-y-1`}>
                       <div className="mono font-bold uppercase tracking-wider text-[9px] mb-1">{timelineSolved ? "✓ SUCCESS VERDICT PACKET" : "✘ TEMPORAL ALIGNMENT MISMATCH"}</div>
                       <p className="font-serif italic text-[11px] md:text-xs">"{timelineFeedback}"</p>
                    </div>
                 )}

                 {!timelineSolved && (
                    <button
                      onClick={handleVerifyTimeline}
                      className="w-full py-4 border-2 border-[#1F2833] text-white hover:bg-[#66FCF1] hover:text-black hover:border-accent uppercase tracking-widest bold font-mono text-xs shadow-md transition-all active:translate-y-0.5"
                    >
                       EXECUTE CHRONOLOGICAL CROSS-CHECK
                    </button>
                 )}
              </div>

               {/* Manual Secure System Certificate Action */}
               {selectedEvidence && selectedEvidence.authenticity === AuthenticityStatus.VERIFIED && !selectedEvidence.hasBSACertificate && (
                 <div className="border-2 border-dashed border-[#1F2833] p-6 bg-[#161a22] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 max-w-lg">
                       <h4 className="mono text-sm font-bold text-white uppercase flex items-center gap-1.5"><Stamp size={16} className="text-[#6FCF97]"/> Certify Under Bharatiya Sakshya Adhiniyam Sec 63</h4>
                       <p className="text-xs text-[#C5C6C7]/60">This verified digital asset lacks a valid dual-signature forensic hash. Certify to legally elevate admissibility stats, preventing court exclusions.</p>
                    </div>
                    <button
                       onClick={() => updateEvidence(selectedEvidence.id, GameEngine.certifyEvidence(selectedEvidence))}
                       className="px-6 py-4 bg-[#6FCF97] hover:bg-green-600 text-black font-bold uppercase tracking-widest text-xs mono shrink-0"
                    >
                       ISSUE DIGITAL BSA CERTIFICATE
                    </button>
                 </div>
               )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center mono opacity-10 italic text-[#66FCF1] tracking-widest">
              [NO_ITEM_MOUNTED_IN_LAB]
            </div>
          )}
        </main>

        {/* Action Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l-2 border-[#1F2833] p-6 bg-[#11141a]/60 flex flex-col shrink-0 select-none">
          <div className="col-header tracking-widest text-[#66FCF1] text-[10px] uppercase font-bold mb-4">Forensic Suite Controller</div>
          
          <div className="hidden lg:flex flex-col space-y-4 flex-1">
             <div className="p-4 border border-[#1F2833] bg-[#0c0f13] space-y-3">
                <span className="mono text-[8px] opacity-40 uppercase block">Active Device Target</span>
                <p className="text-[11px] font-bold text-white mono font-mono break-all leading-tight">DEVICE_MAC_LUCKNOW_PORT_88</p>
                <div className="flex justify-between text-[8px] mono">
                   <span className="opacity-40">Active Channel:</span>
                   <span className="text-[#64ffda]">RSA-2048 SHA-256</span>
                </div>
             </div>

             <div className="p-4 border border-[#1F2833] bg-[#0c0f13] space-y-2">
                <span className="mono font-bold text-[9px] text-[#66FCF1] uppercase flex items-center gap-1">
                   <UserCheck size={11} className="text-[#66FCF1]" />
                   Interactive Integrity
                </span>
                <p className="text-[10px] opacity-60 leading-relaxed italic">
                   Under BSA Section 63, screenshot files without strict device signatures are excluded instantly under legal objection. Execute diagnostics to verify internal files, lock timeline structures, and certify files before trial.
                </p>
             </div>
          </div>

          <button 
            onClick={nextPhase}
            className="btn-accent w-full py-5 text-[11px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] mt-8"
          >
            COMMIT_TO_DOCKET
            <ChevronRight size={14} />
          </button>
        </aside>
      </div>
    </div>
  );
}

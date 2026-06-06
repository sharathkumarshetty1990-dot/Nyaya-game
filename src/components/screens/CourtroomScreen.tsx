import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, AuthenticityStatus, AdmissibilityStatus, TrialStepOption, Evidence } from '../../types';
import { GameEngine } from '../../game/gameEngine';
import { resolveDynamicDialogue } from '../../game/characterSystem';
import { LAW_CARDS } from '../../constants';
import { audioService } from '../../game/audio';
import Typewriter from '../Typewriter';
import { 
  Gavel, 
  Scale, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

// Refactored Modular Panels
import TestimonyPanel from './courtroom/TestimonyPanel';
import ReliabilityPanel from './courtroom/ReliabilityPanel';
import EvidencePanel from './courtroom/EvidencePanel';
import JudgePanel from './courtroom/JudgePanel';

interface CourtroomScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentCase: Case;
}

export default function CourtroomScreen({ gameState, setGameState, currentCase }: CourtroomScreenProps) {
  const [step, setStep] = useState(0);
  const [showContradiction, setShowContradiction] = useState(false);
  const [selectedContradictionId, setSelectedContradictionId] = useState<string | null>(null);
  const [selectedReliability, setSelectedReliability] = useState<'deception' | 'memory_error' | 'pressure' | 'procedural_confusion' | null>(null);
  const [selectedJustificationId, setSelectedJustificationId] = useState<string | null>(null);
  const [selectedLawCardId, setSelectedLawCardId] = useState<string | null>(null);
  const [contradictionResult, setContradictionResult] = useState<{
    status: 'success' | 'failure' | 'inadmissible' | 'strong' | 'partial' | 'weak' | null;
    message: string;
  }>({ status: null, message: '' });

  const [selectedOptionOutcome, setSelectedOptionOutcome] = useState<TrialStepOption | null>(null);
  const [pressureAnim, setPressureAnim] = useState(false);
  const [objectionFlash, setObjectionFlash] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.getIsMuted());

  const handleToggleMute = () => {
    const nextMute = audioService.toggleMute();
    setIsMuted(nextMute);
  };

  // Background tension audio pulse setup
  useEffect(() => {
    audioService.startPressureBackingTrack(gameState.pressureMeter);
    return () => {
      audioService.stopPressureBackingTrack();
    };
  }, []);

  useEffect(() => {
    audioService.updatePressure(gameState.pressureMeter);
  }, [gameState.pressureMeter]);

  const trialStep = currentCase.trialFlow[step];

  // Helper to determine modified dialogue on high pressure (delegates to character system profile registry)
  const getDynamicDialogue = (speaker: string, originalText: string) => {
    return resolveDynamicDialogue(speaker, originalText, gameState.pressureMeter);
  };

  const handleNextStep = () => {
    if (step < currentCase.trialFlow.length - 1) {
      const currentStep = currentCase.trialFlow[step];
      
      setGameState(prev => ({
        ...prev,
        pressureMeter: Math.min(100, Math.max(0, prev.pressureMeter + (currentStep.impactOnPressure || 0))),
        justiceScore: Math.min(100, prev.justiceScore + (currentStep.impactOnJustice || 0))
      }));

      if (currentStep.contradictionEvidenceId) {
        // Trigger high-impact Phoenix Wright styled OBJECTION splash
        setObjectionFlash(true);
        audioService.playObjection();
        setTimeout(() => {
          setObjectionFlash(false);
          setShowContradiction(true);
          setSelectedContradictionId(null);
          setSelectedReliability(null);
          setSelectedJustificationId(null);
          setSelectedLawCardId(null);
          setContradictionResult({ status: null, message: '' });
        }, 1100);
      } else {
        audioService.playGavel();
        setStep(step + 1);
      }
    } else {
        audioService.playSuccess();
        const nextPhase = GameEngine.getNextPhase(gameState.phase);
        setGameState(prev => ({ ...prev, phase: nextPhase }));
    }
  };

  const handleSelectOption = (opt: TrialStepOption) => {
    // Check if the option requires specific evidence
    if (opt.evidenceRequiredId) {
      const hasItem = gameState.inventory.find(e => e.id === opt.evidenceRequiredId);
      if (!hasItem) {
        return; // Disabled click (safeguard)
      }
      if (opt.requiresBsaCertificate && !GameEngine.isEvidenceAdmissible(hasItem)) {
        // If they try to choose it but the item is uncertified, they fail
        audioService.playBuzzer();
        setSelectedOptionOutcome({
          ...opt,
          id: 'failed-cert-option',
          text: opt.text + " (PROCEDURAL FAILURE)",
          outcomeDialogue: `Procedural Catastrophe! You tried to present the ${hasItem.name} but without a valid dual-signature certificate under BSA Section 63, the defense counselor objects instantly: 'Counsel relies on raw pixels with zero custody hash! Obvious statutory violation!' Justice G. Singh sustains, scolding you for frivolous digital submission.`,
          impactOnPressure: 20,
          impactOnJustice: -10,
          impactOnLegal: -15
        });
        return;
      }
    }

    audioService.playSuccess();
    setSelectedOptionOutcome(opt);
  };

  const confirmOptionOutcome = () => {
    if (!selectedOptionOutcome) return;

    setGameState(prev => {
      const updatedTrust = { ...prev.npcTrust };
      if (selectedOptionOutcome.npcTrustInfluence) {
        const { npcId, amount } = selectedOptionOutcome.npcTrustInfluence;
        updatedTrust[npcId] = Math.min(5, Math.max(0, (updatedTrust[npcId] || 0) + amount));
      }
      return {
        ...prev,
        legalScore: Math.min(100, prev.legalScore + selectedOptionOutcome.impactOnLegal),
        justiceScore: Math.min(100, prev.justiceScore + selectedOptionOutcome.impactOnJustice),
        pressureMeter: Math.min(100, Math.max(0, prev.pressureMeter + selectedOptionOutcome.impactOnPressure)),
        npcTrust: updatedTrust
      };
    });

    audioService.playGavel();
    setSelectedOptionOutcome(null);
    setStep(step + 1);
  };

  const handleExecuteContradiction = () => {
    if (!selectedContradictionId) return;

    const selectedItem = gameState.inventory.find(e => e.id === selectedContradictionId);
    if (!selectedItem) return;

    // Check if step expects a contradiction
    const expectedEvidenceId = trialStep.contradictionEvidenceId;
    const expectedReliability = trialStep.reliabilityReason;

    if (!expectedEvidenceId) return;

    const isEvidenceCorrect = selectedItem.id === expectedEvidenceId;

    // 1. Evaluate if the selected evidence card actually matches the targets
    if (!isEvidenceCorrect) {
      audioService.playBuzzer();
      let irrMessage = '';
      if (selectedItem.id === 'wa-ss') {
        irrMessage = `REJECTED. WhatsApp call metadata cannot establish officer memory accuracy, alibis, or police boundaries. Unrelated exhibit.`;
      } else if (selectedItem.id === 'cbi-logo') {
        irrMessage = `REJECTED. Pixelated logo analysis is irrelevant to coercion, personal alibis, or police boundaries. Unrelated exhibit.`;
      } else if (selectedItem.id === 'newspaper-cji') {
        irrMessage = `REJECTED. Press reports concerning judicial location are irrelevant to coercion, visual memory, or local police boundaries. Unrelated exhibit.`;
      } else if (selectedItem.id === 'zero-fir-receipt') {
        irrMessage = `REJECTED. Station FIR registration receipts do not prove coercion, recollective accuracy, or travel alibis. Unrelated exhibit.`;
      } else {
        irrMessage = `REJECTED. The presented exhibit has no logical bearing on the witness's statement. Unrelated exhibit.`;
      }

      setContradictionResult({
        status: 'failure',
        message: irrMessage
      });
      setGameState(prev => ({ ...prev, pressureMeter: Math.min(100, prev.pressureMeter + 12) }));
      setPressureAnim(true);
      setTimeout(() => setPressureAnim(false), 500);
      return;
    }

    // 2. Check if the evidence is admissible (BSA sec 63 verification compliance)
    const isAdmissible = GameEngine.isEvidenceAdmissible(selectedItem);
    if (!isAdmissible) {
      audioService.playBuzzer();
      setContradictionResult({
        status: 'inadmissible',
        message: `EXCLUDED. Exhibit ${selectedItem.name} supports the theory. However, under BSA Section 63, uncertified electronic files are legally inadmissible. Relog custody hash in the Verification Suite first.`
      });
      setGameState(prev => ({ ...prev, pressureMeter: Math.min(100, prev.pressureMeter + 10) }));
      setPressureAnim(true);
      setTimeout(() => setPressureAnim(false), 500);
      return;
    }

    // Determine expected Law Card for this step
    const targetStepId = trialStep.id;
    let expectedLawId = '';
    let expectedJustificationId = '';
    if (targetStepId === 'virendra-pressure-check') {
      expectedLawId = 'bns-308';
      expectedJustificationId = 'cbi-logo';
    } else if (targetStepId === 'mishra-memory-check') {
      expectedLawId = 'bsa-63';
      expectedJustificationId = 'wa-ss';
    } else if (targetStepId === 'perjury-check') {
      expectedLawId = 'bns-318';
      expectedJustificationId = 'wa-ss';
    } else if (targetStepId === 'dixit-procedural-check') {
      expectedLawId = 'bnss-173';
      expectedJustificationId = 'wa-ss';
    }

    const selectedLaw = LAW_CARDS.find(l => l.id === selectedLawCardId);
    const selectedReliabilityKey = selectedReliability || 'deception';

    const isLawCorrect = selectedLawCardId === expectedLawId;
    const isReliabilityCorrect = selectedReliabilityKey === expectedReliability;
    const isJustificationCorrect = selectedJustificationId === expectedJustificationId;

    audioService.playSuccess();

    let status: 'strong' | 'partial' | 'weak' = 'weak';
    let message = '';

    if (isLawCorrect && isReliabilityCorrect && isJustificationCorrect) {
      status = 'strong';
      if (targetStepId === 'virendra-pressure-check') {
        message = `ADMISSIBLE. Under BNS Section 308, direct coercion and video-called threats completely negate voluntary consent. Presenting the certified WhatsApp screenshot, supported by the counterfeit logo proving cyber-spoofing, forms an ironclad evidentiary chain. Coerced declaration ruled void!`;
      } else if (targetStepId === 'mishra-memory-check') {
        message = `SUSTAINED. Under BSA Section 63, electronic structure analysis proves the CBI logo was a synthetic overlay. Citing the electronic WhatsApp environment as corroboration proves the officer suffered a classical cognitive source-monitoring memory error. No physical stamp existed.`;
      } else if (targetStepId === 'perjury-check') {
        message = `DECEPTION CONFIRMED. Under BNS 318, the alibi is perjury. Official newspaper reports place the CJI in Delhi, while the spoofed call logs assert Lucknow presence. This dual-link mapping proves malicious fraud.`;
      } else if (targetStepId === 'dixit-procedural-check') {
        message = `PROCEDURAL BYPASS ADOPTED. Under BNSS Section 173, Zero FIR registration is mandatory for digital crimes. Linking the WhatsApp transaction proves the crime occurred over the internet—overriding Hazratganj's spatial limits.`;
      } else {
        message = `FLAWLESS LEGAL REASONING. Exhibit ${selectedItem.name} admitted under ${selectedLaw?.section} with correct reliability diagnosis of ${selectedReliabilityKey.toUpperCase()} and coherent corroborating grounds.`;
      }
    } else if (isLawCorrect && isReliabilityCorrect && !isJustificationCorrect) {
      status = 'partial';
      message = `PARTIAL REASONING. Your diagnosis of ${selectedReliabilityKey.replace('_', ' ').toUpperCase()} and statutory citation of ${selectedLaw?.section} are textually correct. However, you selected an incorrect corroborating justification exhibit. The defense counselor argues your causal link remains legally ungrounded!`;
    } else if (isReliabilityCorrect) {
      status = 'partial';
      message = `PARTIAL COMPLIANCE. Reliability diagnosis of ${selectedReliabilityKey.replace('_', ' ').toUpperCase()} is factually correct. However, the cited statute (${selectedLaw ? selectedLaw.section : 'none'}) is legally incorrect. Brief sustained on facts but marked with a statutory penalty.`;
    } else if (isLawCorrect) {
      status = 'partial';
      message = `PARTIAL COMPLIANCE. Statutory citation of ${selectedLaw?.section} is correct, admitting the exhibit. However, the diagnosed reliability cause (${selectedReliabilityKey.replace('_', ' ').toUpperCase()}) is theoretically incorrect. Fact admitted but legal standing penalized.`;
    } else {
      status = 'weak';
      message = `WEAK ADJUDICATION. Primary exhibit matched, but statutory selection, reliability diagnosis, or justifying corroboration are incorrect. Re-evaluate your legal chain.`;
    }

    // Save choice in game state
    setGameState(prev => {
      const updatedInterpretations = {
        ...(prev.reliabilityInterpretations || {}),
        [targetStepId]: selectedReliabilityKey as any
      };
      return {
        ...prev,
        reliabilityInterpretations: updatedInterpretations
      };
    });

    setContradictionResult({
      status,
      message
    });
  };

  const confirmContradictionClose = () => {
    if (['strong', 'success'].includes(contradictionResult.status || '')) {
      audioService.playSuccess();
      setShowContradiction(false);
      setStep(step + 1);
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 25),
        pressureMeter: Math.max(0, prev.pressureMeter - 20)
      }));
      setSelectedContradictionId(null);
      setSelectedReliability(null);
      setSelectedJustificationId(null);
      setSelectedLawCardId(null);
      setContradictionResult({ status: null, message: '' });
    } else if (contradictionResult.status === 'partial') {
      audioService.playSuccess();
      setShowContradiction(false);
      setStep(step + 1);
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 12),
        pressureMeter: Math.min(100, prev.pressureMeter + 5)
      }));
      setSelectedContradictionId(null);
      setSelectedReliability(null);
      setSelectedJustificationId(null);
      setSelectedLawCardId(null);
      setContradictionResult({ status: null, message: '' });
    } else if (contradictionResult.status === 'weak') {
      audioService.playSuccess();
      setShowContradiction(false);
      setStep(step + 1);
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 5),
        pressureMeter: Math.min(100, prev.pressureMeter + 12)
      }));
      setSelectedContradictionId(null);
      setSelectedReliability(null);
      setSelectedJustificationId(null);
      setSelectedLawCardId(null);
      setContradictionResult({ status: null, message: '' });
    } else {
      audioService.playGavel();
      setContradictionResult({ status: null, message: '' });
      setSelectedContradictionId(null);
      setSelectedReliability(null);
      setSelectedJustificationId(null);
      setSelectedLawCardId(null);
    }
  };

  const isUnderPressure = gameState.pressureMeter > 50;

  return (
    <div className={`relative flex-1 flex flex-col bg-[#2A1810] overflow-hidden transition-all duration-500 ${isUnderPressure ? 'animate-shake animate-glitch border-4 border-red-900 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)]' : ''} ${pressureAnim ? 'bg-red-900/20' : ''}`}>
      {/* Dynamic Judge Objection Splash & Objection Modal Outputs */}
      <JudgePanel
        objectionFlash={objectionFlash}
        selectedOptionOutcome={selectedOptionOutcome}
        onConfirmOptionOutcome={confirmOptionOutcome}
        gameState={gameState}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
      />

      {/* Courtroom Header */}
      <div className="h-14 md:h-16 border-b-2 border-[#1A0D08] bg-[#3D251C] flex items-center px-4 md:px-8 justify-between shrink-0 text-amber-50 shadow-lg">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-accent lg:block hidden animate-pulse" />
          <div>
            <h2 className="mono font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase">High Court // Lucknow</h2>
            <span className="mono text-[7px] md:text-[10px] opacity-40 italic font-bold">STATE_VS_UNKNOWN // BNSS_PROTOCOL</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-4">
              <span className="mono text-[8px] opacity-40 uppercase">Judicial Pressure</span>
              <div className="w-24 h-1 bg-[#1A0D08] mt-1 border border-[#5A3D2D] relative overflow-hidden">
                 <div className={`h-full transition-all duration-700 ${gameState.pressureMeter > 75 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : gameState.pressureMeter > 40 ? 'bg-amber-500' : 'bg-accent'}`} style={{ width: `${gameState.pressureMeter}%` }} />
              </div>
           </div>
           {gameState.pressureMeter > 60 && (
              <span className="hidden sm:inline-block px-2 py-1 border border-red-500/40 bg-red-950 text-red-500 text-[8px] font-bold uppercase mono tracking-widest animate-pulse max-w-xs truncate mr-2">
                 ⚡ Bench Irritation: Max
              </span>
           )}
           <button
             onClick={handleToggleMute}
             className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 focus:outline-none ${isMuted ? 'border-red-900/60 bg-red-950/40 text-red-400 hover:text-red-300' : 'border-[#5A3D2D] bg-[#1A0D08]/50 text-[#C5C6C7] hover:text-[#66FCF1] hover:border-[#66FCF1]'}`}
             title={isMuted ? "Unmute Synthetic Tension Audio" : "Mute Synthetic Tension Audio"}
           >
             {isMuted ? <VolumeX size={12} className="text-red-400 animate-pulse" /> : <Volume2 size={12} className="text-[#66FCF1]" />}
             <span className="mono text-[8.5px] font-bold tracking-widest hidden sm:inline uppercase">
               {isMuted ? "MUTE" : "AUDIO ON"}
             </span>
           </button>
           <div className="status-chip bg-[#1A0D08] text-amber-200 border-[#5A3D2D] text-[8px] tracking-widest uppercase">In Session</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        {/* Trial Area */}
        <main className="flex-1 flex flex-col p-4 md:p-8 bg-[#2A1810] min-h-0 overflow-y-auto">
            {/* Active Testimony Panel */}
            <TestimonyPanel
              step={step}
              trialStep={trialStep}
              gameState={gameState}
              getDynamicDialogue={getDynamicDialogue}
              onSelectOption={handleSelectOption}
              onNextStep={handleNextStep}
              showContradiction={showContradiction}
            />

            {/* Admissible Horizontal Exhibits tray */}
            <EvidencePanel
              mode="admitted-tray"
              inventory={gameState.inventory}
            />
        </main>

        {/* Action Sidebar - Desktop only */}
        <aside className="hidden md:flex w-96 border-l-2 border-[#1A0D08] bg-[#1A0D08] p-6 flex-col overflow-y-auto shrink-0">
            <div className="col-header border-amber-900/40 text-amber-500 tracking-widest font-bold mb-6 text-[10px] uppercase">Trial Docket</div>

            {/* Evidence List Side Dashboard */}
            <EvidencePanel
              mode="sidebar"
              inventory={gameState.inventory}
            />
            
            <div className="mt-auto p-4 bg-[#2A1810] border border-[#5A3D2D] space-y-4 shadow-xl">
               <div className="mono text-[9px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} />
                  Judicial Notes
               </div>
               <p className="text-[10px] text-amber-100/40 leading-relaxed italic border-l-2 border-accent pl-3">
                 Admissibility relies on strict BSA Section 63 certificates. 
                 Presentation of uncertified digital bytes or inconsistent testimony risks sudden contempt triggers and witness loss-of-faith logs.
               </p>
            </div>
        </aside>

        {/* Global DEDUCTION / Interactive Contradiction Modal */}
        <AnimatePresence>
            {showContradiction && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
                >
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-[#1A0D08] border-2 border-[#5A3D2D] flex flex-col max-w-2xl w-full shadow-[20px_20px_0px_0px_rgba(42,24,16,1)] h-[85vh] md:h-auto min-h-0 overflow-y-auto"
                    >
                        {/* Interactive Header */}
                        <div className="p-6 border-b border-[#5A3D2D] bg-[#2A1810]/70">
                            <div className="flex items-center gap-3">
                               <AlertCircle size={28} className="text-accent animate-pulse" />
                               <div>
                                  <h4 className="mono font-bold text-amber-100 text-xl tracking-tighter uppercase leading-none">
                                    IMPEACHMENT INITIATION // ACTIVE DEDUCTION
                                  </h4>
                                  <p className="text-[10px] text-amber-100/40 mono italic leading-none mt-1">Cross-examine the witness logs. Present contradicting exhibit from your inventory.</p>
                                </div>
                            </div>
                        </div>

                        {/* Middle body */}
                        <div className="flex-1 p-6 space-y-6">
                           <div className="bg-black/40 p-4 border border-red-950/40">
                              <span className="mono text-[8px] text-accent uppercase font-bold tracking-widest block mb-1">Target Statement to Impeach</span>
                              <p className="text-xs md:text-sm font-serif italic text-amber-100/80 leading-relaxed">
                                 "{getDynamicDialogue(trialStep.speaker, trialStep.text)}"
                              </p>
                           </div>

                           {contradictionResult.status === null ? (
                             <>
                               {/* Selector */}
                               <div className="space-y-4">
                                  {/* Step 1: Select Forensic Exhibit Component */}
                                  <EvidencePanel
                                    mode="modal-selector"
                                    inventory={gameState.inventory}
                                    selectedContradictionId={selectedContradictionId}
                                    onSelect={setSelectedContradictionId}
                                  />

                                  {/* Step 2: Cite Sovereign Statutory Code */}
                                  <div className="space-y-2 pt-3 border-t border-[#5A3D2D]/30">
                                     <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
                                        2. Cite Sovereign Statutory Code
                                     </div>
                                     <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                                        {LAW_CARDS.map(law => {
                                           const isSelected = selectedLawCardId === law.id;
                                           return (
                                              <button
                                                 type="button"
                                                 key={law.id}
                                                 onClick={() => setSelectedLawCardId(law.id)}
                                                 className={`p-2 text-left border-2 transition-all relative flex flex-col justify-center cursor-pointer ${
                                                    isSelected 
                                                      ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.15)]'
                                                      : 'bg-black/30 border-[#5A3D2D] hover:border-amber-900/60'
                                                 }`}
                                              >
                                                 <span className="font-bold text-[9px] tracking-wider block text-amber-100">{law.section}</span>
                                                 <span className="text-[7.5px] text-amber-100/60 block truncate">{law.title}</span>
                                              </button>
                                           );
                                        })}
                                     </div>
                                  </div>

                                  {/* Step 3: Evaluate Testimony Reliability Component */}
                                  <ReliabilityPanel
                                    selectedReliability={selectedReliability}
                                    onSelect={setSelectedReliability}
                                    selectedContradictionId={selectedContradictionId}
                                    selectedJustificationId={selectedJustificationId}
                                    onSelectJustification={setSelectedJustificationId}
                                    inventory={gameState.inventory}
                                    reliabilityReasonNeeded={!!trialStep.reliabilityReason}
                                  />
                               </div>

                               <button 
                                   disabled={!selectedContradictionId || !selectedLawCardId || (!!trialStep.reliabilityReason && (!selectedReliability || !selectedJustificationId))}
                                   onClick={handleExecuteContradiction}
                                   className={`w-full py-4 border-2 uppercase font-bold text-[10px] tracking-widest shadow-md transition-all cursor-pointer ${
                                      selectedContradictionId && selectedLawCardId && (!trialStep.reliabilityReason || (selectedReliability && selectedJustificationId))
                                        ? 'bg-accent text-white border-accent hover:bg-black hover:text-white'
                                        : 'bg-[#180E0A] text-amber-100/20 border-amber-950/20 cursor-not-allowed'
                                   }`}
                               >
                                   VERIFY DOCKET CONTRADICTION & RELIABILITY
                               </button>
                             </>
                           ) : (
                             /* Feedback Panel */
                             <div className="space-y-6">
                                <div className={`p-5 border flex items-start gap-4 ${
                                   ['success', 'strong', 'partial'].includes(contradictionResult.status || '') 
                                     ? 'bg-emerald-950/30 border-emerald-500/55 text-emerald-200'
                                     : 'bg-red-950/20 border-red-500/35 text-red-200'
                                }`}>
                                   {(contradictionResult.status === 'success' || contradictionResult.status === 'strong' || contradictionResult.status === 'partial') ? (
                                      <CheckCircle2 size={24} className="text-[#6FCF97] shrink-0 mt-0.5" />
                                   ) : (
                                      <XCircle size={24} className="text-red-500 shrink-0 mt-0.5" />
                                   )}
                                   <div className="space-y-1">
                                      <h5 className="mono font-bold uppercase text-[10px] tracking-widest text-amber-100">Deduction Outcome</h5>
                                      <p className="text-[11px] md:text-xs leading-relaxed opacity-90">{contradictionResult.message}</p>
                                   </div>
                                </div>

                                <button 
                                    onClick={confirmContradictionClose}
                                    className="bg-accent text-white mono font-bold text-[10px] w-full py-4 border-2 border-[#5A3D2D] hover:bg-black uppercase tracking-[0.2em] cursor-pointer"
                                >
                                    {(contradictionResult.status === 'success' || contradictionResult.status === 'strong' || contradictionResult.status === 'partial') ? 'DISCREDIT & CONTINUE' : 'RETRY ACTIVE DEDUCTION'}
                                </button>
                             </div>
                           )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="h-10 md:h-12 border-t-2 border-[#1A0D08] bg-[#1A0D08] px-4 md:px-12 flex items-center justify-between mono text-[8px] md:text-[10px] text-amber-100/20 font-bold relative z-10 uppercase tracking-widest shrink-0">
          <div className="flex gap-4 md:gap-6 truncate">
              <span className="truncate">STATE vs UNKNOWN</span>
              <span className="opacity-40 italic hidden sm:inline">BNSS_SESSION_{gameState.currentCaseId}</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="hidden sm:inline">REC_ON</span>
             </div>
             <Clock size={10} className="md:w-3 md:h-3" />
             <span>SESSION_{gameState.phase}</span>
          </div>
      </div>
    </div>
  );
}

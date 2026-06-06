import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Case, AuthenticityStatus, AdmissibilityStatus, TrialStepOption, Evidence } from '../../types';
import { GameEngine } from '../../game/gameEngine';
import { resolveDynamicDialogue } from '../../game/characterSystem';
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
  TrendingDown,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

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

    // 1. Check if the player selected the correct evidence
    if (selectedItem.id !== expectedEvidenceId) {
      audioService.playBuzzer();
      setContradictionResult({
        status: 'failure',
        message: `MISTAKEN DEDUCTION! You stand and present the ${selectedItem.name} to challenge the witness's statement. The Defense Counsel scoffs: "Counsel is shooting in the dark. How does this exhibit prove a logical contradiction?" Justice G. Singh shakes his head in deep irritation: "Counsel, do not waste this bench's time with unrelated dockets. Focus on the core of the testimony!"`
      });
      setGameState(prev => ({ ...prev, pressureMeter: Math.min(100, prev.pressureMeter + 15) }));
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
        message: `PERSUASIVE BUT PROCEDURALLY INVALID (Inadmissible)! You present the correct item and diagnose the unreliability cause as ${selectedReliability?.replace('_', ' ').toUpperCase() || 'none'}. However, because you did NOT certify this digital exhibit in the Verification Suite, the Defense Counsel leaps up: "Objection! Under Bharatiya Sakshya Adhiniyam Section 63, electronic logs are legally inadmissible without a fully signed BSA digital hash certificate!" Justice G. Singh nods: "Sustained. Excellent legal deduction, but I cannot legally admit uncertified digital material. You must verify your files first!"`
      });
      setGameState(prev => ({ ...prev, pressureMeter: Math.min(100, prev.pressureMeter + 15) }));
      setPressureAnim(true);
      setTimeout(() => setPressureAnim(false), 500);
      return;
    }

    // Lookup table for our dynamic narrative reactions based on player's reliability diagnosis
    // This allows active branching and has direct scoring consequences
    const RELIABILITY_LOOKUP: Record<string, Record<string, { status: 'strong' | 'partial' | 'weak'; message: string }>> = {
      'virendra-pressure-check': {
        pressure: {
          status: 'strong',
          message: `STRONG ADJUDICATION! You prove that the victim signed the money transfer under active (+44) video intimidation and extortionate threat of arrest. Justice G. Singh thunders: "Indeed! Under BNS 308 (Coercion), systemic duress negates voluntary consent. The signature is a nullity! Perfectly diagnosed, Counsel."`
        },
        deception: {
          status: 'partial',
          message: `PARTIAL SUCCESS. You argue the fake +44 mask constitutes BNS 318 deceptive impersonation. G. Singh nods: "While digital impersonation occurred, the signature's actual invalidity stems from direct coercion, not mere fraud. A slightly misfocused but acceptable diagnosis."`
        },
        memory_error: {
          status: 'weak',
          message: `WEAK SUCCESS. You claim Virendra suffered from memory inaccuracies. Virendra is offended: "I remember the terror perfectly!" G. Singh: "Suggesting memory failure under active sequestration is naive. Duress, not memory, is the core constraint here. Proceeding solely on the evidence."`
        },
        procedural_confusion: {
          status: 'weak',
          message: `WEAK SUCCESS. You argue bank layout or procedural confusion rules applied. G. Singh: "Counsel, this is a live extortion, not a technical contract error. The victim signed because his family was threatened. Duress is the core mechanism."`
        }
      },
      'mishra-memory-check': {
        memory_error: {
          status: 'strong',
          message: `STRONG ADJUDICATION! You project the low-res pixelated overlays of the scammers' fake uniform. G. Singh: "Outstanding. Under the stress of an active raid, SI Mishra reconstructed a physical 'golden crest' from expectation. Human memory is reconstructive; this is a classic cognitive memory error."`
        },
        deception: {
          status: 'partial',
          message: `PARTIAL SUCCESS. You accuse SI Mishra of collusion or intentional deceit. Mishra is outraged. G. Singh: "Order! There is zero proof of collusion. The digital artifacts prove the stamp was a projection, meaning Mishra was simply mistaken, not lying."`
        },
        pressure: {
          status: 'weak',
          message: `WEAK SUCCESS. You claim Mishra was pressured into testimony. G. Singh: "Extremely speculative. A police raiding team faces no coercion here. The visual artifacts simply show Mishra's recollection was scientifically wrong. Proceeding with caution."`
        },
        procedural_confusion: {
          status: 'partial',
          message: `PARTIAL SUCCESS. You claim search and seizure protocol under BNSS was confused. G. Singh: "While local raid logs are sloppy, the issue is his mistaken visual assertion of a physical stamp. It is a recollective failure, not a protocol error."`
        }
      },
      'perjury-check': {
        deception: {
          status: 'strong',
          message: `STRONG ADJUDICATION! Your certified news copy matches the CJI's live bench in Delhi, exposing 'Amit Sen' as a phantom. G. Singh: "Pure perjury and deliberate deception under BSA Sec 63. This is not a mistake; it is a calculated impersonation and fraud to execute a fake arrest!"`
        },
        memory_error: {
          status: 'weak',
          message: `WEAK SUCCESS. You argue the impersonator simply made a scheduling error. G. Singh sighs: "A scammer spoofing warrants does not suffer from a simple diary error, Counsel. They are actively deceiving. This is a highly naive diagnosis."`
        },
        pressure: {
          status: 'weak',
          message: `WEAK SUCCESS. You claim the fake Inspector was forced by others. G. Singh: "Highly speculative. The perpetrator is the source of the duress, not its target. The log serves to execute the cheat."`
        },
        procedural_confusion: {
          status: 'weak',
          message: `WEAK SUCCESS. You argue the poser was confused on legal meeting rules. G. Singh: "Meeting a Delhi-bound Chief Justice in Lucknow is not legal confusion, Counsel. It is a fabricated alibi. Focus on the core fraud."`
        }
      },
      'dixit-procedural-check': {
        procedural_confusion: {
          status: 'strong',
          message: `STRONG ADJUDICATION! You present the Hazratganj Zero FIR. Under BNSS Sec 173, cyber crimes must be logged instantly regardless of borders. G. Singh: "Indeed. Dixit-ji was locked in outdated municipal geography habits. A textbook case of procedural confusion!"`
        },
        deception: {
          status: 'partial',
          message: `PARTIAL SUCCESS. You accuse Dixit of deliberate bad faith or collusion. Dixit objects. G. Singh: "We see no conspiracy, only a station officer following obsolete jurisdictional manuals. Your receipt is valid, but your accusation is uncalled for."`
        },
        memory_error: {
          status: 'partial',
          message: `PARTIAL SUCCESS. You argue Dixit forgot his instructions. Dixit: "I remember our codes!" G. Singh: "Indeed. He did not forget; he failed to apply the new BNSS Zero-FIR cross-territory mandates. That represents confusion of legal codes."`
        },
        pressure: {
          status: 'weak',
          message: `WEAK SUCCESS. You claim Dixit was blackmailed. Dixit: "Unfounded!" G. Singh: "The delay stems from bureaucratic territorial inertia, not criminal extortion. This diagnostic misses the administrative focus."`
        }
      }
    };

    audioService.playSuccess();
    
    // Select outcome
    const targetStepId = trialStep.id;
    const selectedReliabilityKey = selectedReliability || 'deception';
    const resolvedOutcome = RELIABILITY_LOOKUP[targetStepId]?.[selectedReliabilityKey] || {
      status: 'strong',
      message: `STRONG CONTRADICTION ACCEPTED! You present the ${selectedItem.name} and successfully impeach the witness's statement. G. Singh strikes his gavel: "Clear contradiction established."`
    };

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
      status: resolvedOutcome.status,
      message: resolvedOutcome.message
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
    } else if (contradictionResult.status === 'partial') {
      audioService.playSuccess();
      setShowContradiction(false);
      setStep(step + 1);
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 12),
        // Let the partial advance but keep a slight pressure setback
        pressureMeter: Math.min(100, prev.pressureMeter + 5)
      }));
    } else if (contradictionResult.status === 'weak') {
      audioService.playSuccess();
      setShowContradiction(false);
      setStep(step + 1);
      setGameState(prev => ({
        ...prev,
        justiceScore: Math.min(100, prev.justiceScore + 5),
        // Let them proceed but increase pressure on poor forensic theory
        pressureMeter: Math.min(100, prev.pressureMeter + 12)
      }));
    } else {
      audioService.playGavel();
      // Let them retry or correct, but they already took the pressure penalties in handleExecuteContradiction
      setContradictionResult({ status: null, message: '' });
      setSelectedContradictionId(null);
      setSelectedReliability(null);
    }
  };

  const renderOptionCard = (opt: TrialStepOption) => {
    const isMissingEvidence = opt.evidenceRequiredId && !gameState.inventory.some(e => e.id === opt.evidenceRequiredId);
    const requiredItem = opt.evidenceRequiredId ? gameState.inventory.find(e => e.id === opt.evidenceRequiredId) : null;
    const isMissingCertification = opt.requiresBsaCertificate && requiredItem && !GameEngine.isEvidenceAdmissible(requiredItem);

    return (
      <button 
        key={opt.id}
        disabled={!!isMissingEvidence}
        onClick={() => handleSelectOption(opt)}
        className={`w-full flex flex-col p-4 md:p-5 border-2 text-left relative transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:scale-98 ${
          isMissingEvidence 
            ? 'bg-[#1e130f] border-red-950/40 opacity-40 cursor-not-allowed'
            : isMissingCertification
              ? 'bg-[#2D1B13] border-amber-900/60 hover:border-red-500'
              : 'bg-[#221008] border-[#5A3D2D] hover:border-accent'
        }`}
      >
        <div className="flex justify-between items-start w-full mb-2 gap-2">
           <span className="mono text-[10px] md:text-[11px] font-bold text-amber-100 tracking-tight leading-none">{opt.text}</span>
           {opt.evidenceRequiredId && <BookOpen size={12} className="text-accent shrink-0" />}
        </div>
        <p className="text-[9px] md:text-[10px] text-amber-100/50 leading-tight mb-3 italic">{opt.description}</p>
        
        {isMissingEvidence ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-red-500 uppercase mono bg-red-950/30 px-2 py-1 border border-red-900/40 w-fit">
            <ShieldAlert size={10} />
            LOCKED: Missing required exhibit
          </div>
        ) : isMissingCertification ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-red-400 uppercase mono bg-red-950/30 px-2 py-1 border border-red-900/40 w-fit">
            <AlertTriangle size={10} className="animate-pulse" />
            RISK: Exhibit uncertified under BSA Sec 63
          </div>
        ) : opt.evidenceRequiredId ? (
          <div className="flex items-center gap-1 text-[8px] font-bold text-accent-green uppercase mono bg-green-950/20 px-2 py-1 border border-green-950/40 w-fit">
            <ShieldCheck size={10} />
            PROVISION APPROVED: {requiredItem?.name} Ready
          </div>
        ) : null}
      </button>
    );
  };

  const isUnderPressure = gameState.pressureMeter > 50;

  return (
    <div className={`relative flex-1 flex flex-col bg-[#2A1810] overflow-hidden transition-all duration-500 ${isUnderPressure ? 'animate-shake animate-glitch border-4 border-red-900 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)]' : ''} ${pressureAnim ? 'bg-red-900/20' : ''}`}>
      {/* High-impact Phoenix Wright Styled Objection Splash Screen */}
      <AnimatePresence>
        {objectionFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/95 pointer-events-none overflow-hidden select-none"
          >
            {/* Pulsing hazard strobe bands */}
            <div className="absolute inset-x-0 h-48 bg-accent rotate-[-6deg] flex items-center justify-center shadow-[0_0_100px_rgba(218,61,44,0.9)] border-y-4 border-white animate-pulse">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)]" />
            </div>
            
            {/* Dramatic popping core text */}
            <motion.div
              initial={{ y: 80, rotate: -6, scale: 0.7 }}
              animate={{ y: 0, rotate: -6, scale: 1.25 }}
              transition={{ type: 'spring', damping: 6, stiffness: 120 }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              {/* Back Drop Shadow */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black text-[65px] md:text-[100px] font-sans font-black tracking-wider uppercase italic select-none">
                OBJECTION!
              </div>
              
              {/* Core Text */}
              <div className="text-[65px] md:text-[100px] font-sans font-black tracking-wider uppercase italic text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] leading-none select-none">
                OBJECTION!
              </div>
              
              {/* Danger Warning Protocol bar */}
              <div className="px-4 py-1.5 bg-black border-2 border-amber-500 text-amber-500 text-[9px] md:text-[11px] uppercase font-mono tracking-[0.25em] font-bold mt-3 rotate-[1deg]">
                ⚡ DOCKET CONTRADICTION DETECTED ⚡
              </div>
            </motion.div>
            
            {/* Laser beams across the view */}
            <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-white/40 shadow-[0_0_20px_#fff] rotate-[25deg]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-white/40 shadow-[0_0_20px_#fff] rotate-[25deg]" />
          </motion.div>
        )}
      </AnimatePresence>
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
           <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-6 md:mb-8 max-w-5xl mx-auto w-full">
             
             {/* Speaker Box */}
             <div className="w-full md:w-72 flex flex-row md:flex-col gap-4 shrink-0">
               <div className="w-20 h-20 md:w-full md:aspect-square bg-ink border-2 border-[#5A3D2D] relative overflow-hidden group shadow-2xl">
                  <img 
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${trialStep.speaker.replace(/ /g, '_')}`} 
                    className={`w-full h-full object-cover grayscale brightness-75 transition-all duration-300 ${gameState.pressureMeter > 60 && trialStep.speaker === 'Virendra Sharma' ? 'scale-105 animate-pulse' : ''}`} 
                    alt={trialStep.speaker}
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-20" />
               </div>
               <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className={`hidden md:block h-1 bg-accent w-full opacity-50 shadow-[0_0_10px_rgba(218,61,44,0.5)] transition-all`} style={{ opacity: gameState.pressureMeter / 100, transform: `scaleX(${gameState.pressureMeter / 100})` }} />
                  <div className="mono text-[8px] bg-[#1A0D08] px-2 py-1 text-amber-100/60 border border-[#5A3D2D] uppercase font-bold tracking-widest leading-none truncate">{trialStep.speaker}</div>
                  <p className="text-[8px] md:text-[9px] text-amber-100/40 italic leading-tight max-w-xs">
                    {trialStep.speaker === 'Justice G. Singh' ? "Strict constitutional text under old vs new codes." : trialStep.speaker === 'Virendra Sharma' ? '"Regards, Principal Sharma..."' : "Formal statutory arguments."}
                  </p>
               </div>
             </div>

             {/* Dialogue Bubble */}
             <div className="flex-1 space-y-6 md:space-y-8 min-w-0 w-full relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`bg-[#1A0D08] p-6 md:p-10 relative shadow-[0px_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center border-2 border-[#5A3D2D] ${
                      gameState.pressureMeter > 70 ? 'border-red-900/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-shake' : ''
                    }`}
                  >
                    <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-accent text-white p-2 md:p-3 shadow-lg">
                       <Gavel size={18} className="md:w-5 md:h-5" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 border-b border-[#5A3D2D] pb-2">
                       <span className="mono text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">{trialStep.type}</span>
                       <div className="mono text-[8px] text-amber-100/20">LOG_ID: {trialStep.id}</div>
                    </div>

                    {/* Narrative Frame Note */}
                    {trialStep.narrativeStateNote && (
                      <p className="text-[10px] text-amber-500/60 italic mono mb-4 border-l border-amber-900/60 pl-3">
                         {trialStep.narrativeStateNote}
                      </p>
                    )}

                    <p className={`text-xl md:text-2xl font-serif leading-snug italic tracking-tight text-amber-50 relative ${gameState.pressureMeter > 80 ? 'blur-[0.3px]' : ''}`}>
                      "
                      <Typewriter 
                        key={step} 
                        text={getDynamicDialogue(trialStep.speaker, trialStep.text)} 
                        speed={10} 
                        playTickSound={!audioService.getIsMuted()} 
                      />
                      "
                    </p>

                    {trialStep.type === 'objection' && trialStep.options && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                           {trialStep.options.map(opt => renderOptionCard(opt))}
                        </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!showContradiction && trialStep.type !== 'objection' && (
                    <button 
                        onClick={handleNextStep}
                        className="btn-accent w-full py-4 text-[9px] md:text-[10px] border-2 border-[#5A3D2D] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase font-bold tracking-[0.2em]"
                    >
                        ADVANCE TRIAL // STEP_{step}
                    </button>
                )}
             </div>
           </div>

           {/* Admissible Exhibits */}
           <div className="mt-4 border-t border-amber-950/40 pt-4">
              <div className="col-header border-amber-900/40 text-amber-500 text-[9px] mb-3 uppercase tracking-widest font-bold">Judicially Admitted Exhibits</div>
              <div className="flex gap-3 overflow-x-auto pb-4 touch-pan-x">
                {gameState.inventory.map(item => (
                  <div 
                     key={item.id}
                     className={`p-3 border shrink-0 w-36 md:w-44 transition-all bg-[#1e130f]/60 ${GameEngine.isEvidenceAdmissible(item) ? 'border-accent-green/40 shadow-[0_0_8px_rgba(34,197,94,0.1)]' : 'opacity-20 grayscale border-[#5A3D2D]'}`}
                  >
                    <div className="mono text-[9px] font-bold text-amber-200 truncate mb-1">{item.name}</div>
                    <div className="flex justify-between items-center text-[8px]">
                       <span className={`mono font-bold ${GameEngine.isEvidenceAdmissible(item) ? 'text-accent-green' : 'text-red-500/60'}`}>{GameEngine.isEvidenceAdmissible(item) ? 'ADMITTED' : 'EXCLUDED'}</span>
                       {item.hasBSACertificate && <ShieldCheck size={11} className="text-accent-green" />}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </main>

        {/* Action Sidebar - Desktop only */}
        <aside className="hidden md:flex w-96 border-l-2 border-[#1A0D08] bg-[#1A0D08] p-6 flex-col overflow-y-auto shrink-0">
            <div className="col-header border-amber-900/40 text-amber-500 tracking-widest font-bold mb-6 text-[10px] uppercase">Trial Docket</div>

            <div className="grid grid-cols-1 gap-3">
                {gameState.inventory.map(item => (
                    <div 
                        key={item.id}
                        className={`p-4 border-2 transition-all cursor-default ${GameEngine.isEvidenceAdmissible(item) ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.2)]' : 'bg-[#1A0D08]/50 border-[#5A3D2D]'}`}
                    >
                        <div className="flex justify-between mb-2 pb-1 border-b border-[#2A1810]">
                           <span className="mono text-[10px] font-bold text-amber-50 tracking-tighter">{item.name}</span>
                           <span className="mono text-[8px] opacity-40 uppercase">{item.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] mb-2">
                           <span className="mono text-amber-100/40 font-bold uppercase">{item.authenticity} // {item.admissibility}</span>
                           <span className="mono text-amber-500 font-bold uppercase">{item.courtConfidence}% CONF</span>
                        </div>
                        
                        {/* Three separate dimensions bar display */}
                        <div className="grid grid-cols-3 gap-1 text-[7.5px] mono border-t border-amber-950/40 pt-1.5 opacity-80">
                           <div>
                              <span className="opacity-50">CR (Cred):</span>
                              <span className="text-[#6FCF97] font-bold ml-0.5">{item.credibility || 30}%</span>
                           </div>
                           <div>
                              <span className="opacity-50">AD (Proc):</span>
                              <span className="text-[#66FCF1] font-bold ml-0.5">{item.admissibilityStrength || 10}%</span>
                           </div>
                           <div>
                              <span className="opacity-50">SW (Sway):</span>
                              <span className="text-[#DC3D2C] font-bold ml-0.5">{item.judgeImpact || 60}%</span>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-auto p-4 bg-[#2A1810] border border-[#5A3D2D] space-y-4 shadow-xl">
               <div className="mono text-[9px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} />
                  Judicial Notes
               </div>
               <p className="text-[10px] text-amber-100/40 leading-relaxed italic border-l-2 border-accent pl-3">
                 Court confidence is currently {(gameState.inventory.reduce((acc, curr) => acc + (curr.courtConfidence || 0), 0) / (gameState.inventory.length || 1)).toFixed(0)}%. 
                 Presentation of uncertified digital bytes or inconsistent artifacts risks sudden contempt triggers and witness loss-of-faith logs.
               </p>
            </div>
        </aside>

        {/* Objections Option Outcome Overlay Modal */}
        <AnimatePresence>
            {selectedOptionOutcome && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-[#1A0D08] p-8 md:p-10 border-2 border-[#5A3D2D] flex flex-col gap-6 max-w-xl w-full text-left shadow-[20px_20px_0px_0px_rgba(42,24,16,1)]"
                    >
                        <div>
                           <span className="mono text-[9px] text-[#A67C52] uppercase font-bold tracking-widest block mb-1">OBJECTION RESOLUTIOIN // DIRECTED SPECTRUM</span>
                           <h4 className="text-xl md:text-2xl font-serif font-bold text-amber-100 leading-snug">
                             "{selectedOptionOutcome.text}"
                           </h4>
                        </div>
                        
                        <p className="text-xs md:text-sm italic font-medium leading-relaxed text-amber-100/70 bg-[#26150F] p-4 border border-amber-950/40">
                           {selectedOptionOutcome.outcomeDialogue}
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                           <div className="p-3 bg-black/40 border border-[#5A3D2D] text-left">
                              <span className="mono text-[8px] opacity-40 uppercase block">Justice Impact</span>
                              <span className={`mono font-bold text-xs ${selectedOptionOutcome.impactOnJustice >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                                {selectedOptionOutcome.impactOnJustice >= 0 ? '+' : ''}{selectedOptionOutcome.impactOnJustice} PTS
                              </span>
                           </div>
                           <div className="p-3 bg-black/40 border border-[#5A3D2D] text-left">
                              <span className="mono text-[8px] opacity-40 uppercase block">Statute Accuracy</span>
                              <span className={`mono font-bold text-xs ${selectedOptionOutcome.impactOnLegal >= 0 ? 'text-accent' : 'text-red-500'}`}>
                                {selectedOptionOutcome.impactOnLegal >= 0 ? '+' : ''}{selectedOptionOutcome.impactOnLegal} PTS
                              </span>
                           </div>
                           <div className="p-3 bg-black/40 border border-[#5A3D2D] text-left">
                              <span className="mono text-[8px] opacity-40 uppercase block">Tension Delta</span>
                              <span className={`mono font-bold text-xs ${selectedOptionOutcome.impactOnPressure <= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                                {selectedOptionOutcome.impactOnPressure >= 0 ? '+' : ''}{selectedOptionOutcome.impactOnPressure} PTS
                              </span>
                           </div>
                        </div>

                        <button 
                            onClick={confirmOptionOutcome}
                            className="bg-accent text-white mono font-bold text-[10px] w-full py-4 border-2 border-[#5A3D2D] hover:bg-black uppercase tracking-[0.2em] transition-all shadow-md active:translate-y-0.5"
                        >
                            RECORD STATEMENT & PROCEED <ChevronRight size={14} className="inline opacity-60" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

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
                                  <div className="space-y-2">
                                     <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">1. Select Contradiction Exhibit Documentation</div>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                                        {gameState.inventory.map(item => {
                                           const isSelected = selectedContradictionId === item.id;
                                           const isAdmissible = GameEngine.isEvidenceAdmissible(item);
                                           return (
                                              <button
                                                 key={item.id}
                                                 onClick={() => setSelectedContradictionId(item.id)}
                                                 className={`p-3 text-left border-2 transition-all relative flex flex-col justify-center cursor-pointer ${
                                                    isSelected 
                                                      ? 'bg-[#2A1810] border-accent shadow-[4px_4px_0px_0px_rgba(218,61,44,0.15)]'
                                                      : 'bg-black/30 border-[#5A3D2D] hover:border-amber-900/60'
                                                 }`}
                                              >
                                                 <div className="font-bold text-[10px] text-amber-100 truncate w-full mb-1">{item.name}</div>
                                                 <div className="flex justify-between items-center text-[8px] w-full">
                                                    <span className="mono opacity-40 uppercase">{item.type}</span>
                                                    <span className={`mono font-bold ${isAdmissible ? 'text-accent-green' : 'text-accent'}`}>
                                                       {isAdmissible ? 'ADMITTED // READY' : 'UNCERTIFIED // REJECTABLE'}
                                                    </span>
                                                 </div>
                                              </button>
                                           );
                                        })}
                                        {gameState.inventory.length === 0 && (
                                           <div className="text-center p-6 text-xs text-amber-100/40 italic bg-black/30 col-span-2 font-mono">
                                              You have collected zero materials in your case docket as legal basis. Go back and check hotspots.
                                           </div>
                                        )}
                                     </div>
                                  </div>

                                  {trialStep.reliabilityReason && (
                                     <div className="space-y-2 pt-3 border-t border-[#5A3D2D]/30">
                                        <div className="mono text-[9px] text-amber-500 uppercase tracking-widest font-bold">
                                           2. Evaluate Testimony Reliability Cause
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                           {[
                                              { id: 'deception', label: 'DECEPTION', color: 'border-red-500/30 text-red-100 hover:border-red-400', bg: 'bg-red-950/20', desc: 'Intentional lie / spoofing' },
                                              { id: 'memory_error', label: 'MEMORY ERROR', color: 'border-amber-500/30 text-amber-100 hover:border-amber-400', bg: 'bg-amber-950/20', desc: 'Honest memory recall gap' },
                                              { id: 'pressure', label: 'PRESSURE', color: 'border-blue-500/30 text-blue-100 hover:border-blue-400', bg: 'bg-blue-950/20', desc: 'Coercion / threat / fear' },
                                              { id: 'procedural_confusion', label: 'PROCEDURAL CONFUSION', color: 'border-emerald-500/30 text-emerald-100 hover:border-emerald-400', bg: 'bg-emerald-950/20', desc: 'Statutory or law mistake' }
                                           ].map(r => {
                                              const isSel = selectedReliability === r.id;
                                              return (
                                                 <button
                                                    key={r.id}
                                                    onClick={() => setSelectedReliability(r.id as any)}
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
                                  )}
                               </div>

                               <button 
                                   disabled={!selectedContradictionId || (!!trialStep.reliabilityReason && !selectedReliability)}
                                   onClick={handleExecuteContradiction}
                                   className={`w-full py-4 border-2 uppercase font-bold text-[10px] tracking-widest shadow-md transition-all cursor-pointer ${
                                      selectedContradictionId && (!trialStep.reliabilityReason || selectedReliability)
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
                                      <CheckCircle2 size={24} className="text-accent-green shrink-0 mt-0.5" />
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

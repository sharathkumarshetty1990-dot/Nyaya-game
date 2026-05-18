import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GamePhase, GameState, Evidence, Case } from './types';
import { CASES } from './constants';
import HomeScreen from './components/screens/HomeScreen';
import BriefingScreen from './components/screens/BriefingScreen';
import InvestigationHub from './components/screens/InvestigationHub';
import VerificationScreen from './components/screens/VerificationScreen';
import StationScreen from './components/screens/StationScreen';
import CourtroomScreen from './components/screens/CourtroomScreen';
import VerdictScreen from './components/screens/VerdictScreen';
import { Gavel, Scale, FileText } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentCaseId: null,
    phase: GamePhase.BRIEFING,
    inventory: [],
    actionTokens: 0,
    legalScore: 0,
    justiceScore: 0,
    unlockedLawCards: [],
    completedCases: [],
    npcTrust: {},
    pressureMeter: 0,
    isGameOver: false,
  });

  // Simple router
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startCase = (caseId: string) => {
    const selectedCase = CASES.find(c => c.id === caseId);
    if (!selectedCase) return;

    setGameState(prev => ({
      ...prev,
      currentCaseId: caseId,
      phase: GamePhase.BRIEFING,
      inventory: [],
      actionTokens: selectedCase.maxActions,
      legalScore: 0,
      justiceScore: 0,
      pressureMeter: 0,
    }));
    setIsGameStarted(true);
  };

  const nextPhase = (phase: GamePhase) => {
    setGameState(prev => ({ ...prev, phase }));
  };

  const currentCase = CASES.find(c => c.id === gameState.currentCaseId);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* Top Header Rail */}
      <header className="h-[50px] md:h-[60px] border-b-2 border-line flex items-center px-4 md:px-6 justify-between shrink-0 bg-white z-20">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-accent" />
            <span className="mono font-bold text-[10px] md:text-sm tracking-tight">NYAYA // P_v1.0</span>
          </div>
          {gameState.currentCaseId && (
            <div className="hidden sm:flex items-center gap-4 border-l border-line pl-6">
              <span className="mono text-[11px] opacity-40">CASE:</span>
              <span className="mono font-bold text-[11px] uppercase tracking-wider">#DA-2024-{gameState.currentCaseId.split('-')[1]}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`status-chip ${isGameStarted ? 'bg-accent text-white border-accent' : 'bg-accent-green text-white border-accent-green'} text-[9px] md:text-[10px]`}>
            {isGameStarted ? 'ACTIVE' : 'READY'}
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {!isGameStarted ? (
            <HomeScreen onStartCase={startCase} />
          ) : (
            <motion.div
              key={gameState.phase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col overflow-auto h-full"
            >
              {gameState.phase === GamePhase.BRIEFING && currentCase && (
                <BriefingScreen 
                  caseData={currentCase} 
                  onConfirm={() => nextPhase(GamePhase.INVESTIGATION)} 
                />
              )}
              {gameState.phase === GamePhase.INVESTIGATION && currentCase && (
                <InvestigationHub 
                  gameState={gameState}
                  currentCase={currentCase}
                  setGameState={setGameState}
                />
              )}
              {gameState.phase === GamePhase.VERIFICATION && currentCase && (
                <VerificationScreen 
                  gameState={gameState}
                  setGameState={setGameState}
                />
              )}
              {gameState.phase === GamePhase.STATION && currentCase && (
                <StationScreen 
                  gameState={gameState}
                  setGameState={setGameState}
                  currentCase={currentCase}
                />
              )}
              {gameState.phase === GamePhase.COURTROOM && currentCase && (
                <CourtroomScreen 
                  gameState={gameState}
                  setGameState={setGameState}
                  currentCase={currentCase}
                />
              )}
              {gameState.phase === GamePhase.VERDICT && currentCase && (
                <VerdictScreen 
                  gameState={gameState}
                  currentCase={currentCase}
                  onReset={() => setIsGameStarted(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-[60px] md:h-[80px] border-t-2 border-line flex items-center px-4 md:px-8 justify-between shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
           {gameState.phase === GamePhase.STATION ? (
              <button className="btn-primary h-10 md:h-12 px-6 md:px-10 text-[10px] md:text-xs">FILE FIR</button>
           ) : (
              <div className="mono text-[9px] md:text-[10px] opacity-40 leading-tight">
                 LOOP: VERIFY &gt; FILE &gt; COURT<br />
                 {gameState.phase}_PHASE
              </div>
           )}
        </div>
        <div className="text-right">
           <div className="mono text-[9px] md:text-[10px] opacity-30 font-bold uppercase tracking-widest leading-none">NYAYA_CORE</div>
           <div className="mono text-[8px] md:text-[9px] opacity-20">BNS V1.08</div>
        </div>
      </footer>
    </div>
  );
}

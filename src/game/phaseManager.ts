import { GamePhase } from '../types';

export const getNextPhase = (currentPhase: GamePhase): GamePhase => {
  const flow = [
    GamePhase.BRIEFING,
    GamePhase.INVESTIGATION,
    GamePhase.VERIFICATION,
    GamePhase.STATION,
    GamePhase.COURTROOM,
    GamePhase.VERDICT
  ];
  
  const currentIndex = flow.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === flow.length - 1) return flow[0];
  return flow[currentIndex + 1];
};

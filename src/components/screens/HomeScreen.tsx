import { motion } from 'motion/react';
import { CASES } from '../../constants';
import { Scale, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  onStartCase: (id: string) => void;
}

export default function HomeScreen({ onStartCase }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-paper-dark p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8 md:space-y-12">
        
        <header className="text-center space-y-4">
           <div className="status-chip bg-accent text-white px-4 md:px-8 py-2 mx-auto inline-block border-2 border-line shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
             AUTHORIZATION_REQUIRED // SESSION_0812
           </div>
           <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-none mb-2">Nyaya.Justice</h1>
           <p className="mono font-bold text-[9px] md:text-xs opacity-40 uppercase tracking-[0.3em]">Forensic Legal Simulation // v1.0.812</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {CASES.map(caseItem => (
             <div 
              key={caseItem.id}
              className="bg-white border-2 border-line p-6 md:p-8 flex flex-col gap-4 md:gap-6 group hover:-translate-y-1 transition-transform shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:shadow-[10px_10px_0px_0px_rgba(218,61,44,1)] hover:border-accent"
             >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-paper-dark border border-line flex items-center justify-center">
                    <Scale size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="mono text-[9px] md:text-[10px] opacity-30 font-bold">CASE: #{caseItem.id.split('-')[1]}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif italic leading-tight group-hover:text-accent transition-colors">{caseItem.title}</h3>
                  <p className="text-xs md:text-sm opacity-60 leading-relaxed line-clamp-3 md:line-clamp-4">{caseItem.description}</p>
                </div>

                <div className="space-y-3 md:space-y-4 border-t border-line pt-4 md:pt-6">
                   <div className="data-row border-none p-0 flex justify-between items-center">
                      <span className="opacity-40 uppercase text-[9px] md:text-[10px] mono font-bold tracking-widest text-[8px] md:text-[10px]">Complexity:</span>
                      <div className="flex gap-1">
                        {[...Array(caseItem.complexity)].map((_, i) => (
                          <div key={i} className="w-1 md:w-1.5 h-3 md:h-4 bg-accent" />
                        ))}
                      </div>
                   </div>
                   <div className="data-row border-none p-0 flex justify-between items-center">
                      <span className="opacity-40 uppercase text-[9px] md:text-[10px] mono font-bold tracking-widest text-[8px] md:text-[10px]">Target Law:</span>
                      <span className="mono text-[10px] md:text-[11px] font-bold">{caseItem.lawsTaught[0]}</span>
                   </div>
                </div>

                <button 
                  onClick={() => onStartCase(caseItem.id)}
                  className="btn-accent w-full py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mt-auto shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Mount Investigation
                </button>
             </div>
           ))}

           {/* Locked Cases Placeholder */}
           <div className="bg-paper-dark border-2 border-line border-dashed p-8 flex flex-col items-center justify-center gap-4 opacity-30 grayscale saturate-0 hidden sm:flex">
               <Scale size={40} className="opacity-20" />
               <div className="text-center">
                 <span className="mono text-[10px] font-bold block mb-1 uppercase tracking-widest">Access Restricted</span>
                 <p className="text-[10px] italic">COMPLETE_CASE_01_TO_UNLOCK</p>
               </div>
           </div>
        </div>

        <footer className="text-center pt-12 md:pt-24 pb-8 md:pb-12">
           <div className="w-1/3 h-px bg-line mx-auto mb-6 md:mb-8 opacity-20" />
           <div className="mono text-[8px] md:text-[9px] opacity-30 font-bold uppercase tracking-[0.2em]">
             System Developed by Legal Design Lab // BNSS v1.08
           </div>
        </footer>
      </div>
    </div>
  );
}

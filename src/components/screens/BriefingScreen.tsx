import { motion } from 'motion/react';
import { Case } from '../../types';
import { FileText, FastForward, Play, Scale } from 'lucide-react';

interface BriefingScreenProps {
  caseData: Case;
  onConfirm: () => void;
}

export default function BriefingScreen({ caseData, onConfirm }: BriefingScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Briefing content */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
           <header className="space-y-4 md:space-y-2">
              <div className="flex items-center gap-3 text-accent mb-2">
                 <Scale size={20} className="md:w-6 md:h-6" />
                 <span className="mono font-bold text-base md:text-lg tracking-[0.2em] font-sans">BRIEF_INIT</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-serif italic tracking-tighter mb-4 leading-none">{caseData.title}</h3>
              <div className="status-chip bg-ink text-paper inline-block text-[9px] md:text-[10px]">Active Assignment</div>
              <div className="h-0.5 bg-line w-full opacity-10 mt-4" />
           </header>

           <article className="space-y-10 md:space-y-12">
              <div className="space-y-3 md:space-y-4">
                 <div className="col-header uppercase border-none text-ink/30 tracking-widest text-[9px] md:text-[11px]">Case Narrative</div>
                 <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-ink/80">{caseData.description}</p>
              </div>

              <section className="space-y-4 bg-paper-dark/30 p-4 md:p-0 md:bg-transparent">
                <div className="col-header opacity-100 border-none mb-1 text-[9px] md:text-[11px]">Administrative Intel</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                  <div className="data-row border-none p-0">
                    <span className="opacity-40">STATION:</span>
                    <span className="font-bold">UP_P-812</span>
                  </div>
                  <div className="data-row border-none p-0">
                    <span className="opacity-40">URGENCY:</span>
                    <span className="font-bold text-accent">T-MINUS 4H</span>
                  </div>
                  <div className="data-row border-none p-0">
                    <span className="opacity-40">EST. LOSS:</span>
                    <span className="font-bold">₹1.25L</span>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="col-header uppercase border-none text-ink/30 tracking-widest text-[9px] md:text-[11px]">Objectives</div>
                    <ul className="space-y-4">
                       {[
                         "Secure 1930 transaction logs immediately.",
                         "Verify WhatsApp metadata origin headers.",
                         "Identify BSA Sec 63 compliance status.",
                         "Challenge the SHO on Zero FIR mandate."
                       ].map((obj, i) => (
                         <li key={i} className="flex gap-4 items-start group">
                            <span className="mono text-[10px] font-bold text-accent bg-accent/5 w-6 h-6 flex items-center justify-center shrink-0 border border-accent/20">0{i+1}</span>
                            <span className="text-[12px] md:text-[13px] leading-snug font-medium opacity-70 transition-opacity">{obj}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="space-y-6">
                    <div className="col-header uppercase border-none text-ink/30 tracking-widest text-[9px] md:text-[11px]">Law Masteries</div>
                    <div className="space-y-3">
                       {caseData.lawsTaught.map(law => (
                         <div key={law} className="bg-paper-dark border-2 border-line p-4 relative group hover:border-accent transition-colors shadow-[4px_4px_0px_0px_rgba(20,20,20,0.05)]">
                            <div className="flex justify-between items-center mb-1">
                               <span className="mono font-bold text-[10px] md:text-[11px] tracking-tight">{law}</span>
                               <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-20" />
                            </div>
                            <p className="text-[10px] opacity-40 italic leading-tight">Digital Forensic Standards & Jurisdictional Overrides.</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </article>

           <div className="pt-8">
             <button 
              onClick={onConfirm}
              className="btn-accent w-full py-5 md:py-6 text-xs md:text-sm shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all relative overflow-hidden group"
             >
               <span className="relative z-10 font-bold uppercase tracking-[0.3em]">Authorize Investigation</span>
               <div className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             </button>
           </div>
        </div>
      </main>
    </div>
  );
}

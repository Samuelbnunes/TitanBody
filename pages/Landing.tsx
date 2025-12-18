
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-center">
      <div className="mb-12 animate-in fade-in zoom-in duration-1000">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] rotate-6 opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] -rotate-3 opacity-10"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <i className="fa-solid fa-bolt-lightning text-black text-6xl drop-shadow-lg"></i>
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-2 italic">TITAN<span className="text-emerald-500">BODY</span></h1>
        <div className="h-1 w-12 bg-emerald-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">Forging Elite Physics</p>
      </div>

      <div className="max-w-xs w-full space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <button 
          onClick={() => navigate('/setup')}
          className="w-full bg-white text-black font-black py-5 rounded-3xl text-lg active:scale-95 transition-all shadow-xl hover:bg-zinc-100"
        >
          INICIAR JORNADA
        </button>
        <div className="flex items-center justify-center gap-2 text-zinc-600">
          <div className="h-px w-4 bg-zinc-800"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">
            AI POWERED ENGINE
          </p>
          <div className="h-px w-4 bg-zinc-800"></div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

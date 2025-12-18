
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { AppData, Workout } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const TrainingList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData>(storageService.getData());
  const [expandedDesc, setExpandedDesc] = useState(false);

  useEffect(() => {
    setData(storageService.getData());
  }, []);

  const currentPlan = data.currentPlan;

  if (!currentPlan) {
    return (
      <div className="p-8 text-center h-screen flex flex-col justify-center">
        <h2 className="text-2xl font-black mb-4">Nenhum plano ativo</h2>
        <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-sm">Configure suas informações para que o Titan AI crie um plano sob medida.</p>
        <button 
          onClick={() => navigate('/setup')}
          className="bg-emerald-500 text-white py-4 px-8 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          GERAR PLANO COM IA
        </button>
      </div>
    );
  }

  const nextIndex = (data.lastWorkoutIndex + 1) % currentPlan.workouts.length;
  const methodology = currentPlan.methodology;
  const isLongDesc = methodology.length > 500;
  const displayDesc = !expandedDesc && isLongDesc ? methodology.slice(0, 300) + '...' : methodology;

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Meus Treinos</h1>
          <p className="text-zinc-500 text-sm mt-1">Total: {currentPlan.workouts.length} sessões</p>
        </div>
        <button 
          onClick={() => navigate('/setup')}
          className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 rounded-full px-4 py-2 hover:bg-emerald-500/10 transition-colors"
        >
          Novo Plano
        </button>
      </header>

      <section className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 shadow-sm">
        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Metodologia do Plano</h4>
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line cursor-pointer" onClick={() => setExpandedDesc(!expandedDesc)}>
          {displayDesc}
        </p>
        {isLongDesc && (
          <button 
            onClick={() => setExpandedDesc(!expandedDesc)}
            className="text-emerald-500 text-[10px] font-black uppercase mt-3 tracking-widest"
          >
            {expandedDesc ? 'Ver menos ↑' : 'Ver tudo ↓'}
          </button>
        )}
      </section>

      <div className="space-y-4">
        {currentPlan.workouts.map((workout, index) => {
          const isCurrent = index === nextIndex;
          return (
            <div 
              key={workout.id} 
              className={`bg-zinc-900 border rounded-[2rem] transition-all overflow-hidden ${
                isCurrent ? 'border-emerald-500 shadow-xl shadow-emerald-500/5' : 'border-zinc-800'
              }`}
            >
              <div className="p-6 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SESSÃO {index + 1}</span>
                    {isCurrent && (
                      <span className="text-[8px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded-full uppercase">Treino Atual</span>
                    )}
                  </div>
                  <h3 className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>{workout.name}</h3>
                </div>
                <Link 
                  to={`/workout/${workout.id}`}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <i className="fa-solid fa-play ml-1"></i>
                </Link>
              </div>
              
              <div className="bg-zinc-800/30 p-3 flex gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-800/50">
                <span>{workout.exercises.length} Exercícios</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingList;

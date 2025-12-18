
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Workout, Exercise } from '../types';

interface SetState {
  weight: number;
  completed: boolean;
}

const WorkoutSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [exerciseSets, setExerciseSets] = useState<Record<string, SetState[]>>({});
  
  // Timer state
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showRestPrompt, setShowRestPrompt] = useState(false);
  const [currentRestTarget, setCurrentRestTarget] = useState(60);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const data = storageService.getData();
    const found = data.currentPlan?.workouts.find(w => w.id === id);
    if (found) {
      setWorkout(found);
      const initialSets: Record<string, SetState[]> = {};
      found.exercises.forEach(ex => {
        initialSets[ex.id] = Array.from({ length: ex.sets }, () => ({
          weight: ex.weight,
          completed: false
        }));
      });
      setExerciseSets(initialSets);
      if (found.exercises.length > 0) {
        setExpandedExercise(found.exercises[0].id);
      }
    }
  }, [id]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerRef.current = window.setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, isTimerActive]);

  const toggleSet = (exerciseId: string, setIndex: number, restSeconds: string) => {
    const sets = [...exerciseSets[exerciseId]];
    const wasCompleted = sets[setIndex].completed;
    sets[setIndex].completed = !wasCompleted;
    
    setExerciseSets({ ...exerciseSets, [exerciseId]: sets });

    if (!wasCompleted) {
      // Extract seconds from rest string like "60s" or "1:30"
      const seconds = parseInt(restSeconds) || 60;
      setCurrentRestTarget(seconds);
      setShowRestPrompt(true);
    }
  };

  const updateSetWeight = (exerciseId: string, setIndex: number, delta: number) => {
    const sets = [...exerciseSets[exerciseId]];
    sets[setIndex].weight = Math.max(0, sets[setIndex].weight + delta);
    setExerciseSets({ ...exerciseSets, [exerciseId]: sets });
  };

  const startRest = () => {
    setTimer(currentRestTarget);
    setIsTimerActive(true);
    setShowRestPrompt(false);
  };

  const skipRest = () => {
    setIsTimerActive(false);
    setTimer(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleFinish = () => {
    if (workout) {
      storageService.completeWorkout(workout.id, workout.name);
      navigate('/');
    }
  };

  if (!workout) return <div className="p-8">Treino não encontrado.</div>;

  const totalSets = Object.values(exerciseSets).flat().length;
  const completedSets = Object.values(exerciseSets).flat().filter(s => s.completed).length;
  const isAllDone = completedSets === totalSets && totalSets > 0;
  const progress = Math.round((completedSets / (totalSets || 1)) * 100);

  return (
    <div className="min-h-screen bg-black pb-40">
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 active:scale-90 transition-transform">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          <div className="text-center">
            <h1 className="font-black text-lg uppercase tracking-tight">{workout.name}</h1>
            {isTimerActive ? (
              <button 
                onClick={skipRest}
                className="text-emerald-500 font-mono font-black text-xs flex items-center justify-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 active:scale-95 transition-all mt-1"
              >
                <i className="fa-solid fa-clock-rotate-left animate-spin-slow"></i>
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} • FINALIZAR
              </button>
            ) : (
              <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">{completedSets}/{totalSets} SÉRIES</div>
            )}
          </div>
          <div className="w-10"></div>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {workout.exercises.map((ex) => {
          const sets = exerciseSets[ex.id] || [];
          const isExpanded = expandedExercise === ex.id;
          const allSetsDone = sets.length > 0 && sets.every(s => s.completed);

          return (
            <div 
              key={ex.id} 
              className={`bg-zinc-900/40 border-2 rounded-[2rem] transition-all duration-300 ${allSetsDone ? 'border-emerald-500/30 opacity-60' : isExpanded ? 'border-zinc-700 bg-zinc-900/80 shadow-xl' : 'border-zinc-800'}`}
            >
              <button 
                onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}
                className="w-full text-left p-6 flex justify-between items-center"
              >
                <div className="flex-1 pr-4">
                  <h3 className={`font-black text-xl mb-1 ${allSetsDone ? 'text-zinc-500' : 'text-white'}`}>{ex.name}</h3>
                  <div className="flex gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{ex.muscleGroup}</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500">{sets.filter(s => s.completed).length} / {ex.sets} OK</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180 bg-zinc-800' : 'bg-transparent text-zinc-600'}`}>
                   <i className="fa-solid fa-chevron-down"></i>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-4 gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-1">
                    <span>SÉRIE</span>
                    <span className="col-span-2 text-center">CARGA (KG)</span>
                    <span className="text-right">STATUS</span>
                  </div>
                  {sets.map((set, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950/50 border-zinc-800/50'}`}>
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center gap-4">
                         <button 
                           onClick={() => updateSetWeight(ex.id, idx, -1)}
                           className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-transform"
                         >
                           <i className="fa-solid fa-minus text-[8px]"></i>
                         </button>
                         <div className="text-center min-w-[3.5rem]">
                           <span className="text-xl font-black block leading-none tabular-nums">{set.weight}</span>
                           <span className="text-[8px] text-zinc-600 uppercase font-black">QUILOS</span>
                         </div>
                         <button 
                           onClick={() => updateSetWeight(ex.id, idx, 1)}
                           className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-transform"
                         >
                           <i className="fa-solid fa-plus text-[8px]"></i>
                         </button>
                      </div>

                      <button 
                        onClick={() => toggleSet(ex.id, idx, ex.restTime)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                          set.completed ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                        }`}
                      >
                        <i className={`fa-solid ${set.completed ? 'fa-check-double' : 'fa-check'} text-xs`}></i>
                      </button>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                      Alvo: {ex.reps} Repetições
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showRestPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 w-full max-w-xs text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-emerald-500/30">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
              <i className="fa-solid fa-hourglass-start text-3xl animate-pulse"></i>
            </div>
            <h3 className="text-2xl font-black mb-2 italic">Série Finalizada!</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">Deseja iniciar o descanso sugerido de {currentRestTarget}s?</p>
            <div className="space-y-4">
              <button 
                onClick={startRest}
                className="w-full bg-emerald-500 text-black font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                INICIAR DESCANSO
              </button>
              <button 
                onClick={() => setShowRestPrompt(false)}
                className="w-full text-zinc-600 font-black py-2 text-[10px] uppercase tracking-[0.2em]"
              >
                Pular agora
              </button>
            </div>
          </div>
        </div>
      )}

      {isAllDone && (
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent animate-in slide-in-from-bottom-12 duration-700">
          <div className="max-w-md mx-auto">
             <button 
               onClick={handleFinish}
               className="w-full bg-white text-black font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all group"
             >
               <i className="fa-solid fa-trophy text-xl text-amber-500 group-hover:scale-125 transition-transform"></i>
               <span className="text-lg">FINALIZAR TREINO</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;

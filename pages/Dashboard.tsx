
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { AppData, WorkoutHistory } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AppData>(storageService.getData());

  useEffect(() => {
    setData(storageService.getData());
  }, []);

  if (!data.profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <i className="fa-solid fa-bolt text-emerald-500 text-2xl"></i>
        </div>
        <h1 className="text-2xl font-black mb-2">TitanBody AI</h1>
        <p className="text-zinc-400 mb-8 max-w-xs text-sm">
          A inteligência artificial aplicada ao fisiculturismo de elite.
        </p>
        <Link 
          to="/setup" 
          className="w-full max-w-xs bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
        >
          Configurar Perfil
        </Link>
      </div>
    );
  }

  // Streak Logic: Count weeks with at least one workout
  const calculateStreak = (history: WorkoutHistory[]) => {
    if (history.length === 0) return 0;
    const weeks = new Set();
    history.forEach(h => {
      const date = new Date(h.date);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      weeks.add(`${date.getFullYear()}-${weekNum}`);
    });
    return weeks.size;
  };

  // Weekly Calendar Logic (Mon-Sun)
  const getWeekDates = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();
  const historyDates = data.history.map(h => new Date(h.date).toDateString());
  const streak = calculateStreak(data.history);

  // Next Session Logic
  const workouts = data.currentPlan?.workouts || [];
  const nextIndex = (data.lastWorkoutIndex + 1) % (workouts.length || 1);
  const nextWorkout = workouts[nextIndex];
  
  const todayFinished = data.history.some(h => new Date(h.date).toDateString() === new Date().toDateString());

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">Olá, {data.profile.name}</h1>
          <p className="text-zinc-500 text-sm">Foco total no objetivo.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-1">
             <i className="fa-solid fa-fire text-orange-500 text-xl"></i>
          </div>
          <span className="text-[10px] font-black text-orange-500">{streak} SEMANAS</span>
        </div>
      </header>

      {/* Weekly Goal Calendar */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-8">
        <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest text-center">Meta Semanal: {data.profile.daysPerWeek} Dias</h3>
        <div className="flex justify-between px-2">
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((dayName, idx) => {
            const dateStr = weekDates[idx].toDateString();
            const isCompleted = historyDates.includes(dateStr);
            const isToday = new Date().toDateString() === dateStr;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-500' : 'text-zinc-600'}`}>{dayName}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted ? 'bg-emerald-500 text-white' : isToday ? 'border-2 border-emerald-500/50 bg-emerald-500/5' : 'bg-zinc-800 text-zinc-700'
                }`}>
                  {isCompleted ? <i className="fa-solid fa-check text-xs"></i> : <span className="text-[10px] font-black">{weekDates[idx].getDate()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {nextWorkout && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">
              {todayFinished ? 'Treino Concluído!' : 'Próxima Sessão'}
            </h3>
          </div>
          
          {todayFinished ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-xl"></i>
              </div>
              <h4 className="text-lg font-bold mb-1">Missão Cumprida</h4>
              <p className="text-zinc-400 text-xs mb-4">Você já treinou hoje. Descanse e recupere-se para o próximo!</p>
              <Link to="/training" className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Ver Cronograma</Link>
            </div>
          ) : (
            <Link 
              to={`/workout/${nextWorkout.id}`}
              className="block bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-6 rounded-3xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-1">{nextWorkout.name}</h4>
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white text-[10px] font-black py-2 px-4 rounded-full mt-2">
                  TREINAR AGORA <i className="fa-solid fa-play ml-1"></i>
                </div>
              </div>
              <i className="fa-solid fa-dumbbell absolute -right-4 -bottom-4 text-white/5 text-7xl transform -rotate-12 group-hover:scale-110 transition-transform"></i>
            </Link>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ExperienceLevel } from '../types';
import { generateBodybuildingPlan } from '../services/gemini';
import { storageService } from '../services/storage';

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 75,
    height: 175,
    experience: ExperienceLevel.BEGINNER,
    daysPerWeek: 4,
    focusArea: 'Hipertrofia Geral',
    gender: 'M'
  });

  useEffect(() => {
    const data = storageService.getData();
    if (data.profile) {
      setProfile(data.profile);
      setIsEditing(true);
    }
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    try {
      storageService.saveProfile(profile);
      const data = storageService.getData();
      // Generate plan if new user or if they explicitly confirm a rebuild
      if (!data.currentPlan || confirm("Deseja que o Gemini gere um novo plano de treinos baseado nestas informações?")) {
        const plan = await generateBodybuildingPlan(profile);
        storageService.savePlan(plan);
      }
      navigate('/');
    } catch (error) {
      alert("Erro ao processar. Verifique sua conexão.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-zinc-950">
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fa-solid fa-brain text-2xl text-emerald-500"></i>
          </div>
        </div>
        <h2 className="text-2xl font-black mb-3">Sincronizando Dados...</h2>
        <p className="text-zinc-400 max-w-xs text-sm">O Gemini está analisando seu perfil para otimizar seus ganhos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto bg-black">
      <header className="mb-8 pt-4">
        <div className="flex justify-center mb-8">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-6">
             <i className="fa-solid fa-bolt text-black text-2xl"></i>
           </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
             <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500">ETAPA {step} / 3</span>
             <h1 className="text-2xl font-black">{isEditing ? 'Informações' : 'Configurar Perfil'}</h1>
          </div>
          <button onClick={() => navigate(-1)} className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Sair</button>
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-2">Seu Nome</label>
            <input 
              type="text" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-white"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="Ex: Arnold S."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-2">Peso (kg)</label>
              <input 
                type="number" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 font-bold"
                value={profile.weight}
                onChange={e => setProfile({...profile, weight: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-2">Altura (cm)</label>
              <input 
                type="number" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 font-bold"
                value={profile.height}
                onChange={e => setProfile({...profile, height: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <button 
            disabled={!profile.name}
            onClick={nextStep}
            className="w-full bg-white text-black font-black py-4 rounded-2xl mt-8 disabled:opacity-50 active:scale-95 transition-transform"
          >
            PRÓXIMO PASSO <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-4 text-center">Nível de Experiência</label>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(ExperienceLevel).map((level) => (
                <button
                  key={level}
                  onClick={() => setProfile({...profile, experience: level})}
                  className={`p-5 rounded-2xl border text-left transition-all flex justify-between items-center ${profile.experience === level ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  <span className="font-black uppercase tracking-widest text-xs">{level}</span>
                  {profile.experience === level && <i className="fa-solid fa-circle-check"></i>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={prevStep} className="flex-1 bg-zinc-900 text-zinc-500 font-bold py-4 rounded-2xl border border-zinc-800">VOLTAR</button>
            <button onClick={nextStep} className="flex-1 bg-white text-black font-black py-4 rounded-2xl">PRÓXIMO</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-4 text-center">Frequência Semanal</label>
            <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-inner">
               <button onClick={() => setProfile({...profile, daysPerWeek: Math.max(1, profile.daysPerWeek - 1)})} className="w-12 h-12 bg-zinc-800 rounded-xl text-xl font-bold active:bg-zinc-700 transition-colors">-</button>
               <span className="text-3xl font-black">{profile.daysPerWeek} <small className="text-xs text-zinc-500">DIAS</small></span>
               <button onClick={() => setProfile({...profile, daysPerWeek: Math.min(7, profile.daysPerWeek + 1)})} className="w-12 h-12 bg-zinc-800 rounded-xl text-xl font-bold active:bg-zinc-700 transition-colors">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-2">Foco Muscular Principal</label>
            <input 
              type="text" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-emerald-500 font-bold"
              value={profile.focusArea}
              onChange={e => setProfile({...profile, focusArea: e.target.value})}
              placeholder="Ex: Peito e Costas"
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button onClick={prevStep} className="flex-1 bg-zinc-900 text-zinc-500 font-bold py-4 rounded-2xl border border-zinc-800">VOLTAR</button>
            <button 
              onClick={handleComplete} 
              className="flex-[2] bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
            >
              SALVAR DADOS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupWizard;

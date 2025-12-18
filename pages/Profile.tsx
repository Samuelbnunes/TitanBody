
import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const data = storageService.getData();
  const [profile] = useState(data.profile);

  const handleReset = () => {
    if(confirm("Deseja realmente apagar seu perfil e todos os seus dados salvos? Esta ação não pode ser desfeita.")) {
      localStorage.clear();
      // Use window.location instead of navigate to fully reset the app state
      window.location.href = '#/landing';
      window.location.reload();
    }
  };

  if (!profile) return <div className="p-8 text-center"><p>Nenhum perfil encontrado.</p></div>;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Meu Perfil</h1>
        <button 
          onClick={() => navigate('/setup')}
          className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-emerald-500"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-2xl text-emerald-500">
            <i className="fa-solid fa-id-card"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-zinc-500 text-sm font-medium">{profile.experience}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 divide-x divide-zinc-800">
          <div className="p-6 text-center">
            <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">Peso</span>
            <span className="font-bold text-2xl">{profile.weight} <small className="text-xs font-medium text-zinc-500">kg</small></span>
          </div>
          <div className="p-6 text-center">
            <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">Estatura</span>
            <span className="font-bold text-2xl">{profile.height} <small className="text-xs font-medium text-zinc-500">cm</small></span>
          </div>
        </div>
        
        <div className="p-6 border-t border-zinc-800 space-y-4 bg-zinc-950/30">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500">Treinos p/ Semana</span>
            <span className="font-bold">{profile.daysPerWeek} dias</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500">Foco Atual</span>
            <span className="font-bold text-emerald-500">{profile.focusArea}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/setup')}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors"
        >
          <i className="fa-solid fa-user-gear"></i>
          Editar Perfil
        </button>

        <button 
          onClick={handleReset}
          className="w-full bg-red-500/10 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 border border-red-500/20 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-trash-can"></i>
          Apagar Meu Perfil
        </button>
      </div>

      <div className="mt-12 text-center text-zinc-700 text-[10px] uppercase font-bold tracking-widest">
        TitanBody Core Engine
      </div>
    </div>
  );
};

export default Profile;

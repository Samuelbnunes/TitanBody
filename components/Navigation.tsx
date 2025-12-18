
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Início' },
    { path: '/training', icon: 'fa-dumbbell', label: 'Treinos' },
    { path: '/chat', icon: 'fa-comment-dots', label: 'Coach AI' },
    { path: '/profile', icon: 'fa-user', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

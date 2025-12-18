
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkoutSession from './pages/WorkoutSession';
import SetupWizard from './pages/SetupWizard';
import Profile from './pages/Profile';
import TrainingList from './pages/TrainingList';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import Navigation from './components/Navigation';
import { storageService } from './services/storage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const data = storageService.getData();
  const hasProfile = !!data.profile;
  
  const hideNav = 
    location.pathname.startsWith('/workout') || 
    location.pathname === '/setup' || 
    location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={hasProfile ? <Dashboard /> : <Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/workout/:id" element={<WorkoutSession />} />
        <Route path="/training" element={<TrainingList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/setup" element={<SetupWizard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!hideNav && hasProfile && <Navigation />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;

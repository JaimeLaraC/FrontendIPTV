import React, { useState, useEffect } from 'react';
import { UserCredentials, XtreamCategory, XtreamStream, ViewMode } from './types';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import LiveTV from './components/LiveTV';
import { fetchCategories, fetchStreams } from './services/xtreamService';
import { Clapperboard } from 'lucide-react';

const App: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [streams, setStreams] = useState<XtreamStream[]>([]);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME); // Default to HOME

  // Live TV State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('4');
  const [selectedStream, setSelectedStream] = useState<XtreamStream | null>(null);

  // Load Categories on Login
  useEffect(() => {
    if (credentials) {
      fetchCategories(credentials.url)
        .then(data => {
          setCategories(data);
        })
        .catch(err => console.error(err));
    }
  }, [credentials]);

  // Load Streams when Category Changes - Logic kept for data fetching, but LiveTV handles its own filtering now if we pass all streams. 
  // However, fetching ALL streams might be heavy. The new LiveTV expects 'streams' prop. 
  // If we want to keep the category-based fetching optimization, we might need to adapt LiveTV to handle async loading or just fetch all for now if the API supports it.
  // For this port, assuming we fetch streams based on selected category is still valid, BUT the new UI expects to show categories AND channels.
  // If the new UI expects to browse categories, it needs data.
  // Let's assume for now we fetch a default category or try to fetch more. 
  // To make the new UI work as intended (browsing categories), we ideally need all streams or fetch on demand.
  // Given the constraints and the previous code, let's fetch a default category's streams to populate the UI initially.
  useEffect(() => {
    if (credentials && selectedCategoryId) {
      fetchStreams(credentials.url, selectedCategoryId)
        .then(data => {
          setStreams(data);
        });
    }
  }, [credentials, selectedCategoryId]);

  const handleLogin = (creds: UserCredentials) => {
    setCredentials(creds);
  };

  const handleLogout = () => {
    setCredentials(null);
    setCategories([]);
    setStreams([]);
  };

  if (!credentials) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="w-full h-screen bg-[#0f1016] flex overflow-hidden font-sans text-slate-200">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Layer 1: Navigation Bar (Now Fixed Bottom Overlay) */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      {/* Layer 2: Main Content Area */}
      <div className="flex flex-1 z-10 w-full h-full relative">

        {/* The 'key' attribute forces React to destroy and recreate this div when currentView changes, triggering the animation */}
        <div key={currentView} className="w-full h-full animate-soft-enter flex">

          {/* VIEW: HOME DASHBOARD */}
          {currentView === ViewMode.HOME && (
            <MainDashboard />
          )}

          {/* VIEW: LIVE TV (New Immersive Layout) */}
          {currentView === ViewMode.LIVE_TV && (
            <LiveTV
              streams={streams}
              categories={categories}
              onPlayStream={(stream) => console.log('Playing', stream)}
            />
          )}

          {/* VIEW: Placeholder for other views */}
          {(currentView === ViewMode.MOVIES || currentView === ViewMode.SERIES) && (
            <div className="flex-1 flex items-center justify-center text-white/30 flex-col gap-4">
              <Clapperboard size={48} className="opacity-50" />
              <h2 className="text-xl font-light">VOD Library Coming Soon</h2>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { UserCredentials, XtreamCategory, XtreamStream, ViewMode } from './types';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import LiveTV from './components/LiveTV';
import { login, fetchCategories, fetchAllStreams, getProfile } from './services/xtreamService';
import { Clapperboard, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [streams, setStreams] = useState<XtreamStream[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading to check for session

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME); // Default to HOME

  // Check for existing token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 1. Get Profile to restore credentials (or at least valid session state)
          const profile = await getProfile();

          // The profile contains decrypted credentials in user.iptv_credentials
          // We need to map this to UserCredentials
          if (profile && (profile as any).user && (profile as any).user.iptv_credentials) {
            const savedCreds = (profile as any).user.iptv_credentials;
            setCredentials(savedCreds);

            // 2. Fetch All Data
            const [cats, allStreams] = await Promise.all([
              fetchCategories(savedCreds.url),
              fetchAllStreams()
            ]);
            setCategories(cats);
            setStreams(allStreams);
          } else {
            // Invalid profile structure, force login
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const handleLogin = async (creds: UserCredentials) => {
    setIsLoading(true);
    try {
      // 1. Login to get token
      await login(creds);
      setCredentials(creds);

      // 2. Fetch All Data (Categories & Streams)
      // We do this here to "process all channels" as requested
      const [cats, allStreams] = await Promise.all([
        fetchCategories(creds.url),
        fetchAllStreams()
      ]);

      setCategories(cats);
      setStreams(allStreams);

    } catch (error) {
      console.error("Login or Fetch Error:", error);
      alert("Login failed or error fetching data. Please check credentials and server.");
      setCredentials(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCredentials(null);
    setCategories([]);
    setStreams([]);
    localStorage.removeItem('token');
    localStorage.removeItem('favorite_categories');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl font-light">Restaurando sesión...</p>
      </div>
    );
  }

  if (!credentials) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-xl font-light">Conectando y procesando canales...</p>
            <p className="text-sm text-white/50 mt-2">Esto puede tardar unos segundos dependiendo de la cantidad de canales.</p>
          </div>
        )}
      </>
    );
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
              allCategories={categories}
              allStreams={streams}
              isLoading={isLoading}
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
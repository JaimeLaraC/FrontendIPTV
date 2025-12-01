
import React from 'react';
import { Tv, Star, Settings, LogOut, Home, Clapperboard } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {

  const NavItem = ({ view, icon: Icon }: { view: ViewMode; icon: any }) => {
    const isActive = currentView === view;
    return (
      <div className="group/item relative flex items-center justify-center">
        {isActive && (
          <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-xl opacity-60 transition-opacity"></div>
        )}

        {/* Tooltip */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all pointer-events-none whitespace-nowrap z-50">
          {view}
        </span>

        <button
          onClick={() => onNavigate(view)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
            ${isActive
              ? 'bg-gradient-to-br from-white to-gray-200 text-blue-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110'
              : 'bg-transparent text-white/40 hover:text-white hover:bg-white/10 hover:scale-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
            }
          `}
        >
          <Icon size={isActive ? 20 : 22} fill={isActive ? "currentColor" : "none"} strokeWidth={isActive ? 2.5 : 2} />
        </button>
      </div>
    );
  };

  return (
    // TRIGGER ZONE: A fixed invisible strip on the bottom that detects hover
    <div className="fixed bottom-0 left-0 w-full h-24 z-[9999] group perspective-[2000px] flex justify-center items-end pointer-events-none">

      {/* Invisible Hover Hitbox - make it interactive */}
      <div className="absolute inset-x-0 bottom-0 h-20 z-50 cursor-pointer pointer-events-auto" />

      {/* Visual Cue: Subtle glowing pill indicating menu position */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full blur-[1px] group-hover:opacity-0 transition-opacity duration-300 animate-pulse delay-0 group-hover:delay-0" />

      {/* 3D MENU PANEL (The Glass Pill) */}
      <div className="
        mb-4 relative pointer-events-auto z-[100]
        w-auto py-3 px-6 bg-[#1a1b26]/80 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        flex flex-row items-center gap-5
        origin-bottom transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        translate-y-[150%] rotate-x-[-90deg] opacity-0 scale-90
        group-hover:translate-y-0 group-hover:rotate-x-0 group-hover:opacity-100 group-hover:scale-100
        delay-[1000ms] group-hover:delay-0
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-white/20
      ">

        {/* Main Nav */}
        <div className="flex flex-row gap-3 items-center">
          <NavItem view={ViewMode.HOME} icon={Home} />
          <NavItem view={ViewMode.LIVE_TV} icon={Tv} />
          <NavItem view={ViewMode.MOVIES} icon={Clapperboard} />

          <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

          <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-110 hover:rotate-12">
            <Star size={20} />
          </button>

          <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-110 hover:rotate-90">
            <Settings size={20} />
          </button>
        </div>

        {/* Footer Nav (Inside Pill) */}
        <div className="ml-1 pl-3 border-l border-white/5 h-8 flex items-center">
          <button onClick={onLogout} className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-110">
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
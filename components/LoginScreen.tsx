
import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Lock, Server, Tag } from 'lucide-react';
import { UserCredentials } from '../types';

interface LoginScreenProps {
  onLogin: (creds: UserCredentials) => void;
}

// High-quality TV-themed backgrounds
const backgroundImages = [
  // Football/Stadium (Sports)
  "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2600&auto=format&fit=crop",
  // Cinema/Movies (Projector/Theater)
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2600&auto=format&fit=crop",
  // News Studio (Cameras/Set)
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2600&auto=format&fit=crop",
  // Concert/Entertainment
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2600&auto=format&fit=crop"
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [url, setUrl] = useState('http://mock-xtream-url.com');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && url) {
      onLogin({ username, password, url });
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black font-sans text-white">

      {/* Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out z-0 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={img}
            alt="Background"
            className="w-full h-full object-cover transform scale-105"
            style={{
              animation: index === currentImageIndex ? 'slowZoom 20s infinite alternate linear' : 'none'
            }}
          />
          {/* Heavy Dark Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/70 bg-gradient-to-t from-black via-black/60 to-black/70"></div>
        </div>
      ))}

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">

        {/* Apple-style Glass Card */}
        <div className="w-full max-w-[380px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-center">Añadir Lista</h1>
            <p className="text-white/50 text-sm mt-1.5 font-light">Introduce datos Xtream Codes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-3">

              {/* Playlist Name (Alias) */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <Tag size={16} />
                </div>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Nombre de Lista (Alias)"
                  className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>

              {/* Username */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>

              {/* URL */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <Server size={16} />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="URL del Servidor (http://...)"
                  className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-white text-black font-semibold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              Conectar
              <ArrowRight size={16} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
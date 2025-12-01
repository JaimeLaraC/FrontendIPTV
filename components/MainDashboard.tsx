import React from 'react';
import { Play, Info, Clock, Star, Signal, Radio } from 'lucide-react';

const MainDashboard: React.FC = () => {

  // Mock Data: Featured Live Event (TV)
  const featuredContent = {
    title: "Champions League Final",
    subtitle: "Manchester City vs Real Madrid",
    desc: "Live coverage of the UEFA Champions League final from Wembley Stadium. Pre-match analysis, player interviews, and the full match live in 4K HDR.",
    image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2600&auto=format&fit=crop", 
    tags: ["Live Sport", "Football", "4K HDR"],
    channel: "Sky Sports Main Event"
  };

  // Mock Data: Recent Channels (Replacing Series)
  const recentChannels = [
    { id: 1, name: "CNN US", program: "Anderson Cooper 360", time: "20:00 - 21:00", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/2048px-CNN_International_logo.svg.png", bg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" },
    { id: 2, name: "ESPN", program: "NBA Countdown", time: "Live", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESPN_logo.svg/2560px-ESPN_logo.svg.png", bg: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2669&auto=format&fit=crop" },
    { id: 3, name: "HBO", program: "The Last of Us", time: "21:00 - 22:00", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/2560px-HBO_logo.svg.png", bg: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop" },
    { id: 4, name: "Nat Geo", program: "Wild: Lions", time: "18:00 - 19:30", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nat_Geo_Wild_logo.svg/2560px-Nat_Geo_Wild_logo.svg.png", bg: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2572&auto=format&fit=crop" },
  ];

  // Mock Data: Favorite Channels
  const favoriteChannels = [
    { id: 101, name: "Discovery", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Discovery_Science_201x_logo.svg/1200px-Discovery_Science_201x_logo.svg.png" },
    { id: 102, name: "Disney", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Disney_Channel_logo.svg/2560px-Disney_Channel_logo.svg.png" },
    { id: 103, name: "Sky Cinema", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sky_Sports_logo_%282017%29.svg/2560px-Sky_Sports_logo_%282017%29.svg.png" },
    { id: 104, name: "MTV Live", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/MTV_Live_Logo_2017.svg/2560px-MTV_Live_Logo_2017.svg.png" },
    { id: 105, name: "BBC One", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_One_logo_%282021%29.svg/2048px-BBC_One_logo_%282021%29.svg.png" },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide pb-20 relative perspective-1000">
      
      {/* Hero Section (Live TV Event) */}
      <div className="w-full h-[70vh] relative rounded-bl-[50px] overflow-hidden shadow-2xl group">
        <img src={featuredContent.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt="Hero" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1016] via-[#0f1016]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-[#0f1016]/20 to-transparent"></div>

        {/* Live Indicator */}
        <div className="absolute top-10 right-10 flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full z-20 shadow-lg animate-pulse">
            <Radio size={16} className="text-white" />
            <span className="text-white font-bold text-xs tracking-wider">LIVE Broadcast</span>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-16 left-0 p-12 max-w-2xl z-20">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">{featuredContent.channel}</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                {featuredContent.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium text-white/80">
                        {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-6xl font-bold text-white mb-2 leading-tight drop-shadow-2xl">
                {featuredContent.title}
            </h1>
            <h2 className="text-2xl text-white/90 font-light mb-6">
                {featuredContent.subtitle}
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-8 line-clamp-3">
                {featuredContent.desc}
            </p>

            <div className="flex gap-4">
                <button className="px-8 py-3.5 bg-white text-black rounded-xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95">
                    <Play size={20} fill="currentColor" />
                    Watch Channel
                </button>
                <button className="px-8 py-3.5 bg-white/10 text-white border border-white/10 rounded-xl font-bold flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
                    <Info size={20} />
                    Guide Info
                </button>
            </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-10 -mt-10 relative z-30 space-y-12">
        
        {/* Recent Channels Section */}
        <div>
            <div className="flex items-center gap-2 mb-6 pl-2">
                <Clock className="text-blue-400" size={18} />
                <h3 className="text-white font-semibold text-lg tracking-wide">Recent Channels</h3>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-8 pt-4 px-2 scrollbar-hide">
                {recentChannels.map(item => (
                    <div key={item.id} className="min-w-[280px] h-[160px] relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5 shadow-lg transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] hover:ring-2 hover:ring-blue-500/50 hover:z-50">
                        {/* Background Image of the Show */}
                        <img src={item.bg} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 scale-110" alt={item.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#0f1016]/50 to-transparent"></div>
                        
                        {/* Channel Logo (Centered) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-4">
                             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full p-2 shadow-xl flex items-center justify-center">
                                <img src={item.img} className="max-w-full max-h-full object-contain drop-shadow-md" alt="logo" />
                             </div>
                        </div>

                        {/* Text Info (Bottom) */}
                        <div className="absolute bottom-0 w-full p-4 transform transition-transform duration-300">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-0.5 drop-shadow-md">{item.name}</h4>
                                    <span className="text-blue-300 text-xs font-medium">{item.program}</span>
                                </div>
                                <span className="text-white/40 text-[10px] font-mono bg-white/5 px-2 py-1 rounded">{item.time}</span>
                            </div>
                            
                            {/* Live Progress Bar simulation */}
                            <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-red-500 w-[60%] shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Favorites Section (Replacing Trending Live) */}
        <div className="pb-10">
            <div className="flex items-center gap-2 mb-6 pl-2">
                <Star className="text-yellow-400" size={18} />
                <h3 className="text-white font-semibold text-lg tracking-wide">Your Favorites</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-soft-enter">
                {favoriteChannels.map((channel) => (
                    <div key={channel.id} className="h-[100px] bg-[#1a1b26] rounded-xl relative group cursor-pointer border border-white/5 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-[#232433] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                             <div className="w-12 h-12 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                                <img src={channel.img} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0" alt={channel.name} />
                             </div>
                             <span className="text-white/40 text-xs font-medium group-hover:text-white transition-colors">{channel.name}</span>
                        </div>

                        {/* Quick Play Button on Hover */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                                <Play size={10} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add New Favorite Button */}
                <div className="h-[100px] rounded-xl border border-dashed border-white/10 flex items-center justify-center cursor-pointer text-white/20 hover:text-white/60 hover:border-white/30 transition-all hover:scale-105">
                    <span className="text-xs font-medium">+ Add New</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MainDashboard;
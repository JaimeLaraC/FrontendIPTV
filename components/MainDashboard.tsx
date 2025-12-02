import React from 'react';
import { Play, Info, Clock, Radio } from 'lucide-react';

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


            </div>
        </div>
    );
};

export default MainDashboard;
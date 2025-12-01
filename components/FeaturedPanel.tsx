import React from 'react';
import { XtreamStream } from '../types';
import { Search, Cloud, Bell } from 'lucide-react';

interface FeaturedPanelProps {
  stream: XtreamStream | null;
}

const FeaturedPanel: React.FC<FeaturedPanelProps> = ({ stream }) => {
  if (!stream) {
    return (
        <div className="flex-1 h-full bg-[#0b0c15] flex items-center justify-center text-white/20">
            Select a channel
        </div>
    );
  }

  // Determine a background image based on channel name (Mock logic)
  let bgImage = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2572&auto=format&fit=crop'; // Default Cheetah (Nature)
  if (stream.name.includes("Disney") || stream.name.includes("Cartoon")) bgImage = 'https://images.unsplash.com/photo-1534251664183-026857416353?q=80&w=2560&auto=format&fit=crop';
  if (stream.name.includes("Sport") || stream.name.includes("ESPN")) bgImage = 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2b?q=80&w=2670&auto=format&fit=crop';
  if (stream.name.includes("HBO") || stream.name.includes("Movie")) bgImage = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop';

  return (
    <div className="relative w-full h-full overflow-hidden rounded-l-[40px] shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        {/* Background Image */}
        <div className="absolute inset-0">
            <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
            
            {/* Gradient Overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0f1016]/40 to-[#0f1016]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-transparent to-transparent opacity-90"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col p-10 z-10">
            
            {/* Top Bar: Time, Weather, Search */}
            <div className="flex items-center justify-end gap-6 mb-auto">
                <span className="text-white/90 font-medium">12:51</span>
                
                <div className="flex items-center gap-2 text-white/80">
                    <Cloud size={18} />
                    <span>24°</span>
                </div>

                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 backdrop-blur-sm">
                    <Search size={18} />
                </button>
            </div>

            {/* Bottom Content Info */}
            <div className="mt-auto max-w-lg">
                <div className="mb-2">
                    <span className="text-white/60 text-sm font-medium">Now Playing...</span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    Animals and Nature
                </h1>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">
                    Big cat expert Boone Smith follows a strange trail of carnage and death to track cats in Patagonia. He documents their behavior from kittens to killers in this breathtaking documentary.
                </p>

                {/* Progress Bar */}
                <div className="w-full mb-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[35%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    </div>
                </div>
                
                <div className="flex justify-between text-[10px] font-medium text-white/50">
                    <span>01:52:37</span>
                    <span>02:10:46</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FeaturedPanel;
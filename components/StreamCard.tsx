import React from 'react';
import { XtreamStream } from '../types';
import { Star } from 'lucide-react';

interface StreamCardProps {
  stream: XtreamStream;
  isSelected: boolean;
  onSelect: (stream: XtreamStream) => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(stream)}
      className={`relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group
        ${isSelected 
            ? 'h-[140px] bg-gradient-to-br from-[#2a2d45] to-[#1e1f30] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] scale-105 border border-white/10 z-20 translate-x-2' 
            : 'h-[100px] bg-[#1a1b26] hover:bg-[#232433] border border-white/5 opacity-80 hover:opacity-100 z-0 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:z-10 hover:border-white/20'
        }
      `}
    >
        {/* Active Indicator Strip */}
        {isSelected && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
        )}

        <div className="flex h-full items-center p-5 gap-5">
            {/* Logo */}
            <div className={`flex-shrink-0 flex items-center justify-center bg-black/20 rounded-md p-2 transition-all duration-300
                ${isSelected ? 'w-24 h-24 shadow-lg' : 'w-16 h-16 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}
            `}>
                <img 
                    src={stream.stream_icon} 
                    alt={stream.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-md"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=TV';
                    }}
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 justify-center transition-transform duration-300 group-hover:translate-x-1">
                <h3 className={`font-semibold leading-tight mb-1 transition-all ${isSelected ? 'text-white text-lg' : 'text-white/70 text-base group-hover:text-white'}`}>
                    {stream.name}
                </h3>
                
                {isSelected && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-300/80 font-medium">{stream.views}</span>
                    </div>
                )}
                
                {!isSelected && (
                     <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">{stream.views}</span>
                )}

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                    {stream.tags?.map((tag, idx) => (
                        <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${isSelected ? 'bg-white/10 text-white/90' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Favorite Star */}
            <div className={`self-start mt-1 transition-all duration-300 ${isSelected ? 'text-orange-500 scale-110' : 'text-transparent group-hover:text-white/10 group-hover:scale-110'}`}>
                <Star size={16} fill={isSelected ? "currentColor" : "none"} />
            </div>
        </div>
    </div>
  );
};

export default StreamCard;
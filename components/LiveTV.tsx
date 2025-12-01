
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { XtreamStream, XtreamCategory } from '../types';
import { Play, Info, Volume2, Folder, Globe, ArrowLeft, ChevronRight, Wifi, Zap, Maximize2, ChevronLeft } from 'lucide-react';

interface LiveTVProps {
    streams: XtreamStream[];
    categories: XtreamCategory[];
    onPlayStream?: (stream: XtreamStream) => void;
}

// Internal presentation type for the UI
interface UIChannel {
    id: number;
    name: string;
    nowPlaying: string;
    logo: string;
    progress: number;
    image: string;
    quality: string;
    category: string;
    originalStream: XtreamStream;
}

type TVLayoutMode = 'ambient' | 'cyber' | 'spatial';

const LiveTV: React.FC<LiveTVProps> = ({ streams, categories, onPlayStream }) => {
    const [layoutMode, setLayoutMode] = useState<TVLayoutMode>('ambient');
    const [selectedChannel, setSelectedChannel] = useState<UIChannel | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Navigation State
    const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

    // Map XtreamStream to UIChannel
    const uiChannels = useMemo(() => {
        return streams.map(stream => {
            const cat = categories.find(c => c.category_id === stream.category_id);
            // Mocking missing data for UI demo purposes
            const isHD = stream.name.toLowerCase().includes('hd');
            const isFHD = stream.name.toLowerCase().includes('fhd') || stream.name.toLowerCase().includes('1080');
            const is4K = stream.name.toLowerCase().includes('4k') || stream.name.toLowerCase().includes('uhd');

            let quality = 'SD';
            if (is4K) quality = '4K';
            else if (isFHD) quality = 'FHD';
            else if (isHD) quality = 'HD';

            return {
                id: stream.stream_id,
                name: stream.name,
                nowPlaying: stream.name, // Using name as title for now
                logo: stream.stream_icon || 'https://via.placeholder.com/150?text=No+Logo',
                progress: Math.floor(Math.random() * 100), // Random progress
                image: stream.stream_icon || 'https://via.placeholder.com/800x600?text=No+Preview', // Use icon as backdrop if no other image
                quality,
                category: cat ? cat.category_name : 'Uncategorized',
                originalStream: stream
            } as UIChannel;
        });
    }, [streams, categories]);

    // Set initial selected channel
    useEffect(() => {
        if (uiChannels.length > 0 && !selectedChannel) {
            setSelectedChannel(uiChannels[0]);
        }
    }, [uiChannels]);

    // Derive Unique Categories from the available channels
    const availableCategories = useMemo(() => {
        const cats = Array.from(new Set(uiChannels.map(c => c.category)));
        return cats.sort();
    }, [uiChannels]);

    // Filter channels based on active category
    const visibleChannels = useMemo(() => {
        if (!activeCategoryName) return [];
        return uiChannels.filter(c => c.category === activeCategoryName);
    }, [activeCategoryName, uiChannels]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setIsPlaying(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedChannel]);

    // Scroll active channel into view in the list
    const activeChannelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (activeChannelRef.current) {
            activeChannelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedChannel]);

    if (!selectedChannel) return <div className="w-full h-full flex items-center justify-center text-white">Loading Channels...</div>;

    // --- COMPONENT: OPTION 1 - AMBIENT IMMERSIVE (UPDATED) ---
    const AmbientView = () => (
        <div className="relative w-full h-full overflow-hidden flex font-sans select-none">

            {/* Custom Animations */}
            <style>{`
        @keyframes zoom-in-fade {
          0% { opacity: 0; transform: scale(0.95) translateZ(-50px); filter: blur(4px); }
          100% { opacity: 1; transform: scale(1) translateZ(0); filter: blur(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
      `}</style>

            {/* 1. Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 bg-[#0f1016]">
                {/* Dynamic Blurred Logo Background */}
                <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-1000 ease-in-out opacity-40 scale-150 blur-[100px]"
                    style={{
                        backgroundImage: `url(${selectedChannel.logo || selectedChannel.image})`,
                    }}
                />

                {/* Vignette Overlay for Focus */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1016] via-[#0f1016]/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-transparent to-black/40" />
            </div>

            {/* 2. Main Content Layer */}
            <div className="relative z-10 flex w-full h-full">

                {/* Left: Hero Info (Sticky) */}
                <div className="flex-[3] flex flex-col justify-center p-12 pl-20">
                    <div className="animate-soft-enter max-w-4xl">

                        {/* Channel Logo (Floating) */}
                        <div className="mb-10 animate-[float_6s_ease-in-out_infinite]">
                            <div className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-[30px] p-6 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                <img
                                    src={selectedChannel.logo}
                                    className="w-full h-full object-contain drop-shadow-lg"
                                    alt="logo"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        </div>

                        {/* Metadata Badge Row */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-[pulse_2s_infinite]"></span>
                                <span className="text-red-100 text-[11px] font-bold tracking-widest uppercase">LIVE STREAM</span>
                            </div>

                            {/* Quality Badge (Derived) */}
                            {(selectedChannel.name.includes('HD') || selectedChannel.name.includes('FHD') || selectedChannel.name.includes('4K')) && (
                                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 text-white/80 text-[11px] font-bold tracking-widest uppercase">
                                    {selectedChannel.name.includes('4K') ? '4K UHD' : selectedChannel.name.includes('FHD') ? 'FULL HD' : 'HD'}
                                </div>
                            )}

                            <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 text-white/50 text-[11px] font-bold tracking-widest uppercase">
                                {selectedChannel.category}
                            </div>
                        </div>

                        {/* Massive Channel Name Title */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter drop-shadow-2xl line-clamp-2">
                            {selectedChannel.name}
                        </h1>

                        {/* Description / Subtitles */}
                        <p className="text-xl text-white/50 font-light max-w-xl mb-10 leading-relaxed">
                            Disfruta de la mejor programación en vivo. Conexión estable y de alta calidad directamente a tu pantalla.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => {
                                    setIsPlaying(!isPlaying);
                                    if (onPlayStream) onPlayStream(selectedChannel.originalStream);
                                }}
                                className="group h-16 px-10 bg-white text-black rounded-[20px] font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                            >
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    {isPlaying ? <span className="w-2.5 h-2.5 bg-white rounded-sm" /> : <Play fill="white" className="text-white ml-0.5" size={14} />}
                                </div>
                                {isPlaying ? 'Reproduciendo...' : 'Ver Ahora'}
                            </button>

                            <button className="h-16 w-16 rounded-[20px] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
                                <Info size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Glass List (Categories or Channels) */}
                <div className="flex-[1.2] min-w-[350px] max-w-[450px] h-full relative z-20">
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-[#0f1016]/60 backdrop-blur-3xl border-l border-white/5"></div>

                    <div className="relative z-0 h-full flex flex-col pt-8 pb-8">

                        {/* Header Area */}
                        <div className="px-8 mb-6 flex items-center justify-between min-h-[32px]">
                            {activeCategoryName ? (
                                <button
                                    onClick={() => setActiveCategoryName(null)}
                                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                    </div>
                                    <span className="font-bold text-xs tracking-widest uppercase">{activeCategoryName}</span>
                                </button>
                            ) : (
                                <h3 className="text-white/40 font-bold text-xs tracking-widest uppercase">Categorías</h3>
                            )}

                            <div className="flex gap-2 text-white/20">
                                <Globe size={16} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 space-y-2 scrollbar-hide perspective-1000">

                            {/* Animated Container Switcher */}
                            <div key={activeCategoryName || 'categories'} className="animate-[zoom-in-fade_0.4s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">

                                {/* MODE: CATEGORIES LIST */}
                                {!activeCategoryName && availableCategories.map((category) => {
                                    // Find first channel in this category for preview logic on click
                                    const previewChannel = uiChannels.find(c => c.category === category);
                                    const count = uiChannels.filter(c => c.category === category).length;

                                    return (
                                        <div
                                            key={category}
                                            onClick={() => {
                                                setActiveCategoryName(category);
                                                // Update background to fit the new context immediately on click (dive in)
                                                if (previewChannel) setSelectedChannel(previewChannel);
                                            }}
                                            className="group relative p-5 mb-3 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ease-out cursor-pointer flex items-center gap-4 hover:scale-[1.02] transform origin-center"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white/80 group-hover:text-white transition-colors border border-white/5">
                                                <Folder size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{category}</h4>
                                                <span className="text-[11px] text-white/40 font-medium tracking-wide">{count} Canales</span>
                                            </div>
                                            <ChevronRight className="ml-auto text-white/10 group-hover:translate-x-1 transition-transform" size={18} />
                                        </div>
                                    );
                                })}

                                {/* MODE: CHANNELS LIST */}
                                {activeCategoryName && visibleChannels.map((channel) => {
                                    const isActive = selectedChannel.id === channel.id;
                                    return (
                                        <div
                                            key={channel.id}
                                            ref={isActive ? activeChannelRef : null}
                                            onClick={() => setSelectedChannel(channel)}
                                            className={`
                                        group relative p-3 mb-2 rounded-[18px] transition-all duration-300 cursor-pointer border flex items-center gap-4 transform origin-center
                                        ${isActive
                                                    ? 'bg-white/10 border-white/20 shadow-lg scale-100 opacity-100 z-10'
                                                    : 'bg-transparent border-transparent hover:bg-white/5 hover:scale-[1.02] opacity-60 hover:opacity-100'
                                                }
                                    `}
                                        >
                                            {/* Glow Effect for Active */}
                                            {isActive && <div className="absolute inset-0 bg-white/5 rounded-[18px] blur-lg" />}

                                            <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center p-2 transition-all duration-300 flex-shrink-0 border
                                        ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 grayscale group-hover:grayscale-0'}
                                    `}>
                                                <img src={channel.logo} className="w-full h-full object-contain" alt="logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
                                                    {channel.name}
                                                </h4>
                                                {/* Removed "Now Playing" as we don't have EPG */}
                                                <p className={`text-[10px] truncate transition-colors ${isActive ? 'text-blue-300' : 'text-white/30'}`}>
                                                    {channel.id} • {channel.quality}
                                                </p>
                                            </div>

                                            {/* Active Indicator (EQ) */}
                                            {isActive && (
                                                <div className="flex gap-0.5 items-end h-3 mr-2">
                                                    <div className="w-0.5 bg-green-400 rounded-full animate-[music_1s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                                                    <div className="w-0.5 bg-green-400 rounded-full animate-[music_1.2s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }}></div>
                                                    <div className="w-0.5 bg-green-400 rounded-full animate-[music_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '40%' }}></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- COMPONENT: OPTION 2 - CYBER GRID (UPDATED) ---
    const CyberView = () => (
        <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col font-mono select-none">
            {/* Cyber Grid Background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black pointer-events-none" />

            {/* Top: Video Preview Command Center */}
            <div className="flex-1 p-6 flex gap-6 min-h-[50vh]">
                {/* Main Preview */}
                <div className="flex-1 relative border border-[#22c55e]/30 bg-black/80 shadow-[0_0_30px_rgba(34,197,94,0.1)] rounded-lg overflow-hidden group">
                    {/* Background using Logo instead of Image */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <img src={selectedChannel.logo} className="w-1/2 h-1/2 object-contain grayscale opacity-50" alt="bg" />
                    </div>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                                <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-2 py-0.5 text-xs font-bold animate-pulse">LIVE FEED</span>
                                <span className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50 px-2 py-0.5 text-xs font-bold">STREAM OK</span>
                                <span className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50 px-2 py-0.5 text-xs font-bold">{selectedChannel.quality}</span>
                            </div>
                            <Maximize2 className="text-[#22c55e]/60 hover:text-[#22c55e] cursor-pointer" size={20} />
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-md font-sans">{selectedChannel.name}</h2>
                            <div className="flex items-center gap-4">
                                <img src={selectedChannel.logo} className="h-8 object-contain" alt="ch" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <span className="text-[#22c55e] text-lg">/ {selectedChannel.category}</span>
                                <span className="text-white/40 text-sm">ID: {selectedChannel.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#22c55e]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#22c55e]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#22c55e]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#22c55e]" />
                </div>

                {/* Side Stats Panel */}
                <div className="w-64 border-l border-[#22c55e]/20 pl-6 flex flex-col gap-4 text-xs text-[#22c55e]/70">
                    <div className="mb-4">
                        <h3 className="text-white font-bold mb-2 border-b border-white/10 pb-2">SYSTEM STATUS</h3>
                        <div className="flex items-center gap-2 mb-1"><Wifi size={14} /> Connection: Stable</div>
                        <div className="flex items-center gap-2"><Zap size={14} /> Latency: 12ms</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold mb-2 border-b border-white/10 pb-2">CHANNEL INFO</h3>
                        <div className="mb-2">
                            <span className="text-white/50 block">Name:</span>
                            <span className="text-white">{selectedChannel.name}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-white/50 block">Category:</span>
                            <span className="text-white">{selectedChannel.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Channel List (Replaced EPG) */}
            <div className="h-[40vh] bg-[#0a0a0a] border-t border-[#22c55e]/20 p-4">
                <div className="flex gap-4 mb-2 text-xs text-[#22c55e]/50 ml-[100px]">
                    <span>CHANNEL LIST</span>
                </div>
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                    {uiChannels.slice(0, 50).map((channel) => (
                        <div
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                            className={`flex items-center h-14 border-b border-white/5 hover:bg-white/5 cursor-pointer ${selectedChannel.id === channel.id ? 'bg-[#22c55e]/10 border-l-2 border-l-[#22c55e]' : ''}`}
                        >
                            <div className="w-[80px] p-2 flex-shrink-0 border-r border-white/5 flex justify-center">
                                <img src={channel.logo} className="max-h-8 max-w-[60px] object-contain" alt="logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                            <div className="flex-1 px-4 flex items-center justify-between">
                                <span className={`text-sm font-semibold truncate ${selectedChannel.id === channel.id ? 'text-[#22c55e]' : 'text-white'}`}>{channel.name}</span>
                                {selectedChannel.id === channel.id && <span className="text-[10px] text-[#22c55e] animate-pulse">ACTIVE</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // --- COMPONENT: OPTION 3 - SPATIAL GLASS FLOW (UPDATED) ---
    const SpatialView = () => {
        // Basic index logic for the carousel
        const [activeIndex, setActiveIndex] = useState(0);
        const channelsToDisplay = uiChannels.slice(0, 15); // Limit for performance/demo

        const handleNext = () => setActiveIndex((prev) => (prev + 1) % channelsToDisplay.length);
        const handlePrev = () => setActiveIndex((prev) => (prev - 1 + channelsToDisplay.length) % channelsToDisplay.length);

        // Sync selected channel with active index
        useEffect(() => {
            setSelectedChannel(channelsToDisplay[activeIndex]);
        }, [activeIndex]);

        const getCardStyle = (index: number) => {
            const diff = (index - activeIndex + channelsToDisplay.length) % channelsToDisplay.length;

            let transform = '';
            let opacity = 0.5;
            let zIndex = 0;
            let filter = 'blur(4px) brightness(0.5)';

            // Adjust diff to handle wrap-around for immediate neighbors
            let effectiveDiff = diff;
            if (diff > channelsToDisplay.length / 2) effectiveDiff -= channelsToDisplay.length;
            if (diff < -channelsToDisplay.length / 2) effectiveDiff += channelsToDisplay.length;

            if (effectiveDiff === 0) {
                transform = 'translateX(0) scale(1) translateZ(0)';
                opacity = 1;
                zIndex = 50;
                filter = 'none';
            } else if (effectiveDiff === 1) {
                transform = 'translateX(60%) scale(0.8) rotateY(-25deg) translateZ(-100px)';
                opacity = 0.7;
                zIndex = 40;
            } else if (effectiveDiff === -1) {
                transform = 'translateX(-60%) scale(0.8) rotateY(25deg) translateZ(-100px)';
                opacity = 0.7;
                zIndex = 40;
            } else if (effectiveDiff > 1) {
                transform = 'translateX(120%) scale(0.6) rotateY(-45deg) translateZ(-200px)';
                opacity = 0;
            } else if (effectiveDiff < -1) {
                transform = 'translateX(-120%) scale(0.6) rotateY(45deg) translateZ(-200px)';
                opacity = 0;
            }

            return { transform, opacity, zIndex, filter };
        };

        return (
            <div className="w-full h-full bg-[#0f1016] overflow-hidden flex flex-col relative perspective-[1200px] select-none">
                {/* Soft Radial Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f1016] to-[#0f1016]" />

                <div className="flex-1 flex items-center justify-center relative mt-10">
                    {/* Carousel Container */}
                    <div className="relative w-[800px] h-[500px] flex items-center justify-center preserve-3d">
                        {channelsToDisplay.map((channel, index) => {
                            const style = getCardStyle(index);
                            return (
                                <div
                                    key={channel.id}
                                    className="absolute w-[600px] h-[400px] rounded-[40px] transition-all duration-700 ease-out cursor-pointer group"
                                    style={{
                                        ...style,
                                        transformStyle: 'preserve-3d'
                                    }}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {/* Glass Effect Container */}
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[40px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group-hover:border-white/40 transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                        {/* Image Layer (Blurred Logo as BG) */}
                                        <div
                                            className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-30 blur-xl scale-150"
                                            style={{ backgroundImage: `url(${channel.logo})` }}
                                        />

                                        {/* Content inside Glass */}
                                        <div className="absolute inset-0 p-10 flex flex-col justify-between transform translate-z-[20px]">
                                            <div className="flex justify-between items-start">
                                                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md">
                                                    <img src={channel.logo} className="w-14 object-contain" alt="logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium">
                                                    {channel.quality}
                                                </div>
                                            </div>

                                            <div className="transform transition-transform duration-500 group-hover:translate-z-[30px] group-hover:translate-y-[-10px]">
                                                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">{channel.name}</h2>
                                                <p className="text-lg text-white/70 font-light">{channel.category}</p>

                                                <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    <button className="px-8 py-3 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                                                        Play Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <button onClick={handlePrev} className="absolute left-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md z-50">
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={handleNext} className="absolute right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md z-50">
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* Bottom Reflection/Title */}
                <div className="h-32 flex flex-col items-center justify-center pb-8 z-50">
                    <h3 className="text-white/30 text-sm tracking-[0.5em] uppercase font-light">Swipe to Browse</h3>
                    <div className="flex gap-2 mt-4">
                        {channelsToDisplay.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full relative">
            {/* View Switcher - Miniaturized */}
            <div className="absolute top-6 right-6 z-[100] flex bg-black/50 backdrop-blur-xl border border-white/5 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => setLayoutMode('ambient')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${layoutMode === 'ambient' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                >
                    Ambient
                </button>
                <button
                    onClick={() => setLayoutMode('cyber')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${layoutMode === 'cyber' ? 'bg-[#22c55e] text-black' : 'text-white/50 hover:text-white'}`}
                >
                    Cyber
                </button>
                <button
                    onClick={() => setLayoutMode('spatial')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${layoutMode === 'spatial' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                    Spatial
                </button>
            </div>

            {/* Render Selected View */}
            {layoutMode === 'ambient' && <AmbientView />}
            {layoutMode === 'cyber' && <CyberView />}
            {layoutMode === 'spatial' && <SpatialView />}
        </div>
    );
};

export default LiveTV;

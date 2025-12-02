import React, { useState, useEffect, useMemo } from 'react';
import { XtreamService } from '../services/xtream'; // Keeping for type reference if needed, but we use props now
import { Category, LiveStream } from '../types';
import { VideoPlayer } from './VideoPlayer';
// @ts-ignore
import * as ReactWindow from 'react-window';
const List = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList;
// @ts-ignore
import * as AutoSizerPkg from 'react-virtualized-auto-sizer';
const AutoSizer = AutoSizerPkg.default || AutoSizerPkg;
import {
    Play, Info, Folder, Star,
    ChevronRight, ArrowLeft, Search, Loader2
} from 'lucide-react';

interface LiveTVProps {
    allCategories?: Category[];
    allStreams?: LiveStream[];
    isLoading?: boolean;
}

export default function LiveTV({ allCategories = [], allStreams = [], isLoading = false }: LiveTVProps) {
    // --- State Management ---

    // Filter & Search State
    const [channelSearchQuery, setChannelSearchQuery] = useState('');
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    // Favorites State
    const [favoriteCategoryIds, setFavoriteCategoryIds] = useState<Set<string>>(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // UI State
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<'categories' | 'channels'>('categories');

    // --- Initialization ---
    useEffect(() => {
        // Load Favorites from LocalStorage
        try {
            const savedFavs = localStorage.getItem('favorite_categories');
            if (savedFavs) {
                setFavoriteCategoryIds(new Set(JSON.parse(savedFavs)));
            }
        } catch (e) {
            console.error("Error loading favorites", e);
        }
    }, []);

    // --- Handlers ---

    const toggleFavoriteCategory = (e: React.MouseEvent, categoryId: string) => {
        e.stopPropagation(); // Prevent opening the category
        const newFavs = new Set(favoriteCategoryIds);
        if (newFavs.has(categoryId)) {
            newFavs.delete(categoryId);
        } else {
            newFavs.add(categoryId);
        }
        setFavoriteCategoryIds(newFavs);
        localStorage.setItem('favorite_categories', JSON.stringify([...newFavs]));
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setSidebarMode('channels');
        setChannelSearchQuery(''); // Reset channel search
    };

    const handleStreamSelect = (stream: LiveStream) => {
        setSelectedStream(stream);
    };

    const handleBackToCategories = () => {
        setSidebarMode('categories');
        setSelectedCategory(null);
    };

    const handlePlay = () => {
        if (selectedStream) {
            setIsPlaying(true);
        }
    };

    const handleChannelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChannelSearchQuery(e.target.value);
    };

    const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategorySearchQuery(e.target.value);
    };

    // --- Helpers ---

    // Compute displayed categories based on search and favorites filter
    const displayedCategories = useMemo(() => {
        return allCategories.filter(cat => {
            const matchesSearch = cat.category_name.toLowerCase().includes(categorySearchQuery.toLowerCase());
            const matchesFav = showFavoritesOnly ? favoriteCategoryIds.has(cat.category_id) : true;
            return matchesSearch && matchesFav;
        });
    }, [allCategories, categorySearchQuery, showFavoritesOnly, favoriteCategoryIds]);

    // Compute displayed streams based on selected category and search
    const filteredStreams = useMemo(() => {
        let streams = allStreams;

        // 1. Filter by Category (if selected)
        if (selectedCategory) {
            streams = streams.filter(s => s.category_id === selectedCategory.category_id);
        }

        // 2. Filter by Search Query
        if (channelSearchQuery) {
            const query = channelSearchQuery.toLowerCase();
            streams = streams.filter(s => s.name.toLowerCase().includes(query));
        }

        return streams;
    }, [allStreams, selectedCategory, channelSearchQuery]);

    const BackgroundImage = selectedStream?.stream_icon && selectedStream.stream_icon.length > 5
        ? selectedStream.stream_icon
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nat_Geo_Wild_logo.svg/2560px-Nat_Geo_Wild_logo.svg.png";

    const ChannelLogo = selectedStream?.stream_icon && selectedStream.stream_icon.length > 5
        ? selectedStream.stream_icon
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nat_Geo_Wild_logo.svg/2560px-Nat_Geo_Wild_logo.svg.png";

    // Row renderer for Virtualized List
    const ChannelRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const stream = filteredStreams[index];
        const isSelected = selectedStream?.stream_id === stream.stream_id;

        return (
            <div style={style} className="px-2 py-1">
                <div
                    onClick={() => handleStreamSelect(stream)}
                    className={`
                        group relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 h-full
                        ${isSelected
                            ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }
                    `}
                >
                    <div className="w-8 h-8 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/5">
                        <img
                            src={stream.stream_icon || "https://cdn-icons-png.flaticon.com/512/3658/3658959.png"}
                            alt="icon"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3658/3658959.png"; }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-blue-200' : 'text-white/90'}`}>
                            {stream.name}
                        </h4>
                    </div>
                    {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0"></div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-[#0f1016] flex overflow-hidden font-sans text-slate-200 relative">

            {/* --- Video Overlay --- */}
            {isPlaying && selectedStream && (
                <VideoPlayer
                    streamUrl={selectedStream.stream_url || selectedStream.direct_source || ""} // Assuming stream_url is populated or we build it
                    channelName={selectedStream.name}
                    channelIcon={selectedStream.stream_icon}
                    onClose={() => setIsPlaying(false)}
                />
            )}

            {/* --- Ambient Background --- */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px]"></div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="flex flex-1 z-10 w-full h-full relative">
                <div className="w-full h-full animate-soft-enter flex">

                    {/* --- Hero / Player Section (Left) --- */}
                    <div className="w-full h-full relative">

                        <div className="relative w-full h-full overflow-hidden flex font-sans select-none">

                            {/* Dynamic Background */}
                            <div className="absolute inset-0 z-0 bg-[#0f1016]">
                                <div
                                    className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-1000 ease-in-out opacity-40 scale-150 blur-[100px]"
                                    style={{ backgroundImage: `url("${BackgroundImage}")` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1016] via-[#0f1016]/90 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-transparent to-black/40"></div>
                            </div>

                            {/* Content Layer */}
                            <div className="relative z-10 flex w-full h-full">

                                {/* Hero Info */}
                                <div className="flex-[3] flex flex-col justify-center p-12 pl-20">
                                    <div className="animate-soft-enter max-w-4xl">

                                        {/* Floating Logo */}
                                        <div className="mb-10 animate-[float_6s_ease-in-out_infinite]">
                                            <div className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-[30px] p-6 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                                <img
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                    alt="logo"
                                                    src={ChannelLogo}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3658/3658959.png";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Metadata Tags */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/20 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-[pulse_2s_infinite]"></span>
                                                <span className="text-red-100 text-[11px] font-bold tracking-widest uppercase">LIVE STREAM</span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 text-white/80 text-[11px] font-bold tracking-widest uppercase">
                                                HD
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 text-white/50 text-[11px] font-bold tracking-widest uppercase">
                                                {selectedCategory ? selectedCategory.category_name : "Select Channel"}
                                            </div>
                                        </div>

                                        {/* Title & Desc */}
                                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter drop-shadow-2xl line-clamp-2">
                                            {selectedStream ? selectedStream.name : "Bienvenido"}
                                        </h1>
                                        <p className="text-xl text-white/50 font-light max-w-xl mb-10 leading-relaxed">
                                            {selectedStream
                                                ? `Disfruta de la mejor programación en vivo. Conexión estable y de alta calidad directamente a tu pantalla.`
                                                : "Selecciona una categoría para comenzar."}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 items-center">
                                            <button
                                                onClick={handlePlay}
                                                disabled={!selectedStream}
                                                className={`
                          group h-16 px-10 bg-white text-black rounded-[20px] font-bold text-lg flex items-center gap-3 transition-all duration-300 
                          shadow-[0_0_30px_rgba(255,255,255,0.15)]
                          ${!selectedStream ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]'}
                        `}
                                            >
                                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                                                </div>
                                                Ver Ahora
                                            </button>

                                            <button className="h-16 w-16 rounded-[20px] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
                                                <Info size={24} />
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                {/* --- Right Sidebar (Categories/Channels) --- */}
                                <div className="flex-[1.2] min-w-[350px] max-w-[450px] h-full relative z-20 overflow-hidden">
                                    <div className="absolute inset-0 bg-[#0f1016]/60 backdrop-blur-3xl border-l border-white/5"></div>

                                    {/* VIEW 1: CATEGORIES CONTAINER */}
                                    <div
                                        className={`absolute inset-0 z-10 flex flex-col pt-8 pb-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center
                    ${sidebarMode === 'categories'
                                                ? 'opacity-100 scale-100 pointer-events-auto blur-0'
                                                : 'opacity-0 scale-[1.5] pointer-events-none blur-sm'
                                            }`}
                                    >
                                        {/* Header: Favorites Toggle */}
                                        <div className="px-8 mb-4 flex items-center justify-between min-h-[32px]">
                                            <h3 className="text-white/40 font-bold text-xs tracking-widest uppercase">Categorías</h3>
                                            <button
                                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                                className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-wider
                            ${showFavoritesOnly
                                                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                                    }
                          `}
                                            >
                                                <Star size={12} fill={showFavoritesOnly ? "currentColor" : "none"} />
                                                <span>Favoritos</span>
                                            </button>
                                        </div>

                                        {/* Search Bar */}
                                        <div className="px-6 mb-4">
                                            <div className="bg-white/5 border border-white/5 rounded-xl flex items-center px-3 py-2 focus-within:bg-white/10 transition-colors">
                                                <Search size={16} className="text-white/30 mr-2" />
                                                <input
                                                    type="text"
                                                    value={categorySearchQuery}
                                                    onChange={handleCategorySearch}
                                                    placeholder="Filtrar categorías..."
                                                    className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-full"
                                                />
                                            </div>
                                        </div>

                                        {/* Categories List */}
                                        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-20 scrollbar-hide perspective-1000">
                                            {isLoading && displayedCategories.length === 0 ? (
                                                <div className="flex justify-center py-10">
                                                    <Loader2 className="animate-spin text-blue-500" />
                                                </div>
                                            ) : (
                                                displayedCategories.map((cat) => {
                                                    const isFav = favoriteCategoryIds.has(cat.category_id);
                                                    return (
                                                        <div
                                                            key={cat.category_id}
                                                            onClick={() => handleCategorySelect(cat)}
                                                            className="group relative p-4 mb-3 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ease-out cursor-pointer flex items-center gap-4 hover:scale-[1.02] transform origin-center"
                                                        >
                                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white/80 group-hover:text-white transition-colors border border-white/5 shrink-0">
                                                                <Folder size={18} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-base font-bold text-white/90 group-hover:text-white transition-colors truncate">{cat.category_name}</h4>
                                                            </div>

                                                            <button
                                                                onClick={(e) => toggleFavoriteCategory(e, cat.category_id)}
                                                                className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all z-20
                                ${isFav
                                                                        ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                                                                        : 'text-white/10 hover:text-white hover:bg-white/10'
                                                                    }
                              `}
                                                            >
                                                                <Star size={16} fill={isFav ? "currentColor" : "none"} />
                                                            </button>

                                                            <ChevronRight size={18} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    );
                                                })
                                            )}

                                            {!isLoading && displayedCategories.length === 0 && (
                                                <div className="text-center text-white/30 py-10 flex flex-col items-center">
                                                    <Search size={32} className="mb-2 opacity-50" />
                                                    <p>No se encontraron categorías</p>
                                                    {showFavoritesOnly && <p className="text-xs mt-2 text-white/20">(Filtro de favoritos activo)</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* VIEW 2: CHANNELS CONTAINER */}
                                    <div
                                        className={`absolute inset-0 z-10 flex flex-col pt-8 pb-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center
                    ${sidebarMode === 'channels'
                                                ? 'opacity-100 scale-100 pointer-events-auto blur-0'
                                                : 'opacity-0 scale-90 pointer-events-none blur-md'
                                            }`}
                                    >
                                        {/* Header: Back Button & Loading */}
                                        <div className="px-8 mb-4 flex items-center justify-between min-h-[32px]">
                                            <button
                                                onClick={handleBackToCategories}
                                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                                                    <ArrowLeft size={14} />
                                                </div>
                                                <span className="text-xs font-bold tracking-widest uppercase">Volver</span>
                                            </button>

                                            {isLoading && <Loader2 className="animate-spin text-blue-400" size={16} />}
                                        </div>

                                        {/* Search Bar */}
                                        <div className="px-6 mb-4">
                                            <div className="bg-white/5 border border-white/5 rounded-xl flex items-center px-3 py-2 focus-within:bg-white/10 transition-colors">
                                                <Search size={16} className="text-white/30 mr-2" />
                                                <input
                                                    type="text"
                                                    value={channelSearchQuery}
                                                    onChange={handleChannelSearch}
                                                    placeholder="Buscar canales..."
                                                    className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-full"
                                                />
                                            </div>
                                        </div>

                                        {/* Channels List (Virtualized) */}
                                        <div className="flex-1 px-6 pb-20 perspective-1000 h-full">
                                            {filteredStreams.length > 0 ? (
                                                <AutoSizer>
                                                    {({ height, width }) => (
                                                        <List
                                                            height={height}
                                                            itemCount={filteredStreams.length}
                                                            itemSize={60} // Height of each item
                                                            width={width}
                                                            className="scrollbar-hide"
                                                        >
                                                            {ChannelRow}
                                                        </List>
                                                    )}
                                                </AutoSizer>
                                            ) : (
                                                !isLoading && (
                                                    <div className="text-center text-white/30 py-10">No se encontraron canales</div>
                                                )
                                            )}

                                            {isLoading && filteredStreams.length === 0 && (
                                                <div className="flex justify-center py-20">
                                                    <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes dockEnter {
          from { transform: translateY(150%) rotateX(-90deg) scale(0.9); opacity: 0; }
          to { transform: translateY(0) rotateX(0) scale(1); opacity: 1; }
        }
        .animate-dock-enter {
           animation: dockEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
           animation-delay: 1s; /* Wait for cinematic fade */
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}

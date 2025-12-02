import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
    X, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
    Settings, Loader2, ChevronLeft
} from 'lucide-react';

interface VideoPlayerProps {
    streamUrl: string;
    channelName: string;
    channelIcon?: string;
    onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    streamUrl,
    channelName,
    channelIcon,
    onClose
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Playback State
    const [isPlaying, setIsPlaying] = useState(true);
    const [isBuffering, setIsBuffering] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<number | null>(null);

    // --- HLS Setup ---
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Reset State
        setIsBuffering(true);
        setError(null);

        const handleHlsError = (_event: any, data: any) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, trying to recover...');
                        hlsRef.current?.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Media error, trying to recover...');
                        hlsRef.current?.recoverMediaError();
                        break;
                    default:
                        console.error('Unrecoverable error', data);
                        setError("Stream unavailable or connection lost.");
                        hlsRef.current?.destroy();
                        break;
                }
            }
        };

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsRef.current = hls;

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => {
                    console.log("Autoplay blocked, waiting for user interaction", e);
                    setIsPlaying(false);
                });
            });

            hls.on(Hls.Events.ERROR, handleHlsError);

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari Native Support
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }

        // Video Event Listeners
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => {
            setIsBuffering(false);
            setIsPlaying(true);
        };
        const onPause = () => setIsPlaying(false);

        video.addEventListener('waiting', onWaiting);
        video.addEventListener('playing', onPlaying);
        video.addEventListener('pause', onPause);

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('playing', onPlaying);
            video.removeEventListener('pause', onPause);
        };
    }, [streamUrl]);

    // --- Controls Logic ---

    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            window.clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    }, [isPlaying]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
        };
    }, [handleMouseMove]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            if (!isMuted) setVolume(0);
            else setVolume(1);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (videoRef.current) {
            videoRef.current.volume = newVol;
            setIsMuted(newVol === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center animate-soft-enter overflow-hidden group select-none"
            onDoubleClick={toggleFullscreen}
            onClick={() => { if (!showControls) handleMouseMove(); }}
        >
            {/* Background Video */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
            />

            {/* --- Overlay UI --- */}

            {/* Top Gradient & Info */}
            <div
                className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 flex items-start justify-between p-8
        ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div className="flex items-center gap-4">
                        {channelIcon && (
                            <div className="w-12 h-12 bg-white/5 rounded-xl p-2 backdrop-blur-md border border-white/10">
                                <img src={channelIcon} alt="ch" className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-white drop-shadow-md">{channelName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-white/60 text-xs font-bold tracking-widest uppercase">En Vivo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Right Actions */}
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Center Buffering / Play Action */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {isBuffering && !error && (
                    <div className="flex flex-col items-center gap-3 bg-black/40 backdrop-blur-xl p-6 rounded-3xl animate-in fade-in zoom-in">
                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                        <span className="text-white/80 font-medium text-sm tracking-widest uppercase">Cargando Stream</span>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-3 bg-red-900/40 backdrop-blur-xl p-6 rounded-3xl border border-red-500/30">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <X className="w-6 h-6 text-red-400" />
                        </div>
                        <span className="text-white font-medium">{error}</span>
                        <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm mt-2 pointer-events-auto">
                            Cerrar
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Control Bar */}
            <div
                className={`absolute bottom-0 inset-x-0 pb-8 pt-20 px-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-500 flex items-end justify-center
        ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
            >
                <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex items-center gap-6 shadow-2xl">

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </button>

                    {/* Volume Group */}
                    <div className="flex items-center gap-3 group/vol">
                        <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300">
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    {/* Live Indicator (Spacer) */}
                    <div className="flex-1 flex justify-center">
                        <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Transmisión en tiempo real</span>
                        </div>
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                </div>
            </div>
        </div>
    );
};

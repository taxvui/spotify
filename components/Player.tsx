import React, { useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const PlayIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="black">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
  </svg>
);

const PauseIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="black">
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
  </svg>
);

const SkipBackIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#b3b3b3" className="hover:fill-white">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
  </svg>
);

const SkipForwardIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#b3b3b3" className="hover:fill-white">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
  </svg>
);

const VolumeIcon = ({ volume }: { volume: number }) => {
    if (volume === 0) {
        return <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4.612H2.106c-1.426 0-2.314 1.187-2.32 2.871l.002.017a2.98 2.98 0 0 0 .566 1.666.777.777 0 0 0 .129.136c.925 1.155 2.115 1.184 2.518 1.196l-.001.092.35 1.584a.75.75 0 0 0 1.298.37l1.432-3.185c1.409-.844 4.122-2.82 4.122-2.82.724-.482.915-1.411.916-2.203V3.682a.75.75 0 0 0-.21-.527zM8.571 2.308v6.793a3.528 3.528 0 0 1-1.286-1.554l-.066-.148-.002-.004-.374-.83A3.66 3.66 0 0 1 8.57 2.308z"></path></svg>;
    }
    if (volume < 0.5) {
        return <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.741.534a.75.75 0 0 1 .26.966A9.458 9.458 0 0 0 12.25 8a9.458 9.458 0 0 0-2.25 6.5.75.75 0 0 1-1.22.772A10.958 10.958 0 0 1 11.236 8a10.958 10.958 0 0 1-2.46-6.5.75.75 0 0 1 .965-.966z"></path><path d="M11.741 3.545a.75.75 0 0 1 .23.974A5.961 5.961 0 0 0 13.5 8a5.961 5.961 0 0 0-1.529 3.481.75.75 0 1 1-1.258-.802A7.461 7.461 0 0 1 12.5 8a7.461 7.461 0 0 1-1.987-4.433.75.75 0 0 1 .998-.022z"></path></svg>;
    }
    return <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.741.534a.75.75 0 0 1 .26.966A9.458 9.458 0 0 0 12.25 8a9.458 9.458 0 0 0-2.25 6.5.75.75 0 0 1-1.22.772A10.958 10.958 0 0 1 11.236 8a10.958 10.958 0 0 1-2.46-6.5.75.75 0 0 1 .965-.966z"></path><path d="M11.741 3.545a.75.75 0 0 1 .23.974A5.961 5.961 0 0 0 13.5 8a5.961 5.961 0 0 0-1.529 3.481.75.75 0 1 1-1.258-.802A7.461 7.461 0 0 1 12.5 8a7.461 7.461 0 0 1-1.987-4.433.75.75 0 0 1 .998-.022z"></path></svg>;
}

const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const Player = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, currentTime, duration, seek, volume, setVolume } = usePlayer();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // Calculate percentage for progress bar gradient
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <footer className="h-[90px] w-full bg-black border-t border-[#282828] px-4 flex items-center justify-between z-50 transition-all duration-300">
      <style>{`
        @keyframes eq-bar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-eq-1 { animation: eq-bar 0.6s ease-in-out infinite alternate; }
        .animate-eq-2 { animation: eq-bar 0.8s ease-in-out infinite alternate -0.2s; }
        .animate-eq-3 { animation: eq-bar 0.7s ease-in-out infinite alternate -0.4s; }
        .animate-eq-4 { animation: eq-bar 0.5s ease-in-out infinite alternate -0.1s; }

        @keyframes breathe {
           0%, 100% { transform: scale(1); filter: brightness(1); }
           50% { transform: scale(1.02); filter: brightness(1.05); }
        }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }

        /* Range Slider Styling */
        input[type=range] {
            -webkit-appearance: none;
            background: transparent;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            cursor: pointer;
            outline: none;
        }

        /* Webkit Slider Thumb */
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #fff;
            margin-top: -4px; /* Center thumb */
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.1s;
        }

        /* Show thumb on hover of the group (container) */
        .group:hover input[type=range]::-webkit-slider-thumb,
        input[type=range]:active::-webkit-slider-thumb {
            opacity: 1;
        }

        /* Webkit Slider Track - handled via background linear-gradient inline style */
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            border-radius: 2px;
            background: transparent; 
        }
      `}</style>

      {/* Track Info */}
      <div className="flex items-center w-1/3 min-w-[120px]">
        {currentTrack ? (
          <>
            <div className={`relative h-14 w-14 mr-4 transition-all duration-700 ${isPlaying ? 'shadow-[0_4px_20px_rgba(29,185,84,0.4)]' : ''}`}>
               <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className={`h-full w-full rounded bg-[#333] object-cover transition-transform duration-700 ${isPlaying ? 'animate-breathe' : ''}`}
              />
            </div>
            <div className="flex flex-col justify-center overflow-hidden mr-3">
              <div className="text-sm font-medium hover:underline cursor-pointer truncate text-white">
                {currentTrack.title}
              </div>
              <div className="text-xs text-spotify-grey hover:text-white hover:underline cursor-pointer truncate">
                {currentTrack.artist}
              </div>
            </div>
            
            {/* Visualizer - Only visible when playing */}
            {isPlaying && (
                <div className="flex items-end gap-[2px] h-4 pb-0.5 ml-1 hidden sm:flex">
                    <div className="w-[3px] bg-spotify-green rounded-sm animate-eq-1"></div>
                    <div className="w-[3px] bg-spotify-green rounded-sm animate-eq-2"></div>
                    <div className="w-[3px] bg-spotify-green rounded-sm animate-eq-3"></div>
                    <div className="w-[3px] bg-spotify-green rounded-sm animate-eq-4"></div>
                </div>
            )}
          </>
        ) : (
             <div className="flex items-center">
                <div className="h-14 w-14 rounded bg-[#282828] mr-4 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-20 bg-[#282828] rounded animate-pulse"></div>
                    <div className="h-2 w-12 bg-[#282828] rounded animate-pulse"></div>
                </div>
             </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 max-w-[722px]">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-spotify-grey hover:text-white cursor-default disabled:opacity-50" disabled={!currentTrack}>
             <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017 1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>
          </button>
          <button onClick={prevTrack} className="text-spotify-grey hover:text-white transition-colors disabled:opacity-50" disabled={!currentTrack}>
            <SkipBackIcon />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 relative disabled:opacity-50 disabled:hover:scale-100"
            disabled={!currentTrack}
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 rotate-90'}`}>
                <PauseIcon />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out ${!isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 -rotate-90'}`}>
                <PlayIcon />
            </div>
          </button>

          <button onClick={nextTrack} className="text-spotify-grey hover:text-white transition-colors disabled:opacity-50" disabled={!currentTrack}>
            <SkipForwardIcon />
          </button>
           <button className="text-spotify-grey hover:text-white cursor-default disabled:opacity-50" disabled={!currentTrack}>
             <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.829a.75.75 0 1 1 1.06 1.06L9.81 12h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5a2.25 2.25 0 0 0-2.25 2.25v5c0 .414.336.75.75.75s.75-.336.75-.75v-5z"></path></svg>
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 text-xs text-spotify-grey">
          <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
          <div className="relative w-full h-1 group flex items-center">
            <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute z-20 opacity-0 group-hover:opacity-100 w-full h-4 cursor-pointer"
            />
            {/* Visual Custom Track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative pointer-events-none">
                <div 
                    className="h-full bg-white group-hover:bg-spotify-green rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            {/* Thumb Visual (visible on hover) */}
            <div 
                className="absolute h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
            ></div>
          </div>
          <span className="min-w-[40px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-1/3 flex justify-end items-center gap-2 text-spotify-grey">
         <VolumeIcon volume={volume} />
         <div className="w-24 h-1 relative group flex items-center">
             <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange}
                className="absolute z-20 w-full h-4 opacity-0 cursor-pointer"
             />
             <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative pointer-events-none">
                <div 
                    className="h-full bg-white group-hover:bg-spotify-green rounded-full" 
                    style={{ width: `${volumePercent}%` }}
                ></div>
             </div>
             <div 
                className="absolute h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
                style={{ left: `calc(${volumePercent}% - 6px)` }}
            ></div>
         </div>
      </div>
    </footer>
  );
};
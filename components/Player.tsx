
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

// --- Icons ---

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
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
  </svg>
);

const SkipForwardIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
  </svg>
);

const ShuffleIcon = ({ active }: { active: boolean }) => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
        <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
        <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017 1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
    </svg>
)

const RepeatIcon = ({ active }: { active: boolean }) => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
        <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.829a.75.75 0 1 1 1.06 1.06L9.81 12h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5a2.25 2.25 0 0 0-2.25 2.25v5c0 .414.336.75.75.75s.75-.336.75-.75v-5z"></path>
    </svg>
)

const HeartIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
         <path d="M1.69 2H14.5v12H1.69V2zm11.81 11V3H2.5v10h11zM7 5v3H5v2h2v3h2v-3h2V8H9V5H7z" opacity="0"></path> 
         <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
    </svg>
)

const LyricsIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.56 3.129a2.787 2.787 0 0 1-3.933-3.933l3.56-3.129a4.331 4.331 0 0 1-4.786-4.786z"></path></svg>
)

const QueueIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2h-9z"></path></svg>
)

const DevicesIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z"></path><path d="M13 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path></svg>
)

const FullScreenIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.579a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.579a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0z"></path></svg>
)

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
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const Player = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, currentTime, duration, seek, volume, setVolume } = usePlayer();
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  
  // Scrubbing state
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  // Sync scrub value with currentTime when not scrubbing
  useEffect(() => {
    if (!isScrubbing) {
      setScrubValue(currentTime);
    }
  }, [currentTime, isScrubbing]);

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubValue(Number(e.target.value));
    setIsScrubbing(true);
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
    seek(scrubValue);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // Calculate percentage for progress bar gradient
  // Use scrubValue if scrubbing for immediate visual feedback
  const displayTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = duration ? (displayTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <footer className="h-[90px] w-full bg-black border-t border-[#282828] px-4 flex items-center justify-between z-50 transition-all duration-300">
      <style>{`
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
        input[type=range]:active::-webkit-slider-thumb,
        input[type=range].scrubbing::-webkit-slider-thumb {
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

      {/* --- Left Side: Track Info --- */}
      <div className="flex items-center w-[30%] min-w-[180px]">
        {currentTrack ? (
          <>
            <div className={`relative h-14 w-14 mr-3 transition-all duration-700 flex-shrink-0 group`}>
               <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className={`h-full w-full rounded bg-[#333] object-cover transition-transform duration-700 ${isPlaying ? 'animate-breathe' : ''}`}
              />
               <button className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg role="img" height="12" width="12" viewBox="0 0 16 16" fill="white"><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path></svg>
               </button>
            </div>
            <div className="flex flex-col justify-center overflow-hidden mr-4">
              <div className="text-sm font-medium hover:underline cursor-pointer truncate text-white">
                {currentTrack.title}
              </div>
              <div className="text-xs text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate">
                {currentTrack.artist}
              </div>
            </div>
            <button className="text-[#b3b3b3] hover:text-white flex-shrink-0">
                <HeartIcon />
            </button>
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

      {/* --- Center: Player Controls --- */}
      <div className="flex flex-col items-center max-w-[45%] w-full px-2">
        <div className="flex items-center gap-5 mb-2">
          {/* Shuffle */}
          <button 
            className={`transition-colors ${shuffle ? 'text-spotify-green' : 'text-[#b3b3b3] hover:text-white'} disabled:opacity-50`} 
            onClick={() => setShuffle(!shuffle)}
            disabled={!currentTrack}
          >
             <ShuffleIcon active={shuffle} />
          </button>
          
          {/* Previous */}
          <button onClick={prevTrack} className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50" disabled={!currentTrack}>
            <SkipBackIcon />
          </button>
          
          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 relative disabled:opacity-50 disabled:hover:scale-100"
            disabled={!currentTrack}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Next */}
          <button onClick={nextTrack} className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50" disabled={!currentTrack}>
            <SkipForwardIcon />
          </button>

           {/* Repeat */}
           <button 
                className={`transition-colors ${repeat ? 'text-spotify-green' : 'text-[#b3b3b3] hover:text-white'} disabled:opacity-50`} 
                onClick={() => setRepeat(!repeat)}
                disabled={!currentTrack}
            >
             <RepeatIcon active={repeat} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-xs text-[#b3b3b3]">
          <span className="min-w-[40px] text-right tabular-nums">{formatTime(displayTime)}</span>
          <div className="relative w-full h-1 group flex items-center">
            <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={displayTime} 
                onChange={handleScrubChange}
                onMouseUp={handleScrubEnd}
                onTouchEnd={handleScrubEnd}
                className={`absolute z-20 opacity-0 group-hover:opacity-100 w-full h-4 cursor-pointer ${isScrubbing ? 'scrubbing' : ''}`}
                disabled={!currentTrack || !duration}
            />
            {/* Visual Custom Track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative pointer-events-none">
                <div 
                    className={`h-full ${isScrubbing ? 'bg-spotify-green' : 'bg-white group-hover:bg-spotify-green'} rounded-full`} 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            {/* Thumb Visual (visible on hover) */}
            <div 
                className={`absolute h-3 w-3 bg-white rounded-full shadow pointer-events-none transition-opacity z-10 ${isScrubbing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                style={{ left: `calc(${progressPercent}% - 6px)` }}
            ></div>
          </div>
          <span className="min-w-[40px] tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* --- Right Side: Volume & Extra --- */}
      <div className="w-[30%] flex justify-end items-center gap-2 text-[#b3b3b3]">
         <button className="p-2 hover:text-white transition-colors"><LyricsIcon /></button>
         <button className="p-2 hover:text-white transition-colors"><QueueIcon /></button>
         <button className="p-2 hover:text-white transition-colors"><DevicesIcon /></button>
         
         <div className="flex items-center gap-2 w-32">
             <button className="hover:text-white transition-colors"><VolumeIcon volume={volume} /></button>
             <div className="w-full h-1 relative group flex items-center">
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
         <button className="p-2 hover:text-white transition-colors"><FullScreenIcon /></button>
      </div>
    </footer>
  );
};

import React from 'react';
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

export const Player = () => {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

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
             <div className="h-14 w-14 rounded bg-[#282828] mr-4 animate-pulse"></div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 max-w-[722px]">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-spotify-grey hover:text-white cursor-default">
            {/* Shuffle Icon Placeholder */}
             <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>
          </button>
          <button className="text-spotify-grey hover:text-white transition-colors">
            <SkipBackIcon />
          </button>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
            disabled={!currentTrack}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="text-spotify-grey hover:text-white transition-colors">
            <SkipForwardIcon />
          </button>
           <button className="text-spotify-grey hover:text-white cursor-default">
            {/* Repeat Icon Placeholder */}
             <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.829a.75.75 0 1 1 1.06 1.06L9.81 12h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5a2.25 2.25 0 0 0-2.25 2.25v5c0 .414.336.75.75.75s.75-.336.75-.75v-5z"></path></svg>
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 text-xs text-spotify-grey">
          <span>0:00</span>
          <div className="h-1 bg-[#4d4d4d] rounded-full w-full relative group cursor-pointer">
            <div className={`h-full bg-white rounded-full absolute top-0 left-0 transition-all duration-1000 linear ${isPlaying ? 'w-full animate-pulse' : 'w-0'}`} style={{width: isPlaying ? '45%' : '0%'}}></div>
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-[45%] w-3 h-3 bg-white rounded-full shadow-lg"></div>
          </div>
          <span>{currentTrack?.duration || "-:--"}</span>
        </div>
      </div>

      {/* Volume / Extra */}
      <div className="w-1/3 flex justify-end items-center gap-2 text-spotify-grey">
          {/* Volume Icon Placeholder */}
         <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.741.534a.75.75 0 0 1 .26.966A9.458 9.458 0 0 0 12.25 8a9.458 9.458 0 0 0-2.25 6.5.75.75 0 0 1-1.22.772A10.958 10.958 0 0 1 11.236 8a10.958 10.958 0 0 1-2.46-6.5.75.75 0 0 1 .965-.966z"></path><path d="M11.741 3.545a.75.75 0 0 1 .23.974A5.961 5.961 0 0 0 13.5 8a5.961 5.961 0 0 0-1.529 3.481.75.75 0 1 1-1.258-.802A7.461 7.461 0 0 1 12.5 8a7.461 7.461 0 0 1-1.987-4.433.75.75 0 0 1 .998-.022z"></path></svg>
         <div className="w-24 h-1 bg-[#4d4d4d] rounded-full group relative cursor-pointer">
             <div className="h-full bg-white rounded-full w-2/3 group-hover:bg-spotify-green"></div>
         </div>
      </div>
    </footer>
  );
};

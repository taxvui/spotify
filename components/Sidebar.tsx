import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MOCK_PLAYLISTS } from '../constants';

// Icons as simple SVGs
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill={active ? "white" : "#b3b3b3"} className={active ? "" : "hover:fill-white transition-colors"}>
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 8.747V20.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-5h3v5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1V8.747l-7.5-5.5Zm-8 17V9.017l7.5-5.5 7.5 5.5V20.25h-3.5v-6a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v6h-3.5Z"></path>
    {active && <path d="M11.5 13.25h-3.5v6H4V9.017l8-5.866 8 5.866V19.25h-4v-6h-3.5v6H11.5v-6Z" fill="white"></path>} 
    {/* Simplified for "active" state visuals, actually Spotify fills it. */}
    <path d={active ? "M12.5 3.247a1 1 0 0 0-1 0L4 8.747V20.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-5h3v5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1V8.747l-7.5-5.5Z" : ""} fill={active ? "white" : "none"}></path>
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill={active ? "white" : "#b3b3b3"} className={active ? "" : "hover:fill-white transition-colors"}>
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.227 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
  </svg>
);

const LibraryIcon = ({ active }: { active: boolean }) => (
  <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill={active ? "white" : "#b3b3b3"} className={active ? "" : "hover:fill-white transition-colors"}>
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path>
  </svg>
);

const PlusIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#b3b3b3" className="hover:fill-white transition-colors">
        <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
    </svg>
);

const ArrowRightIcon = () => (
     <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#b3b3b3" className="hover:fill-white transition-colors">
        <path d="M11.596 8 6.596 3 5.404 4.192l3.808 3.808-3.808 3.808L6.596 13l5-5z"></path>
    </svg>
)

export const Sidebar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSearch = location.pathname === '/search';

  return (
    <nav className="w-64 bg-black flex flex-col h-full gap-2 p-2 hidden md:flex">
      <div className="bg-spotify-dark rounded-lg p-4 flex flex-col gap-4">
        <Link to="/" className={`flex items-center gap-4 font-bold transition-colors ${isHome ? 'text-white' : 'text-spotify-grey hover:text-white'}`}>
          <HomeIcon active={isHome} />
          Home
        </Link>
        <Link to="/search" className={`flex items-center gap-4 font-bold transition-colors ${isSearch ? 'text-white' : 'text-spotify-grey hover:text-white'}`}>
          <SearchIcon active={isSearch} />
          Search
        </Link>
      </div>

      <div className="bg-spotify-dark rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-spotify-grey hover:text-white font-bold cursor-pointer transition-colors">
                <LibraryIcon active={false} />
                Your Library
             </div>
             <div className="flex items-center gap-2">
                <button className="hover:bg-[#1f1f1f] p-1 rounded-full"><PlusIcon /></button>
                <button className="hover:bg-[#1f1f1f] p-1 rounded-full"><ArrowRightIcon /></button>
             </div>
          </div>
          <div className="flex gap-2 mb-2">
            <button className="bg-[#232323] hover:bg-[#2a2a2a] text-white text-xs px-3 py-1 rounded-full transition-colors">Playlists</button>
            <button className="bg-[#232323] hover:bg-[#2a2a2a] text-white text-xs px-3 py-1 rounded-full transition-colors">Artists</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2">
            <div className="flex flex-col">
                {MOCK_PLAYLISTS.map((playlist) => (
                    <div key={playlist.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer group">
                        <img src={playlist.coverUrl} alt={playlist.name} className="w-12 h-12 rounded bg-[#333] shadow-md" />
                        <div className="flex flex-col">
                            <span className="text-white font-medium truncate w-32">{playlist.name}</span>
                            <span className="text-spotify-grey text-xs truncate w-32 group-hover:text-white">Playlist • Gemini User</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </nav>
  );
};

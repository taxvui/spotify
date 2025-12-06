
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { getCurrentUserProfile, getUserPlaylists } from '../services/spotifyService';
import { Playlist, UserProfile } from '../types';

const LibraryIcon = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
    </svg>
);

const GlobeIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zM7 6.5C7 8.378 7.63 10 8.5 10c.87 0 1.5-1.622 1.5-3.5S9.37 3 8.5 3c-.87 0-1.5 1.622-1.5 3.5zm8.5 0c0 2.505-2.753 4.67-6.5 4.96C8.63 9.49 8.13 8.04 8.13 6.5c0-1.54.5-2.99.87-4.96 3.747.29 6.5 2.455 6.5 4.96zM7.5 11.46c-3.747-.29-6.5-2.455-6.5-4.96 0-2.505 2.753-4.67 6.5-4.96.37 1.97.87 3.42.87 4.96 0 1.54-.5 2.99-.87 4.96z"></path>
    </svg>
);

const SearchListIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path></svg>
);

export const Sidebar = () => {
    const { currentTrack } = usePlayer();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUserProfile().then(u => {
            setUser(u);
            if (u) {
                getUserPlaylists().then(setPlaylists);
            }
        });
    }, []);

    return (
        <aside className="w-[320px] md:w-[420px] lg:w-[350px] flex flex-col gap-2 h-full flex-shrink-0">
            {/* Library Container */}
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
                <div className="p-2 px-4 shadow-md z-10">
                    <div className="flex items-center justify-between text-[#a7a7a7] hover:text-white transition-colors cursor-pointer py-2">
                        <div className="flex items-center gap-3 font-bold">
                            <LibraryIcon />
                            <span>Your Library</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="hover:bg-[#1f1f1f] hover:text-white rounded-full p-2 transition-colors">
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                    
                    {/* Logged In Filter Chips */}
                    {user && (
                         <div className="flex gap-2 mb-2 mt-1">
                             <button className="px-3 py-1 bg-[#232323] hover:bg-[#2a2a2a] rounded-full text-sm font-medium transition-colors">Playlists</button>
                             <button className="px-3 py-1 bg-[#232323] hover:bg-[#2a2a2a] rounded-full text-sm font-medium transition-colors">Artists</button>
                         </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 scroll-smooth custom-scrollbar">
                    {/* Now Playing Section */}
                    {currentTrack && (
                        <div className="px-2 mt-2 mb-6">
                             <Link to={`/track/${currentTrack.id}`} className="block bg-[#1f1f1f] p-4 rounded-lg hover:bg-[#282828] transition-colors group">
                                <div className="font-bold text-white mb-3 text-sm uppercase tracking-wider opacity-70">Now Playing</div>
                                <div className="relative aspect-square w-full mb-3 shadow-lg rounded-md overflow-hidden">
                                     <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-white text-base truncate group-hover:text-spotify-green transition-colors">{currentTrack.title}</span>
                                     <span className="text-sm text-[#b3b3b3] truncate">{currentTrack.artist}</span>
                                </div>
                             </Link>
                        </div>
                    )}
                    
                    {user && (
                         <div className="flex items-center justify-between px-2 text-[#a7a7a7] text-xs mb-2">
                             <div className="hover:text-white cursor-pointer"><SearchIconMini/></div>
                             <div className="flex items-center gap-1 hover:text-white cursor-pointer">
                                 <span>Recents</span>
                                 <SearchListIcon />
                             </div>
                         </div>
                    )}

                    {/* Content: If User -> Playlists, Else -> CTA Cards */}
                    {user ? (
                        <div className="flex flex-col">
                            {playlists.map(playlist => (
                                <div 
                                    key={playlist.id}
                                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer group"
                                >
                                    <img src={playlist.coverUrl} className="w-12 h-12 rounded object-cover" alt={playlist.name} />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-white font-medium truncate group-hover:text-white">{playlist.name}</span>
                                        <div className="flex items-center gap-1 text-sm text-[#a7a7a7]">
                                            <span className="truncate">Playlist • {playlist.owner || user.display_name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {playlists.length === 0 && (
                                <div className="p-4 text-[#a7a7a7] text-sm text-center">No playlists found.</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-2 px-2">
                             <div className="bg-[#1f1f1f] p-5 rounded-lg flex flex-col items-start gap-5">
                                <div className="flex flex-col gap-2">
                                    <span className="font-bold text-base text-white">Create your first playlist</span>
                                    <span className="text-sm text-white font-medium">It's easy, we'll help you</span>
                                </div>
                                <button className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform">
                                    Create playlist
                                </button>
                            </div>
    
                            <div className="bg-[#1f1f1f] p-5 rounded-lg flex flex-col items-start gap-5">
                                <div className="flex flex-col gap-2">
                                    <span className="font-bold text-base text-white">Let's find some podcasts to follow</span>
                                    <span className="text-sm text-white font-medium">We'll keep you updated on new episodes</span>
                                </div>
                                <button className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform">
                                    Browse podcasts
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Links (Only for logged out typically, but we keep them for now or hide if desired) */}
                {!user && (
                    <div className="px-8 pb-8 pt-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
                            {['Legal', 'Safety & Privacy Center', 'Privacy Policy', 'Cookies', 'About Ads', 'Accessibility'].map(link => (
                                <a key={link} href="#" className="text-[11px] text-[#b3b3b3] hover:underline pr-1">
                                    {link}
                                </a>
                            ))}
                             <a href="#" className="text-[11px] text-[#b3b3b3] hover:underline">Cookies</a>
                        </div>
                        
                        <button className="flex items-center gap-1.5 border border-[#727272] hover:border-white rounded-full px-4 py-1.5 text-sm font-bold text-white transition-colors">
                            <GlobeIcon />
                            <span>English</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

const SearchIconMini = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path></svg>
)

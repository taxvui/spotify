import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../constants';
import { getGeminiGreeting } from '../services/geminiService';

export const Home = () => {
    const [greeting, setGreeting] = useState("Good morning");

    useEffect(() => {
        getGeminiGreeting().then(setGreeting);
    }, []);

    // Create a mock "Made For You" section by shuffling
    const madeForYou = [...MOCK_PLAYLISTS].sort(() => 0.5 - Math.random()).slice(0, 4);
    const recentlyPlayed = [...MOCK_PLAYLISTS].slice(0, 6); // First 6

    return (
        <div className="p-6 pt-20">
             <h1 className="text-3xl font-bold mb-6 text-white">{greeting}</h1>
             
             {/* Recently Played Grid (Small Cards) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {recentlyPlayed.map(playlist => (
                    <div key={`recent-${playlist.id}`} className="flex items-center bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-md overflow-hidden cursor-pointer group h-16 sm:h-20">
                        <img src={playlist.coverUrl} alt={playlist.name} className="h-full w-16 sm:w-20 object-cover shadow-lg" />
                        <div className="flex-1 px-4 font-bold text-white flex justify-between items-center">
                            <span className="truncate">{playlist.name}</span>
                            <div className="w-12 h-12 bg-spotify-green rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg role="img" height="20" width="20" aria-hidden="true" viewBox="0 0 24 24" fill="black">
                                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
             </div>

             <h2 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">Made For You</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
                {madeForYou.map(playlist => (
                    <Card 
                        key={playlist.id} 
                        image={playlist.coverUrl} 
                        title={playlist.name} 
                        description={playlist.description}
                        track={playlist.tracks[0]} // Just play first track for demo
                    />
                ))}
             </div>

             <h2 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">Your Top Mixes</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {MOCK_PLAYLISTS.map(playlist => (
                    <Card 
                        key={`mix-${playlist.id}`} 
                        image={playlist.coverUrl} 
                        title={playlist.name} 
                        description={playlist.description}
                        track={playlist.tracks[0]} 
                    />
                ))}
             </div>
        </div>
    );
};

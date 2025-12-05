import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getGeminiGreeting } from '../services/geminiService';
import { getFeaturedPlaylists, getNewReleases, getCategoryPlaylists } from '../services/spotifyService';
import { Playlist } from '../types';

const CHIPS = ['All', 'Music', 'Podcasts'];

export const Home = () => {
    const [greeting, setGreeting] = useState("Good morning");
    const [featured, setFeatured] = useState<Playlist[]>([]);
    const [newReleases, setNewReleases] = useState<Playlist[]>([]);
    const [activeChip, setActiveChip] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine what to fetch based on active chip
                let feat: Playlist[] = [];
                let rel: Playlist[] = [];
                let greet = await getGeminiGreeting();

                if (activeChip === 'All') {
                     [feat, rel] = await Promise.all([
                        getFeaturedPlaylists(),
                        getNewReleases()
                    ]);
                } else if (activeChip === 'Music') {
                    // Fetch specific category playlists for Music
                    // 'pop' is a safe bet for generic "Music" or we could try 'party'
                    const musicPlaylists = await getCategoryPlaylists('pop');
                    feat = musicPlaylists;
                    rel = await getNewReleases(); // Keep new releases for Music
                } else if (activeChip === 'Podcasts') {
                    // Just show some educational/spoken word playlists as proxy if API limits podcasts
                    const podcastPlaylists = await getCategoryPlaylists('educational');
                    feat = podcastPlaylists;
                    rel = []; 
                }

                setGreeting(greet);
                setFeatured(feat);
                setNewReleases(rel);
            } catch (e) {
                console.error("Error loading home data", e);
            }
            setLoading(false);
        };
        fetchData();
    }, [activeChip]);

    // Helper to get first few items
    const topPicks = featured.slice(0, 6);

    return (
        <div className="p-6 pt-20">
             {/* Chips Filter Row */}
             <div className="flex gap-2 mb-6">
                {CHIPS.map(chip => (
                    <button
                        key={chip}
                        onClick={() => setActiveChip(chip)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            activeChip === chip 
                            ? 'bg-white text-black' 
                            : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                        }`}
                    >
                        {chip}
                    </button>
                ))}
             </div>

             {loading ? (
                <div className="flex justify-center h-40 items-center">
                    <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
                </div>
             ) : (
                <>
                    {activeChip !== 'Podcasts' && <h1 className="text-3xl font-bold mb-6 text-white">{greeting}</h1>}
                    
                    {/* Featured Grid (Small Cards) - Only for All or Music */}
                    {activeChip !== 'Podcasts' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {topPicks.map(playlist => (
                                <div key={`recent-${playlist.id}`} className="flex items-center bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-md overflow-hidden cursor-pointer group h-16 sm:h-20" onClick={() => window.location.hash = `#/playlist/${playlist.id}`}>
                                    <img src={playlist.coverUrl} alt={playlist.name} className="h-full w-16 sm:w-20 object-cover shadow-lg" />
                                    <div className="flex-1 px-4 font-bold text-white flex justify-between items-center overflow-hidden">
                                        <span className="truncate pr-2">{playlist.name}</span>
                                        <div className="w-10 h-10 min-w-[2.5rem] bg-spotify-green rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 24 24" fill="black">
                                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {newReleases.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">New Releases</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
                                {newReleases.map(playlist => (
                                    <Card 
                                        key={playlist.id} 
                                        id={playlist.id}
                                        image={playlist.coverUrl} 
                                        title={playlist.name} 
                                        description={playlist.description}
                                        type="album"
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <h2 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">
                        {activeChip === 'Podcasts' ? 'Educational Podcasts' : 'Featured Playlists'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {featured.map(playlist => (
                            <Card 
                                key={`featured-${playlist.id}`} 
                                id={playlist.id}
                                image={playlist.coverUrl} 
                                title={playlist.name} 
                                description={playlist.description}
                                type="playlist"
                            />
                        ))}
                    </div>
                </>
             )}
        </div>
    );
};
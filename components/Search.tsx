import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { searchMusicWithGemini } from '../services/geminiService';
import { Track } from '../types';

const PlayIcon = () => (
    <svg role="img" height="12" width="12" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
    </svg>
)

export const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

    // Simple debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const tracks = await searchMusicWithGemini(debouncedQuery);
            setResults(tracks);
            setLoading(false);
        };
        fetchData();
    }, [debouncedQuery]);

    // Browse all categories colors
    const categoryColors = [
        'bg-[#E8115B]', 'bg-[#148A08]', 'bg-[#1E3264]', 'bg-[#8D67AB]',
        'bg-[#7358FF]', 'bg-[#B02897]', 'bg-[#D84000]', 'bg-[#509BF5]',
    ];
    const categories = [
        'Pop', 'Hip-Hop', 'Rock', 'Latin', 'Charts', 'Indie', 'Dance', 'Country'
    ];

    const handlePlay = (track: Track) => {
        playTrack(track);
    }

    return (
        <div className="p-6 pt-20">
            <div className="mb-6 relative max-w-[400px]">
                <input 
                    type="text" 
                    placeholder="What do you want to listen to?" 
                    className="w-full rounded-full py-3 px-12 bg-[#242424] text-white border border-transparent focus:border-white focus:outline-none placeholder-[#757575]"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <div className="absolute left-3 top-3 text-black">
                    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="#757575">
                         <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.227 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
                    </svg>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="mb-8">
                     <h2 className="text-2xl font-bold mb-4">Top Results (AI Generated)</h2>
                     <div className="flex flex-col gap-2">
                         {results.map((track, i) => (
                             <div 
                                key={track.id} 
                                className="flex items-center justify-between p-2 rounded hover:bg-[#2a2a2a] group transition-colors cursor-pointer"
                                onClick={() => handlePlay(track)}
                            >
                                 <div className="flex items-center gap-4">
                                     <div className="relative">
                                        <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            {currentTrack?.id === track.id && isPlaying ? (
                                                // Playing animation or pause icon
                                                <svg height="12" width="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                                            ) : (
                                                <PlayIcon />
                                            )}
                                        </div>
                                     </div>
                                     <div>
                                         <div className={`text-sm font-normal ${currentTrack?.id === track.id ? 'text-spotify-green' : 'text-white'}`}>{track.title}</div>
                                         <div className="text-sm text-spotify-grey">{track.artist}</div>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-6">
                                    <span className="text-sm text-spotify-grey opacity-0 group-hover:opacity-100">{track.album}</span>
                                    <span className="text-sm text-spotify-grey w-10 text-right">{track.duration}</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}

            {!loading && results.length === 0 && !query && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Browse all</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {categories.map((cat, i) => (
                            <div 
                                key={cat} 
                                className={`${categoryColors[i % categoryColors.length]} h-48 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                            >
                                <h3 className="text-2xl font-bold">{cat}</h3>
                                <img 
                                    src={`https://picsum.photos/100/100?random=${100+i}`} 
                                    className="absolute -bottom-4 -right-4 w-24 h-24 rotate-[25deg] shadow-lg"
                                    alt={cat}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

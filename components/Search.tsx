import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { searchTracks, getCategories } from '../services/spotifyService';
import { Track } from '../types';

const PlayIcon = () => (
    <svg role="img" height="12" width="12" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
    </svg>
)

const AddToQueueIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
    </svg>
)

const FilterIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M15 2.5H1v-1h14v1zM2.5 8h11v-1h-11v1zM11.5 13.5h-7v-1h7v1z"></path>
    </svg>
)

export const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Track[]>([]);
    const [categories, setCategories] = useState<{id: string, name: string, icon: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // Suggestions state
    const [suggestions, setSuggestions] = useState<Track[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [yearFilter, setYearFilter] = useState('');
    const [decadeFilter, setDecadeFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

    const { playTrack, currentTrack, isPlaying, addToQueue } = usePlayer();
    const navigate = useNavigate();

    // Fetch categories on mount
    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    // Main Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch Main Results
    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const tracks = await searchTracks(debouncedQuery);
            setResults(tracks);
            setLoading(false);
        };
        fetchData();
    }, [debouncedQuery]);

    // Fetch Suggestions (Dynamic, faster debounce)
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        let active = true;
        const fetchSuggestions = async () => {
            const tracks = await searchTracks(query);
            if (active) {
                setSuggestions(tracks.slice(0, 5));
            }
        };

        const timer = setTimeout(fetchSuggestions, 200);

        return () => {
            clearTimeout(timer);
            active = false;
        };
    }, [query]);

    // Browse all categories colors
    const categoryColors = [
        'bg-[#E8115B]', 'bg-[#148A08]', 'bg-[#1E3264]', 'bg-[#8D67AB]',
        'bg-[#7358FF]', 'bg-[#B02897]', 'bg-[#D84000]', 'bg-[#509BF5]',
        'bg-[#BC5900]', 'bg-[#E91429]', 'bg-[#0D72EA]', 'bg-[#E1118C]',
    ];

    const handlePlay = (e: React.MouseEvent, track: Track) => {
        e.stopPropagation();
        playTrack(track);
    }

    const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
        e.stopPropagation();
        addToQueue(track);
    }

    const handleSuggestionClick = (track: Track) => {
        setQuery(`${track.title} ${track.artist}`);
        setShowSuggestions(false);
    };

    const filteredResults = results.filter(track => {
        let matchesYear = true;
        let matchesGenre = true;
        let matchesDecade = true;

        if (yearFilter) {
            matchesYear = track.releaseYear === yearFilter;
        }

        if (decadeFilter && track.releaseYear) {
            const year = parseInt(track.releaseYear);
            const decadeStart = parseInt(decadeFilter);
            if (!isNaN(year) && !isNaN(decadeStart)) {
                matchesDecade = year >= decadeStart && year < decadeStart + 10;
            }
        }

        if (genreFilter) {
            matchesGenre = track.genre ? track.genre.toLowerCase().includes(genreFilter.toLowerCase()) : false;
        }

        return matchesYear && matchesGenre && matchesDecade;
    });

    const topResult = filteredResults[0];
    
    // If we have a top result and no filters, we show a simplified "Overview" list (Top Result + 4 Songs)
    // Otherwise, we show the full list.
    const isOverviewMode = topResult && !yearFilter && !genreFilter && !decadeFilter;
    
    const listResults = isOverviewMode 
        ? filteredResults.filter(t => t.id !== topResult.id).slice(0, 4) 
        : filteredResults;

    return (
        <div className="p-6 pt-6">
            <div className="mb-6 relative max-w-[400px] z-50">
                <input 
                    type="text" 
                    placeholder="What do you want to listen to?" 
                    className="w-full rounded-full py-3 px-12 bg-[#242424] hover:bg-[#2a2a2a] text-white border border-transparent focus:border-white focus:outline-none placeholder-spotify-grey transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    autoFocus
                />
                <div className="absolute left-3 top-3 text-black">
                    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="#757575">
                         <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.227 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
                    </svg>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-spotify-light rounded-md shadow-2xl overflow-hidden border border-spotify-hover z-[60]">
                        {suggestions.map((track) => (
                            <div 
                                key={`suggestion-${track.id}`}
                                className="flex items-center gap-3 p-3 hover:bg-spotify-hover cursor-pointer transition-colors border-b border-spotify-hover last:border-0"
                                onClick={() => handleSuggestionClick(track)}
                            >
                                <img src={track.coverUrl} alt="" className="w-10 h-10 rounded shadow-sm object-cover" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-white truncate">{track.title}</span>
                                    <span className="text-xs text-spotify-grey truncate">{track.artist}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Top Result Section - Only show if overview mode */}
                    {isOverviewMode && (
                         <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-4">Top result</h2>
                            <div 
                                className="bg-[#181818] hover:bg-[#282828] p-5 rounded-lg transition-colors group relative cursor-pointer h-64 flex flex-col justify-center gap-4"
                                onClick={(e) => { e.stopPropagation(); navigate(`/artist/${topResult.artistId}`); }}
                            >
                                <img src={topResult.coverUrl} alt={topResult.title} className="w-[92px] h-[92px] rounded shadow-lg object-cover" />
                                
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1 line-clamp-2 pb-1 tracking-tight">{topResult.title}</div>
                                    <div className="text-sm font-semibold text-spotify-grey flex items-center gap-2">
                                        <span className="text-white bg-[#121212] rounded-full px-3 py-1 text-xs uppercase tracking-wider">Song</span>
                                        <Link 
                                            to={`/artist/${topResult.artistId}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="line-clamp-1 hover:text-white hover:underline font-bold text-white"
                                        >
                                            {topResult.artist}
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Large Play Button */}
                                <div onClick={(e) => handlePlay(e, topResult)} className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl z-10">
                                    <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform hover:bg-[#1fdf64]">
                                        {currentTrack?.id === topResult.id && isPlaying ? (
                                        <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                                        ) : (
                                        <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Songs List Section */}
                     <div className={!isOverviewMode ? "lg:col-span-5" : "lg:col-span-3"}>
                         <div className="flex items-center justify-between mb-4">
                             <h2 className="text-2xl font-bold">Songs</h2>
                             <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${showFilters ? 'text-spotify-green' : 'text-spotify-grey hover:text-white'}`}
                             >
                                 <FilterIcon />
                                 Filter
                             </button>
                         </div>

                         {/* Filter Bar */}
                         {showFilters && (
                             <div className="flex gap-4 mb-6 bg-spotify-card p-4 rounded-md flex-wrap">
                                 <div className="flex flex-col gap-1">
                                     <label className="text-xs font-bold text-spotify-grey uppercase">Decade</label>
                                     <select 
                                        value={decadeFilter}
                                        onChange={(e) => setDecadeFilter(e.target.value)}
                                        className="bg-spotify-highlight text-white text-sm rounded px-3 py-2 border border-transparent focus:border-spotify-grey focus:outline-none w-32 cursor-pointer h-[38px]"
                                     >
                                        <option value="">All</option>
                                        <option value="2020">2020s</option>
                                        <option value="2010">2010s</option>
                                        <option value="2000">2000s</option>
                                        <option value="1990">1990s</option>
                                        <option value="1980">1980s</option>
                                        <option value="1970">1970s</option>
                                        <option value="1960">1960s</option>
                                     </select>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                     <label className="text-xs font-bold text-spotify-grey uppercase">Year</label>
                                     <input 
                                        type="number" 
                                        placeholder="YYYY" 
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="bg-spotify-highlight text-white text-sm rounded px-3 py-2 border border-transparent focus:border-spotify-grey focus:outline-none w-24 h-[38px]"
                                     />
                                 </div>
                                 <div className="flex flex-col gap-1">
                                     <label className="text-xs font-bold text-spotify-grey uppercase">Genre</label>
                                     <input 
                                        type="text" 
                                        placeholder="Pop, Rock..." 
                                        value={genreFilter}
                                        onChange={(e) => setGenreFilter(e.target.value)}
                                        className="bg-spotify-highlight text-white text-sm rounded px-3 py-2 border border-transparent focus:border-spotify-grey focus:outline-none w-40 h-[38px]"
                                     />
                                 </div>
                                 {(yearFilter || genreFilter || decadeFilter) && (
                                     <button 
                                        onClick={() => { setYearFilter(''); setGenreFilter(''); setDecadeFilter(''); }}
                                        className="self-end mb-2 text-xs font-bold text-spotify-grey hover:text-white"
                                     >
                                         Clear
                                     </button>
                                 )}
                             </div>
                         )}

                         <div className="flex flex-col">
                             {listResults.length === 0 ? (
                                 <div className="text-spotify-grey py-4">No songs found matching filters.</div>
                             ) : (
                                listResults.map((track) => (
                                    <div 
                                        key={track.id} 
                                        className="flex items-center justify-between p-2 rounded hover:bg-[#2a2a2a] group transition-colors cursor-pointer h-14"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/track/${track.id}`); }}
                                    >
                                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                            <div className="relative w-10 h-10 min-w-[40px]" onClick={(e) => handlePlay(e, track)}>
                                                <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded object-cover group-hover:opacity-50 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {currentTrack?.id === track.id && isPlaying ? (
                                                        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                                                    ) : (
                                                        <PlayIcon />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col overflow-hidden justify-center">
                                                <div className={`text-base font-normal truncate mb-0.5 ${currentTrack?.id === track.id ? 'text-spotify-green' : 'text-white'}`}>{track.title}</div>
                                                <div className="flex items-center gap-2">
                                                    <Link 
                                                        to={`/artist/${track.artistId}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-sm text-spotify-grey truncate hover:underline group-hover:text-white transition-colors"
                                                    >
                                                        {track.artist}
                                                    </Link>
                                                    {track.releaseYear && (
                                                        <>
                                                             <span className="text-xs text-[#555]">•</span>
                                                             <span className="text-xs text-spotify-grey">{track.releaseYear}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 hidden sm:flex">
                                            <button 
                                                onClick={(e) => handleAddToQueue(e, track)}
                                                className="text-spotify-grey hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                                title="Add to queue"
                                            >
                                                <AddToQueueIcon />
                                            </button>
                                            <div className="w-6 flex justify-center">
                                                <button className="text-spotify-grey hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M1.69 2H14.5v12H1.69V2zm11.81 11V3H2.5v10h11zM7 5v3H5v2h2v3h2v-3h2V8H9V5H7z"></path></svg>
                                                </button>
                                            </div>
                                            <span className="text-sm text-spotify-grey w-12 text-right tabular-nums">{track.duration}</span>
                                        </div>
                                    </div>
                                ))
                             )}
                         </div>
                    </div>
                </div>
            )}

            {!loading && results.length === 0 && !query && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Browse all</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
                        {categories.map((cat, i) => (
                            <div 
                                key={cat.id} 
                                onClick={() => navigate(`/playlist/${cat.id}`)} 
                                className={`${categoryColors[i % categoryColors.length]} h-48 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                            >
                                <h3 className="text-2xl font-bold break-words max-w-[80%]">{cat.name}</h3>
                                <img 
                                    src={cat.icon} 
                                    className="absolute -bottom-4 -right-4 w-28 h-28 rotate-[25deg] shadow-lg"
                                    alt={cat.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
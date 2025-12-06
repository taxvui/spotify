
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { searchContent, getCategories, searchTracks } from '../services/spotifyService';
import { Track, Playlist, ArtistFull } from '../types';
import { Card } from './Card';

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

const ClockIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zM7 6.5C7 8.378 7.63 10 8.5 10c.87 0 1.5-1.622 1.5-3.5S9.37 3 8.5 3c-.87 0-1.5 1.622-1.5 3.5zm8.5 0c0 2.505-2.753 4.67-6.5 4.96C8.63 9.49 8.13 8.04 8.13 6.5c0-1.54.5-2.99.87-4.96 3.747.29 6.5 2.455 6.5 4.96zM7.5 11.46c-3.747-.29-6.5-2.455-6.5-4.96 0-2.505 2.753-4.67 6.5-4.96.37 1.97.87 3.42.87 4.96 0 1.54-.5 2.99-.87 4.96z"></path></svg>
);

type SearchType = 'all' | 'tracks' | 'artists' | 'playlists' | 'albums';

interface SearchData {
    tracks: Track[];
    artists: ArtistFull[];
    playlists: Playlist[];
    albums: Playlist[];
}

export const Search = () => {
    const [query, setQuery] = useState('');
    const [searchData, setSearchData] = useState<SearchData>({ tracks: [], artists: [], playlists: [], albums: [] });
    const [categories, setCategories] = useState<{id: string, name: string, icon: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // Suggestions state
    const [suggestions, setSuggestions] = useState<Track[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Active Filter State
    const [activeFilter, setActiveFilter] = useState<SearchType>('all');

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
            setSearchData({ tracks: [], artists: [], playlists: [], albums: [] });
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const data = await searchContent(debouncedQuery);
            setSearchData(data);
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
            // Just fetching tracks for suggestions dropdown is usually enough
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

    const hasResults = searchData.tracks.length > 0 || searchData.artists.length > 0 || searchData.albums.length > 0 || searchData.playlists.length > 0;

    // determine Top Result (simulated logic: prefer artist if exact match, otherwise top track)
    let topResultType: 'artist' | 'track' = 'track';
    let topResultData: any = searchData.tracks[0];
    
    if (searchData.artists.length > 0) {
        // If query closely matches an artist name, promote it
        // For simplicity, we just check if we have artist results and maybe prefer them
        // In a real app, Spotify returns a specific 'top_result' field.
        // Here we'll default to the first artist if available, else first track.
         if (searchData.artists[0] && searchData.artists[0].name.toLowerCase().includes(debouncedQuery.toLowerCase())) {
             topResultType = 'artist';
             topResultData = searchData.artists[0];
         }
    }

    const FilterChip = ({ label, type }: { label: string, type: SearchType }) => (
        <button
            onClick={() => setActiveFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === type ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-6 pt-6">
            {/* Search Input */}
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

            {!loading && hasResults && (
                <>
                    {/* Filter Chips */}
                    <div className="flex gap-2 mb-6">
                        <FilterChip label="All" type="all" />
                        <FilterChip label="Artists" type="artists" />
                        <FilterChip label="Songs" type="tracks" />
                        <FilterChip label="Playlists" type="playlists" />
                        <FilterChip label="Albums" type="albums" />
                    </div>

                    {/* All View */}
                    {activeFilter === 'all' && (
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* Top Result */}
                                {topResultData && (
                                    <div className="lg:col-span-2">
                                        <h2 className="text-2xl font-bold mb-4">Top result</h2>
                                        <div 
                                            className="bg-[#181818] hover:bg-[#282828] p-5 rounded-lg transition-colors group relative cursor-pointer h-60 flex flex-col justify-center gap-4"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                navigate(topResultType === 'artist' ? `/artist/${topResultData.id}` : `/track/${topResultData.id}`); 
                                            }}
                                        >
                                            <img 
                                                src={topResultType === 'artist' ? topResultData.images?.[0]?.url : topResultData.coverUrl} 
                                                alt={topResultType === 'artist' ? topResultData.name : topResultData.title} 
                                                className={`w-24 h-24 shadow-[0_8px_24px_rgba(0,0,0,0.5)] object-cover mb-2 ${topResultType === 'artist' ? 'rounded-full' : 'rounded-md'}`}
                                            />
                                            
                                            <div>
                                                <div className="text-3xl font-bold text-white mb-1 line-clamp-1 pb-1 tracking-tight">
                                                    {topResultType === 'artist' ? topResultData.name : topResultData.title}
                                                </div>
                                                <div className="text-sm font-semibold text-spotify-grey flex items-center gap-2">
                                                    {topResultType === 'artist' ? (
                                                        <span className="text-white bg-[#121212] rounded-full px-3 py-1 text-xs uppercase tracking-wider">Artist</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-white bg-[#121212] rounded-full px-3 py-1 text-xs uppercase tracking-wider">Song</span>
                                                            <span className="text-white">{topResultData.artist}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Play Button for Top Result */}
                                            {topResultType === 'track' && (
                                                <div onClick={(e) => handlePlay(e, topResultData)} className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl z-10">
                                                    <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform hover:bg-[#1fdf64]">
                                                        <svg role="img" height="20" width="20" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Songs List */}
                                <div className="lg:col-span-3">
                                    <h2 className="text-2xl font-bold mb-4">Songs</h2>
                                    <div className="flex flex-col">
                                        {searchData.tracks.slice(0, 4).map((track) => (
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
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 hidden sm:flex">
                                                    <button 
                                                        onClick={(e) => handleAddToQueue(e, track)}
                                                        className="text-spotify-grey hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <AddToQueueIcon />
                                                    </button>
                                                    <span className="text-sm text-spotify-grey w-12 text-right tabular-nums">{track.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Artists Section */}
                            {searchData.artists.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">Artists</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {searchData.artists.slice(0, 6).map(artist => (
                                             <Card 
                                                key={`artist-${artist.id}`}
                                                id={artist.id}
                                                image={artist.images[0]?.url || 'https://via.placeholder.com/300'}
                                                title={artist.name}
                                                description="Artist"
                                                type="artist"
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Albums Section */}
                            {searchData.albums.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">Albums</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {searchData.albums.slice(0, 6).map(album => (
                                             <Card 
                                                key={`album-${album.id}`}
                                                id={album.id}
                                                image={album.coverUrl}
                                                title={album.name}
                                                description={album.description}
                                                type="album"
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                             {/* Playlists Section */}
                             {searchData.playlists.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {searchData.playlists.slice(0, 6).map(playlist => (
                                             <Card 
                                                key={`playlist-${playlist.id}`}
                                                id={playlist.id}
                                                image={playlist.coverUrl}
                                                title={playlist.name}
                                                description={`By ${playlist.owner || 'Spotify'}`}
                                                type="playlist"
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Tracks View */}
                    {activeFilter === 'tracks' && (
                        <div>
                             <h2 className="text-2xl font-bold mb-4">Songs</h2>
                             <div className="grid grid-cols-[16px_1fr_40px] md:grid-cols-[16px_1fr_1fr_60px] gap-4 text-spotify-grey text-sm border-b border-[#282828] pb-2 mb-4 px-4 uppercase font-normal">
                                <span>#</span>
                                <span>Title</span>
                                <span className="hidden md:block">Album</span>
                                <div className="flex justify-end"><ClockIcon /></div>
                            </div>
                            <div className="flex flex-col">
                                {searchData.tracks.map((track, index) => (
                                    <div 
                                        key={track.id} 
                                        className="grid grid-cols-[16px_1fr_40px] md:grid-cols-[16px_1fr_1fr_60px] gap-4 items-center px-4 py-2 hover:bg-[#2a2a2a] rounded group cursor-pointer text-sm text-spotify-grey hover:text-white transition-colors"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/track/${track.id}`); }}
                                    >
                                        <div className="flex justify-center items-center w-4">
                                            <span className="text-base group-hover:hidden">{index + 1}</span>
                                            <button 
                                                className="hidden group-hover:flex text-white items-center justify-center bg-transparent border-none outline-none"
                                                onClick={(e) => handlePlay(e, track)}
                                            >
                                                {currentTrack?.id === track.id && isPlaying ? (
                                                     <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                                                ) : (
                                                    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <img src={track.coverUrl} className="w-10 h-10 rounded shadow-sm" alt="" />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className={`truncate font-medium text-base ${currentTrack?.id === track.id ? 'text-spotify-green' : 'text-white'}`}>{track.title}</span>
                                                <Link to={`/artist/${track.artistId}`} onClick={(e) => e.stopPropagation()} className="truncate text-sm hover:underline">{track.artist}</Link>
                                            </div>
                                        </div>
                                        <span className="hidden md:block truncate hover:underline">{track.album}</span>
                                        <span className="text-right tabular-nums">{track.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Artists View */}
                    {activeFilter === 'artists' && (
                        <div>
                             <h2 className="text-2xl font-bold mb-4">Artists</h2>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {searchData.artists.map(artist => (
                                     <Card 
                                        key={`artist-${artist.id}`}
                                        id={artist.id}
                                        image={artist.images[0]?.url || 'https://via.placeholder.com/300'}
                                        title={artist.name}
                                        description="Artist"
                                        type="artist"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                     {/* Playlists View */}
                     {activeFilter === 'playlists' && (
                        <div>
                             <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {searchData.playlists.map(playlist => (
                                     <Card 
                                        key={`playlist-${playlist.id}`}
                                        id={playlist.id}
                                        image={playlist.coverUrl}
                                        title={playlist.name}
                                        description={`By ${playlist.owner || 'Spotify'}`}
                                        type="playlist"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                     {/* Albums View */}
                     {activeFilter === 'albums' && (
                        <div>
                             <h2 className="text-2xl font-bold mb-4">Albums</h2>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {searchData.albums.map(album => (
                                     <Card 
                                        key={`album-${album.id}`}
                                        id={album.id}
                                        image={album.coverUrl}
                                        title={album.name}
                                        description={album.description}
                                        type="album"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </>
            )}

            {!loading && !hasResults && !query && (
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

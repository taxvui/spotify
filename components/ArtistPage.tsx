import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtist, getArtistTopTracks, getArtistAlbums } from '../services/spotifyService';
import { ArtistFull, Track, Playlist } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { Card } from './Card';

const PlayIconBig = () => (
    <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24" fill="black"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
);

export const ArtistPage = () => {
    const { id } = useParams<{ id: string }>();
    const [artist, setArtist] = useState<ArtistFull | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack } = usePlayer();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        
        Promise.all([
            getArtist(id),
            getArtistTopTracks(id),
            getArtistAlbums(id)
        ]).then(async ([artistData, tracksData, albumsData]) => {
            setArtist(artistData);
            setTopTracks(tracksData);
            // Filter out duplicate albums by name for cleaner display
            const uniqueAlbums = albumsData.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);
            setAlbums(uniqueAlbums);
            
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div></div>;
    if (!artist) return <div className="p-8 text-white">Artist not found</div>;

    return (
        <div className="flex flex-col text-white pb-8">
            {/* Hero Header */}
            <div 
                className="h-[50vh] min-h-[400px] flex flex-col justify-end p-8 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${artist.images[0]?.url})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-transparent"></div>
                <div className="relative z-10 max-w-5xl">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="bg-[#3d91f4] text-white px-2 py-1 text-sm font-bold rounded-full flex items-center gap-1">
                            <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="white"><path d="M8.7 1.346a13.36 13.36 0 0 0-1.4 0 13.36 13.36 0 0 0 0 13.308c.45.068.91.104 1.373.104 4.885 0 8.846-3.023 8.846-6.754 0-3.73-3.96-6.754-8.82-6.658zM7.3 1.346a13.36 13.36 0 0 1 1.4 0 13.36 13.36 0 0 1 0 13.308c-.45.068-.91.104-1.373.104-4.885 0-8.846-3.023-8.846-6.754 0-3.73 3.96-6.754 8.82-6.658z"></path></svg>
                            Verified Artist
                         </span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter shadow-black drop-shadow-lg">{artist.name}</h1>
                    <p className="text-base font-normal mb-4 drop-shadow-md">{artist.followers.total.toLocaleString()} followers</p>
                    
                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {artist.genres.map(genre => (
                            <span key={genre} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold capitalize border border-white/10 shadow-sm">
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Popularity Score */}
                    <div className="flex items-center gap-3 text-sm font-bold drop-shadow-md">
                        <span className="opacity-90">Popularity</span>
                        <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                            <div 
                                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                                style={{ width: `${artist.popularity}%` }}
                            />
                        </div>
                        <span className="opacity-90">{artist.popularity}%</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 px-8 py-6">
                 <button 
                    onClick={() => topTracks.length > 0 && playTrack(topTracks[0])}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all shadow-lg"
                >
                    <PlayIconBig />
                </button>
                <button className="px-4 py-1 border border-[#727272] hover:border-white rounded text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">
                    Follow
                </button>
            </div>

            <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Popular Tracks */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Popular</h2>
                    <div className="flex flex-col">
                        {topTracks.slice(0, 5).map((track, index) => (
                             <div 
                                key={track.id} 
                                className="grid grid-cols-[16px_1fr_40px] gap-4 items-center px-4 py-2 hover:bg-[#2a2a2a] rounded group cursor-pointer text-sm text-spotify-grey hover:text-white transition-colors h-14"
                                onClick={() => playTrack(track)}
                            >
                                <span className="text-base group-hover:hidden w-4 text-center">{index + 1}</span>
                                <span className="hidden group-hover:block text-white w-4">
                                    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
                                </span>

                                <div className="flex items-center gap-4 overflow-hidden">
                                    <img src={track.coverUrl} className="w-10 h-10 rounded shadow-sm" alt="" />
                                    <span className={`truncate font-medium text-base ${currentTrack?.id === track.id ? 'text-spotify-green' : 'text-white'}`}>{track.title}</span>
                                </div>
                                <span className="text-right tabular-nums">{track.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Artist Pick (Static for now, simulates layout) */}
                <div className="hidden lg:block">
                    <h2 className="text-2xl font-bold mb-4">Artist Pick</h2>
                    <div className="flex gap-3 items-start">
                        <img src={artist.images[0]?.url} className="w-20 h-20 rounded" alt="" />
                        <div className="flex flex-col gap-1">
                             <div className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
                                <img src={artist.images[0]?.url} className="w-4 h-4 rounded-full" alt=""/>
                                <span>Posted By {artist.name}</span>
                             </div>
                             <span className="font-bold hover:underline cursor-pointer">Best of {artist.name}</span>
                             <span className="text-sm text-spotify-grey">Playlist</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discography */}
            <div className="px-8 mt-10">
                <h2 className="text-2xl font-bold mb-4">Discography</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {albums.map(album => (
                        <Card 
                            key={album.id}
                            id={album.id}
                            image={album.coverUrl}
                            title={album.name}
                            description={`${new Date(album.description.split('•')[1] || '').getFullYear()} • Album`}
                            type="album"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
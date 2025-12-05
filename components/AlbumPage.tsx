import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbum } from '../services/spotifyService';
import { AlbumFull } from '../types';
import { usePlayer } from '../context/PlayerContext';

const ClockIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#b3b3b3"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg>
);

const PlayIconBig = () => (
    <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24" fill="black"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
);

export const AlbumPage = () => {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<AlbumFull | null>(null);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack } = usePlayer();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getAlbum(id).then(data => {
            setAlbum(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div></div>;
    if (!album) return <div className="p-8 text-white">Album not found</div>;

    const releaseYear = album.release_date.split('-')[0];

    return (
        <div className="flex flex-col text-white pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 p-6 pt-16 bg-gradient-to-b from-[#a03838] to-[#121212]">
                <img src={album.coverUrl} alt={album.name} className="w-52 h-52 sm:w-60 sm:h-60 shadow-[0_4px_60px_rgba(0,0,0,0.5)] rounded" />
                <div className="flex flex-col justify-end">
                    <span className="text-sm font-bold uppercase hidden md:block">Album</span>
                    <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 mt-2 tracking-tighter">{album.name}</h1>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <img src={album.coverUrl} className="w-6 h-6 rounded-full object-cover mr-1" alt="" />
                        <Link to={`/artist/${album.artistId}`} className="hover:underline">{album.artist}</Link>
                        <span className="text-white mx-1">•</span>
                        <span className="font-normal">{releaseYear}</span>
                        <span className="text-white mx-1">•</span>
                        <span className="font-normal">{album.total_tracks} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 px-6 py-6">
                <button 
                    onClick={() => album.tracks.length > 0 && playTrack(album.tracks[0])}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all shadow-lg"
                >
                    <PlayIconBig />
                </button>
                 <button className="text-spotify-grey hover:text-white transition-colors">
                     <svg role="img" height="32" width="32" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M5.21 1.57a6.757 6.757 0 0 1 6.778 0 3.379 3.379 0 0 1 .5.51l.008.01a7.284 7.284 0 0 1 .31.39l.298.406c.453.64.887 1.348 1.455 1.348.568 0 1.002-.708 1.455-1.348l.298-.407a7.02 7.02 0 0 1 .318-.401 3.38 3.38 0 0 1 .5-.51 6.757 6.757 0 0 1 6.779 0A6.744 6.744 0 0 1 24 7.643c0 7.502-11.417 14.155-11.667 14.296a.63.63 0 0 1-.666 0C11.417 21.798 0 15.145 0 7.642A6.744 6.744 0 0 1 5.21 1.57zm13.116 1.834a5.244 5.244 0 0 0-4.994.498 1.88 1.88 0 0 0-.293.308l-.008.01a5.61 5.61 0 0 0-.27.35l-.299.407c-.772 1.088-1.577 2.222-2.903 2.222s-2.13-1.134-2.903-2.222l-.299-.407a5.597 5.597 0 0 0-.279-.36 1.879 1.879 0 0 0-.293-.308 5.244 5.244 0 0 0-4.994-.498 5.245 5.245 0 0 0-4.045 4.72C.674 13.045 9.489 18.23 12 19.66c2.511-1.43 11.326-6.615 11.536-11.838a5.245 5.245 0 0 0-4.045-4.72z"></path></svg>
                </button>
            </div>

            {/* Tracks Table */}
            <div className="px-6">
                 <div className="grid grid-cols-[16px_1fr_40px] md:grid-cols-[16px_1fr_60px] gap-4 text-spotify-grey text-sm border-b border-[#282828] pb-2 mb-4 px-4 uppercase font-normal">
                    <span>#</span>
                    <span>Title</span>
                    <div className="flex justify-end"><ClockIcon /></div>
                </div>

                <div className="flex flex-col">
                    {album.tracks.map((track, index) => (
                        <div 
                            key={`${track.id}-${index}`} 
                            onClick={() => playTrack(track)}
                            className="grid grid-cols-[16px_1fr_40px] md:grid-cols-[16px_1fr_60px] gap-4 items-center px-4 py-2 hover:bg-[#2a2a2a] rounded group cursor-pointer text-sm text-spotify-grey hover:text-white transition-colors"
                        >
                            <span className="text-base group-hover:hidden">{index + 1}</span>
                            <span className="hidden group-hover:block text-white">
                                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
                            </span>

                            <div className="flex flex-col overflow-hidden">
                                <span className={`truncate font-medium text-base ${currentTrack?.id === track.id ? 'text-spotify-green' : 'text-white'}`}>{track.title}</span>
                                <span className="truncate text-sm text-spotify-grey">{track.artist}</span>
                            </div>

                            <span className="text-right tabular-nums">{track.duration}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
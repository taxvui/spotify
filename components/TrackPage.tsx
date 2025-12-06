
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrack, getRecommendations } from '../services/spotifyService';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';

const PlayIconBig = () => (
    <svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24" fill="black"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
);

export const TrackPage = () => {
    const { id } = useParams<{ id: string }>();
    const [track, setTrack] = useState<Track | null>(null);
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack } = usePlayer();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getTrack(id).then(async (data) => {
            setTrack(data);
            if (data) {
                const recs = await getRecommendations([data.id]);
                setRecommendations(recs);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div></div>;
    if (!track) return <div className="p-8 text-white">Track not found</div>;

    return (
        <div className="flex flex-col text-white pb-8">
            <div className="flex flex-col md:flex-row gap-6 p-6 pt-16 bg-gradient-to-b from-[#3848a0] to-[#121212]">
                <img src={track.coverUrl} alt={track.title} className="w-52 h-52 sm:w-60 sm:h-60 shadow-[0_4px_60px_rgba(0,0,0,0.5)] rounded" />
                <div className="flex flex-col justify-end">
                    <span className="text-sm font-bold uppercase hidden md:block">Song</span>
                    <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 mt-2 tracking-tighter">{track.title}</h1>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <img src={track.coverUrl} className="w-6 h-6 rounded-full object-cover mr-1" alt="" />
                        <Link to={`/artist/${track.artistId}`} className="hover:underline">{track.artist}</Link>
                        <span className="text-white mx-1">•</span>
                        <Link to={`/album/${track.albumId}`} className="hover:underline font-normal text-spotify-grey hover:text-white">{track.album}</Link>
                        <span className="text-white mx-1">•</span>
                        <span className="font-normal">{track.duration}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 px-6 py-6">
                <button 
                    onClick={() => playTrack(track)}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all shadow-lg"
                >
                    <PlayIconBig />
                </button>
            </div>

            <div className="px-6 mt-4">
                <h2 className="text-2xl font-bold mb-4">Recommended</h2>
                <div className="flex flex-col">
                    {recommendations.map((rec, index) => (
                         <div 
                            key={rec.id} 
                            className="grid grid-cols-[16px_1fr_40px] gap-4 items-center px-4 py-2 hover:bg-[#2a2a2a] rounded group cursor-pointer text-sm text-spotify-grey hover:text-white transition-colors h-14"
                            onClick={() => playTrack(rec)}
                        >
                            <span className="text-base group-hover:hidden w-4 text-center">{index + 1}</span>
                            <span className="hidden group-hover:block text-white w-4">
                                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
                            </span>

                            <div className="flex items-center gap-4 overflow-hidden">
                                <img src={rec.coverUrl} className="w-10 h-10 rounded shadow-sm" alt="" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className={`truncate font-medium text-base ${currentTrack?.id === rec.id ? 'text-spotify-green' : 'text-white'}`}>{rec.title}</span>
                                    <span className="truncate text-xs">{rec.artist}</span>
                                </div>
                            </div>
                            <span className="text-right tabular-nums">{rec.duration}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';

interface CardProps {
  id: string; 
  image: string;
  title: string;
  description: string;
  type?: 'playlist' | 'album' | 'artist' | 'track'; 
  track?: Track;
}

const PlayButton = () => (
    <div className="absolute bottom-2 right-2 w-[48px] h-[48px] bg-spotify-green rounded-full shadow-[0_8px_8px_rgba(0,0,0,0.3)] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-[-8px] group-hover:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-[#1fdf64] z-20">
        <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="black">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
        </svg>
    </div>
)

export const Card: React.FC<CardProps> = ({ id, image, title, description, type = 'playlist', track }) => {
  const { playTrack } = usePlayer();
  const navigate = useNavigate();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (track) {
        playTrack(track);
    } else {
        // For albums/playlists, we would typically play context, but navigating is safer for now
        navigate(`/${type}/${id}`);
    }
  };

  const handleClick = () => {
    if (type === 'track' && track) {
        if(track.albumId) navigate(`/album/${track.albumId}`);
    } else {
        navigate(`/${type}/${id}`);
    }
  };

  return (
    <div 
        onClick={handleClick}
        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-colors duration-300 cursor-pointer group flex flex-col gap-3 relative isolate"
    >
      <div className={`relative w-full aspect-square shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${type === 'artist' ? 'rounded-full' : 'rounded-md'} overflow-hidden`}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {/* Play button only shows for non-artist types on hover */}
        {type !== 'artist' && (
            <div onClick={handlePlay}>
                <PlayButton />
            </div>
        )}
      </div>
      <div className="flex flex-col min-h-[62px]">
        <h3 className="font-bold text-white text-[16px] truncate mb-1" title={title}>{title}</h3>
        <p className="text-[13px] text-[#a7a7a7] line-clamp-2 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};
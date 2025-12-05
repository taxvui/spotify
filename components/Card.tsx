import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';

interface CardProps {
  id: string; // Add ID for navigation
  image: string;
  title: string;
  description: string;
  type?: 'playlist' | 'album' | 'artist' | 'track'; // Default to playlist if undefined
  track?: Track; // If it's a track card
}

const PlayButton = () => (
    <div className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full shadow-xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 z-20">
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
        // For playlists/albums, ideally we would fetch the tracks and play the first one
        // For now, let's just navigate
        navigate(`/${type}/${id}`);
    }
  };

  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div 
        onClick={handleClick}
        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-md transition-colors duration-300 cursor-pointer group flex flex-col gap-4 relative"
    >
      <div className={`relative shadow-lg overflow-hidden aspect-square ${type === 'artist' ? 'rounded-full' : 'rounded-md'}`}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {type !== 'artist' && (
            <div onClick={handlePlay}>
                <PlayButton />
            </div>
        )}
      </div>
      <div className="min-h-[60px]">
        <h3 className="font-bold text-white mb-1 truncate">{title}</h3>
        <p className="text-sm text-spotify-grey line-clamp-2">{description}</p>
      </div>
    </div>
  );
};
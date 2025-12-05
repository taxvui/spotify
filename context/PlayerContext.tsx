import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { Track } from '../types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
        // Lower volume slightly by default
        audioRef.current.volume = 0.5;
    }
  }, []);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
        // Stop current audio
        audioRef.current.pause();

        if (currentTrack.previewUrl) {
            audioRef.current.src = currentTrack.previewUrl;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            }
        } else {
             // No preview available, we can still show the player but can't play audio
             console.log("No preview URL for track:", currentTrack.title);
             audioRef.current.src = "";
             // Optional: reset playing state if you don't want to show "playing" UI for silent tracks
             // setIsPlaying(false); 
        }
    }
  }, [currentTrack]);

  // Handle play/pause toggle
  useEffect(() => {
    if(audioRef.current && audioRef.current.src) {
        if(isPlaying) {
             audioRef.current.play().catch(e => console.error("Play error", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
        togglePlay();
    } else {
        setCurrentTrack(track);
        setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    // In a real app, this would check the queue
    console.log("Next track clicked");
  };

  const prevTrack = () => {
    console.log("Prev track clicked");
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, nextTrack, prevTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
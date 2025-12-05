import React, { createContext, useContext, useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
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

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
        const next = queue[0];
        setQueue((prev) => prev.slice(1));
        setCurrentTrack(next);
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }
  }, [queue]);

  const prevTrack = () => {
     if (audioRef.current) {
         audioRef.current.currentTime = 0;
     }
  };

  // Bind onended to nextTrack whenever nextTrack changes (due to queue updates)
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.onended = nextTrack;
      }
  }, [nextTrack]);

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, queue, playTrack, togglePlay, nextTrack, prevTrack, addToQueue }}>
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
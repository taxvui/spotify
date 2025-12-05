import React, { createContext, useContext, useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.5;
        audioRef.current.preload = 'metadata';
    }
  }, []);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
        const audio = audioRef.current;
        // Pause before changing source
        audio.pause();
        
        if (currentTrack.previewUrl) {
            audio.src = currentTrack.previewUrl;
            audio.load();
            
            // Reset time state
            setCurrentTime(0);
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => {
                        console.error("Playback failed", e);
                        setIsPlaying(false);
                    });
            }
        } else {
             console.log("No preview URL for track:", currentTrack.title);
             audio.src = "";
             setIsPlaying(false);
             setDuration(0);
        }
    }
  }, [currentTrack]);

  // Handle play/pause toggle
  useEffect(() => {
    if(audioRef.current && audioRef.current.src) {
        if(isPlaying) {
             const playPromise = audioRef.current.play();
             if (playPromise !== undefined) {
                 playPromise.catch(e => console.error("Play error", e));
             }
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);

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
            setCurrentTime(0);
        }
    }
  }, [queue]);

  // Setup Event Listeners for Audio
  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => {
          if(!isNaN(audio.duration) && audio.duration !== Infinity) {
              setDuration(audio.duration);
          }
      };
      const onEnded = () => {
          setIsPlaying(false);
          nextTrack();
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', onEnded);

      return () => {
          audio.removeEventListener('timeupdate', updateTime);
          audio.removeEventListener('loadedmetadata', updateDuration);
          audio.removeEventListener('ended', onEnded);
      };
  }, [nextTrack]);

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

  const prevTrack = () => {
     if (audioRef.current) {
         if (audioRef.current.currentTime > 3) {
             audioRef.current.currentTime = 0;
         } else {
             // Implement real previous track logic here if we kept a history
             audioRef.current.currentTime = 0;
         }
         setCurrentTime(audioRef.current.currentTime);
     }
  };

  const seek = (time: number) => {
      if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
      }
  };

  const setVolume = (vol: number) => {
      if (audioRef.current) {
          audioRef.current.volume = vol;
          setVolumeState(vol);
      }
  };

  return (
    <PlayerContext.Provider value={{ 
        currentTrack, 
        isPlaying, 
        queue, 
        currentTime, 
        duration, 
        volume,
        playTrack, 
        togglePlay, 
        nextTrack, 
        prevTrack, 
        addToQueue,
        seek,
        setVolume
    }}>
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
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g., "3:45"
  coverUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export interface SearchState {
  query: string;
  results: Track[];
  isLoading: boolean;
  error: string | null;
}

export enum ViewType {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  LIBRARY = 'LIBRARY',
  PLAYLIST = 'PLAYLIST'
}

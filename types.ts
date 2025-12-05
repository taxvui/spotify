export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  duration: string; // e.g., "3:45"
  coverUrl: string;
  previewUrl?: string | null;
  addedAt?: string; // Date added for playlists
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  type?: 'playlist' | 'album' | 'artist' | 'track';
}

export interface PlaylistFull extends Playlist {
  owner: string;
  followers: number;
  total_tracks: number;
}

export interface AlbumFull {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  release_date: string;
  coverUrl: string;
  tracks: Track[];
  total_tracks: number;
  type: 'album';
}

export interface ArtistFull {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  genres: string[];
  popularity: number;
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
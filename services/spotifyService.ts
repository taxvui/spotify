import { Track, Playlist } from '../types';

const CLIENT_ID = 'bdc640818e8747eaa7ff3903a8d6cede';
const CLIENT_SECRET = '40fec813eecc4ee9b8eed33fa9f8a3fc';

let accessToken = '';
let tokenExpiration = 0;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) throw new Error('Failed to fetch token');

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return null;
  }
};

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const mapTrack = (item: any): Track => ({
  id: item.id,
  title: item.name,
  artist: item.artists.map((a: any) => a.name).join(', '),
  album: item.album.name,
  duration: formatDuration(item.duration_ms),
  coverUrl: item.album.images[0]?.url || 'https://via.placeholder.com/300',
  previewUrl: item.preview_url,
});

const mapPlaylist = (item: any): Playlist => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
  coverUrl: item.images[0]?.url || 'https://via.placeholder.com/300',
  tracks: [],
});

const mapAlbum = (item: any): Playlist => ({
    id: item.id,
    name: item.name,
    description: item.artists.map((a: any) => a.name).join(', ') + ' • ' + (item.release_date?.split('-')[0] || ''),
    coverUrl: item.images[0]?.url || 'https://via.placeholder.com/300',
    tracks: [],
  });

export const searchTracks = async (query: string): Promise<Track[]> => {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.tracks?.items?.map(mapTrack) || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getNewReleases = async (): Promise<Playlist[]> => {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=12`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.albums?.items?.map(mapAlbum) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getFeaturedPlaylists = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return [];
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=12`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data.playlists?.items?.map(mapPlaylist) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
};

export const getCategories = async (): Promise<{id: string, name: string, icon: string}[]> => {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/categories?limit=20`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.categories?.items?.map((item: any) => ({
            id: item.id,
            name: item.name,
            icon: item.icons[0]?.url
        })) || [];
    } catch(e) {
        return [];
    }
}
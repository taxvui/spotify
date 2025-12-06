
import { Track, Playlist, PlaylistFull, AlbumFull, ArtistFull, UserProfile } from '../types';
import { MOCK_TRENDING, MOCK_ARTISTS, MOCK_ALBUMS, MOCK_RADIO, MOCK_CHARTS, MOCK_TRACKS } from '../constants';

const CLIENT_ID = 'bdc640818e8747eaa7ff3903a8d6cede';
const CLIENT_SECRET = '40fec813eecc4ee9b8eed33fa9f8a3fc';
const REDIRECT_URI = 'https://spotify-sepia-chi.vercel.app/callback';

let accessToken = '';
let tokenExpiration = 0;
let userAccessToken = '';
let userTokenExpiration = 0;

export const loginWithSpotify = () => {
    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    window.location.assign(authUrl);
};

export const handleAuthCallback = async (code: string) => {
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
        });

        if (!response.ok) throw new Error('Failed to exchange code');

        const data = await response.json();
        userAccessToken = data.access_token;
        userTokenExpiration = Date.now() + (data.expires_in * 1000);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const getAccessToken = async () => {
  if (userAccessToken && Date.now() < userTokenExpiration) {
      return userAccessToken;
  }

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

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    return null;
  }
};

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const mapTrack = (item: any): Track => {
    const track = item.track || item; 
    
    if (!track || !track.name) {
        return {
            id: 'unknown',
            title: 'Unknown Track',
            artist: 'Unknown',
            album: 'Unknown',
            duration: '0:00',
            coverUrl: 'https://via.placeholder.com/300',
        }
    }

    return {
      id: track.id,
      title: track.name,
      artist: track.artists ? track.artists.map((a: any) => a.name).join(', ') : 'Unknown',
      artistId: track.artists && track.artists[0] ? track.artists[0].id : '',
      album: track.album ? track.album.name : '',
      albumId: track.album ? track.album.id : '',
      duration: formatDuration(track.duration_ms),
      coverUrl: track.album?.images[0]?.url || 'https://via.placeholder.com/300',
      previewUrl: track.preview_url,
      addedAt: item.added_at ? new Date(item.added_at).toLocaleDateString() : undefined,
      releaseYear: track.album?.release_date?.split('-')[0]
    };
};

const mapPlaylist = (item: any): Playlist => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
  coverUrl: item.images?.[0]?.url || 'https://via.placeholder.com/300',
  tracks: [],
  type: 'playlist',
  owner: item.owner?.display_name
});

const mapAlbum = (item: any): Playlist => ({
    id: item.id,
    name: item.name,
    description: item.artists ? item.artists.map((a: any) => a.name).join(', ') : '',
    coverUrl: item.images?.[0]?.url || 'https://via.placeholder.com/300',
    tracks: [],
    type: 'album'
  });

export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
    if (!userAccessToken) return null;
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${userAccessToken}` }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) { return null; }
}

export const getUserPlaylists = async (): Promise<Playlist[]> => {
    if (!userAccessToken) return [];
    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
            headers: { Authorization: `Bearer ${userAccessToken}` }
        });
        const data = await response.json();
        return data.items.map(mapPlaylist);
    } catch (e) { return []; }
}

export const searchTracks = async (query: string): Promise<Track[]> => {
  const token = await getAccessToken();
  if (!token) return MOCK_TRACKS.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20&market=VN`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.tracks?.items?.map(mapTrack) || [];
  } catch (error) {
    return MOCK_TRACKS;
  }
};

export const getNewReleases = async (): Promise<Playlist[]> => {
  const token = await getAccessToken();
  if (!token) return MOCK_ALBUMS;

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=12&country=VN`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const items = data.albums?.items?.map(mapAlbum) || [];
    return items.length > 0 ? items : MOCK_ALBUMS;
  } catch (error) {
    return MOCK_ALBUMS;
  }
};

export const getFeaturedPlaylists = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_CHARTS;
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=12&country=VN`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const items = data.playlists?.items?.map(mapPlaylist) || [];
      return items.length > 0 ? items : MOCK_CHARTS;
    } catch (error) {
      return MOCK_CHARTS;
    }
};

export const getCategories = async (): Promise<{id: string, name: string, icon: string}[]> => {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/categories?limit=20&country=VN`, {
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

export const getCategoryPlaylists = async (categoryId: string): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_CHARTS;

    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=12&country=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.playlists?.items?.map(mapPlaylist) || [];
    } catch (e) {
        return [];
    }
}

export const getPlaylist = async (id: string): Promise<PlaylistFull | null> => {
    const token = await getAccessToken();
    if (!token) {
        const mockP = MOCK_CHARTS.find(p => p.id === id) || MOCK_RADIO.find(p => p.id === id) || MOCK_CHARTS[0];
        return {
            ...mockP,
            tracks: MOCK_TRENDING,
            owner: 'Spotify',
            followers: 123456,
            total_tracks: MOCK_TRENDING.length,
            type: 'playlist'
        };
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;
        
        const data = await response.json();
        const tracks = data.tracks.items.map(mapTrack).filter((t: Track) => t.id !== 'unknown');

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            coverUrl: data.images?.[0]?.url || '',
            tracks: tracks,
            owner: data.owner.display_name,
            followers: data.followers.total,
            total_tracks: data.tracks.total,
            type: 'playlist'
        };
    } catch (e) {
        return null;
    }
}

export const getAlbum = async (id: string): Promise<AlbumFull | null> => {
    const token = await getAccessToken();
    if (!token) {
        const mockA = MOCK_ALBUMS.find(a => a.id === id) || MOCK_ALBUMS[0];
        return {
            id: mockA.id,
            name: mockA.name,
            artist: mockA.description,
            artistId: 'mock-artist',
            release_date: '2024',
            coverUrl: mockA.coverUrl,
            tracks: MOCK_TRENDING.slice(0,3),
            total_tracks: 3,
            type: 'album'
        };
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;

        const data = await response.json();
        const tracks = data.tracks.items.map((item: any) => ({
            ...mapTrack(item),
            coverUrl: data.images?.[0]?.url, 
            album: data.name,
            releaseYear: data.release_date?.split('-')[0]
        }));

        return {
            id: data.id,
            name: data.name,
            artist: data.artists.map((a: any) => a.name).join(', '),
            artistId: data.artists[0]?.id,
            release_date: data.release_date,
            coverUrl: data.images?.[0]?.url || '',
            tracks: tracks,
            total_tracks: data.total_tracks,
            type: 'album'
        };
    } catch (e) {
        return null;
    }
}

export const getArtist = async (id: string): Promise<ArtistFull | null> => {
    const token = await getAccessToken();
    if (!token) return MOCK_ARTISTS.find(a => a.id === id) || MOCK_ARTISTS[0];
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) { return null; }
}

export const getArtistTopTracks = async (id: string): Promise<Track[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_TRENDING;
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.tracks.map(mapTrack);
    } catch (e) { return []; }
}

export const getArtistAlbums = async (id: string): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_ALBUMS;
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=10&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.items.map(mapAlbum);
    } catch (e) { return []; }
}

export const getTrack = async (id: string): Promise<Track | null> => {
    const token = await getAccessToken();
    if (!token) return MOCK_TRENDING.find(t => t.id === id) || MOCK_TRENDING[0];
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;
        const data = await response.json();
        return mapTrack(data);
    } catch(e) { return null; }
}

export const getRecommendations = async (seedTracks: string[]): Promise<Track[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_TRENDING.slice(2, 5);
    try {
        const seeds = seedTracks.slice(0, 5).join(',');
        const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seeds}&limit=10&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.tracks.map(mapTrack);
    } catch(e) { return []; }
}

export const getTopArtists = async (): Promise<ArtistFull[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_ARTISTS;
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=7&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const items = data.artists?.items || [];
        return items.length > 0 ? items : MOCK_ARTISTS;
    } catch (e) { return MOCK_ARTISTS; }
}

export const getTrendingTracks = async (): Promise<Track[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_TRENDING;
    
    try {
        const playlistIds = ['37i9dQZEVXbLdGSmz6xilI', '37i9dQZEVXbMDoHDwVN2tF'];
        for (const id of playlistIds) {
            const playlist = await getPlaylist(id); 
            if (playlist && playlist.tracks.length > 0) {
                return playlist.tracks.slice(0, 7);
            }
        }
         
         const featured = await getFeaturedPlaylists();
         if(featured[0] && featured[0].id !== MOCK_CHARTS[0].id) {
             const fp = await getPlaylist(featured[0].id);
             return fp && fp.tracks.length > 0 ? fp.tracks.slice(0, 7) : MOCK_TRENDING;
         }
    } catch (e) {
        return MOCK_TRENDING;
    }
     
    return MOCK_TRENDING;
}

export const getFeaturedCharts = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_CHARTS;
    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=7&country=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const items = data.playlists?.items?.map(mapPlaylist) || [];
        return items.length > 0 ? items : MOCK_CHARTS;
    } catch (e) { return MOCK_CHARTS; }
}

export const getPopularRadio = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return MOCK_RADIO;
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=Radio&type=playlist&limit=7&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const items = data.playlists?.items?.map(mapPlaylist) || [];
        return items.length > 0 ? items : MOCK_RADIO;
    } catch (e) { return MOCK_RADIO; }
}

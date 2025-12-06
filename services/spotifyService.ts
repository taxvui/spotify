import { Track, Playlist, PlaylistFull, AlbumFull, ArtistFull, UserProfile } from '../types';

const CLIENT_ID = 'bdc640818e8747eaa7ff3903a8d6cede';
// Note: In a real production app, never expose client secret on the client side.
const CLIENT_SECRET = '40fec813eecc4ee9b8eed33fa9f8a3fc';
const REDIRECT_URI = 'https://spotify-sepia-chi.vercel.app/callback';

let accessToken = '';
let tokenExpiration = 0;
let userAccessToken = '';
let userTokenExpiration = 0;

// --- Authentication ---

export const loginWithSpotify = () => {
    const scope = 'user-read-private user-read-email playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    // Use assign to strictly navigate
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
  // Prefer user token if logged in
  if (userAccessToken && Date.now() < userTokenExpiration) {
      return userAccessToken;
  }

  // Fallback to Client Credentials
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

// --- Mappers ---

const mapTrack = (item: any): Track => {
    // Handle both direct track object or track object inside 'track' property (playlist)
    const track = item.track || item; 
    
    // Safety check for empty track objects
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
  type: 'playlist'
});

const mapAlbum = (item: any): Playlist => ({
    id: item.id,
    name: item.name,
    description: item.artists ? item.artists.map((a: any) => a.name).join(', ') : '',
    coverUrl: item.images?.[0]?.url || 'https://via.placeholder.com/300',
    tracks: [],
    type: 'album'
  });

// --- API Methods ---

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

export const searchTracks = async (query: string): Promise<Track[]> => {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20&market=VN`, {
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
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=12&country=VN`, {
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
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=12&country=VN`, {
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
    if (!token) return [];

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
    if (!token) return null;

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
        console.error(e);
        return null;
    }
}

export const getAlbum = async (id: string): Promise<AlbumFull | null> => {
    const token = await getAccessToken();
    if (!token) return null;

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
        console.error(e);
        return null;
    }
}

export const getArtist = async (id: string): Promise<ArtistFull | null> => {
    const token = await getAccessToken();
    if (!token) return null;
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
    if (!token) return [];
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
    if (!token) return [];
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
    if (!token) return null;
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
    if (!token) return [];
    try {
        const seeds = seedTracks.slice(0, 5).join(',');
        const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seeds}&limit=10&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.tracks.map(mapTrack);
    } catch(e) { return []; }
}

// --- Home Page Design Methods ---

export const getTopArtists = async (): Promise<ArtistFull[]> => {
    const token = await getAccessToken();
    if (!token) return [];
    try {
        // Fetch popular artists generally if VN market specific search returns nothing
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=7&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.artists?.items || [];
    } catch (e) { return []; }
}

export const getTrendingTracks = async (): Promise<Track[]> => {
    // Try "Global Top 50" if "Top 50 - Vietnam" fails or implies usage of other playlist
    // Global Top 50: 37i9dQZEVXbMDoHDwVN2tF
    // Top 50 - Vietnam: 37i9dQZEVXbLdGSmz6xilI
    
    const playlistIds = ['37i9dQZEVXbLdGSmz6xilI', '37i9dQZEVXbMDoHDwVN2tF'];
    
    for (const id of playlistIds) {
        const playlist = await getPlaylist(id); 
        if (playlist && playlist.tracks.length > 0) {
            return playlist.tracks.slice(0, 7);
        }
    }
     
     // Fallback if playlist fails
     const featured = await getFeaturedPlaylists();
     if(featured[0]) {
         const fp = await getPlaylist(featured[0].id);
         return fp ? fp.tracks.slice(0, 7) : [];
     }
     return [];
}

export const getFeaturedCharts = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return [];
    try {
        // Fetch 'toplists' category playlists
        const response = await fetch(`https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=7&country=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const items = data.playlists?.items?.map(mapPlaylist) || [];
        
        if (items.length === 0) {
            // Fallback to featured
             return getFeaturedPlaylists().then(res => res.slice(0, 7));
        }
        return items;
    } catch (e) { return []; }
}

export const getPopularRadio = async (): Promise<Playlist[]> => {
    const token = await getAccessToken();
    if (!token) return [];
    try {
        // Search for playlists with "Radio" in the title
        const response = await fetch(`https://api.spotify.com/v1/search?q=Radio&type=playlist&limit=7&market=VN`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.playlists?.items?.map(mapPlaylist) || [];
    } catch (e) { return []; }
}
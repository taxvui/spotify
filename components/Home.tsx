
import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getNewReleases, getTrendingTracks, getTopArtists, getFeaturedCharts, getPopularRadio } from '../services/spotifyService';
import { Playlist, Track, ArtistFull } from '../types';
import { MOCK_TRACKS, MOCK_PLAYLISTS } from '../constants';

const SectionHeader = ({ title, showAll = true }: { title: string, showAll?: boolean }) => (
    <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">{title}</h2>
        {showAll && (
            <span className="text-[14px] font-bold text-[#b3b3b3] hover:underline cursor-pointer tracking-wide">
                Show all
            </span>
        )}
    </div>
);

export const Home = () => {
    const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
    const [popularArtists, setPopularArtists] = useState<ArtistFull[]>([]);
    const [popularAlbums, setPopularAlbums] = useState<Playlist[]>([]);
    const [featuredCharts, setFeaturedCharts] = useState<Playlist[]>([]);
    const [popularRadio, setPopularRadio] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tracks, artists, albums, charts, radios] = await Promise.all([
                    getTrendingTracks(),
                    getTopArtists(),
                    getNewReleases(),
                    getFeaturedCharts(),
                    getPopularRadio()
                ]);

                // Use fetched data or fallback to mocks if empty to ensure UI is populated
                setTrendingTracks(tracks.length > 0 ? tracks.slice(0, 7) : MOCK_TRACKS);
                
                if (artists.length > 0) {
                    setPopularArtists(artists.slice(0, 7));
                } else {
                     // Create mock artists from mock tracks if needed
                     const mockArtists: ArtistFull[] = MOCK_TRACKS.map((t, i) => ({
                         id: `mock-artist-${i}`,
                         name: t.artist.split(',')[0],
                         images: [{ url: t.coverUrl, height: 300, width: 300 }],
                         followers: { total: 1000000 },
                         genres: ['Pop'],
                         popularity: 80
                     }));
                     setPopularArtists(mockArtists);
                }

                setPopularAlbums(albums.length > 0 ? albums.slice(0, 7) : MOCK_PLAYLISTS.map(p => ({...p, type: 'album'} as Playlist)));
                setFeaturedCharts(charts.length > 0 ? charts.slice(0, 7) : MOCK_PLAYLISTS);
                setPopularRadio(radios.length > 0 ? radios.slice(0, 7) : MOCK_PLAYLISTS);

            } catch (e) {
                console.error("Error loading home data", e);
                // Fallback to mocks on error
                setTrendingTracks(MOCK_TRACKS);
                setPopularAlbums(MOCK_PLAYLISTS);
                setFeaturedCharts(MOCK_PLAYLISTS);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <div className="w-10 h-10 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 px-4 pt-2 pb-8">
            {/* Trending Songs Section */}
            <section>
                <SectionHeader title="Trending songs" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {trendingTracks.map(track => (
                        <Card 
                            key={`trending-${track.id}`}
                            id={track.id}
                            image={track.coverUrl}
                            title={track.title}
                            description={track.artist}
                            type="track"
                            track={track}
                        />
                    ))}
                </div>
            </section>

            {/* Popular Artists Section */}
            <section>
                <SectionHeader title="Popular artists" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {popularArtists.map(artist => (
                        <Card 
                            key={`artist-${artist.id}`}
                            id={artist.id}
                            image={artist.images[0]?.url || 'https://via.placeholder.com/300'}
                            title={artist.name}
                            description="Artist"
                            type="artist"
                        />
                    ))}
                </div>
            </section>

            {/* Popular Albums Section */}
            <section>
                <SectionHeader title="Popular albums and singles" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {popularAlbums.map(album => (
                        <Card 
                            key={`album-${album.id}`}
                            id={album.id}
                            image={album.coverUrl}
                            title={album.name}
                            description={album.description || `Album • ${album.name}`} 
                            type="album"
                        />
                    ))}
                </div>
            </section>

            {/* Popular Radio Section */}
            <section>
                <SectionHeader title="Popular radio" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {popularRadio.map(playlist => (
                        <Card 
                            key={`radio-${playlist.id}`}
                            id={playlist.id}
                            image={playlist.coverUrl}
                            title={playlist.name}
                            description={playlist.description || 'Non-stop music based on your favorite artists.'}
                            type="playlist"
                        />
                    ))}
                </div>
            </section>

            {/* Featured Charts Section */}
            <section>
                <SectionHeader title="Featured Charts" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {featuredCharts.map(playlist => (
                        <Card 
                            key={`chart-${playlist.id}`}
                            id={playlist.id}
                            image={playlist.coverUrl}
                            title={playlist.name}
                            description={playlist.description || 'Top tracks globally.'}
                            type="playlist"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

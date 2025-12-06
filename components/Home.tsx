
import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getNewReleases, getTrendingTracks, getTopArtists, getFeaturedCharts, getPopularRadio } from '../services/spotifyService';
import { Playlist, Track, ArtistFull } from '../types';
import { MOCK_TRENDING, MOCK_ARTISTS, MOCK_ALBUMS, MOCK_CHARTS, MOCK_RADIO } from '../constants';

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
    // INITIALIZE WITH MOCK DATA IMMEDIATELY
    // This ensures the user sees content instantly, behaving like a static preview
    const [trendingTracks, setTrendingTracks] = useState<Track[]>(MOCK_TRENDING);
    const [popularArtists, setPopularArtists] = useState<ArtistFull[]>(MOCK_ARTISTS);
    const [popularAlbums, setPopularAlbums] = useState<Playlist[]>(MOCK_ALBUMS);
    const [featuredCharts, setFeaturedCharts] = useState<Playlist[]>(MOCK_CHARTS);
    const [popularRadio, setPopularRadio] = useState<Playlist[]>(MOCK_RADIO);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Attempt to fetch real data in the background
                // If these fail or return empty, we just keep the initial MOCK data
                const [tracks, artists, albums, charts, radios] = await Promise.all([
                    getTrendingTracks(),
                    getTopArtists(),
                    getNewReleases(),
                    getFeaturedCharts(),
                    getPopularRadio()
                ]);
                
                if (!isMounted) return;

                // Only update if we actually got valid data back
                if (tracks && tracks.length > 0) setTrendingTracks(tracks);
                if (artists && artists.length > 0) setPopularArtists(artists);
                if (albums && albums.length > 0) setPopularAlbums(albums);
                if (charts && charts.length > 0) setFeaturedCharts(charts);
                if (radios && radios.length > 0) setPopularRadio(radios);

            } catch (e) {
                console.warn("API fetch failed, sticking with mock data", e);
                // Do nothing, we already have mock data showing
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    // No loading check here - render immediately
    return (
        <div className="flex flex-col gap-8 px-4 pt-6 pb-8">
            {/* Trending Songs Section */}
            <section>
                <SectionHeader title="Trending songs" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                    {trendingTracks.slice(0, 7).map(track => (
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
                    {popularArtists.slice(0, 7).map(artist => (
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
                    {popularAlbums.slice(0, 7).map(album => (
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
                    {popularRadio.slice(0, 7).map(playlist => (
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
                    {featuredCharts.slice(0, 7).map(playlist => (
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

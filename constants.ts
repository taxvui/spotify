import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    duration: '3:50',
    coverUrl: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: '2',
    title: 'Closer',
    artist: 'The Chainsmokers, Halsey',
    album: 'Collage',
    duration: '4:04',
    coverUrl: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: '3',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: '3:53',
    coverUrl: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    coverUrl: 'https://picsum.photos/300/300?random=4',
  },
  {
    id: '5',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    coverUrl: 'https://picsum.photos/300/300?random=5',
  },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music. Enjoy new discoveries and deep cuts chosen just for you.',
    coverUrl: 'https://picsum.photos/300/300?random=10',
    tracks: MOCK_TRACKS,
  },
  {
    id: 'p2',
    name: 'Release Radar',
    description: 'Catch up on the latest releases from artists you follow, plus new singles picked for you.',
    coverUrl: 'https://picsum.photos/300/300?random=11',
    tracks: [...MOCK_TRACKS].reverse(),
  },
  {
    id: 'p3',
    name: 'Daily Mix 1',
    description: 'A mix of news and timeless favorites.',
    coverUrl: 'https://picsum.photos/300/300?random=12',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[2], MOCK_TRACKS[4]],
  },
  {
    id: 'p4',
    name: 'Top Hits',
    description: 'The hottest tracks in the world right now.',
    coverUrl: 'https://picsum.photos/300/300?random=13',
    tracks: MOCK_TRACKS,
  },
  {
    id: 'p5',
    name: 'Chill Vibes',
    description: 'Just sit back and relax.',
    coverUrl: 'https://picsum.photos/300/300?random=14',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[3]],
  }
];

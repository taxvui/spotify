import { Track, Playlist, ArtistFull } from './types';

// Functional MP3 samples for playback testing
const SAMPLE_MP3_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const SAMPLE_MP3_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
const SAMPLE_MP3_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3";
const SAMPLE_MP3_4 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3";

// --- MOCK TRENDING SONGS (Vietnam & Global Mix) ---
export const MOCK_TRENDING: Track[] = [
  {
    id: 't1',
    title: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU',
    artist: 'Sơn Tùng M-TP',
    artistId: 'art1',
    album: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU',
    albumId: 'alb1',
    duration: '5:23',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a0aa68bb6e1db0df14073f8f',
    previewUrl: SAMPLE_MP3_1,
    releaseYear: '2024',
    genre: 'V-Pop'
  },
  {
    id: 't2',
    title: 'Die With A Smile',
    artist: 'Lady Gaga, Bruno Mars',
    artistId: 'art2',
    album: 'Die With A Smile',
    albumId: 'alb2',
    duration: '4:11',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45',
    previewUrl: SAMPLE_MP3_2,
    releaseYear: '2024',
    genre: 'Pop'
  },
  {
    id: 't3',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    artistId: 'art3',
    album: 'Espresso',
    albumId: 'alb3',
    duration: '2:55',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3918e0d5',
    previewUrl: SAMPLE_MP3_3,
    releaseYear: '2024',
    genre: 'Pop'
  },
  {
    id: 't4',
    title: 'Hứa Đợi Nhưng Lại Quên',
    artist: 'SOOBIN',
    artistId: 'art4',
    album: 'Bật Nó Lên',
    albumId: 'alb4',
    duration: '3:45',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2731835978a6320a0063229b439',
    previewUrl: SAMPLE_MP3_4,
    releaseYear: '2024',
    genre: 'R&B'
  },
  {
    id: 't5',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    artistId: 'art5',
    album: 'HIT ME HARD AND SOFT',
    albumId: 'alb5',
    duration: '3:30',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
    previewUrl: SAMPLE_MP3_1,
    releaseYear: '2024',
    genre: 'Alternative'
  },
  {
    id: 't6',
    title: 'Thiên Lý Ơi',
    artist: 'Jack - J97',
    artistId: 'art6',
    album: 'Thiên Lý Ơi',
    albumId: 'alb6',
    duration: '4:02',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273574c372224424a1b02138936',
    previewUrl: SAMPLE_MP3_2,
    releaseYear: '2024',
    genre: 'V-Pop'
  }
];

// --- MOCK ARTISTS ---
export const MOCK_ARTISTS: ArtistFull[] = [
  {
    id: 'art1',
    name: 'Sơn Tùng M-TP',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb006ff3c0136a71bfb9928d34', height: 640, width: 640 }],
    followers: { total: 14500000 },
    genres: ['V-pop'],
    popularity: 95
  },
  {
    id: 'art2',
    name: 'SOOBIN',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb1d27572d44933a39e782c3c9', height: 640, width: 640 }],
    followers: { total: 3200000 },
    genres: ['V-pop', 'R&B'],
    popularity: 88
  },
  {
    id: 'art3',
    name: 'Taylor Swift',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0', height: 640, width: 640 }],
    followers: { total: 100000000 },
    genres: ['Pop'],
    popularity: 100
  },
  {
    id: 'art4',
    name: 'HIEUTHUHAI',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb2b947230b80980c559c5df00', height: 640, width: 640 }],
    followers: { total: 1500000 },
    genres: ['Rap', 'Hip Hop'],
    popularity: 90
  },
  {
    id: 'art5',
    name: 'tlinh',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb12ee742460d3d5f992c30386', height: 640, width: 640 }],
    followers: { total: 1200000 },
    genres: ['Indie', 'R&B'],
    popularity: 85
  },
  {
    id: 'art6',
    name: 'MCK',
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5ebd743916ddf539151e285d43e', height: 640, width: 640 }],
    followers: { total: 2000000 },
    genres: ['Rap'],
    popularity: 92
  }
];

// --- MOCK ALBUMS ---
export const MOCK_ALBUMS: Playlist[] = [
  {
    id: 'alb1',
    name: 'Lover',
    description: 'Taylor Swift',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
    tracks: [],
    type: 'album'
  },
  {
    id: 'alb2',
    name: 'Bật Nó Lên',
    description: 'SOOBIN',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2731835978a6320a0063229b439',
    tracks: [],
    type: 'album'
  },
  {
    id: 'alb3',
    name: 'ái',
    description: 'tlinh',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2736151f1656885dfb0e27c13cb',
    tracks: [],
    type: 'album'
  },
  {
    id: 'alb4',
    name: 'Golden',
    description: 'Jung Kook',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273673b5443217b11d9990f1d3a',
    tracks: [],
    type: 'album'
  },
  {
    id: 'alb5',
    name: '99%',
    description: 'MCK',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27391997d9c66fc29c488390777',
    tracks: [],
    type: 'album'
  }
];

// --- MOCK RADIO ---
export const MOCK_RADIO: Playlist[] = [
  {
    id: 'rad1',
    name: 'Sơn Tùng M-TP Radio',
    description: 'With SOOBIN, Jack - J97 and more',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c5249a5e2f754719c8d62638',
    tracks: [],
    type: 'playlist'
  },
  {
    id: 'rad2',
    name: 'Pop Radio',
    description: 'With Taylor Swift, Ariana Grande and more',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273413550e68d01119b9148d484',
    tracks: [],
    type: 'playlist'
  },
  {
    id: 'rad3',
    name: 'Hip-Hop Radio',
    description: 'With MCK, HIEUTHUHAI and more',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea',
    tracks: [],
    type: 'playlist'
  },
  {
    id: 'rad4',
    name: 'Chill Mix',
    description: 'Just sit back and relax',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273ca6084d5c41443424cb4d262',
    tracks: [],
    type: 'playlist'
  }
];

// --- MOCK CHARTS ---
export const MOCK_CHARTS: Playlist[] = [
  {
    id: 'ch1',
    name: 'Top 50 - Vietnam',
    description: 'Your daily update of the most played tracks right now - Vietnam.',
    coverUrl: 'https://charts-images.scdn.co/assets/locale_en/regional/daily/region_vn_default.jpg',
    tracks: [],
    type: 'playlist'
  },
  {
    id: 'ch2',
    name: 'Top 50 - Global',
    description: 'Your daily update of the most played tracks right now - Global.',
    coverUrl: 'https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg',
    tracks: [],
    type: 'playlist'
  },
  {
    id: 'ch3',
    name: 'Viral 50 - Vietnam',
    description: 'Your daily update of the most viral tracks right now - Vietnam.',
    coverUrl: 'https://charts-images.scdn.co/assets/locale_en/viral/daily/region_vn_default.jpg',
    tracks: [],
    type: 'playlist'
  }
];

// Re-export old MOCK_TRACKS for compatibility if needed, but prefer MOCK_TRENDING
export const MOCK_TRACKS = MOCK_TRENDING;
export const MOCK_PLAYLISTS = MOCK_ALBUMS;

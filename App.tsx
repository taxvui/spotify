import React, { useRef, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { PlaylistPage } from './components/PlaylistPage';
import { AlbumPage } from './components/AlbumPage';
import { ArtistPage } from './components/ArtistPage';
import { TrackPage } from './components/TrackPage';
import { TopBar } from './components/TopBar';
import { PlayerProvider } from './context/PlayerContext';

const ScrollWrapper = ({ children }: { children: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    const location = useLocation();

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollTop = scrollRef.current.scrollTop;
            const newOpacity = Math.min(scrollTop / 200, 1);
            setOpacity(newOpacity);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if(el) {
            el.addEventListener('scroll', handleScroll);
            // Reset scroll on route change
            el.scrollTop = 0; 
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, [location.pathname]);

    // Use different navbar colors based on route or simple opacity
    const isSpecialPage = location.pathname.startsWith('/playlist') || location.pathname.startsWith('/album') || location.pathname.startsWith('/artist') || location.pathname.startsWith('/track');
    // For these pages, we might want the navbar to blend with the header color, handled via transparency
    
    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#121212] rounded-lg overflow-hidden my-2 mr-2">
            <TopBar opacity={opacity} />
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-[#121212] relative scroll-smooth"
            >
                {/* Add a subtle gradient background at the top that persists */}
                <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#202020] to-[#121212] -z-10" />
                {children}
            </div>
        </div>
    );
}

const App = () => {
  return (
    <PlayerProvider>
        <Router>
            <div className="flex flex-col h-screen w-screen bg-black text-white font-sans">
                <div className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <ScrollWrapper>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/playlist/:id" element={<PlaylistPage />} />
                            <Route path="/album/:id" element={<AlbumPage />} />
                            <Route path="/artist/:id" element={<ArtistPage />} />
                            <Route path="/track/:id" element={<TrackPage />} />
                        </Routes>
                        
                        {/* Fake Footer Links */}
                        <div className="p-8 pb-16 flex flex-col md:flex-row justify-between text-[#b3b3b3] text-sm mt-8">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-white mb-2">Company</h4>
                                <a href="#" className="hover:underline hover:text-white">About</a>
                                <a href="#" className="hover:underline hover:text-white">Jobs</a>
                                <a href="#" className="hover:underline hover:text-white">For the Record</a>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                <h4 className="font-bold text-white mb-2">Communities</h4>
                                <a href="#" className="hover:underline hover:text-white">For Artists</a>
                                <a href="#" className="hover:underline hover:text-white">Developers</a>
                                <a href="#" className="hover:underline hover:text-white">Advertising</a>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                <h4 className="font-bold text-white mb-2">Useful links</h4>
                                <a href="#" className="hover:underline hover:text-white">Support</a>
                                <a href="#" className="hover:underline hover:text-white">Free Mobile App</a>
                            </div>
                        </div>
                    </ScrollWrapper>
                </div>
                <Player />
            </div>
        </Router>
    </PlayerProvider>
  );
};

export default App;
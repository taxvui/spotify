
import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Home } from './components/Home';
import { Search } from './components/Search';
import { PlaylistPage } from './components/PlaylistPage';
import { AlbumPage } from './components/AlbumPage';
import { ArtistPage } from './components/ArtistPage';
import { TrackPage } from './components/TrackPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Player } from './components/Player';

import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { handleAuthCallback } from './services/spotifyService';

const ScrollWrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#121212] rounded-lg overflow-hidden isolate">
            <div className="flex-1 overflow-y-auto bg-[#121212] relative scroll-smooth custom-scrollbar">
                {/* Gradient background at the top */}
                <div className="absolute top-0 left-0 w-full h-[332px] bg-gradient-to-b from-[#1f1f1f] to-[#121212] -z-10" />
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

const Callback = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            handleAuthCallback(code).then(() => navigate('/'));
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

const AppContent = () => {
    return (
        <div className="flex flex-col h-screen w-screen bg-black text-white font-sans overflow-hidden">
            <TopBar />
            {/* Main Layout Area with Gap */}
            <div className="flex-1 flex gap-2 p-2 pt-0 overflow-hidden min-h-0">
                <Sidebar />
                
                <ScrollWrapper>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/callback" element={<Callback />} />
                        <Route path="/playlist/:id" element={<PlaylistPage />} />
                        <Route path="/album/:id" element={<AlbumPage />} />
                        <Route path="/artist/:id" element={<ArtistPage />} />
                        <Route path="/track/:id" element={<TrackPage />} />
                    </Routes>
                </ScrollWrapper>
            </div>
            
            {/* Player Footer */}
            <Player />
        </div>
    );
}

const App = () => {
  return (
    <ThemeProvider>
        <PlayerProvider>
            <Router>
                <AppContent />
            </Router>
        </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUserProfile, loginWithSpotify } from '../services/spotifyService';
import { UserProfile } from '../types';

const ChevronLeft = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="white">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
    </svg>
)
const ChevronRight = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="white">
        <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path>
    </svg>
)
const ContrastIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 0 1 0-13V8h-6.5a6.5 6.5 0 0 1 6.5 6.5z"/>
    </svg>
)

export const TopBar = ({ opacity = 0, bgColor = '#121212' }: { opacity?: number, bgColor?: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isHighContrast, toggleTheme } = useTheme();
    const [user, setUser] = React.useState<UserProfile | null>(null);

    React.useEffect(() => {
        getCurrentUserProfile().then(setUser);
    }, []);

    return (
        <header 
            className="h-16 w-full fixed top-0 z-40 px-6 flex items-center justify-between transition-colors duration-300"
            style={{ backgroundColor: opacity > 0 ? 'rgba(0,0,0,0.7)' : 'transparent', backdropFilter: opacity > 0 ? 'blur(10px)' : 'none' }}
        >
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="bg-black/70 rounded-full p-2 hover:scale-105 disabled:opacity-50"
                    disabled={location.key === "default"}
                >
                    <ChevronLeft />
                </button>
                <button 
                    onClick={() => navigate(1)} 
                    className="bg-black/70 rounded-full p-2 hover:scale-105 disabled:opacity-50"
                >
                    <ChevronRight />
                </button>
            </div>
            
            <div className="flex gap-4 items-center">
                <button 
                    onClick={toggleTheme}
                    className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full border transition-all ${isHighContrast ? 'bg-white text-black border-white' : 'bg-transparent text-white border-transparent hover:border-white'}`}
                    title="Toggle High Contrast Mode"
                >
                    <ContrastIcon />
                    <span className="hidden sm:inline">Contrast</span>
                </button>
                
                {user ? (
                    <div className="flex items-center gap-2 bg-black/70 rounded-full p-1 pr-3 hover:scale-105 transition-transform cursor-pointer">
                        {user.images?.[0] ? (
                             <img src={user.images[0].url} alt={user.display_name} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                            <div className="w-7 h-7 bg-[#535353] rounded-full flex items-center justify-center text-xs font-bold">
                                {user.display_name.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm font-bold text-white">{user.display_name}</span>
                    </div>
                ) : (
                    <>
                        <button className="text-spotify-grey hover:text-white font-bold text-sm hover:scale-105 transition-transform">
                            Sign up
                        </button>
                        <button onClick={loginWithSpotify} className="bg-white text-black font-bold text-sm px-8 py-3 rounded-full hover:scale-105 transition-transform">
                            Log in
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
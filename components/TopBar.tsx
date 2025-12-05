import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

export const TopBar = ({ opacity = 0, bgColor = '#121212' }: { opacity?: number, bgColor?: string }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine background color style based on scroll
    const style = {
        backgroundColor: opacity > 0 ? bgColor : 'transparent',
        opacity: opacity > 0 ? 1 : 1, // Element is always visible, background fades
    };

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
                 <button className="text-spotify-grey hover:text-white font-bold text-sm hover:scale-105 transition-transform">
                    Sign up
                </button>
                <button className="bg-white text-black font-bold text-sm px-8 py-3 rounded-full hover:scale-105 transition-transform">
                    Log in
                </button>
            </div>
        </header>
    );
}

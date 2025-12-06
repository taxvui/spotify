import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginWithSpotify, getCurrentUserProfile } from '../services/spotifyService';

const SpotifyLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" height="24">
        <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"/>
        <path fill="black" d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z"/>
    </svg>
);

const HomeIcon = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-4v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path>
    </svg>
);

const SearchIcon = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.227 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
    </svg>
);

const BrowseIcon = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm-2 2a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5V4z"></path>
        <path d="M16.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
    </svg>
)

export const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = React.useState<any>(null);
    const [localQuery, setLocalQuery] = React.useState('');

    React.useEffect(() => {
        getCurrentUserProfile().then(setUser);
    }, []);

    const isSearch = location.pathname === '/search';

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate('/search');
            // Logic to pass query to search component would go here, 
            // but for now we just navigate
        }
    };

    return (
        <header className="h-16 w-full bg-black flex items-center justify-between px-6 z-30 flex-shrink-0">
            {/* Left aligned items: Logo */}
            <div className="flex items-center justify-start w-[140px] md:w-[240px]">
                 <Link to="/" className="text-white hover:text-[#1ed760] transition-colors">
                    <SpotifyLogo />
                 </Link>
            </div>

            {/* Center: Home Icon + Search Bar */}
            <div className="flex-1 flex items-center justify-center gap-2">
                 <Link to="/" className="w-12 h-12 bg-[#1f1f1f] rounded-full flex-shrink-0 flex items-center justify-center text-white hover:scale-105 transition-transform">
                    <HomeIcon />
                 </Link>
                 
                 <div className="flex-1 max-w-[480px] hidden md:block group">
                     <div 
                        className="relative flex items-center"
                        onClick={() => { if(!isSearch) navigate('/search'); }}
                     >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#b3b3b3] group-hover:text-white transition-colors">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text" 
                            placeholder="What do you want to play?" 
                            className="w-full h-12 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] hover:border-[#333] border border-transparent text-white pl-12 pr-12 placeholder-[#b3b3b3] font-medium text-sm transition-all focus:outline-none focus:border-white focus:bg-[#2a2a2a] truncate"
                            value={isSearch ? '' : localQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l border-[#7c7c7c] pl-3 pointer-events-none text-[#b3b3b3] group-hover:text-white transition-colors">
                             <BrowseIcon />
                        </div>
                     </div>
                </div>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center justify-end gap-4 w-[140px] md:w-[240px]">
                {user ? (
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-[#282828] p-1 pr-3 rounded-full transition-colors">
                            <img src={user.images?.[0]?.url || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full" alt="Profile" />
                            <span className="text-sm font-bold hidden sm:block">{user.display_name}</span>
                    </div>
                ) : (
                    <>
                        <button className="text-[#a7a7a7] hover:text-white font-bold text-base hover:scale-105 transition-transform tracking-wide whitespace-nowrap">
                            Sign up
                        </button>
                        <button 
                            onClick={loginWithSpotify}
                            className="bg-white text-black font-bold text-base px-8 py-3 rounded-full hover:scale-105 hover:bg-[#f0f0f0] transition-transform whitespace-nowrap"
                        >
                            Log in
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};
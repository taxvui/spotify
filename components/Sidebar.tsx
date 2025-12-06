
import React from 'react';
import { Link } from 'react-router-dom';

const LibraryIcon = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
    </svg>
);

const GlobeIcon = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zM7 6.5C7 8.378 7.63 10 8.5 10c.87 0 1.5-1.622 1.5-3.5S9.37 3 8.5 3c-.87 0-1.5 1.622-1.5 3.5zm8.5 0c0 2.505-2.753 4.67-6.5 4.96C8.63 9.49 8.13 8.04 8.13 6.5c0-1.54.5-2.99.87-4.96 3.747.29 6.5 2.455 6.5 4.96zM7.5 11.46c-3.747-.29-6.5-2.455-6.5-4.96 0-2.505 2.753-4.67 6.5-4.96.37 1.97.87 3.42.87 4.96 0 1.54-.5 2.99-.87 4.96z"></path>
    </svg>
);

export const Sidebar = () => {
    return (
        <aside className="w-[320px] md:w-[420px] lg:w-[350px] flex flex-col gap-2 h-full flex-shrink-0">
            {/* Library Container */}
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
                <div className="p-2 px-4 shadow-md z-10">
                    <div className="flex items-center justify-between text-[#a7a7a7] hover:text-white transition-colors cursor-pointer py-2">
                        <div className="flex items-center gap-3 font-bold">
                            <LibraryIcon />
                            <span>Your Library</span>
                        </div>
                        <button className="hover:bg-[#1f1f1f] hover:text-white rounded-full p-2 transition-colors">
                            <PlusIcon />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 scroll-smooth">
                    {/* CTA Cards */}
                    <div className="flex flex-col gap-4 mt-2 px-2">
                         <div className="bg-[#1f1f1f] p-5 rounded-lg flex flex-col items-start gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="font-bold text-base text-white">Create your first playlist</span>
                                <span className="text-sm text-white font-medium">It's easy, we'll help you</span>
                            </div>
                            <button className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform">
                                Create playlist
                            </button>
                        </div>

                        <div className="bg-[#1f1f1f] p-5 rounded-lg flex flex-col items-start gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="font-bold text-base text-white">Let's find some podcasts to follow</span>
                                <span className="text-sm text-white font-medium">We'll keep you updated on new episodes</span>
                            </div>
                            <button className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform">
                                Browse podcasts
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="px-8 pb-8">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
                        {['Legal', 'Safety & Privacy Center', 'Privacy Policy', 'Cookies', 'About Ads', 'Accessibility'].map(link => (
                            <a key={link} href="#" className="text-[11px] text-[#b3b3b3] hover:underline pr-1">
                                {link}
                            </a>
                        ))}
                         <a href="#" className="text-[11px] text-[#b3b3b3] hover:underline">Cookies</a>
                    </div>
                    
                    <button className="flex items-center gap-1.5 border border-[#727272] hover:border-white rounded-full px-4 py-1.5 text-sm font-bold text-white transition-colors">
                        <GlobeIcon />
                        <span>English</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

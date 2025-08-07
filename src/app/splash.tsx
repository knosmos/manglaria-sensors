// fullscreen splash screen component
// disappears after 2 seconds with a fade-out effect

import React, { useEffect, useState } from 'react';

export default function SplashScreen() {
    // SMOOOTH TRANSITION
    const [visible, setVisible] = useState(true);
    const [fadeoutStarted, setFadeoutStarted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeoutStarted(true);
            setTimeout(() => setVisible(false), 500); // Wait for fade-out to complete
        }, 500); // Show splash screen for 2 seconds

        return () => clearTimeout(timer);
    }, []);
    if (!visible) return null; // Don't render if not visible

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-gray-300 text-black transition-opacity duration-500 ease-in-out ${fadeoutStarted ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-4xl md:text-8xl font-sans tracking-widest">MANGLARIA</h1>
        <p className="md:text-xl font-mono mt-4 tracking-widest">LOADING MAP ///////////</p>
        </div>
    );
    }
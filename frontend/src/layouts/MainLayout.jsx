import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MainLayout = () => {
    const location = useLocation();
    const isFoodDetails = location.pathname.startsWith('/food/');
    const [isExpanded, setIsExpanded] = useState(false);

    // Get user from localStorage to check gold status
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isGold = user?.isGoldMember || false;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]" data-theme={isGold ? 'gold' : 'default'}>
            <div>
                <Navigation isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            </div>
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'md:pl-64' : 'md:pl-20'}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;

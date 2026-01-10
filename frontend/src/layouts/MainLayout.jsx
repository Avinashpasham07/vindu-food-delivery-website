import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MainLayout = () => {
    const location = useLocation();
    const isFoodDetails = location.pathname.startsWith('/food/');
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
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

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPartner = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedPartner = localStorage.getItem('partner');
        if (!storedPartner) {
            navigate('/food-partner/login');
        }
    }, [navigate]);

    return <>{children}</>;
};

export default AuthPartner;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthUser = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            toast.error("Please login to continue 🔒");
            navigate('/user/login');
        }
    }, [navigate]);

    return <>{children}</>;
};

export default AuthUser;

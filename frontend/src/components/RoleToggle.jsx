import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleToggle = ({ activeRole, mode = 'login' }) => {
    const navigate = useNavigate();

    const handleToggle = (role) => {
        if (role === activeRole) return;

        // Determine path based on role and mode
        // mode: 'login' or 'register'
        // role: 'user' or 'partner'

        let path = '';
        if (role === 'partner') {
            path = mode === 'register' ? '/food-partner/register' : '/food-partner/login';
        } else {
            path = mode === 'register' ? '/user/register' : '/user/login';
        }

        navigate(path);
    };

    return (
        <div className="flex justify-center w-full mb-6">
            <div className="bg-[#1a1a1a] p-1 rounded-full border border-[#333] flex items-center shadow-lg relative">
                {/* User Button */}
                <button
                    onClick={() => handleToggle('user')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeRole === 'user'
                        ? 'text-black bg-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    User
                </button>

                {/* Partner Button */}
                <button
                    onClick={() => handleToggle('partner')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeRole === 'partner'
                        ? 'text-black bg-[#10B981] shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Partner
                </button>
            </div>
        </div>
    );
};

export default RoleToggle;

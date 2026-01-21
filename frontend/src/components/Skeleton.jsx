import React from 'react';

const Skeleton = ({ width, height, className }) => {
    return (
        <div
            className={`bg-white/5 animate-pulse rounded-lg ${className}`}
            style={{ width, height }}
        />
    );
};

export default Skeleton;

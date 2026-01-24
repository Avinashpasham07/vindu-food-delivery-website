import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-white/10 rounded-xl ${className}`}
            {...props}
        />
    );
};

export const CardSkeleton = () => (
    <div className="bg-[#1a1a1a] rounded-[2rem] p-4 border border-white/5 space-y-4">
        <Skeleton className="w-full h-48 rounded-2xl" />
        <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
    </div>
);

export const ListSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#1a1a1a] rounded-2xl border border-white/5">
                <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;

import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="flex flex-row md:flex-col gap-3 p-3 bg-[#1e1e1e] rounded-2xl md:bg-[#1a1a1a] md:p-0 md:gap-0 md:rounded-[2rem] w-full overflow-hidden border border-white/5">
            {/* Image Skeleton */}
            <div className="w-32 h-32 md:w-full md:h-64 bg-white/5 rounded-xl md:rounded-none shrink-0 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col justify-between md:p-4 w-full">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        {/* Title */}
                        <div className="h-5 w-3/4 bg-white/10 rounded-md animate-pulse" />
                        {/* Type Icon */}
                        <div className="h-4 w-4 bg-white/5 rounded-full shrink-0 animate-pulse" />
                    </div>

                    {/* Metadata */}
                    <div className="h-3 w-20 bg-white/5 rounded-md mb-2 animate-pulse" />

                    {/* Description (Desktop) */}
                    <div className="hidden md:block space-y-1.5 mb-3">
                        <div className="h-3 w-full bg-white/5 rounded-md animate-pulse" />
                        <div className="h-3 w-5/6 bg-white/5 rounded-md animate-pulse" />
                    </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-end justify-between mt-2 md:items-center">
                    <div className="h-6 w-16 bg-white/10 rounded-md animate-pulse" />
                    <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;

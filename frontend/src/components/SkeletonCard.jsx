import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="flex flex-col gap-0 bg-[#1e1e1e] rounded-xl md:bg-[#1a1a1a] md:rounded-2xl w-full overflow-hidden border border-white/5 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-40 sm:h-56 md:h-64 bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col justify-between p-3 md:p-4 w-full">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        {/* Title */}
                        <div className="h-4 w-3/4 bg-white/10 rounded-md" />
                        {/* Type Icon */}
                        <div className="h-3 w-3 bg-white/5 rounded-full shrink-0" />
                    </div>

                    {/* Metadata */}
                    <div className="h-3 w-20 bg-white/5 rounded-md mb-2" />

                    {/* Description (Desktop) */}
                    <div className="hidden md:block space-y-1.5 mb-3">
                        <div className="h-3 w-full bg-white/5 rounded-md" />
                        <div className="h-3 w-5/6 bg-white/5 rounded-md" />
                    </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between mt-2">
                    <div className="h-5 w-12 bg-white/10 rounded-md" />
                    <div className="h-8 w-20 bg-white/10 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;

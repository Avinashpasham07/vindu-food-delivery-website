import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ data }) => {
    // Fallback dummy data if no real data is provided
    const chartData = data && data.length > 0 ? data : [
        { name: '10 AM', orders: 4, revenue: 2400 },
        { name: '11 AM', orders: 3, revenue: 1398 },
        { name: '12 PM', orders: 12, revenue: 8800 },
        { name: '1 PM', orders: 20, revenue: 14500 },
        { name: '2 PM', orders: 15, revenue: 9800 },
        { name: '3 PM', orders: 8, revenue: 4900 },
        { name: '4 PM', orders: 5, revenue: 3200 },
    ];

    return (
        <div className="w-full h-[300px] bg-[#1a1a1a] rounded-2xl border border-white/5 p-4 md:p-6 relative overflow-hidden">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">Revenue Trend (Today)</h3>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#666"
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#10B981' }}
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;

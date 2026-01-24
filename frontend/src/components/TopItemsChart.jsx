import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10B981', '#FF5E00', '#3B82F6', '#F59E0B', '#8B5CF6'];

const TopItemsChart = ({ data }) => {
    // Fallback if no data
    const chartData = data && data.length > 0 ? data : [
        { name: 'Chicken Biryani', value: 400 },
        { name: 'Veg Pizza', value: 300 },
        { name: 'Cola', value: 300 },
        { name: 'Burger', value: 200 },
    ];

    return (
        <div className="w-full h-[350px] bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 flex flex-col">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Best Sellers</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-gray-400 text-xs font-bold ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopItemsChart;

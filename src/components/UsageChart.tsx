import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  data: {
    name: string;
    usage: number;
    amount: number;
  }[];
  type: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ data, type }) => {
  const getColor = () => {
    switch (type.toLowerCase()) {
      case 'water':
        return '#3B82F6';
      case 'electricity':
        return '#EAB308';
      case 'gas':
        return '#EF4444';
      default:
        return '#6366F1';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{type} Usage</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="usage" stroke={getColor()} fill={getColor()} fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageChart;
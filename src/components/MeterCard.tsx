import React from 'react';
import { Droplets, Zap, Flame } from 'lucide-react';
import { ethers } from 'ethers';

interface MeterCardProps {
  id: number;
  type: string;
  rate: number;
  active: boolean;
  lastReading?: number;
  onViewBills: (id: number) => void;
}

const MeterCard: React.FC<MeterCardProps> = ({ id, type, rate, active, lastReading, onViewBills }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'water':
        return <Droplets className="w-8 h-8 text-blue-500" />;
      case 'electricity':
        return <Zap className="w-8 h-8 text-yellow-500" />;
      case 'gas':
        return <Flame className="w-8 h-8 text-red-500" />;
      default:
        return <Zap className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case 'water':
        return 'bg-blue-100 text-blue-800';
      case 'electricity':
        return 'bg-yellow-100 text-yellow-800';
      case 'gas':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gray-100">{getIcon()}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Meter #{id}</h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor()}`}>
                {type}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Rate</p>
            <p className="text-lg font-semibold">{ethers.formatEther(rate.toString())} ETH</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Last Reading</p>
            <p className="text-lg font-semibold">{lastReading || 'N/A'}</p>
          </div>
        </div>
        
        <button
          onClick={() => onViewBills(id)}
          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          View Bills
        </button>
      </div>
    </div>
  );
};

export default MeterCard;
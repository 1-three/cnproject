import React from 'react';
import { Receipt, CheckCircle, XCircle } from 'lucide-react';
import { ethers } from 'ethers';

interface BillCardProps {
  id: number;
  meterId: number;
  reading: number;
  amount: number;
  timestamp: number;
  paid: boolean;
  onPayBill: () => void;
}

const BillCard: React.FC<BillCardProps> = ({
  id,
  meterId,
  reading,
  amount,
  timestamp,
  paid,
  onPayBill,
}) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gray-100">
              <Receipt className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bill #{id}</h3>
              <p className="text-sm text-gray-500">Meter #{meterId}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {paid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Reading</p>
            <p className="text-lg font-semibold">{reading} units</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-lg font-semibold">{ethers.formatEther(amount.toString())} ETH</p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Generated on {formattedDate}</p>
          {!paid && (
            <button
              onClick={onPayBill}
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Pay Bill
            </button>
          )}
          {paid && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Paid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillCard;
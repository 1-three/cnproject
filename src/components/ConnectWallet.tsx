import React from 'react';
import { Wallet } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const ConnectWallet: React.FC = () => {
  const { connectWallet, loading } = useWeb3();

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
      <Wallet className="w-16 h-16 text-indigo-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
      <p className="text-gray-600 text-center mb-6">
        To access the blockchain-based billing system, please connect your Ethereum wallet.
      </p>
      <button
        onClick={connectWallet}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </span>
        )}
      </button>
    </div>
  );
};

export default ConnectWallet;
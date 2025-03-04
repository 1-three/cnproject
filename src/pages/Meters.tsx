import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import MeterCard from '../components/MeterCard';
import ConnectWallet from '../components/ConnectWallet';
import { Diameter as Meter, Plus, Search } from 'lucide-react';

const Meters: React.FC = () => {
  const { account, contract, isOwner, loading } = useWeb3();
  const [meters, setMeters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeters = async () => {
      if (contract && account) {
        try {
          setIsLoading(true);
          
          let meterIds;
          if (isOwner) {
            // If owner, get all meters (this is a simplified approach)
            const meterCount = await contract.meterCount();
            meterIds = Array.from({ length: Number(meterCount) }, (_, i) => i + 1);
          } else {
            // Get user's meters
            meterIds = await contract.getUserMeters(account);
          }
          
          const metersData = [];
          
          for (let i = 0; i < meterIds.length; i++) {
            const meterId = meterIds[i];
            const meterDetails = await contract.getMeterDetails(meterId);
            
            // Get bills for this meter to find the last reading
            const bills = await contract.getMeterBills(meterId);
            const lastReading = bills.length > 0 ? Number(bills[bills.length - 1].reading) : undefined;
            
            metersData.push({
              id: Number(meterId),
              type: meterDetails.meterType,
              rate: meterDetails.rate,
              active: meterDetails.active,
              lastReading
            });
          }
          
          setMeters(metersData);
        } catch (error) {
          console.error('Error fetching meters:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };

    fetchMeters();
  }, [contract, account, isOwner, loading]);

  const handleViewBills = (meterId: number) => {
    navigate('/bills', { state: { meterId } });
  };

  const filteredMeters = meters.filter(meter => 
    meter.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    meter.id.toString().includes(searchTerm)
  );

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!account) {
    return <ConnectWallet />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Meter className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Meters</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meters..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isOwner && (
            <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Register Meter
            </button>
          )}
        </div>
      </div>

      {filteredMeters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeters.map((meter) => (
            <MeterCard
              key={meter.id}
              id={meter.id}
              type={meter.type}
              rate={meter.rate}
              active={meter.active}
              lastReading={meter.lastReading}
              onViewBills={handleViewBills}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Meter className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meters Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? "No meters match your search criteria. Try a different search term."
              : "You don't have any meters registered yet. Please contact the system administrator to register a meter for your account."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Meters;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import BillCard from '../components/BillCard';
import ConnectWallet from '../components/ConnectWallet';
import { Receipt, Filter, ArrowLeft, Search } from 'lucide-react';

const Bills: React.FC = () => {
  const { account, contract, loading } = useWeb3();
  const [bills, setBills] = useState<any[]>([]);
  const [meters, setMeters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPaid, setFilterPaid] = useState<string>('all');
  const [selectedMeter, setSelectedMeter] = useState<number | null>(null);
  
  const location = useLocation();
  const locationMeterId = location.state?.meterId;

  useEffect(() => {
    if (locationMeterId) {
      setSelectedMeter(locationMeterId);
    }
  }, [locationMeterId]);

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          setIsLoading(true);
          
          // Get user meters
          const meterIds = await contract.getUserMeters(account);
          
          const metersData = [];
          const billsData = [];
          
          for (let i = 0; i < meterIds.length; i++) {
            const meterId = meterIds[i];
            const meterDetails = await contract.getMeterDetails(meterId);
            
            metersData.push({
              id: Number(meterId),
              type: meterDetails.meterType
            });
            
            // Get bills for this meter
            const meterBills = await contract.getMeterBills(meterId);
            
            for (let j = 0; j < meterBills.length; j++) {
              const bill = meterBills[j];
              billsData.push({
                id: Number(bill.id),
                meterId: Number(bill.meterId),
                reading: Number(bill.reading),
                amount: bill.amount,
                timestamp: Number(bill.timestamp),
                paid: bill.paid,
                meterType: meterDetails.meterType,
                billIndex: j
              });
            }
          }
          
          setMeters(metersData);
          setBills(billsData);
        } catch (error) {
          console.error('Error fetching bills:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contract, account, loading]);

  const handlePayBill = async (meterId: number, billIndex: number) => {
    if (contract) {
      try {
        const bill = bills.find(b => b.meterId === meterId && b.billIndex === billIndex);
        
        if (!bill) return;
        
        const tx = await contract.payBill(meterId, billIndex, {
          value: bill.amount
        });
        
        await tx.wait();
        
        // Update the bill status
        const updatedBills = bills.map(b => {
          if (b.meterId === meterId && b.billIndex === billIndex) {
            return { ...b, paid: true };
          }
          return b;
        });
        
        setBills(updatedBills);
      } catch (error) {
        console.error('Error paying bill:', error);
      }
    }
  };

  const filteredBills = bills.filter(bill => {
    // Filter by meter if selected
    if (selectedMeter !== null && bill.meterId !== selectedMeter) {
      return false;
    }
    
    // Filter by payment status
    if (filterPaid === 'paid' && !bill.paid) {
      return false;
    }
    if (filterPaid === 'unpaid' && bill.paid) {
      return false;
    }
    
    // Filter by search term
    return (
      bill.id.toString().includes(searchTerm) ||
      bill.meterId.toString().includes(searchTerm) ||
      bill.meterType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const clearMeterFilter = () => {
    setSelectedMeter(null);
  };

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
          <Receipt className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedMeter ? `Bills for Meter #${selectedMeter}` : 'All Bills'}
          </h1>
          
          {selectedMeter && (
            <button 
              onClick={clearMeterFilter}
              className="ml-4 flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to all bills</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bills..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full"
              value={filterPaid}
              onChange={(e) => setFilterPaid(e.target.value)}
            >
              <option value="all">All Bills</option>
              <option value="paid">Paid Only</option>
              <option value="unpaid">Unpaid Only</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              id={bill.id}
              meterId={bill.meterId}
              reading={bill.reading}
              amount={bill.amount}
              timestamp={bill.timestamp}
              paid={bill.paid}
              onPayBill={() => handlePayBill(bill.meterId, bill.billIndex)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Receipt className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bills Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedMeter || filterPaid !== 'all'
              ? "No bills match your search criteria. Try adjusting your filters."
              : "You don't have any bills yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Bills;
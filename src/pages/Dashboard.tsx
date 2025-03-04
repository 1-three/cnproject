import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import ConnectWallet from '../components/ConnectWallet';
import UsageChart from '../components/UsageChart';
import { LayoutDashboard, Droplets, Zap, Flame, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { account, contract, loading } = useWeb3();
  const [userMeters, setUserMeters] = useState<any[]>([]);
  const [totalBills, setTotalBills] = useState<number>(0);
  const [unpaidBills, setUnpaidBills] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sample data for charts
  const electricityData = [
    { name: 'Jan', usage: 120, amount: 0.12 },
    { name: 'Feb', usage: 140, amount: 0.14 },
    { name: 'Mar', usage: 130, amount: 0.13 },
    { name: 'Apr', usage: 170, amount: 0.17 },
    { name: 'May', usage: 150, amount: 0.15 },
    { name: 'Jun', usage: 160, amount: 0.16 },
  ];

  const waterData = [
    { name: 'Jan', usage: 80, amount: 0.08 },
    { name: 'Feb', usage: 90, amount: 0.09 },
    { name: 'Mar', usage: 85, amount: 0.085 },
    { name: 'Apr', usage: 100, amount: 0.1 },
    { name: 'May', usage: 95, amount: 0.095 },
    { name: 'Jun', usage: 110, amount: 0.11 },
  ];

  const gasData = [
    { name: 'Jan', usage: 50, amount: 0.05 },
    { name: 'Feb', usage: 60, amount: 0.06 },
    { name: 'Mar', usage: 55, amount: 0.055 },
    { name: 'Apr', usage: 70, amount: 0.07 },
    { name: 'May', usage: 65, amount: 0.065 },
    { name: 'Jun', usage: 75, amount: 0.075 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          setIsLoading(true);
          
          // Get user meters
          const meterIds = await contract.getUserMeters(account);
          
          const meters = [];
          let totalBillsCount = 0;
          let unpaidBillsCount = 0;
          
          for (let i = 0; i < meterIds.length; i++) {
            const meterId = meterIds[i];
            const meterDetails = await contract.getMeterDetails(meterId);
            const bills = await contract.getMeterBills(meterId);
            
            totalBillsCount += bills.length;
            
            for (let j = 0; j < bills.length; j++) {
              if (!bills[j].paid) {
                unpaidBillsCount++;
              }
            }
            
            meters.push({
              id: meterId,
              type: meterDetails.meterType,
              rate: meterDetails.rate,
              active: meterDetails.active,
              bills: bills
            });
          }
          
          setUserMeters(meters);
          setTotalBills(totalBillsCount);
          setUnpaidBills(unpaidBillsCount);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!loading) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contract, account, loading]);

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
      <div className="flex items-center mb-6">
        <LayoutDashboard className="w-6 h-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Meters</p>
              <p className="text-2xl font-bold text-gray-800">{userMeters.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bills</p>
              <p className="text-2xl font-bold text-gray-800">{totalBills}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unpaid Bills</p>
              <p className="text-2xl font-bold text-gray-800">{unpaidBills}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {userMeters.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UsageChart data={electricityData} type="Electricity" />
          <UsageChart data={waterData} type="Water" />
          <UsageChart data={gasData} type="Gas" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Flame className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meters Found</h3>
          <p className="text-gray-600 mb-4">
            You don't have any meters registered yet. Please contact the system administrator to register a meter for your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
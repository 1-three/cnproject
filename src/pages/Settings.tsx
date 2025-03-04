import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import ConnectWallet from '../components/ConnectWallet';
import { Settings as SettingsIcon, User, Shield, Bell, Info, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const { account, loading } = useWeb3();
  const [activeTab, setActiveTab] = useState<string>('account');
  
  if (loading) {
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
        <SettingsIcon className="w-6 h-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-50 p-6">
            <nav>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg mb-2 ${
                  activeTab === 'account' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                <span>Account</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg mb-2 ${
                  activeTab === 'security' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg mb-2 ${
                  activeTab === 'notifications' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${
                  activeTab === 'about' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}
              >
                <Info className="w-5 h-5 mr-3" />
                <span>About</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 md:flex-1">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connected Wallet</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-800 font-mono">{account}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Used for notifications and billing updates</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="toggle" className="sr-only" />
                      <label
                        htmlFor="toggle"
                        className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">Transaction Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified for all blockchain transactions</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="toggle2" className="sr-only" checked />
                      <label
                        htmlFor="toggle2"
                        className="block bg-indigo-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Connected Applications</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">MetaMask</h4>
                          <p className="text-sm text-gray-500">Connected on Jun 12, 2025</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">Disconnect</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">New Bill Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified when a new bill is generated</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="bill-notif" className="sr-only" checked />
                      <label
                        htmlFor="bill-notif"
                        className="block bg-indigo-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">Payment Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders for upcoming bill payments</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="payment-remind" className="sr-only" checked />
                      <label
                        htmlFor="payment-remind"
                        className="block bg-indigo-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">Usage Alerts</h3>
                      <p className="text-sm text-gray-500">Get alerts when your usage exceeds normal patterns</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="usage-alert" className="sr-only" />
                      <label
                        htmlFor="usage-alert"
                        className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">System Updates</h3>
                      <p className="text-sm text-gray-500">Receive notifications about system updates and maintenance</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" id="system-updates" className="sr-only" checked />
                      <label
                        htmlFor="system-updates"
                        className="block bg-indigo-600 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
                      ></label>
                      <span className="absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About BlockMeter</h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="mb-4">
                    BlockMeter is a blockchain-based utility billing and metering system that provides transparent, 
                    secure, and efficient management of utility consumption and payments.
                  </p>
                  <p className="mb-4">
                    Built on Ethereum blockchain technology, BlockMeter ensures that all transactions and meter 
                    readings are immutable and verifiable, eliminating disputes and providing a trustless environment 
                    for utility billing.
                  </p>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-800 mb-2">Version</h3>
                    <p className="text-gray-600">v0.1.0 (Beta)</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-2">Smart Contract</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono">0x5FbDB2315678afecb367f032d93F642f64180aa3</p>
                      <p className="text-xs text-gray-500 mt-1">Deployed on Local Hardhat Network</p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View on Explorer
                    </button>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-2">Support</h3>
                <p className="text-gray-600 mb-4">
                  If you need help or have any questions, please contact our support team.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { LayoutDashboard, Diameter as Meter, Receipt, Settings, Menu, X, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  const { account, connectWallet } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Meters', path: '/meters', icon: <Meter className="w-5 h-5" /> },
    { name: 'Bills', path: '/bills', icon: <Receipt className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Meter className="w-8 h-8" />
            <span className="text-xl font-bold">BlockMeter</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 hover:text-indigo-200 transition-colors ${
                  location.pathname === item.path ? 'text-white font-semibold' : 'text-indigo-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {account ? (
              <div className="bg-indigo-700 py-2 px-4 rounded-full flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-white text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-full font-medium transition-colors flex items-center"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-500">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
                    location.pathname === item.path
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              {account ? (
                <div className="bg-indigo-700 py-2 px-4 rounded-md flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-md font-medium transition-colors flex items-center"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
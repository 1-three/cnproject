import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Meters from './pages/Meters';
import Bills from './pages/Bills';
import Settings from './pages/Settings';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/meters" element={<Meters />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { connectWallets, connectionStatus, initApi } from './services/api';
import ChainState from './components/ChainState/ChainState';
import Extrinsics from './components/Extrinsics/Extrinsics';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

const App: React.FC = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // Subscribe to connection status
    const subscription = connectionStatus.subscribe(newStatus => {
      setStatus(newStatus);
    });

    // Initialize API connection
    const connect = async () => {
      try {
        await initApi();
        await connectWallets();
      } catch (error) {
        console.error('Connection error:', error);
      }
    };
    
    connect();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header connectionStatus={status} />
        
        <nav className="bg-polkadot-dark text-white py-2">
          <div className="container mx-auto px-4">
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="py-2 px-4 hover:bg-polkadot-primary hover:text-white rounded-md transition-colors"
                >
                  ChainState
                </Link>
              </li>
              <li>
                <Link 
                  to="/extrinsics" 
                  className="py-2 px-4 hover:bg-polkadot-primary hover:text-white rounded-md transition-colors"
                >
                  Extrinsics
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-6 flex-grow">
          {status === 'connected' ? (
            <Routes>
              <Route path="/" element={<ChainState />} />
              <Route path="/extrinsics" element={<Extrinsics />} />
            </Routes>
          ) : status === 'connecting' ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-polkadot-primary mx-auto"></div>
                <p className="mt-4 text-lg">Connecting to node...</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
                <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
                <p className="mb-4">Failed to connect to the local node. Please make sure your Zombienet is running.</p>
                <button 
                  onClick={() => initApi()} 
                  className="px-4 py-2 bg-polkadot-primary text-white rounded-md hover:bg-polkadot-secondary"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
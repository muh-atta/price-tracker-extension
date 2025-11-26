import React, { useState } from 'react';
import { Menu, X, ChevronLeft, Home, Tag, Settings } from 'lucide-react'; // Example icons

const mockWatchlist = [
  { id: 1, title: 'Laptop Charger Cable', price: 45.99, currency: 'USD', triggered: '40.00' },
  { id: 2, title: 'Mechanical Keyboard Kit', price: 120.00, currency: 'USD', triggered: '110.00' },
  { id: 3, title: 'Noise Cancelling Headphones', price: 299.00, currency: 'USD', triggered: '250.00' },
  { id: 4, title: 'Ergonomic Desk Chair', price: 450.00, currency: 'USD', triggered: '400.00' },
];

export default function WatchlistView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = isSidebarOpen ? 'w-64' : 'w-20';
  const mainContentMargin = isSidebarOpen ? 'ml-64' : 'ml-20';

  const NavItem = ({ Icon, label }) => (
    <div className="flex items-center p-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg cursor-pointer transition-colors duration-150">
      <Icon className="w-5 h-5 mr-3 shrink-0" />
      {isSidebarOpen && <span>{label}</span>}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* 1. HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-indigo-600 focus:outline-none mr-4">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Price Monitor Dashboard</h1>
        </div>
        <div className="text-sm text-gray-500">
          User: John Doe
        </div>
      </header>

      <div className="flex flex-1 pt-16"> 
        
        <aside 
          className={`fixed top-16 bottom-0 bg-white border-r border-gray-200 p-4 transition-all duration-300 ease-in-out ${sidebarWidth} z-20`}
        >
          <div className="flex justify-end mb-4">
            <button 
              onClick={toggleSidebar} 
              className="text-gray-400 hover:text-indigo-600 focus:outline-none transition-transform duration-300"
            >
              <ChevronLeft className={`w-5 h-5 ${isSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className="space-y-1">
            <NavItem Icon={Home} label="Dashboard" />
            <NavItem Icon={Tag} label="My Watchlist" />
            <NavItem Icon={Settings} label="Settings" />
          </nav>
        </aside>

        {/* DATA DISPLAY CONTENT */}
        <main className={`flex-1 p-6 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 My Tracked Items</h2>

          {/* Table Display */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price ({mockWatchlist[0]?.currency || 'USD'})
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Triggered At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockWatchlist.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.price <= item.triggered ? 'text-green-600' : 'text-red-500'}`}>
                      ${item.triggered}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {mockWatchlist.length === 0 && (
            <div className="p-10 text-center text-gray-500 border border-dashed rounded-lg mt-6">
              No items in your watchlist yet. Click 'Add Item' from the extension popup!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
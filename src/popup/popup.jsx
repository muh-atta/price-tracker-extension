import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tag, TrendingUp, Eye } from 'lucide-react';


export default function Popup() {

  const openSPA = (route) => {
    window.open(`index.html#${route}`, '_blank');
  };

  return (
    <div className="w-80 p-6 from-indigo-50 to-purple-50 bg-gradient-to-br border-t-4 border-indigo-600 relative rounded-lg">
      <div className="text-center mb-6">
        <div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md">
          <Tag className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">PriceTracker</h1>
        <p className="text-sm text-gray-600 mt-1">Track prices and save money</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Tracking</p>
              <p className="text-lg font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Saved</p>
              <p className="text-lg font-bold text-gray-900">$84.50</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-200 flex items-center justify-center"
          onClick={() => openSPA('/watchlist')}
        >
          <Eye className="w-5 h-5 mr-2" />
          View Dashboard
        </button>
      </div>

      <p className="text-xs text-center text-gray-500 mt-6">
        Track prices across your favorite stores
      </p>
    </div>
  );
}

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css'; // Keep this for any base/global styles if needed

// --- Floating Add Window Component ---
const AddWindow = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-72 transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Choose Action</h3>
        <div className="space-y-3">
          <button
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150"
            onClick={() => {
              // Action for Button 1
              alert('Button 1 Clicked!');
              onClose();
            }}
          >
            Monitor Product
          </button>
          <button
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-150"
            onClick={() => {
              // Action for Button 2
              alert('Button 2 Clicked!');
              onClose();
            }}
          >
            Add New Service
          </button>
        </div>
        <button
          className="mt-6 w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition duration-150"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// --- Main Popup Component ---
export default function Popup() {
  const [isAddWindowOpen, setIsAddWindowOpen] = useState(false);

  // Function to open the main single-page app (SPA) in a new tab
  const openSPA = (route) => {
    // You can keep this function if you still need it,
    // but the 'Add Item' button will now open the floating window first.
    window.open(`index.html#${route}`, '_blank');
  };

  return (
    // Set a fixed size for the popup container and use Tailwind classes
    <div className="w-80 p-5 bg-gray-50 border-t-4 border-indigo-600 relative">
      {/* Title Section: Centered */}
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
        Price Monitor
      </h1>
      <p className="text-sm text-center text-gray-500 mb-6">
        Track your items and watchlist easily!
      </p>

      {/* Button Group: Two buttons, centered */}
      <div className="flex flex-col space-y-3">
        <button
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
          onClick={() => setIsAddWindowOpen(true)} // Open the floating window
        >
          ➕ Add Item
        </button>
        <button
          className="w-full py-3 px-4 bg-white text-indigo-600 border-2 border-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
          onClick={() => openSPA('/watchlist')} // Example route for watchlist
        >
          👀 View Watchlist
        </button>
      </div>

      {/* Conditional Rendering for the Floating Window */}
      {isAddWindowOpen && (
        <AddWindow onClose={() => setIsAddWindowOpen(false)} />
      )}
    </div>
  );
}

// Render the popup (Keep this standard)
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
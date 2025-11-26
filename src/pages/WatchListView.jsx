import { useState, useEffect } from 'react';
import { Menu, X, Link2, ChevronLeft, Home, Tag, TrendingUp, Bell, Search, Plus, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const StatCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
        </p>
      </div>
      <div className="p-3 bg-indigo-50 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  </div>
);

export default function WatchlistView() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStore, setActiveStore] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const sidebarWidth = isSidebarOpen ? 'w-64' : 'w-20';
  const mainContentMargin = isSidebarOpen ? 'ml-64' : 'ml-20';

  // Extract store parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const storeParam = params.get('store');
    if (storeParam) {
      setActiveStore(storeParam.toLowerCase());
      setIsWatchlistOpen(true);
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleWatchlist = () => {
    setIsWatchlistOpen(!isWatchlistOpen);
  };

  const selectStore = (store) => {
    setActiveStore(store);
    // Update URL to reflect the selected store
    window.location.hash = `/watchlist?store=${store}`;
  };

  const [watchlist, setWatchlist] = useState({
    amazon: [],
    daraz: [],
    ebay: [],
    dhgate: [],
  });

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp; // difference in ms

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  };

  const [stats, setStats] = useState({
  trackedItems: 0,
  activeAlerts: 0,
  avgSavings: 0,
  thisMonth: 0,
});

useEffect(() => {
  const computeStats = () => {
    const allItems = [
      ...watchlist.amazon,
      ...watchlist.daraz,
      ...watchlist.ebay,
      ...watchlist.dhgate,
    ];

    const trackedItems = allItems.length;

    const activeAlerts = allItems.filter(item => item.price.price <= item.triggered).length;

    const alertItems = allItems.filter(item => item.price.price <= item.triggered);
    const avgSavings = alertItems.length
      ? alertItems.reduce((sum, item) => sum + (item.triggered - item.price.price), 0) / alertItems.length
      : 0;

    const now = new Date();
    const thisMonth = allItems
      .filter(item => {
        const added = new Date(item.addedAt);
        return added.getMonth() === now.getMonth() && added.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + (item.triggered - item.price.price), 0);

    setStats({
      trackedItems,
      activeAlerts,
      avgSavings,
      thisMonth,
    });
  };

  computeStats();
}, [watchlist]);

useEffect(() => {
    const fetchData = () => {
      chrome.storage.local.get(
        ["amazon_watchList", "daraz_watchList", "ebay_watchList", "dhgate_watchList"],
        (res) => {
          console.log(res)
          setWatchlist({
            amazon: res.amazon_watchList || [],
            daraz: res.daraz_watchList || [],
            ebay: res.ebay_watchList || [],
            dhgate: res.dhgate_watchList || [],
          });
        }
      );
    };

    fetchData();
    chrome.storage.onChanged.addListener(fetchData);
    return () => chrome.storage.onChanged.removeListener(fetchData);
  }, []);

  // Filter items based on active store
  let displayItems = [];
  if (activeStore) {
    displayItems = watchlist[activeStore] || [];
  } else {
    displayItems = [
      ...watchlist.amazon.map(item => ({
        ...item,
        store: "Amazon",
      })),
      ...watchlist.daraz.map(item => ({
        ...item,
        store: "Daraz",
      })),
      ...watchlist.ebay.map(item => ({
        ...item,
        store: "Ebay",
      })),
      ...watchlist.dhgate.map(item => ({
        ...item,
        store: "DHGate",
      })),
    ];
  }

  const filteredItems = displayItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.store?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NavItem = ({ Icon, label, isActive = false, hasDropdown = false, isDropdownOpen = false, onClick }) => (
    <div 
      className={`flex items-center p-3 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-150 ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-3 shrink-0" />
      {isSidebarOpen && (
        <>
          <span className="flex-1">{label}</span>
          {hasDropdown && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="text-gray-600 hover:text-indigo-600 focus:outline-none mr-4 p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {activeStore ? `${activeStore.charAt(0).toUpperCase() + activeStore.slice(1)} Watchlist` : "PriceTracker Dashboard"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
              JD
            </div>
            {isSidebarOpen && (
              <span className="ml-2 text-sm font-medium text-gray-700">John Doe</span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16"> 
        <aside 
          className={`fixed top-16 bottom-0 bg-white border-r border-gray-200 p-4 transition-all duration-300 ease-in-out ${sidebarWidth} z-20`}
        >
          <div className="flex justify-end mb-4">
            <button 
              onClick={toggleSidebar} 
              className="text-gray-400 hover:text-indigo-600 focus:outline-none transition-transform duration-300 p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className={`w-4 h-4 ${isSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className="space-y-1">
            <NavItem Icon={Home} label="Dashboard" isActive={!activeStore} onClick={() => {
              setActiveStore(null);
              window.location.hash = '/watchlist';
            }} />
            
            <div>
              <NavItem 
                Icon={Tag} 
                label="My Watchlist" 
                isActive={!!activeStore} 
                hasDropdown={true} 
                isDropdownOpen={isWatchlistOpen} 
                onClick={toggleWatchlist}
              />
              
              {isWatchlistOpen && isSidebarOpen && (
                <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                  <button
                    className={`w-full flex items-center p-2 text-sm rounded-lg transition-colors ${
                      activeStore === 'amazon' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                    onClick={() => selectStore('amazon')}
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                    Amazon
                  </button>
                  <button
                    className={`w-full flex items-center p-2 text-sm rounded-lg transition-colors ${
                      activeStore === 'daraz' 
                        ? 'bg-red-100 text-red-800' 
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                    }`}
                    onClick={() => selectStore('daraz')}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                    Daraz
                  </button>
                  <button
                    className={`w-full flex items-center p-2 text-sm rounded-lg transition-colors ${
                      activeStore === 'ebay' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    onClick={() => selectStore('ebay')}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    Ebay
                  </button>
                  <button
                    className={`w-full flex items-center p-2 text-sm rounded-lg transition-colors ${
                      activeStore === 'dhgate' 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                    onClick={() => selectStore('dhgate')}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    DHGate
                  </button>
                </div>
              )}
            </div>
            
            <NavItem Icon={TrendingUp} label="Price Alerts" />
          </nav>

          {isSidebarOpen && (
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeStore ? `${activeStore.charAt(0).toUpperCase() + activeStore.slice(1)} Items` : "Dashboard Overview"}
            </h2>
            <p className="text-gray-600 mt-1">
              {activeStore 
                ? `Showing items from ${activeStore.charAt(0).toUpperCase() + activeStore.slice(1)}` 
                : "Monitor your tracked items and price alerts"}
            </p>
          </div>

          {/* Stats Grid - only shown when no specific store is selected */}
          {!activeStore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Tracked Items" value={stats.trackedItems} change={12} icon={Tag} />
            <StatCard title="Active Alerts" value={stats.activeAlerts} change={-3} icon={Bell} />
            <StatCard title="Avg. Savings" value={`$${stats.avgSavings.toFixed(2)}`} change={8} icon={TrendingUp} />
            <StatCard title="This Month" value={`$${stats.thisMonth.toFixed(2)}`} change={15} icon={Home} />
            </div>
          )}

          {/* Watchlist Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeStore 
                  ? `${activeStore.charAt(0).toUpperCase() + activeStore.slice(1)} Tracked Items` 
                  : "All Tracked Items"}
              </h3>
              <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </button>
            </div>
            
            <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 table-fixed">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
      <th className="px-6 py-4 w-1/6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">View Product</th>
      {!activeStore && <th className="px-6 py-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>}
      <th className="px-6 py-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
      <th className="px-6 py-4 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Price</th>
      <th className="px-6 py-4 w-1/6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {filteredItems.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50 transition-colors">

        {/* Product */}
        <td className="px-6 py-4 max-w-sm overflow-hidden">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900 truncate" title={item.title}>
              {item.title}
            </div>
            <div className="text-sm text-gray-500">{getTimeAgo(item.addedAt)}</div>
          </div>
        </td>

        {/* View Product */}
        <td className="px-6 py-4 w-1/6 text-center">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center text-blue-600 hover:text-blue-800"
            title="View Product"
          >
            <Link2 className="w-4 h-4" />
          </a>
        </td>

        {/* Store - only shown when no specific store is selected */}
        {!activeStore && (
          <td className="px-6 py-4 w-1/6 overflow-hidden">
            <div className="text-sm text-gray-900 truncate" title={item.store}>
              {item.store}
            </div>
          </td>
        )}

        {/* Current Price */}
        <td className="px-6 py-4 w-1/6">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {item.price.symbol} {item.price.price.toFixed(2)}
          </div>
        </td>

        {/* Alert Price */}
        <td className={`px-6 py-4 w-1/6 text-sm font-medium truncate ${item.price.price <= item.triggered ? "text-green-600" : "text-orange-600"}`}>
          {item.triggered}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 w-1/6 text-center">
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </td>

      </tr>
    ))}
  </tbody>
</table>
</div>

            
            {filteredItems.length === 0 && (
              <div className="p-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeStore 
                    ? `No items found for ${activeStore.charAt(0).toUpperCase() + activeStore.slice(1)}. Try adding some items.` 
                    : "Try adjusting your search query"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
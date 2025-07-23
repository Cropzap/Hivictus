import React, { useState } from 'react';
import { FaDownload, FaPlus, FaBoxOpen, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTruck, FaShoppingCart, FaCalendarAlt, FaSearch } from 'react-icons/fa';

// Mock User Data
const currentUser = {
  name: 'Amanda',
  profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf267ddc?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

// Mock Order Data
const mockOrders = [
  {
    id: 'ORD001',
    date: '2025-07-15',
    status: 'Delivered',
    totalAmount: 1250.00,
    products: [
      { id: 'prodA', name: 'Organic Neem Cake Fertilizer', image: 'https://placehold.co/64x64/E0E0E0/333333?text=NEEM', qty: 1, price: 380.00 },
      { id: 'prodB', name: 'Hybrid Tomato Seeds', image: 'https://placehold.co/64x64/E0E0E0/333333?text=TOMATO', qty: 2, price: 99.00 },
      { id: 'prodC', name: 'Bio-Pesticide (Neem Oil Based)', image: 'https://placehold.co/64x64/E0E0E0/333333?text=PEST', qty: 1, price: 595.00 },
    ],
  },
  {
    id: 'ORD002',
    date: '2025-07-12',
    status: 'Processing',
    totalAmount: 4950.00,
    products: [
      { id: 'prodD', name: 'Drip Irrigation Kit (Small Farm)', image: 'https://placehold.co/64x64/E0E0E0/333333?text=DRIP', qty: 1, price: 4950.00 },
    ],
  },
  {
    id: 'ORD003',
    date: '2025-07-08',
    status: 'Shipped',
    totalAmount: 500.00,
    products: [
      { id: 'prodE', name: 'Organic Vermicompost', image: 'https://placehold.co/64x64/E0E0E0/333333?text=COMPOST', qty: 2, price: 250.00 },
    ],
  },
  {
    id: 'ORD004',
    date: '2025-07-01',
    status: 'Delivered',
    totalAmount: 720.00,
    products: [
      { id: 'prodF', name: 'Gardening Hand Tool Set', image: 'https://placehold.co/64x64/E0E0E0/333333?text=TOOLS', qty: 1, price: 720.00 },
    ],
  },
  {
    id: 'ORD005',
    date: '2025-06-25',
    status: 'Cancelled',
    totalAmount: 250.00,
    products: [
      { id: 'prodG', name: 'Coco Peat Blocks', image: 'https://placehold.co/64x64/E0E0E0/333333?text=COCO', qty: 2, price: 125.00 },
    ],
  },
];

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);

  const statusFilters = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled'];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearchTerm =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      activeStatusFilter === 'All' || order.status === activeStatusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  // Helper to get status badge styling
  const getStatusBadge = (status) => {
    let colorClass = '';
    let icon = null;
    switch (status) {
      case 'Delivered':
        colorClass = 'bg-emerald-100 text-emerald-700';
        icon = <FaCheckCircle className="inline mr-1" />;
        break;
      case 'Processing':
        colorClass = 'bg-yellow-100 text-yellow-700';
        icon = <FaHourglassHalf className="inline mr-1" />;
        break;
      case 'Shipped':
        colorClass = 'bg-blue-100 text-blue-700';
        icon = <FaTruck className="inline mr-1" />;
        break;
      case 'Cancelled':
        colorClass = 'bg-red-100 text-red-700';
        icon = <FaTimesCircle className="inline mr-1" />;
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-700';
        icon = <FaBoxOpen className="inline mr-1" />;
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {icon} {status}
      </span>
    );
  };

  const handleDownloadAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockOrders, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "all_orders.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setShowDownloadMessage(true);
    setTimeout(() => setShowDownloadMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl space-y-6">

        {/* Download Message */}
        {showDownloadMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold animate-fade-in-down z-50">
            Orders Downloaded Successfully!
          </div>
        )}

        {/* Top Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome, {currentUser.name}</h1>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={currentUser.profilePicture}
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E0E0E0/333333?text=U'; }}
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Track your past orders and their details.</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadAll}
              className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow-sm
                               transition-all duration-200 hover:bg-gray-300 active:scale-98 text-sm sm:text-base"
            >
              <FaDownload className="mr-2" /> Download All
            </button>
            <button className="flex-1 flex items-center justify-center bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md
                               transition-all duration-200 hover:bg-emerald-700 active:scale-98 text-sm sm:text-base">
              <FaPlus className="mr-2" /> New Order
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Filter Orders</h2>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter Tabs */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-medium mb-2">Filter by Status:</p>
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1">
              {statusFilters.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(status)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200
                              ${activeStatusFilter === status ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <h3 className="text-md sm:text-lg font-bold text-gray-900 flex items-center">
                    <FaBoxOpen className="mr-2 text-emerald-600 text-lg" /> Order ID: {order.id}
                  </h3>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order Details - Products */}
                <div className="space-y-3 mb-4">
                  {order.products.map(product => (
                    <div key={product.id} className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/E0E0E0/333333?text=${product.name.charAt(0)}`; }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800 font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {product.qty}</p>
                      </div>
                      <span className="text-gray-800 font-semibold text-sm ml-auto">₹{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer - Total Amount & Date */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-gray-700 font-bold text-base sm:text-lg">Total: ₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center">
                    <FaCalendarAlt className="mr-1.5 text-xs" /> {order.date}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-600">
              <p>No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
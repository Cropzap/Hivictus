import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaPlus, FaBoxOpen, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTruck, FaShoppingCart, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { Loader } from 'lucide-react'; // For loading spinner

const OrderHistory = () => {
  const navigate = useNavigate();

  // State for real data
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering and UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  // Fetch data on component mount
  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view your order history.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        // Fetch both profile and orders in parallel for efficiency
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`, {
            headers: { 'x-auth-token': token },
          }),
          fetch(`${API_BASE_URL}/orders`, {
            headers: { 'x-auth-token': token },
          }),
        ]);

        if (!profileRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();

        // Use the correct field for the user's name from your profile data
        setUser({
          name: profileData?.name || profileData?.user?.name || 'User',
          profilePicture: profileData.profilePicture || 'https://placehold.co/40x40/E0E0E0/333333?text=U'
        });

        setOrders(ordersData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [navigate]);

  const statusFilters = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Pending'];

  const filteredOrders = orders.filter(order => {
    const matchesSearchTerm =
      (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.items && order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));

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
      default: // Covers 'Pending' and any other status
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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "all_orders.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setShowDownloadMessage(true);
    setTimeout(() => setShowDownloadMessage(false), 3000);
  };
  
  // Loading State
  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
    );
  }

  // Error State
  if (error) {
    return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center text-center p-4">
            <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700">An Error Occurred</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
                onClick={() => navigate('/login')}
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
            >
                Go to Login
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={user?.profilePicture}
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E0E0E0/333333?text=U'; }}
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Track your past orders and their details.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadAll}
              className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-300 active:scale-98 text-sm sm:text-base"
            >
              <FaDownload className="mr-2" /> Download All
            </button>
            <button onClick={() => navigate('/products')} className="flex-1 flex items-center justify-center bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200 hover:bg-emerald-700 active:scale-98 text-sm sm:text-base">
              <FaShoppingCart className="mr-2" /> New Order
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Filter Orders</h2>
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
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-medium mb-2">Filter by Status:</p>
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1">
              {statusFilters.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(status)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${activeStatusFilter === status ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
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
              <div key={order._id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <h3 className="text-md sm:text-lg font-bold text-gray-900 flex items-center">
                    <FaBoxOpen className="mr-2 text-emerald-600 text-lg" /> Order ID: {order._id}
                  </h3>
                  {getStatusBadge(order.status)}
                </div>
                <div className="space-y-3 mb-4">
                  {order.items.map(item => ( // Changed from order.products to order.items
                    <div key={item._id} className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={item.imageUrl || 'https://placehold.co/48x48'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800 font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-gray-800 font-semibold text-sm ml-auto">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-gray-700 font-bold text-base sm:text-lg">Total: ₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center">
                    <FaCalendarAlt className="mr-1.5 text-xs" /> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-600">
              <FaShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold">No Orders Yet</h3>
              <p>You haven't placed any orders. Let's change that!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
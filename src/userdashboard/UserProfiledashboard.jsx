import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaDollarSign, FaHistory, FaUserCircle, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaEdit, FaStore, FaSpinner, FaFileAlt, FaQuestionCircle, FaTicketAlt, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// The API URLs for your backend routes.
const ORDERS_API_URL = `${import.meta.env.VITE_API_URL}/orders`; 
const PROFILE_API_URL = `${import.meta.env.VITE_API_URL}/profile`; 
const SELLER_API_URL = `${import.meta.env.VITE_API_URL}/sellerprofile`; 
const TICKETS_API_URL = `${import.meta.env.VITE_API_URL}/support-tickets`;

// A simple utility to simulate a delay for better UX in a loading state.
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * MetricCard Component
 * Displays a single metric with an icon, title, and value.
 * @param {object} props - The component props.
 * @param {React.ComponentType} props.icon - The icon component to display.
 * @param {string} props.title - The title of the metric.
 * @param {string|number} props.value - The value of the metric.
 * @param {string} props.colorClass - The Tailwind CSS class for the background color of the icon.
 */
const MetricCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-start justify-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className={`p-3 rounded-xl ${colorClass} text-white mb-3`}>
      <Icon className="text-xl sm:text-2xl" />
    </div>
    <p className="text-gray-700 text-sm font-medium">{title}</p>
    <h3 className="text-gray-900 text-3xl font-bold mt-1">{value}</h3>
  </div>
);

/**
 * OrderPriceChart Component
 * Displays a bar chart of the total amount for each order.
 * @param {object} props - The component props.
 * @param {Array<object>} props.orders - The list of order objects.
 */
const OrderPriceChart = ({ orders }) => {
  // Format data for the chart, using truncated order IDs for the X-axis
  const chartData = orders.map(order => ({
    name: `Order ${order._id.substring(0, 5)}...`,
    'Total Amount': order.totalAmount,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Order Value Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total Amount" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * OrderDetailsModal Component
 * A modal to display detailed information about a single order.
 * @param {object} props - The component props.
 * @param {object} props.order - The order object to display.
 * @param {Function} props.onClose - Function to call to close the modal.
 */
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // Format the date for better readability
  const formattedDate = new Date(order.createdAt).toLocaleString();

  // A helper function to close the modal
  const handleClose = (e) => {
    // Only close if clicking the close button or the backdrop
    if (e.target === e.currentTarget || e.target.closest('button')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-all duration-300" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FaTimesCircle className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Order ID</p>
            <p className="text-md font-semibold text-gray-900">{order._id}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Order Date</p>
            <p className="text-md font-semibold text-gray-900">{formattedDate}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Seller</p>
            <p className="text-md font-semibold text-gray-900">{order.sellerDetails?.sellerName || 'N/A'}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <p className="text-md font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Products List */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Products</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * TicketDetailsModal Component
 * A modal to display detailed information about a single support ticket.
 * @param {object} props - The component props.
 * @param {object} props.ticket - The ticket object to display.
 * @param {Function} props.onClose - Function to call to close the modal.
 */
const TicketDetailsModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  // Function to get a color for the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget || e.target.closest('button')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-all duration-300" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <FaTimesCircle className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Ticket Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Ticket ID</p>
            <p className="text-md font-semibold text-gray-900">{ticket.ticketId}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-md font-semibold text-white px-2 py-1 rounded-full text-center ${getStatusColor(ticket.status)}`}>
                {ticket.status}
            </p>
          </div>
          <div className="flex flex-col col-span-2">
            <p className="text-sm font-medium text-gray-500">Subject</p>
            <p className="text-md font-semibold text-gray-900">{ticket.subject}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p className="text-md font-semibold text-gray-900">{ticket.category}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Order ID</p>
            <p className="text-md font-semibold text-gray-900">{ticket.orderId || 'N/A'}</p>
          </div>
        </div>
        
        {/* Description and Replies */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">{ticket.description}</p>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">Replies ({ticket.replies.length})</h3>
        <div className="space-y-4 max-h-60 overflow-y-auto">
            {ticket.replies.length > 0 ? (
                ticket.replies.map((reply, index) => (
                    <div key={index} className="p-4 rounded-xl shadow-sm bg-blue-50 border-l-4 border-blue-200">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-blue-800">{reply.userName}</span>
                            <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.message}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No replies yet.</p>
            )}
        </div>
      </div>
    </div>
  );
};


/**
 * UserProfileDashboard Component
 * The main component for the buyer's dashboard.
 */
const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); 
  
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Placeholder for the user's initial state
  const placeholderUser = {
      name: 'Loading...',
      profilePicture: 'https://placehold.co/64x64/E0E0E0/333333?text=U',
      role: 'Customer',
      id: null,
  };

  // Function to open the order details modal
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };
  
  // Function to close the order details modal
  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
  };

  // Function to open the ticket details modal
  const handleViewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  // Function to close the ticket details modal
  const handleCloseTicketModal = () => {
    setSelectedTicket(null);
    setIsTicketModalOpen(false);
  };
  
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    navigate('/'); // Redirect to the homepage or login page
  };

  // Main effect to fetch user profile data once
  useEffect(() => {
    const fetchUserProfile = async () => {
      setError(null);
      
      const userToken = localStorage.getItem('authToken');

      if (!userToken) {
        setError("You must log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const profileResponse = await fetch(PROFILE_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': userToken,
          },
        });
        
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.msg || "Failed to fetch user profile.");
        }
        const profileData = await profileResponse.json();
        setUser({
          ...placeholderUser,
          name: profileData.name,
          profilePicture: profileData.profilePicture || placeholderUser.profilePicture,
          role: profileData.role || placeholderUser.role,
          id: profileData._id,
        });

      } catch (err) {
        console.error("User profile fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Effect to fetch orders when the component mounts or the activeTab changes to 'orders'
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        const userToken = localStorage.getItem('authToken');
        if (!userToken) return;

        try {
          const ordersResponse = await fetch(ORDERS_API_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': userToken,
            },
          });
  
          if (!ordersResponse.ok) {
            const errorData = await ordersResponse.json();
            throw new Error(errorData.msg || "Failed to fetch orders.");
          }
          const ordersData = await ordersResponse.json();
          
          const sellerIds = [...new Set(ordersData.map(order => order.seller).filter(id => typeof id === 'string'))];
          const sellerPromises = sellerIds.map(async (sellerId) => {
            try {
              const sellerResponse = await fetch(`${SELLER_API_URL}/${sellerId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              });
              if (!sellerResponse.ok) {
                return { id: sellerId, name: 'N/A' };
              }
              const sellerData = await sellerResponse.json();
              const sellerName = sellerData && (sellerData.sellerName || sellerData.companyName) ? (sellerData.sellerName || sellerData.companyName) : 'Unknown Seller';
              return { id: sellerId, name: sellerName };
            } catch (err) {
              console.error(`Error fetching seller ${sellerId}:`, err);
              return { id: sellerId, name: 'N/A' };
            }
          });
  
          const sellers = await Promise.all(sellerPromises);
          const newSellerNames = sellers.reduce((acc, seller) => {
            acc[seller.id] = seller.name;
            return acc;
          }, {});
  
          const ordersWithSellerNames = ordersData.map(order => ({
            ...order,
            sellerDetails: {
              sellerName: newSellerNames[order.seller] || 'N/A',
            },
          }));
  
          setOrders(ordersWithSellerNames);
        } catch (err) {
          console.error("Orders fetch error:", err.message);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  // Effect to fetch support tickets when the component mounts or the activeTab changes to 'supportTickets'
  useEffect(() => {
    if (activeTab === 'supportTickets') {
        const fetchTickets = async () => {
            setLoadingTickets(true);
            const userToken = localStorage.getItem('authToken');
            if (!userToken) return;

            try {
                const ticketsResponse = await fetch(TICKETS_API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userToken,
                    },
                });

                if (!ticketsResponse.ok) {
                    const errorData = await ticketsResponse.json();
                    throw new Error(errorData.msg || "Failed to fetch support tickets.");
                }

                const ticketsData = await ticketsResponse.json();
                setTickets(ticketsData);
            } catch (err) {
                console.error("Tickets fetch error:", err.message);
            } finally {
                setLoadingTickets(false);
            }
        };
        fetchTickets();
    }
  }, [activeTab]);

  const totalOrders = orders.length;
  const totalAmountPaid = orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2);
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  
  const lastActivities = [
    { id: 1, text: 'Order #ORD001 delivered', status: 'success' },
    { id: 2, text: 'New item added to wishlist', status: 'info' },
    { id: 3, text: 'Review submitted for Hybrid Tomato Seeds', status: 'success' },
  ];

  const profileName = user ? user.name : placeholderUser.name;
  const profileImage = user ? user.profilePicture : placeholderUser.profilePicture;
  const profileRole = user ? user.role : placeholderUser.role;

  // A helper function to get a status-based color class
  const getStatusColor = (status) => {
    switch (status) {
        case 'Open': return 'bg-red-100 text-red-700 border-red-200';
        case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
        case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // The main dashboard UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 mt-16 font-sans">
      {/* Modals */}
      {isOrderModalOpen && <OrderDetailsModal order={selectedOrder} onClose={handleCloseOrderModal} />}
      {isTicketModalOpen && <TicketDetailsModal ticket={selectedTicket} onClose={handleCloseTicketModal} />}

      <div className="w-full max-w-screen-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (User Profile & Navigation) */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <div className="flex justify-between items-start mb-4">
              {/* Profile details */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                  <img 
                    src={profileImage} 
                    alt="User Profile" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/E0E0E0/333333?text=U'; }} 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profileName}</h2>
                  <p className="text-gray-600 text-sm">{profileRole}</p>
                </div>
              </div>
              {/* Icon-only buttons */}
              <div className="flex space-x-2">
                <Link 
                  to="/user" 
                  className="p-2 rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition-colors duration-200"
                  aria-label="View Profile"
                >
                  <FaUserCircle className="text-lg" />
                </Link>
                <Link 
                  to="/user/edit" 
                  className="p-2 rounded-full bg-gray-200 text-gray-700 shadow-md hover:bg-gray-300 transition-colors duration-200"
                  aria-label="Edit Profile"
                >
                  <FaEdit className="text-lg" />
                </Link>
              </div>
            </div>
          </div>

          {/* New Navigation Menu */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center w-full px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 ${activeTab === 'overview' ? 'bg-gray-100 text-emerald-600' : ''}`}
              >
                <FaHistory className="mr-3 text-lg" />
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center w-full px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 ${activeTab === 'orders' ? 'bg-gray-100 text-emerald-600' : ''}`}
              >
                <FaShoppingCart className="mr-3 text-lg" />
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('supportTickets')}
                className={`flex items-center w-full px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 ${activeTab === 'supportTickets' ? 'bg-gray-100 text-emerald-600' : ''}`}
              >
                <FaTicketAlt className="mr-3 text-lg" />
                Support Tickets
              </button>
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3 text-lg text-red-500" />
                Logout
              </button>
            </nav>
          </div> */}
          {/* New Navigation Menu */}
          <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
            <nav className="space-y-2">
              <Link 
                to="/orders" 
                className="flex items-center px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaShoppingCart className="mr-3 text-lg text-emerald-600" />
                Orders
              </Link>
              <Link 
                to="/support" 
                className="flex items-center px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaTicketAlt className="mr-3 text-lg text-emerald-600" />
                Support Tickets
              </Link>
              <Link 
                to="/terms-and-conditions" 
                className="flex items-center px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaFileAlt className="mr-3 text-lg text-emerald-600" />
                Terms & Conditions
              </Link>
              <Link 
                to="/faq" 
                className="flex items-center px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaQuestionCircle className="mr-3 text-lg text-emerald-600" />
                FAQ
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3 text-lg text-red-500" />
                Logout
              </button>
            </nav>
          </div>

          {/* Last Activities section from original code */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Last Activities</h2>
              <a href="#" className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm transition-colors">See All</a>
            </div>
            <div className="space-y-3">
              {lastActivities.map(activity => (
                <div key={activity.id} className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
                  {activity.status === 'success' && <FaCheckCircle className="text-emerald-500 mr-3 flex-shrink-0 text-lg" />}
                  {activity.status === 'error' && <FaTimesCircle className="text-red-500 mr-3 flex-shrink-0 text-lg" />}
                  {activity.status === 'info' && <FaInfoCircle className="text-blue-500 mr-3 flex-shrink-0 text-lg" />}
                  <p className="text-gray-800 text-sm flex-grow">{activity.text}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Column (Main Content Area - Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-2 w-full">
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 ${activeTab === 'overview' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`} 
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 ${activeTab === 'orders' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`} 
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('supportTickets')} 
                className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 ${activeTab === 'supportTickets' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`} 
              >
                Support Tickets
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 pt-0 animate-fade-in">
              {(loading || loadingOrders || loadingTickets) && (
                <div className="text-center p-8 flex flex-col items-center justify-center">
                    <FaSpinner className="text-4xl text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
              )}
              {error && (
                <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg border-2 border-red-200">
                    <p className="font-semibold mb-2">Error!</p>
                    <p>{error}</p>
                </div>
              )}

              {!loading && !error && activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCard 
                      icon={FaShoppingCart} 
                      title="Total Orders" 
                      value={totalOrders} 
                      colorClass="bg-emerald-500" 
                    />
                    <MetricCard 
                      icon={FaDollarSign} 
                      title="Total Amount Paid" 
                      value={`₹${totalAmountPaid}`} 
                      colorClass="bg-emerald-500" 
                    />
                    <MetricCard 
                      icon={FaTicketAlt} 
                      title="Total Tickets" 
                      value={totalTickets} 
                      colorClass="bg-emerald-500" 
                    />
                    <MetricCard 
                      icon={FaInfoCircle} 
                      title="Open Tickets" 
                      value={openTickets} 
                      colorClass="bg-emerald-500" 
                    />
                  </div>
                  {/* Order Price Chart for Overview Tab */}
                  {orders.length > 0 && <OrderPriceChart orders={orders} />}
                </div>
              )}

              {!loading && !error && activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaHistory className="mr-3 text-emerald-600" /> Your Latest Orders
                  </h2>
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders.map((order, index) => (
                        <div key={order._id || index} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-sm font-medium text-gray-500">Order ID: <span className="font-semibold text-gray-900">{order._id.substring(0, 8)}...</span></h3>
                              <p className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                                {order.status}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-4">
                              <FaStore className="text-gray-500" />
                              <p className="text-sm font-medium text-gray-700">
                                Seller: <span className="font-semibold">{order.sellerDetails?.sellerName || 'N/A'}</span>
                              </p>
                            </div>
                            
                            <ul className="space-y-2">
                              {order.items.slice(0, 2).map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-semibold text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-500 mt-2 ml-10">+{order.items.length - 2} more items</p>
                              )}
                            </ul>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-md font-bold text-gray-900">
                              Total: ₹{order.totalAmount.toFixed(2)}
                            </p>
                            <button 
                              onClick={() => handleViewOrderDetails(order)} 
                              className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-emerald-600 transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <p className="text-gray-500 font-medium">You have no orders yet.</p>
                    </div>
                  )}
                </div>
              )}
              
              {!loading && !error && activeTab === 'supportTickets' && (
                <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FaTicketAlt className="mr-3 text-emerald-600" /> Your Support Tickets
                    </h2>
                    {tickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tickets.map(ticket => (
                                <div key={ticket._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-gray-200 hover:shadow-xl transition-all duration-300">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium text-gray-500">
                                            Ticket ID: <span className="font-semibold text-gray-900">{ticket.ticketId}</span>
                                        </p>
                                        <p className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </p>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{ticket.subject}</h3>
                                    <p className="text-sm text-gray-600 mb-4">Category: {ticket.category}</p>
                                    <p className="text-sm text-gray-800 line-clamp-2">{ticket.description}</p>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <button 
                                      onClick={() => handleViewTicketDetails(ticket)} 
                                      className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-emerald-600 transition-colors duration-200"
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <p className="text-gray-500 font-medium">You have no support tickets yet.</p>
                        </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UserProfileDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaBoxOpen, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTruck, FaShoppingCart, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { Loader, Package, DollarSign } from 'lucide-react'; 

// --- Helper Functions (Updated for aesthetic consistency) ---
const statusFilters = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Pending'];

const getStatusBadge = (status) => {
    let colorClass = '';
    let icon = null;
    switch (status) {
        case 'Delivered':
            colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-300';
            icon = <FaCheckCircle className="inline mr-1" />;
            break;
        case 'Processing':
            colorClass = 'bg-amber-50 text-amber-700 border-amber-300';
            icon = <FaHourglassHalf className="inline mr-1" />;
            break;
        case 'Shipped':
            colorClass = 'bg-blue-50 text-blue-700 border-blue-300';
            icon = <FaTruck className="inline mr-1" />;
            break;
        case 'Cancelled':
            colorClass = 'bg-red-50 text-red-700 border-red-300';
            icon = <FaTimesCircle className="inline mr-1" />;
            break;
        default: // Covers 'Pending'
            colorClass = 'bg-gray-50 text-gray-700 border-gray-300';
            icon = <FaBoxOpen className="inline mr-1" />;
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {icon} {status}
        </span>
    );
};

const handleDownloadAll = (orders, setShowDownloadMessage) => {
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
// -----------------------------------------------------------


// Component for the Product Details Sidebar
const OrderDetailsSidebar = ({ selectedOrder }) => {
    if (!selectedOrder) {
        return (
            <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 sticky top-6 h-[calc(100vh-48px)] flex items-center justify-center text-center transition-all duration-300">
                <div className="text-gray-400">
                    <Package className="mx-auto w-12 h-12 mb-4 text-emerald-400" />
                    <p className="font-semibold text-xl text-gray-600">Order Details View</p>
                    <p className="text-sm mt-2">Select an order on the left to see its comprehensive product breakdown here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">
                Order ID: <span className="font-mono text-base font-semibold text-emerald-600 break-all">{selectedOrder._id.substring(0, 15)}...</span>
            </h2>

            {/* Status & Date */}
            <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-xl">
                <div>
                    <p className="text-sm font-medium text-gray-600">Status:</p>
                    {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 flex items-center justify-end">
                        <FaCalendarAlt className="mr-1.5 text-xs" /> Placed On:
                    </p>
                    <span className="text-gray-900 font-semibold text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-emerald-600" /> Purchased Items
            </h3>
            
            {/* Product List */}
            <div className="space-y-4 border-b pb-4">
                {selectedOrder.items.map(item => (
                    <div key={item._id} className="flex items-start p-3 bg-white border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-gray-100">
                            <img
                                src={item.imageUrl || 'https://placehold.co/64x64'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="text-gray-900 font-bold text-base line-clamp-2">{item.name}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> | @ ₹{item.price.toFixed(2)}
                            </p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                             <p className="text-emerald-600 font-extrabold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900 p-4 bg-emerald-100 rounded-xl shadow-lg">
                    <span className='flex items-center text-emerald-800'><DollarSign className="w-6 h-6 mr-2" /> Grand Total:</span>
                    <span className="text-3xl text-emerald-700">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};


const OrderHistoryDesktop = () => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL; // If you want to use models other than gemini-2.5-flash-preview-09-2025 or imagen-4.0-generate-001, provide an API key here. Otherwise, leave this as-is.

    // --- State and Logic ---
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusFilter, setActiveStatusFilter] = useState('All');
    const [showDownloadMessage, setShowDownloadMessage] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('You must be logged in to view your order history.');
                setLoading(false);
                // navigate('/login'); // Commented out to prevent immediate navigation in sandboxed env
                return;
            }

            // Mock Data Structure (replace with actual fetch on success)
            const mockOrders = [
                { _id: 'ORD001234567', status: 'Delivered', totalAmount: 1245.50, createdAt: new Date(Date.now() - 86400000 * 5), items: [{ _id: 'P1', name: 'Premium Coffee Beans - Medium Roast', quantity: 2, price: 500.00, imageUrl: 'https://placehold.co/64x64/3B82F6/FFFFFF?text=CB' }, { _id: 'P2', name: 'Stainless Steel Travel Mug', quantity: 1, price: 245.50, imageUrl: 'https://placehold.co/64x64/EF4444/FFFFFF?text=TM' }] },
                { _id: 'ORD001234568', status: 'Processing', totalAmount: 789.90, createdAt: new Date(Date.now() - 86400000 * 2), items: [{ _id: 'P3', name: 'Organic Green Tea Bags (200 ct)', quantity: 3, price: 263.30, imageUrl: 'https://placehold.co/64x64/10B981/FFFFFF?text=GT' }] },
                { _id: 'ORD001234569', status: 'Shipped', totalAmount: 4500.00, createdAt: new Date(Date.now() - 86400000 * 10), items: [{ _id: 'P4', name: 'Espresso Machine - Pro Series', quantity: 1, price: 4500.00, imageUrl: 'https://placehold.co/64x64/F97316/FFFFFF?text=EM' }] },
                { _id: 'ORD001234570', status: 'Cancelled', totalAmount: 150.00, createdAt: new Date(Date.now() - 86400000 * 1), items: [{ _id: 'P5', name: 'Milk Frother Handheld', quantity: 1, price: 150.00, imageUrl: 'https://placehold.co/64x64/6366F1/FFFFFF?text=MF' }] },
            ];
            const mockUser = { name: 'Alex Johnson', profilePicture: 'https://placehold.co/40x40/10B981/FFFFFF?text=AJ' };


            try {
                // Assuming successful fetch, replace mock data:
                // const [profileRes, ordersRes] = await Promise.all([... fetches ...]);
                // ...
                // setOrders(ordersData);
                // setUser({ name: profileData?.name || 'User', profilePicture: profileData.profilePicture });
                setOrders(mockOrders);
                setUser(mockUser);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate, API_BASE_URL]);

    const filteredOrders = orders.filter(order => {
        const matchesSearchTerm =
            (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.items && order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus =
            activeStatusFilter === 'All' || order.status === activeStatusFilter;

        return matchesSearchTerm && matchesStatus;
    });

    useEffect(() => {
        if (filteredOrders.length > 0 && (!selectedOrder || !filteredOrders.find(o => o._id === selectedOrder._id))) {
            setSelectedOrder(filteredOrders[0]);
        } else if (filteredOrders.length === 0) {
            setSelectedOrder(null);
        }
    }, [filteredOrders, selectedOrder]);


    // --- Render States ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center text-center p-4">
                <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-700">An Error Occurred</h2>
                <p className="text-red-600 mt-2">{error}</p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-red-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // Simplified Order Card for the List View
    const OrderCard = ({ order, isSelected, onClick }) => (
        <div 
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-[.99] ${isSelected ? 'bg-emerald-50 shadow-lg border-2 border-emerald-500' : 'bg-white shadow-md border border-gray-100 hover:shadow-lg hover:border-emerald-200'}`}
            onClick={() => onClick(order)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-md font-bold text-gray-900 flex flex-col">
                    Order ID: <span className="font-mono text-xs font-semibold text-gray-600">{order._id}</span>
                </h3>
                {getStatusBadge(order.status)}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="text-gray-700 font-extrabold text-xl">
                    ₹{order.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">{order.items.length} item(s)</p>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto flex gap-6">
                
                {/* Download Message */}
                {showDownloadMessage && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-xl text-base font-semibold animate-fade-in-down z-50">
                        Orders Downloaded Successfully!
                    </div>
                )}

                {/* Left Section: Filters & Order List (70%) */}
                <div className="w-8/12 space-y-6">

                    {/* Top Header Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 flex justify-between items-center border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Order History</h1>
                            <p className="text-gray-600 text-sm mt-1">Hello, **{user?.name}**! Track your past orders.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDownloadAll(orders, setShowDownloadMessage)}
                                className="flex items-center bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-300 active:scale-98 text-sm font-medium"
                            >
                                <FaDownload className="mr-2" /> Download All
                            </button>
                            <button 
                                onClick={() => navigate('/products')} 
                                className="flex items-center bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-200 hover:bg-emerald-700 active:scale-98 text-sm font-medium"
                            >
                                <FaShoppingCart className="mr-2" /> New Order
                            </button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Product Name..."
                                className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-base transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-2">
                                {statusFilters.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setActiveStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeStatusFilter === status ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
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
                                <OrderCard 
                                    key={order._id} 
                                    order={order} 
                                    isSelected={selectedOrder && selectedOrder._id === order._id}
                                    onClick={setSelectedOrder}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-600">
                                <FaShoppingCart className="mx-auto text-5xl text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold">No Matching Orders</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Order Details (30%) */}
                <div className="w-4/12">
                    <OrderDetailsSidebar selectedOrder={selectedOrder} />
                </div>

            </div>
        </div>
    );
};

export default OrderHistoryDesktop;
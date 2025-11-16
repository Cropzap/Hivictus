import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Loader, Package, DollarSign, Download, PackageOpen, 
    CheckCircle, Hourglass, XCircle, Truck, ShoppingCart, 
    Calendar, Search, ChevronLeft, ArrowRight 
} from 'lucide-react';

// --- Helper Functions (Updated for aesthetic consistency) ---
const statusFilters = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Pending'];

const getStatusBadge = (status) => {
    let colorClass = '';
    let IconComponent = PackageOpen;
    switch (status) {
        case 'Delivered':
            colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-400';
            IconComponent = CheckCircle;
            break;
        case 'Processing':
            colorClass = 'bg-amber-100 text-amber-700 border-amber-400';
            IconComponent = Hourglass;
            break;
        case 'Shipped':
            colorClass = 'bg-blue-100 text-blue-700 border-blue-400';
            IconComponent = Truck;
            break;
        case 'Cancelled':
            colorClass = 'bg-red-100 text-red-700 border-red-400';
            IconComponent = XCircle;
            break;
        default: // Covers 'Pending'
            colorClass = 'bg-gray-100 text-gray-700 border-gray-400';
            IconComponent = PackageOpen;
    }
    return (
        <span className={`px-2 py-0.5 rounded-xl text-xs font-semibold border flex items-center ${colorClass}`}>
            <IconComponent className="w-3 h-3 mr-1" /> {status}
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


// Component for viewing individual order details
const OrderDetailView = ({ order, onBack }) => (
    <div className="h-full bg-white fixed inset-0 z-40 overflow-y-auto p-4 transition-transform duration-300 transform translate-x-0 font-sans">
        {/* Header/App Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 -mx-4 px-4 pt-4 shadow-sm">
            <button onClick={onBack} className="text-emerald-600 flex items-center p-2 rounded-full hover:bg-gray-100 active:bg-gray-200">
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="font-semibold text-sm">Back</span>
            </button>
            <h2 className="text-xl font-extrabold text-gray-900">Order Details</h2>
            <div className='w-12'>{getStatusBadge(order.status)}</div>
        </div>

        <div className="space-y-6 mt-4">
            {/* Order Summary Card */}
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Order ID:</p>
                <p className="font-mono text-base font-semibold text-gray-900 break-all mb-4 border-b pb-3">{order._id}</p>
                
                <div className="flex justify-between items-center">
                     <p className="text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5 text-emerald-500" /> Placed On:
                    </p>
                    <span className="text-gray-900 text-sm font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-emerald-600" /> Purchased Items
                </h3>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item._id} className="flex items-center p-3 border-b last:border-b-0 border-gray-100">
                            <div className="w-14 h-14 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200">
                                <img
                                    src={item.imageUrl || 'https://placehold.co/56x56'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/56x56/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-900 font-semibold text-sm line-clamp-2">{item.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">Qty: <span className='font-medium text-gray-700'>{item.quantity}</span></p>
                            </div>
                            <span className="text-emerald-600 font-extrabold text-lg ml-auto">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                    <span>TOTAL:</span>
                    <span className='text-3xl'>₹{order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
);


const OrderHistoryMobile = () => {
    const navigate = useNavigate();
    const API_BASE_URL = ''; // If you want to use models other than gemini-2.5-flash-preview-09-2025 or imagen-4.0-generate-001, provide an API key here. Otherwise, leave this as-is.

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
                { _id: 'ORD001234567', status: 'Delivered', totalAmount: 1245.50, createdAt: new Date(Date.now() - 86400000 * 5), items: [{ _id: 'P1', name: 'Premium Coffee Beans - Medium Roast', quantity: 2, price: 500.00, imageUrl: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=CB' }, { _id: 'P2', name: 'Stainless Steel Travel Mug', quantity: 1, price: 245.50, imageUrl: 'https://placehold.co/40x40/EF4444/FFFFFF?text=TM' }] },
                { _id: 'ORD001234568', status: 'Processing', totalAmount: 789.90, createdAt: new Date(Date.now() - 86400000 * 2), items: [{ _id: 'P3', name: 'Organic Green Tea Bags (200 ct)', quantity: 3, price: 263.30, imageUrl: 'https://placehold.co/40x40/10B981/FFFFFF?text=GT' }] },
                { _id: 'ORD001234569', status: 'Shipped', totalAmount: 4500.00, createdAt: new Date(Date.now() - 86400000 * 10), items: [{ _id: 'P4', name: 'Espresso Machine - Pro Series', quantity: 1, price: 4500.00, imageUrl: 'https://placehold.co/40x40/F97316/FFFFFF?text=EM' }] },
                { _id: 'ORD001234570', status: 'Cancelled', totalAmount: 150.00, createdAt: new Date(Date.now() - 86400000 * 1), items: [{ _id: 'P5', name: 'Milk Frother Handheld', quantity: 1, price: 150.00, imageUrl: 'https://placehold.co/40x40/6366F1/FFFFFF?text=MF' }] },
            ];
            const mockUser = { name: 'Alex Johnson', profilePicture: 'https://placehold.co/40x40/10B981/FFFFFF?text=AJ' };


            try {
                // Assuming successful fetch, replace mock data:
                // ...
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
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
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

    if (selectedOrder) {
        return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    // Order Card component for Mobile List
    const MobileOrderCard = ({ order, onClick }) => (
        <div 
            className="bg-white rounded-xl shadow-lg p-4 active:shadow-xl active:bg-gray-50 transition-all duration-150 border border-gray-100 cursor-pointer"
            onClick={() => onClick(order)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-md font-bold text-gray-900">
                    Order ID: <span className="font-mono text-xs font-semibold text-gray-600">{order._id.substring(0, 10)}...</span>
                </h3>
                {getStatusBadge(order.status)}
            </div>

            {/* Product Image Strip */}
            <div className="flex overflow-x-auto space-x-2 pb-3 mb-3 border-b border-gray-100 scrollbar-hide">
                {order.items.slice(0, 5).map(item => (
                    <div key={item._id} className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                            src={item.imageUrl || 'https://placehold.co/48x48'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                        />
                    </div>
                ))}
                {order.items.length > 5 && (
                     <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                        +{order.items.length - 5}
                    </div>
                )}
            </div>

            {/* Footer Details */}
            <div className="flex justify-between items-center">
                <p className="text-gray-900 font-extrabold text-xl text-emerald-600">
                    ₹{order.totalAmount.toFixed(2)}
                </p>
                <div className='flex items-center text-sm text-gray-500 font-medium'>
                    <Calendar className="w-3 h-3 mr-1" /> 
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <ArrowRight className='ml-3 w-3 h-3 text-gray-400' />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans max-w-xl mx-auto">
            
            {/* Download Message */}
            {showDownloadMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-xl text-base font-semibold animate-fade-in-down z-50">
                    Orders Downloaded!
                </div>
            )}

            {/* Top Header/App Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
                 <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-extrabold text-gray-900">Order History</h1>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
                        <img
                            src={user?.profilePicture}
                            alt="User Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E0E0E0/333333?text=U'; }}
                        />
                    </div>
                 </div>

                {/* Action Buttons */}
                <div className="flex gap-3 text-sm">
                    <button
                        onClick={() => handleDownloadAll(orders, setShowDownloadMessage)}
                        className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-300 active:scale-98 font-semibold"
                    >
                        <Download className="w-4 h-4 mr-2" /> Download
                    </button>
                    <button 
                        onClick={() => navigate('/products')} 
                        className="flex-1 flex items-center justify-center bg-emerald-600 text-white px-3 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-emerald-700 active:scale-98 font-semibold"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" /> New Order
                    </button>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search Order ID or Product..."
                    className="w-full p-3 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-base transition-colors shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Status Filters - Swappable buttons for better touch targets */}
            <div className="mb-4">
                <h3 className="text-base font-bold text-gray-700 mb-2">Filter by Status:</h3>
                <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-inner border border-gray-100 overflow-x-auto">
                    {statusFilters.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatusFilter(status)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${activeStatusFilter === status ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order List */}
            <div className="space-y-4 pb-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <MobileOrderCard 
                            key={order._id} 
                            order={order} 
                            onClick={setSelectedOrder}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-600 mt-4">
                        <ShoppingCart className="mx-auto w-10 h-10 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold">No Orders Found</h3>
                        <p>Try clearing your filters or search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryMobile;
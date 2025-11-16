import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Loader, XCircle, Package, DollarSign, Download, PackageOpen, 
    CheckCircle, Hourglass, Truck, ShoppingCart, 
    Calendar, Search, ChevronLeft, ArrowRight, Star 
} from 'lucide-react';

// --- Shared Helper Functions ---

const statusFilters = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Pending'];

const getStatusBadge = (status) => {
    let colorClass = '';
    let IconComponent = PackageOpen;
    let iconSize = 'w-3 h-3';
    
    switch (status) {
        case 'Delivered':
            colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-500';
            IconComponent = CheckCircle;
            break;
        case 'Processing':
            colorClass = 'bg-amber-100 text-amber-700 border-amber-500';
            IconComponent = Hourglass;
            break;
        case 'Shipped':
            colorClass = 'bg-blue-100 text-blue-700 border-blue-500';
            IconComponent = Truck;
            break;
        case 'Cancelled':
            colorClass = 'bg-red-100 text-red-700 border-red-500';
            IconComponent = XCircle;
            break;
        default: // Covers 'Pending'
            colorClass = 'bg-gray-100 text-gray-700 border-gray-500';
            IconComponent = PackageOpen;
    }
    
    return (
        <span className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center shadow-sm ${colorClass}`}>
            <IconComponent className={`inline mr-1 ${iconSize}`} /> {status}
        </span>
    );
};

// --- New Rating Component ---
const StarRating = ({ rating, orderId, itemId, orderStatus, onRate }) => {
    const [hover, setHover] = useState(null);
    const [currentRating, setCurrentRating] = useState(rating || 0);

    const isDelivered = orderStatus === 'Delivered';
    const hasRated = rating > 0;
    const isClickable = isDelivered && !hasRated;
    const readOnly = !isClickable;

    const handleRatingClick = (value) => {
        if (isClickable) {
            setCurrentRating(value);
            onRate(orderId, itemId, value);
        }
    };
    
    const displayRating = hover || currentRating;

    return (
        <div className="flex items-center space-x-0.5">
            {readOnly && currentRating === 0 && (
                <span className="text-xs text-gray-500 italic">Not Rated</span>
            )}
            
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <Star
                        key={index}
                        size={18}
                        className={`
                            ${ratingValue <= displayRating ? 'fill-yellow-400 text-yellow-500' : 'fill-gray-200 text-gray-400'}
                            ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                            transition-colors duration-200
                        `}
                        onClick={() => handleRatingClick(ratingValue)}
                        onMouseEnter={() => isClickable && setHover(ratingValue)}
                        onMouseLeave={() => isClickable && setHover(null)}
                    />
                );
            })}
            
            {!readOnly && hasRated && (
                <span className="text-xs text-emerald-600 ml-2 font-medium">Rated!</span>
            )}
            {!isDelivered && (
                 <span className="text-xs text-gray-400 ml-2 italic">Rate after delivery</span>
            )}
        </div>
    );
};

// -----------------------------------------------------------

// --- Desktop Sub-Components ---

const OrderDetailsSidebar = ({ selectedOrder, handleRateProduct }) => {
    if (!selectedOrder) {
        return (
            <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 sticky top-6 h-[calc(100vh-48px)] flex items-center justify-center text-center transition-all duration-300">
                <div className="text-gray-400">
                    <Package className="mx-auto w-12 h-12 mb-4 text-emerald-500" />
                    <p className="font-semibold text-xl text-gray-600">Order Details View</p>
                    <p className="text-sm mt-2">Select an order on the left to see its comprehensive product breakdown here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">
                Order: <span className="font-mono text-base font-semibold text-emerald-600 break-all">{selectedOrder._id.substring(0, 15)}...</span>
            </h2>

            {/* Status & Date */}
            <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                    <p className="text-sm font-medium text-gray-600">Status:</p>
                    {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 flex items-center justify-end">
                        <Calendar className="w-3 h-3 mr-1.5" /> Placed On:
                    </p>
                    <span className="text-gray-900 font-semibold text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-t pt-4">
                <Package className="w-5 h-5 mr-2 text-emerald-600" /> Purchased Items ({selectedOrder.items.length})
            </h3>
            
            {/* Product List */}
            <div className="space-y-4 border-b pb-4">
                {selectedOrder.items.map(item => (
                    <div key={item._id} className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        
                        <div className="flex items-start mb-3">
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
                                    Qty: <span className="font-extrabold text-gray-700">{item.quantity}</span>
                                </p>
                            </div>
                            <div className="text-right ml-4 flex-shrink-0">
                                <p className="text-emerald-600 font-extrabold text-xl">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-gray-400 text-xs">@ ₹{item.price.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Rating Row */}
                        <div className="border-t border-gray-100 pt-3">
                            <StarRating
                                rating={item.rating}
                                orderId={selectedOrder._id}
                                itemId={item._id}
                                orderStatus={selectedOrder.status}
                                onRate={handleRateProduct}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900 p-4 bg-emerald-600 rounded-xl shadow-2xl text-white">
                    <span className='flex items-center text-2xl'><DollarSign className="w-6 h-6 mr-2" /> Grand Total:</span>
                    <span className="text-4xl">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

const OrderCardDesktop = ({ order, isSelected, onClick }) => (
    <div 
        className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-[.99] ${isSelected ? 'bg-emerald-50 shadow-xl border-2 border-emerald-600' : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:border-emerald-200'}`}
        onClick={() => onClick(order)}
    >
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-md font-bold text-gray-900 flex flex-col">
                Order ID: <span className="font-mono text-xs font-semibold text-gray-600">{order._id}</span>
            </h3>
            {getStatusBadge(order.status)}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <p className="text-gray-700 font-extrabold text-2xl text-emerald-600">
                ₹{order.totalAmount.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm font-medium">{order.items.length} item(s)</p>
        </div>
    </div>
);

// --- Mobile Sub-Components ---

const OrderDetailViewMobile = ({ order, onBack, handleRateProduct }) => (
    <div className="h-full bg-white fixed inset-0 z-40 overflow-y-auto p-4 transition-transform duration-300 transform translate-x-0 font-sans">
        {/* Header/App Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 -mx-4 px-4 pt-4 shadow-sm">
            <button onClick={onBack} className="text-emerald-600 flex items-center p-2 rounded-full hover:bg-gray-100 active:bg-gray-200">
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="font-semibold text-lg">Back</span>
            </button>
            <h2 className="text-xl font-extrabold text-gray-900">Details</h2>
            <div className='w-24'>{getStatusBadge(order.status)}</div>
        </div>

        <div className="space-y-6 mt-4">
            {/* Order Summary Card */}
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Order ID:</p>
                <p className="font-mono text-base font-semibold text-gray-900 break-all mb-4 border-b pb-3">{order._id}</p>
                
                <div className="flex justify-between items-center">
                     <p className="text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-emerald-500" /> Placed On:
                    </p>
                    <span className="text-gray-900 text-md font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-emerald-600" /> Purchased Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item._id} className="flex flex-col p-3 border-b last:border-b-0 border-gray-100 bg-gray-50 rounded-lg shadow-inner">
                            <div className='flex items-center pb-2'>
                                <div className="w-14 h-14 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200">
                                    <img
                                        src={item.imageUrl || 'https://placehold.co/56x56'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/56x56/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-900 font-semibold text-base line-clamp-2">{item.name}</p>
                                    <p className="text-gray-500 text-sm mt-0.5">Qty: <span className='font-medium text-gray-700'>{item.quantity}</span></p>
                                </div>
                                <span className="text-emerald-600 font-extrabold text-xl ml-auto">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            
                            {/* Rating Row */}
                            <div className="border-t border-gray-200 pt-3">
                                <StarRating
                                    rating={item.rating}
                                    orderId={order._id}
                                    itemId={item._id}
                                    orderStatus={order.status}
                                    onRate={handleRateProduct}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl sticky bottom-0 mt-8">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                    <span className='flex items-center text-2xl'><DollarSign className="w-6 h-6 mr-2" /> TOTAL:</span>
                    <span className='text-4xl'>₹{order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
);

const OrderCardMobile = ({ order, onClick }) => (
    <div 
        className="bg-white rounded-xl shadow-lg p-4 active:shadow-xl active:bg-gray-100 transition-all duration-150 border border-gray-100 cursor-pointer"
        onClick={() => onClick(order)}
    >
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-md font-bold text-gray-900">
                ID: <span className="font-mono text-xs font-semibold text-gray-600">{order._id.substring(0, 10)}...</span>
            </h3>
            {getStatusBadge(order.status)}
        </div>

        {/* Product Image Strip */}
        <div className="flex overflow-x-auto space-x-3 pb-3 mb-3 border-b border-gray-100 scrollbar-hide">
            {order.items?.slice(0, 5).map(item => (
                <div key={item._id} className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                        src={item.imageUrl || 'https://placehold.co/56x56'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/56x56/E0E0E0/333333?text=${item.name.charAt(0)}`; }}
                    />
                </div>
            ))}
            {order.items?.length > 5 && (
                 <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-extrabold text-gray-700 shadow-sm border-2 border-gray-300">
                    +{order.items.length - 5}
                </div>
            )}
        </div>

        {/* Footer Details */}
        <div className="flex justify-between items-center">
            <p className="text-gray-900 font-extrabold text-2xl text-emerald-600">
                ₹{order.totalAmount.toFixed(2)}
            </p>
            <div className='flex items-center text-sm text-gray-500 font-medium'>
                <Calendar className="w-4 h-4 mr-1" /> 
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <ArrowRight className='ml-3 w-4 h-4 text-emerald-500' />
            </div>
        </div>
    </div>
);


// --- Main Component ---

const OrderHistory = () => {
    const navigate = useNavigate();
    // FIX: Using a direct string or fallback to avoid import.meta errors
    const API_BASE_URL =import.meta.env.VITE_API_URL;

    // --- State for real data ---
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for filtering and UI ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusFilter, setActiveStatusFilter] = useState('All');
    const [showDownloadMessage, setShowDownloadMessage] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // --- Responsive State ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Fetch data on component mount
    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('You must be logged in to view your order history.');
                setLoading(false);
                // navigate('/login'); // Keep commented out for sandboxed environment
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

                // Ensure data structure is correct and contains necessary fields
                setUser({
                    name: profileData?.name || profileData?.user?.name || 'User',
                    profilePicture: profileData.profilePicture || 'https://placehold.co/40x40/E0E0E0/333333?text=U'
                });

                // Ensure order dates are properly parsed if they are strings
                const processedOrders = ordersData.map(order => ({
                    ...order,
                    // Handle potential string dates
                    createdAt: new Date(order.createdAt || Date.now()), 
                    items: order.items || [] // Ensure items array exists
                }));
                
                setOrders(processedOrders);

            } catch (err) {
                console.error('Fetch error:', err);
                setError(`Failed to load data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate, API_BASE_URL]);

    // --- Rating Submission Logic ---
    const handleRateProduct = async (orderId, itemId, rating) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authorization failed. Please log in.');
            return;
        }
        
        // Clear previous error message
        setError(null); 

        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${itemId}/rate`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ rating }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Failed to submit rating.');
            }

            const { updatedItem } = await res.json();

            // Update local state with the new rating
            setOrders(prevOrders => prevOrders.map(order => {
                if (order._id === orderId) {
                    return {
                        ...order,
                        items: order.items.map(item => 
                            item._id === itemId ? { ...item, rating: updatedItem.rating } : item
                        ),
                    };
                }
                return order;
            }));
            
            // Update selected order view immediately if it's the current one
            setSelectedOrder(prevSelected => {
                if (prevSelected && prevSelected._id === orderId) {
                    return {
                        ...prevSelected,
                        items: prevSelected.items.map(item => 
                            item._id === itemId ? { ...item, rating: updatedItem.rating } : item
                        ),
                    };
                }
                return prevSelected;
            });

        } catch (err) {
            console.error('Rating submission error:', err);
            setError(err.message);
        }
    };


    const statusFiltersList = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Pending'];

    const filteredOrders = orders.filter(order => {
        const matchesSearchTerm =
            (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.items && order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus =
            activeStatusFilter === 'All' || order.status === activeStatusFilter;

        return matchesSearchTerm && matchesStatus;
    });

    // Sync selected order for desktop view
    useEffect(() => {
        if (!isMobile) {
            if (filteredOrders.length > 0 && (!selectedOrder || !filteredOrders.find(o => o._id === selectedOrder._id))) {
                setSelectedOrder(filteredOrders[0]);
            } else if (filteredOrders.length === 0) {
                setSelectedOrder(null);
            }
        }
    }, [filteredOrders, selectedOrder, isMobile]);


    const handleDownloadAll = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "all_orders.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode); // Use removeChild for safety

        setShowDownloadMessage(true);
        setTimeout(() => setShowDownloadMessage(false), 3000);
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }

    // --- Error State ---
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

    // --- Mobile Detail View Logic ---
    if (isMobile && selectedOrder) {
        return <OrderDetailViewMobile order={selectedOrder} onBack={() => setSelectedOrder(null)} handleRateProduct={handleRateProduct} />;
    }

    // --- UI Rendering based on responsiveness ---

    const DesktopView = () => (
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
                                onClick={handleDownloadAll}
                                className="flex items-center bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-300 active:scale-98 text-sm font-medium"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download All
                            </button>
                            <button 
                                onClick={() => navigate('/products')} 
                                className="flex items-center bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-200 hover:bg-emerald-700 active:scale-98 text-sm font-medium"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" /> New Order
                            </button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Product Name..."
                                className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-base transition-colors shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-2">
                                {statusFiltersList.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setActiveStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${activeStatusFilter === status ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
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
                                <OrderCardDesktop 
                                    key={order._id} 
                                    order={order} 
                                    isSelected={selectedOrder && selectedOrder._id === order._id}
                                    onClick={setSelectedOrder}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-600">
                                <ShoppingCart className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold">No Matching Orders</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Order Details (30%) */}
                <div className="w-4/12">
                    <OrderDetailsSidebar selectedOrder={selectedOrder} handleRateProduct={handleRateProduct} />
                </div>

            </div>
        </div>
    );

    const MobileView = () => (
        <div className="min-h-screen bg-gray-50 p-4 font-sans max-w-xl mx-auto">
            
            {/* Download Message */}
            {showDownloadMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-xl text-base font-semibold animate-fade-in-down z-50">
                    Orders Downloaded!
                </div>
            )}

            {/* Top Header/App Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 sticky top-0 z-20">
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
                        onClick={handleDownloadAll}
                        className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-300 active:scale-98 font-semibold shadow-md"
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
                    className="w-full p-3 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-base transition-colors shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Status Filters - Swappable buttons for better touch targets */}
            <div className="mb-4">
                <h3 className="text-base font-bold text-gray-700 mb-2">Filter by Status:</h3>
                <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-inner border border-gray-100 overflow-x-auto">
                    {statusFiltersList.map(status => (
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
                        <OrderCardMobile 
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
    
    return isMobile ? <MobileView /> : <DesktopView />;
};

export default OrderHistory;
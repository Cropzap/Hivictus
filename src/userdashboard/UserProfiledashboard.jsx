import React, { useState } from 'react';
import { FaShoppingCart, FaDollarSign, FaHistory, FaUserCircle, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Ensure Link is imported

// Mock User Data and Order Data (keeping these for context)
const currentUser = {
  name: 'John Doe',
  profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf267ddc?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  role: 'Customer',
};

const mockOrders = [
  {
    orderId: 'ORD001',
    date: '2025-07-10',
    totalAmount: 1250.00,
    products: [
      { id: 'prodA', name: 'Organic Neem Cake Fertilizer', image: 'https://www.dnlpurefarms.com/img/dnl-neem-cake-powder.jpg', price: 380.00, quantity: 1 },
      { id: 'prodB', name: 'Hybrid Tomato Seeds', image: 'https://cdn.shopify.com/s/files/1/0722/2059/files/saaho-to-3251-tomato-seeds-file-20101.jpg?v=1747130775', price: 99.00, quantity: 2 },
      { id: 'prodC', name: 'Bio-Pesticide (Neem Oil Based)', image: 'https://www.katyayaniorganics.com/wp-content/uploads/2022/06/DSC_0297-resize-scaled.jpg', price: 595.00, quantity: 1 },
    ],
  },
  {
    orderId: 'ORD002',
    date: '2025-07-05',
    totalAmount: 4950.00,
    products: [
      { id: 'prodD', name: 'Drip Irrigation Kit (Small Farm)', image: 'https://placehold.co/64x64/E0E0E0/333333?text=DRIP', price: 4950.00, quantity: 1 },
    ],
  },
  {
    orderId: 'ORD003',
    date: '2025-06-28',
    totalAmount: 500.00,
    products: [
      { id: 'prodE', name: 'Organic Vermicompost', image: 'https://naturalearth.in/wp-content/uploads/2024/03/8-Natural-Earth-20KG.jpg', price: 250.00, quantity: 2 },
    ],
  },
  {
    orderId: 'ORD004',
    date: '2025-06-20',
    totalAmount: 720.00,
    products: [
      { id: 'prodF', name: 'Gardening Hand Tool Set', image: 'https://placehold.co/64x64/E0E0E0/333333?text=TOOLS', price: 720.00, quantity: 1 },
    ],
  },
  {
    orderId: 'ORD005',
    date: '2025-06-15',
    totalAmount: 250.00,
    products: [
      { id: 'prodG', name: 'Coco Peat Blocks', image: 'https://placehold.co/64x64/E0E0E0/333333?text=COCO', price: 125.00, quantity: 2 },
    ],
  },
  {
    orderId: 'ORD006',
    date: '2025-06-01',
    totalAmount: 100.00,
    products: [
      { id: 'prodH', name: 'Garden Gloves', image: 'https://placehold.co/64x64/E0E0E0/333333?text=GLOVES', price: 100.00, quantity: 1 },
    ],
  },
];

const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate total orders and total amount paid
  const totalOrders = mockOrders.length;
  const totalAmountPaid = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2);

  // Get recent 5 products from the most recent orders
  const recentProducts = mockOrders
    .slice(0, 5) // Take the 5 most recent orders
    .flatMap(order => order.products) // Flatten products from these orders
    .slice(0, 5); // Take the first 5 products overall for display

  // Mock for "Last Activities" - adapted for e-commerce
  const lastActivities = [
    { id: 1, text: 'Order #ORD001 delivered', status: 'success' },
    { id: 2, text: 'New item added to wishlist', status: 'info' },
    { id: 3, text: 'Payment failed for #ORD006', status: 'error' },
    { id: 4, text: 'Review submitted for Hybrid Tomato Seeds', status: 'success' },
  ];

  // Metric Card Component
  const MetricCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className={`p-2 rounded-lg ${colorClass} text-white mb-2`}>
        <Icon className="text-xl sm:text-2xl" />
      </div>
      <p className="text-gray-700 text-xs sm:text-sm font-medium">{title}</p>
      <h3 className="text-gray-900 text-2xl sm:text-3xl font-bold mt-1">{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 mt-16 sm:p-6 font-sans">
      <div className="w-full max-w-screen grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* User Profile Card (Mobile: Top, Desktop: Right Column) */}
        {/* Added fixed width and responsive adjustments for buttons */}
        <div className="lg:col-span-1 order-first lg:order-none bg-white rounded-2xl shadow-lg p-6 text-center w-full sm:w-64 mx-auto lg:mx-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-4">
            <img
              src={currentUser.profilePicture}
              alt="User Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/E0E0E0/333333?text=U'; }}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
          <p className="text-gray-600 text-sm mb-5">{currentUser.role}</p> {/* Added mb-5 for button spacing */}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Link
              to="/user" // Navigate to the user profile page
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 active:scale-98"
            >
              View Profile
            </Link>
            <Link
              to="/user" // Navigate to the user profile page (same link, but could be different for "Edit")
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 active:scale-98"
            >
              Edit Details
            </Link>
          </div>
        </div>

        {/* Left Column (Main Content Area - Tabs) */}
        {/* On mobile, this will appear after the User Profile Card due to order-first on the profile card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Section (Overview Title) */}
          

          {/* Animated Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-2"> {/* Container for tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4"> {/* Tab buttons container */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300
                            ${activeTab === 'overview' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('recentPurchases')}
                className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300
                            ${activeTab === 'recentPurchases' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Recent Purchases
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 pt-0 animate-fade-in"> {/* Added animate-fade-in */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Mobile: 1 column, Tablet/Desktop: 2 columns */}
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
                  {/* Total Savings card, now always visible */}
                  <MetricCard
                    icon={FaTag}
                    title="Total Savings"
                    value={`₹${(mockOrders.reduce((sum, order) => sum + (order.products.reduce((prodSum, p) => prodSum + (p.price * p.quantity), 0) - order.totalAmount), 0)).toFixed(2)}`}
                    colorClass="bg-emerald-500"
                  />
                </div>
              )}

              {activeTab === 'recentPurchases' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaHistory className="mr-3 text-emerald-600" /> Your Latest Orders
                  </h2>
                  {recentProducts.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                              Qty
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentProducts.map((product, index) => (
                            <tr key={product.id + '-' + index} className="hover:bg-emerald-50 transition-colors duration-200 cursor-pointer group">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/E0E0E0/333333?text=${product.name.charAt(0)}`; }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="text-gray-900 font-semibold text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-gray-600 text-xs sm:hidden">Qty: {product.quantity}</p> {/* Show Qty on mobile below name */}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 hidden sm:table-cell">
                                {product.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-sm sm:text-base text-gray-900">
                                {/* Amount is always visible, hover highlights the row */}
                                ₹{(product.price * product.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4 text-sm">No recent purchases found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Last Activities Section (Mobile: Below tabs, Desktop: Right Column) */}
        {/* On mobile, this will appear after the main content area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import FAQ from './components/FAQ';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import CartPage from './pages/ShoppingCart';
import WishlistPage from './pages/WishlistPage';
import Footer from './components/Footer';
import UserProfile from './userdashboard/UserProfile';
import UserProfileDashboard from './userdashboard/UserProfiledashboard';
import OrderHistory from './userdashboard/OrderHistory';
import SupportTicket from './userdashboard/SupportTicket';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/user" element={<UserProfile/>}/>
        <Route path="/profile" element={<UserProfileDashboard/>}/>
        <Route path="/orderhistory" element={<OrderHistory/>}/>
        <Route path="/support" element={<SupportTicket/>}/>
        <Route path="privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;

// src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts and Guards (Keep static for faster shell load)
import MainLayout from '../layouts/MainLayout';
import AuthPartner from '../components/AuthPartner';
import AuthUser from '../components/AuthUser';

// Lazy Load Pages
const RegisterUser = React.lazy(() => import('../pages/RegisterUser'));
const LoginUser = React.lazy(() => import('../pages/LoginUser'));
const RegisterPartner = React.lazy(() => import('../pages/RegisterPartner'));
const LoginPartner = React.lazy(() => import('../pages/LoginPartner'));
const Home = React.lazy(() => import('../pages/general/HomePage'));
const CreateFood = React.lazy(() => import('../pages/food-patner/CreateFood'));
const EditFood = React.lazy(() => import('../pages/food-patner/EditFood'));
const Profile = React.lazy(() => import('../pages/food-patner/profile'));
const PartnerDashboard = React.lazy(() => import('../pages/food-patner/PartnerDashboard'));
const PartnerProfile = React.lazy(() => import('../pages/food-patner/PartnerProfile'));
const UserProfile = React.lazy(() => import('../pages/user/UserProfile'));
const GoldMembership = React.lazy(() => import('../pages/user/GoldMembership'));
const PaymentMock = React.lazy(() => import('../pages/user/PaymentMock'));
const LandingPage = React.lazy(() => import('../pages/general/LandingPage'));
const RestaurantLanding = React.lazy(() => import('../pages/general/RestaurantLanding'));
const DeliveryLanding = React.lazy(() => import('../pages/general/DeliveryLanding'));
const EntryPage = React.lazy(() => import('../pages/general/EntryPage'));
const ReelsPage = React.lazy(() => import('../pages/general/ReelsPage'));
const FoodDetails = React.lazy(() => import('../pages/general/FoodDetails'));
const CartPage = React.lazy(() => import('../pages/general/CartPage'));
const CheckoutPage = React.lazy(() => import('../pages/general/CheckoutPage'));
const AboutPage = React.lazy(() => import('../pages/general/AboutPage'));
const HelpPage = React.lazy(() => import('../pages/general/HelpPage'));
const TermsPage = React.lazy(() => import('../pages/general/TermsPage'));
const PrivacyPage = React.lazy(() => import('../pages/general/PrivacyPage'));
const CookiesPage = React.lazy(() => import('../pages/general/CookiesPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#050505]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-[#FF5E00]/20 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-[#FF5E00] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

// Delivery Pages
const DeliveryLogin = React.lazy(() => import('../pages/delivery/DeliveryLogin'));
const DeliveryRegister = React.lazy(() => import('../pages/delivery/DeliveryRegister'));
const DeliveryDashboard = React.lazy(() => import('../pages/delivery/DeliveryDashboard'));
const DeliveryProfile = React.lazy(() => import('../pages/delivery/DeliveryProfile'));
const OrderTracking = React.lazy(() => import('../pages/user/OrderTracking'));

// Local Components
import ScrollToTop from '../components/ScrollToTop';

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* User Routes */}
          <Route path="/user/register" element={<RegisterUser />} />
          <Route path="/user/login" element={<LoginUser />} />
          <Route path="/order/tracking/:orderId" element={<OrderTracking />} />

          {/* Food Partner Routes */}
          <Route path="/food-partner/register" element={<RegisterPartner />} />
          <Route path="/food-partner/login" element={<LoginPartner />} />

          {/* Delivery Partner Routes */}
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/register" element={<DeliveryRegister />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/profile" element={<DeliveryProfile />} />

          {/* Entry & Landing Pages */}
          <Route path="/" element={<EntryPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/partner" element={<RestaurantLanding />} />
          <Route path="/rider" element={<DeliveryLanding />} />

          {/* Main Layout for App Pages */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/cart" element={
              <AuthUser>
                <CartPage />
              </AuthUser>
            } />
            <Route path="/checkout" element={
              <AuthUser>
                <CheckoutPage />
              </AuthUser>
            } />
            <Route path="/partner/dashboard" element={
              <AuthPartner><PartnerDashboard /></AuthPartner>} />
            <Route path="/partner/profile" element={
              <AuthPartner>
                <PartnerProfile />
              </AuthPartner>
            } />
            <Route path="/user/profile" element={
              <AuthUser>
                <UserProfile />
              </AuthUser>
            } />
            <Route path="/user/gold" element={<GoldMembership />} />
            <Route path="/user/payment" element={
              <AuthUser><PaymentMock /></AuthUser>} />
            <Route path="/create-food" element={
              <AuthPartner>
                <CreateFood />
              </AuthPartner>
            } />
            <Route path="/edit-food/:id" element={
              <AuthPartner>
                <EditFood />
              </AuthPartner>
            } />
            <Route path="/food-patner/:id" element={<Profile />} />
            <Route path="/food/:id" element={<FoodDetails />} />

            {/* General Info Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
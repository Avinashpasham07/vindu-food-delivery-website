// src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts and Guards (Keep static for faster shell load)
import MainLayout from '../layouts/MainLayout';
import AuthPartner from '../components/AuthPartner';

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
const ReelsPage = React.lazy(() => import('../pages/general/ReelsPage'));
const FoodDetails = React.lazy(() => import('../pages/general/FoodDetails'));
const CartPage = React.lazy(() => import('../pages/general/CartPage'));
const CheckoutPage = React.lazy(() => import('../pages/general/CheckoutPage'));

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

const AppRoutes = () => {
  return (
    <Router>
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

          {/* Main Layout for App Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
            <Route path="/partner/profile" element={<PartnerProfile />} />
            <Route path="/user/profile" element={<UserProfile />} />
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
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
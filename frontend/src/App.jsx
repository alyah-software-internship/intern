import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeProvider.jsx";

import Home from "./page/public/Home";
import Header from "./component/Header";
import Login from "./page/auth/Login";
import Signup from "./page/auth/Signup";
import Rentals from "./page/public/Rentals";
import Categories from "./page/public/Categories";
import HowItWorks from "./page/public/HowItWorks";
import PricingPage from "./page/public/PricingPage";
import AboutPage from "./page/public/AboutPage";
import ContactPage from "./page/public/ContactPage";
import ProfilePage from "./page/customer/ProfilePage";
import DashboardPage from "./page/customer/DashboardPage";
import SettingPage from "./page/customer/SettingPage";
import BookingPage from "./page/customer/BookingPage";
import Messagespage from "./page/customer/Messagespage";
import WishlistPage from "./page/customer/WishlistPage";
import NotificationPage from "./page/customer/NotificationPage";
import VendorLayout from "./component/vendor/VendorLayout";
import VendorPage from "./page/vendor/VendorPage";
import Verify from "./page/vendor/Verify";
import Products from "./page/vendor/Products";
import Bookings from "./page/vendor/Bookings";
import Customers from "./page/vendor/Customers";
import Employees from "./page/vendor/Employees";
import Analytics from "./page/vendor/Analytics";
import Reports from "./page/vendor/Reports";
import VendorProfile from "./page/vendor/Profile";
import Subscription from "./page/vendor/Subscription";
import VendorSettings from "./page/vendor/Settings";
import DetailPage from "./page/public/DetailPage";
import Footer from "./component/Footer.jsx";

const App = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const hideMainHeader = location.pathname.startsWith("/vendor");

  return (
    <div className={theme === "dark" ? "app-root app-root--dark" : "app-root"}>
      {!hideMainHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:id" element={<DetailPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/messages" element={<Messagespage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/vendor" element={<VendorLayout />}>
            <Route index element={<VendorPage />} />
            <Route path="dashboard" element={<VendorPage />} />
            <Route path="verify" element={<Verify />} />
            <Route path="products" element={<Products />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;

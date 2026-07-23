import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
import VendorPage from "./page/vendor/VendorPage";

const App = () => {
  const location = useLocation();

  return (
    <div className="text-red-700">
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rentals" element={<Rentals />} />
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
          <Route path="/vendor" element={<VendorPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;

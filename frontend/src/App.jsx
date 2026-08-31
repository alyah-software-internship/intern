import React, { useContext } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeProvider.jsx";
import { AppContext } from "./context/AppContext.jsx";

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
import BookingDetailsPage from "./page/customer/BookingDetailsPage";
import Messagespage from "./page/customer/Messagespage";
import WishlistPage from "./page/customer/WishlistPage";
import NotificationPage from "./page/customer/NotificationPage";
import VendorLayout from "./component/vendor/VendorLayout";
import VendorPage from "./page/vendor/VendorPage";
import Verify from "./page/vendor/Verify";
import Products from "./page/vendor/Products";
import Bookings from "./page/vendor/Bookings";
import Customers from "./page/vendor/Customers";
import VendorMessages from "./page/vendor/Messages";
import Employees from "./page/vendor/Employees";
import Analytics from "./page/vendor/Analytics";
import Reports from "./page/vendor/Reports";
import VendorProfile from "./page/vendor/Profile";
import Subscription from "./page/vendor/Subscription";
import VendorSettings from "./page/vendor/Settings";
import AddItem from "./page/vendor/addItem";
import VendorAlerts from "./page/vendor/Alerts";
import AdminLayout from "./page/admin/adminLayout.jsx";
import ControlPannel from "./page/admin/ControlPannel";
import Users from "./page/admin/Users";
import UserDetails from "./page/admin/UserDetails";
import VendorAdmin from "./page/admin/Vendor";
import VendorDetail from "./page/admin/VendorDetail";
import VendorsDirectory from "./page/admin/VendorsDirectory";
import Category from "./page/admin/Category";
import RegisterCategory from "./page/admin/RegisterCategory";
import Audit from "./page/admin/Audit";
import EscrowLedger from "./page/admin/EscrowLedger";
import MediationCases from "./page/admin/MediationCases";
import PlatformSettings from "./page/admin/PlatformSettings";
import SystemHealth from "./page/admin/SystemHealth";
import TranslationReviewPage from "./page/admin/TranslationReview.jsx";
import Notifications from "./page/admin/Notifications";
import DetailPage from "./page/public/DetailPage";
import Footer from "./component/Footer.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const { isSignedIn, user } = useContext(AppContext);

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  const userRole = (user?.role || "customer").toLowerCase();
  const isCustomerBookingPath =
    location.pathname === "/bookings" ||
    location.pathname.startsWith("/booking-details") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname === "/settings" ||
    location.pathname === "/messages" ||
    location.pathname === "/wishlist" ||
    location.pathname === "/notifications";

  if (roles && !roles.includes(userRole)) {
    if (isCustomerBookingPath && (!userRole || userRole === "customer")) {
      return children;
    }

    const roleHome = {
      admin: "/admin",
      vendor: "/vendor/dashboard",
      customer: "/dashboard",
    }[userRole];

    return <Navigate to={roleHome || "/"} replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const hideMainHeader =
    location.pathname.startsWith("/vendor") ||
    location.pathname.startsWith("/admin");

  return (
    <div className={theme === "dark" ? "app-root app-root--dark" : "app-root"}>
      {!hideMainHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:id" element={<DetailPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["customer"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={["customer"]}>
                <SettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-details"
            element={
              <ProtectedRoute roles={["customer"]}>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute roles={["customer"]}>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-details/:bookingId"
            element={
              <ProtectedRoute roles={["customer"]}>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute roles={["customer"]}>
                <Messagespage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute roles={["customer"]}>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["customer"]}>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ControlPannel />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="vendors" element={<VendorAdmin />} />
            <Route path="vendors/:id" element={<VendorDetail />} />
            <Route path="vendors-directory" element={<VendorsDirectory />} />
            <Route path="categories" element={<Category />} />
            <Route path="categories/new" element={<RegisterCategory />} />
            <Route path="categories/:id/edit" element={<RegisterCategory />} />
            <Route path="escrow-ledger" element={<EscrowLedger />} />
            <Route path="mediation-cases" element={<MediationCases />} />
            <Route path="system-health" element={<SystemHealth />} />
            <Route path="audit" element={<Audit />} />
            <Route path="platform-settings" element={<PlatformSettings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="translations" element={<TranslationReviewPage />} />
          </Route>
          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VendorPage />} />
            <Route path="dashboard" element={<VendorPage />} />
            <Route path="verify" element={<Verify />} />
            <Route path="products" element={<Products />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="customers" element={<Customers />} />
            <Route path="messages" element={<VendorMessages />} />
            <Route path="employees" element={<Employees />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<VendorSettings />} />
            <Route path="alerts" element={<VendorAlerts />} />
            <Route path="add-product" element={<AddItem />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;

import { lazy, Suspense, useContext } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeProvider.jsx";
import { AppContext } from "./context/AppContext.jsx";

import Header from "./component/Header";
import Footer from "./component/Footer.jsx";

const Home = lazy(() => import("./page/public/Home"));
const Login = lazy(() => import("./page/auth/Login"));
const ForgotPassword = lazy(() => import("./page/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./page/auth/ResetPassword"));
const Signup = lazy(() => import("./page/auth/Signup"));
const Rentals = lazy(() => import("./page/public/Rentals"));
const Categories = lazy(() => import("./page/public/Categories"));
const HowItWorks = lazy(() => import("./page/public/HowItWorks"));
const PricingPage = lazy(() => import("./page/public/PricingPage"));
const AboutPage = lazy(() => import("./page/public/AboutPage"));
const ContactPage = lazy(() => import("./page/public/ContactPage"));
const ProfilePage = lazy(() => import("./page/customer/ProfilePage"));
const DashboardPage = lazy(() => import("./page/customer/DashboardPage"));
const SettingPage = lazy(() => import("./page/customer/SettingPage"));
const BookingPage = lazy(() => import("./page/customer/BookingPage"));
const BookingDetailsPage = lazy(
  () => import("./page/customer/BookingDetailsPage"),
);
const Messagespage = lazy(() => import("./page/customer/Messagespage"));
const WishlistPage = lazy(() => import("./page/customer/WishlistPage"));
const NotificationPage = lazy(() => import("./page/customer/NotificationPage"));
const PaymentPage = lazy(() => import("./page/customer/PaymentPage"));
const PaymentFlowPage = lazy(() => import("./page/customer/PaymentFlowPage"));
const VendorLayout = lazy(() => import("./component/vendor/VendorLayout"));
const VendorPage = lazy(() => import("./page/vendor/VendorPage"));
const Verify = lazy(() => import("./page/vendor/Verify"));
const Products = lazy(() => import("./page/vendor/Products"));
const Bookings = lazy(() => import("./page/vendor/Bookings"));
const Customers = lazy(() => import("./page/vendor/Customers"));
const VendorMessages = lazy(() => import("./page/vendor/Messages"));
const Employees = lazy(() => import("./page/vendor/Employees"));
const Analytics = lazy(() => import("./page/vendor/Analytics"));
const Reports = lazy(() => import("./page/vendor/Reports"));
const VendorProfile = lazy(() => import("./page/vendor/Profile"));
const Subscription = lazy(() => import("./page/vendor/Subscription"));
const VendorSettings = lazy(() => import("./page/vendor/Settings"));
const AddItem = lazy(() => import("./page/vendor/addItem"));
const VendorAlerts = lazy(() => import("./page/vendor/Alerts"));
const VendorWallet = lazy(() => import("./page/vendor/Wallet"));
const VendorWalletPage = lazy(() => import("./page/vendor/VendorWalletPage"));
const VendorWithdrawalsPage = lazy(
  () => import("./page/vendor/VendorWithdrawalsPage"),
);
const AdminLayout = lazy(() => import("./page/admin/adminLayout.jsx"));
const ControlPannel = lazy(() => import("./page/admin/ControlPannel"));
const Users = lazy(() => import("./page/admin/Users"));
const UserDetails = lazy(() => import("./page/admin/UserDetails"));
const VendorAdmin = lazy(() => import("./page/admin/Vendor"));
const VendorDetail = lazy(() => import("./page/admin/VendorDetail"));
const VendorsDirectory = lazy(() => import("./page/admin/VendorsDirectory"));
const Category = lazy(() => import("./page/admin/Category"));
const RegisterCategory = lazy(() => import("./page/admin/RegisterCategory"));
const Audit = lazy(() => import("./page/admin/Audit"));
const EscrowLedger = lazy(() => import("./page/admin/EscrowLedger"));
const MediationCases = lazy(() => import("./page/admin/MediationCases"));
const PlatformSettings = lazy(() => import("./page/admin/PlatformSettings"));
const SystemHealth = lazy(() => import("./page/admin/SystemHealth"));
const TranslationReviewPage = lazy(
  () => import("./page/admin/TranslationReview.jsx"),
);
const Notifications = lazy(() => import("./page/admin/Notifications"));
const AdminFinancialDashboard = lazy(
  () => import("./page/admin/AdminFinancialDashboard"),
);
const AdminPaymentsPage = lazy(() => import("./page/admin/AdminPaymentsPage"));
const AdminWithdrawalsPage = lazy(
  () => import("./page/admin/AdminWithdrawalsPage"),
);
const AdminRefundsPage = lazy(() => import("./page/admin/AdminRefundsPage"));
const DetailPage = lazy(() => import("./page/public/DetailPage"));
const OperatorLayout = lazy(() => import("./page/operator/OperatorLayout.jsx"));
const OperatorDashboard = lazy(
  () => import("./page/operator/OperatorDashboard.jsx"),
);
const OperatorProfile = lazy(
  () => import("./page/operator/OperatorProfile.jsx"),
);
const OperatorAssignments = lazy(
  () => import("./page/operator/OperatorAssignments.jsx"),
);

const ProtectedRoute = ({ children, roles }) => {
  const { isSignedIn, user } = useContext(AppContext);

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  const userRole = (user?.role || "customer").toLowerCase();

  if (roles && !roles.includes(userRole)) {
    const roleHome = {
      admin: "/admin",
      vendor: "/vendor/dashboard",
      customer: "/dashboard",
      operator: "/operator",
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
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/operator") ||
    location.pathname.startsWith("/payments/subscription");

  return (
    <div className={theme === "dark" ? "app-root app-root--dark" : "app-root"}>
      {!hideMainHeader && <Header />}
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <div className="app-loading" role="status" aria-live="polite">
              <span className="app-loading-spinner" aria-hidden="true" />
              <span>Loading...</span>
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
                <ProtectedRoute roles={["customer", "operator"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <SettingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-details"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <BookingDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking-details/:bookingId"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <BookingDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments/:bookingId"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments/subscription/:paymentId"
              element={
                <ProtectedRoute roles={["vendor"]}>
                  <VendorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PaymentPage />} />
            </Route>
            <Route
              path="/payment-flow/:bookingId"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <PaymentFlowPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <Messagespage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute roles={["customer", "operator"]}>
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
              <Route
                path="categories/:id/edit"
                element={<RegisterCategory />}
              />
              <Route path="escrow-ledger" element={<EscrowLedger />} />
              <Route path="mediation-cases" element={<MediationCases />} />
              <Route path="system-health" element={<SystemHealth />} />
              <Route path="audit" element={<Audit />} />
              <Route path="platform-settings" element={<PlatformSettings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="translations" element={<TranslationReviewPage />} />
              <Route
                path="financial/dashboard"
                element={<AdminFinancialDashboard />}
              />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
              <Route path="refunds" element={<AdminRefundsPage />} />
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
              <Route path="wallet" element={<VendorWalletPage />} />
              <Route path="my-wallet" element={<VendorWalletPage />} />
              <Route path="withdrawals" element={<VendorWithdrawalsPage />} />
            </Route>
            <Route
              path="/operator"
              element={
                <ProtectedRoute roles={["operator"]}>
                  <OperatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OperatorDashboard />} />
              <Route path="bookings" element={<OperatorAssignments />} />
              <Route path="messages" element={<Messagespage />} />
              <Route path="profile" element={<OperatorProfile />} />
              <Route path="settings" element={<SettingPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;

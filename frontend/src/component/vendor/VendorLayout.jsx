import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Space, Tag, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/vendor/dashboard" },
  { key: "products", label: "Products", path: "/vendor/products" },
  { key: "bookings", label: "Bookings", path: "/vendor/bookings" },
  { key: "customers", label: "Customers", path: "/vendor/customers" },
  { key: "messages", label: "Messages", path: "/vendor/messages" },
  { key: "employees", label: "Employees", path: "/vendor/employees" },
  { key: "analytics", label: "Analytics", path: "/vendor/analytics" },
  { key: "reports", label: "Reports", path: "/vendor/reports" },
  { key: "profile", label: "Profile", path: "/vendor/profile" },
  { key: "subscription", label: "Subscription", path: "/vendor/subscription" },
  { key: "settings", label: "Settings", path: "/vendor/settings" },
];

const routeTitles = {
  "/vendor": "dashboard",
  "/vendor/dashboard": "dashboard",
  "/vendor/verify": "verify",
  "/vendor/products": "products",
  "/vendor/bookings": "bookings",
  "/vendor/customers": "customers",
  "/vendor/messages": "messages",
  "/vendor/employees": "employees",
  "/vendor/analytics": "analytics",
  "/vendor/reports": "reports",
  "/vendor/profile": "profile",
  "/vendor/subscription": "subscription",
  "/vendor/settings": "settings",
  "/vendor/alerts": "alerts",
  "/vendor/add-product": "addProduct",
};

const vendorProfileCacheKey = "vendorProfile";

const VendorLayout = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const { backendUrl, signOut } = useContext(AppContext);
  const isDark = theme === "dark";
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vendor, setVendor] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(vendorProfileCacheKey)) || null;
    } catch {
      return null;
    }
  });
  const sidebarVisible = !isMobile || sidebarOpen;

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${backendUrl}/vendor/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      })
      .then((response) => {
        setVendor(response.data.vendor);
        localStorage.setItem(
          vendorProfileCacheKey,
          JSON.stringify(response.data.vendor),
        );
      })
      .catch((error) => {
        if (!axios.isCancel(error)) return;
      });

    return () => controller.abort();
  }, [backendUrl]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((value) => !value);
    }
  };

  const isActive = (path) => {
    if (path === "/vendor/dashboard") {
      return location.pathname === "/vendor" || location.pathname === path;
    }
    return location.pathname === path;
  };

  const pageTitleKey = routeTitles[location.pathname] || "dashboard";
  const pageTitle =
    t.vendor?.[pageTitleKey] ||
    navItems.find((item) => item.path === location.pathname)?.label ||
    "Vendor Dashboard";

  const navigate = useNavigate();

  const pageDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const businessName = vendor?.business_name || "Complete profile";
  const initials = vendor?.business_name
    ? vendor.business_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "VP";
  const verificationStatus = vendor?.verification_status || "pending";
  const joinedDate = vendor?.joined_date
    ? new Date(vendor.joined_date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: isDark ? "#060b17" : "#f3f7fb",
      }}
    >
      <div
        style={{
          display: sidebarVisible ? "block" : "none",
          width: 280,
          padding: isMobile ? "24px 20px" : "32px 24px",
          background: isDark ? "#0b1120" : "#fff",
          borderRight: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
          boxShadow: isDark
            ? "2px 0 24px rgba(0,0,0,0.25)"
            : "2px 0 24px rgba(15,23,42,0.04)",
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 20,
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
          transition: "transform 0.25s ease, width 0.25s ease",
          overflow: "auto",
        }}
      >
        <div
          style={{
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 120, marginBottom: 0, cursor: "pointer" }}
            onClick={() => navigate("/")}
            className="cursor-pointer"
          />

          {!isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar menu"
              style={{
                color: isDark ? "#e2e8f0" : "#0f172a",
                fontSize: 18,
              }}
            />
          )}
        </div>

        <div>
          <Card
            style={{
              borderRadius: 20,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.08)",
              boxShadow: isDark
                ? "0 10px 30px rgba(2, 6, 23, 0.45)"
                : "0 10px 30px rgba(15, 23, 42, 0.08)",
              marginBottom: 24,
            }}
          >
            <Space align="center" size={14}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "#16a34a",
                  display: "grid",
                  placeItems: "center",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {initials}
              </div>
              <div>
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {businessName}
                </Title>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#475569",
                    fontSize: 12,
                  }}
                >
                  {joinedDate ? `Since ${joinedDate}` : "Vendor profile"}
                </Text>
              </div>
            </Space>

            <Space wrap size={8} style={{ marginTop: 18 }}>
              <Tag
                icon={
                  verificationStatus === "approved" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <WarningOutlined />
                  )
                }
                style={{
                  borderRadius: 999,
                  background:
                    verificationStatus === "approved" ? "#dcfce7" : "#fef3c7",
                  borderColor:
                    verificationStatus === "approved" ? "#86efac" : "#fcd34d",
                  color:
                    verificationStatus === "approved" ? "#166534" : "#92400e",
                  fontWeight: 700,
                  paddingInline: 10,
                  fontSize: 11,
                }}
              >
                {verificationStatus === "approved"
                  ? "VERIFIED"
                  : "NOT VERIFIED"}
              </Tag>
            </Space>
          </Card>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              style={{ display: "block", textDecoration: "none" }}
            >
              <Button
                type={isActive(item.path) ? "primary" : "text"}
                block
                style={{
                  justifyContent: "flex-start",
                  borderRadius: 14,
                  fontWeight: 500,
                  color: isActive(item.path)
                    ? undefined
                    : isDark
                      ? "#e2e8f0"
                      : "#111827",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {t.vendor?.[item.key] || item.label}
              </Button>
            </NavLink>
          ))}
        </div>
      </div>

      {!sidebarOpen && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: 18,
            left: 18,
            zIndex: 8,
            borderRadius: 14,
          }}
        />
      )}

      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 10,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          padding: isMobile ? 16 : 32,
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                textTransform: "uppercase",
                fontSize: 12,
                letterSpacing: "0.24em",
                color: "#16a34a",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {pageTitle}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            >
              {pageTitle}
            </Title>
            <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
              {pageDate}
            </Text>
          </div>

          <Space wrap size={8}>
            <Button
              icon={<BellOutlined />}
              type="default"
              style={{ borderRadius: 16 }}
              onClick={() => navigate("/vendor/alerts")}
            >
              {t.vendor?.alertsButton || "Alerts"}
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ borderRadius: 16 }}
              onClick={() => navigate("/vendor/add-product")}
            >
              {t.vendor?.addProduct || "Add Product"}
            </Button>
            <Button
              icon={<LogoutOutlined />}
              danger
              type="default"
              style={{ borderRadius: 16 }}
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              {t.nav?.logout || "Logout"}
            </Button>
          </Space>
        </div>

        <div
          style={{
            height: 1,
            background: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(15,23,42,0.08)",
            marginBottom: 24,
          }}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;

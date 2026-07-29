import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/vendor/dashboard" },
  { key: "verify", label: "Verify Credentials", path: "/vendor/verify" },
  { key: "products", label: "Products", path: "/vendor/products" },
  { key: "bookings", label: "Bookings", path: "/vendor/bookings" },
  { key: "customers", label: "Customers", path: "/vendor/customers" },
  { key: "employees", label: "Employees", path: "/vendor/employees" },
  { key: "analytics", label: "Analytics", path: "/vendor/analytics" },
  { key: "reports", label: "Reports", path: "/vendor/reports" },
  { key: "profile", label: "Profile", path: "/vendor/profile" },
  { key: "subscription", label: "Subscription", path: "/vendor/subscription" },
  { key: "settings", label: "Settings", path: "/vendor/settings" },
];

const routeTitles = {
  "/vendor": "Dashboard",
  "/vendor/dashboard": "Dashboard",
  "/vendor/verify": "Verify Credentials",
  "/vendor/products": "Products",
  "/vendor/bookings": "Bookings",
  "/vendor/customers": "Customers",
  "/vendor/employees": "Employees",
  "/vendor/analytics": "Analytics",
  "/vendor/reports": "Reports",
  "/vendor/profile": "Profile",
  "/vendor/subscription": "Subscription",
  "/vendor/settings": "Settings",
};

const VendorLayout = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/vendor/dashboard") {
      return location.pathname === "/vendor" || location.pathname === path;
    }
    return location.pathname === path;
  };

  const pageTitle = routeTitles[location.pathname] || "Vendor Dashboard";
  const pageDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
          width: 280,
          padding: "32px 24px",
          background: isDark ? "#0b1120" : "#fff",
          borderRight: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
          boxShadow: isDark
            ? "2px 0 24px rgba(0,0,0,0.25)"
            : "2px 0 24px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#16a34a",
              display: "grid",
              placeItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: 700 }}>i</Text>
          </div>
          <Title
            level={4}
            style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            i-Share
          </Title>
          <Text
            style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            type="secondary"
          >
            Vendor Portal
          </Text>
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
                }}
              >
                {item.label}
              </Button>
            </NavLink>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 32, overflow: "auto" }}>
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

          <Space wrap>
            <Button
              icon={<BellOutlined />}
              type="default"
              style={{ borderRadius: 16 }}
            >
              Alerts
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ borderRadius: 16 }}
            >
              Add Product
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

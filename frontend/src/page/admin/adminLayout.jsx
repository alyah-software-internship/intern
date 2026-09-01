import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, Space, Tag, Typography } from "antd";
import {
  AppstoreOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  CloseOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const navItems = [
  {
    key: "controlPanel",
    label: "Control Panel",
    path: "/admin",
    icon: <DashboardOutlined />,
  },
  {
    key: "users",
    label: "Users & Flags",
    path: "/admin/users",
    icon: <TeamOutlined />,
    badge: "4",
  },
  {
    key: "vendorQueue",
    label: "Vendor Queue",
    path: "/admin/vendors",
    icon: <ShopOutlined />,
    badge: "1",
  },
  {
    key: "vendorsDirectory",
    label: "Vendors Directory",
    path: "/admin/vendors-directory",
    icon: <AppstoreOutlined />,
    badge: "5",
  },
  {
    key: "categoryRegistry",
    label: "Category Registry",
    path: "/admin/categories",
    icon: <BarChartOutlined />,
  },
  {
    key: "escrowLedger",
    label: "Escrow Ledger",
    path: "/admin/escrow-ledger",
    icon: <BankOutlined />,
  },
  {
    key: "mediationCases",
    label: "Mediation Cases",
    path: "/admin/mediation-cases",
    icon: <SafetyCertificateOutlined />,
    badge: "2",
  },
  {
    key: "systemHealth",
    label: "System Health",
    path: "/admin/system-health",
    icon: <BarChartOutlined />,
  },
  {
    key: "auditReports",
    label: "Audit Reports",
    path: "/admin/audit",
    icon: <FileTextOutlined />,
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/admin/notifications",
    icon: <BellOutlined />,
  },
  {
    key: "platformSettings",
    label: "Platform Settings",
    path: "/admin/platform-settings",
    icon: <SettingOutlined />,
  },
];

const AdminLayout = () => {
  const { theme } = useTheme();
  const { signOut } = useContext(AppContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarVisible = !isMobile || sidebarOpen;

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname === path;
  };

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
          width: 300,
          padding: isMobile ? "24px 18px" : "32px 24px",
          background: isDark ? "#071423" : "#0f172a",
          color: "#f8fafc",
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
          transition: "transform 0.25s ease",
          boxShadow: isDark
            ? "2px 0 28px rgba(0,0,0,0.35)"
            : "2px 0 28px rgba(15,23,42,0.08)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 26,
          }}
        >
          <div style={{ flex: 1 }}>
            <Text
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                color: "#f97316",
                fontWeight: 800,
                fontSize: 11,
              }}
            >
              i-Share Control
            </Text>
            <Title
              level={4}
              style={{
                margin: "10px 0 0",
                color: "#fff",
                lineHeight: 1.2,
                fontSize: 20,
              }}
            >
              Super Administrator
            </Title>
          </div>
          {isMobile && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setSidebarOpen(false)}
              style={{ color: "#f8fafc" }}
            />
          )}
        </div>

        <Card
          style={{
            borderRadius: 22,
            marginBottom: 28,
            background: isDark ? "#0b1726" : "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          styles={{ body: { padding: 20 } }}
        >
          <Space align="center" size={16} style={{ width: "100%" }}>
            <Avatar
              size={48}
              style={{
                background: "#f97316",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              IS
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                i-Share Admin
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                Full access control panel
              </Text>
            </div>
          </Space>

          <Text
            style={{
              display: "block",
              marginTop: 16,
              color: "#cbd5e1",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Manage users, vendors, categories, disputes, system health, and
            settings from one centralized dashboard.
          </Text>
        </Card>

        <div style={{ display: "grid", gap: 10 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.key}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  type={active ? "primary" : "text"}
                  block
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 14,
                    height: 50,
                    paddingInline: 16,
                    fontWeight: 600,
                    color: active ? undefined : "#e2e8f0",
                    background: active ? "#f97316" : "transparent",
                  }}
                >
                  <Space size={12} align="center">
                    {item.icon}
                    <span style={{ marginLeft: 0 }}>{item.label}</span>
                  </Space>
                  {item.badge ? (
                    <Tag
                      color={active ? "#ffffff" : "#f97316"}
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        borderRadius: 999,
                        color: active ? "#111827" : "#fff",
                        background: active ? "#ffffff" : "#f97316",
                      }}
                    >
                      {item.badge}
                    </Tag>
                  ) : null}
                </Button>
              </NavLink>
            );
          })}
        </div>
      </div>

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
          marginLeft: isMobile ? 0 : 0,
          minHeight: "100vh",
        }}
      >
        <div style={{ minHeight: "100vh" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Text
                style={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: isDark ? "#94a3b8" : "#64748b",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Global Control Platform
              </Text>
              <Title
                level={2}
                style={{
                  margin: "8px 0 0",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  fontSize: 32,
                  lineHeight: 1.1,
                }}
              >
                Overview
              </Title>
            </div>

            <Space wrap align="center" size={16}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: isDark
                    ? "0 12px 32px rgba(0,0,0,0.12)"
                    : "0 12px 32px rgba(15,23,42,0.06)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                <Text
                  style={{
                    color: isDark ? "#f8fafc" : "#0f172a",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  All Systems Operational
                </Text>
              </div>

              <Badge count={2} size="small">
                <Button
                  type="default"
                  shape="circle"
                  icon={<BellOutlined />}
                  onClick={() => navigate("/admin/notifications")}
                  style={{
                    width: 46,
                    height: 46,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                  }}
                />
              </Badge>

              <Button
                type="primary"
                style={{
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontWeight: 700,
                }}
              >
                Admin Node
              </Button>

              <Button
                danger
                type="default"
                icon={<LogoutOutlined />}
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </Space>
          </div>

          <div
            style={{
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(15,23,42,0.12)",
              marginBottom: 24,
            }}
          />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

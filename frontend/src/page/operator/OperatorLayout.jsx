import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Space, Typography } from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const navItems = [
  {
    key: "dashboard",
    label: "Overview",
    path: "/operator",
    icon: <DashboardOutlined />,
  },
  {
    key: "bookings",
    label: "My assignments",
    path: "/operator/bookings",
    icon: <CalendarOutlined />,
  },
  {
    key: "messages",
    label: "Messages",
    path: "/operator/messages",
    icon: <MailOutlined />,
  },
  {
    key: "profile",
    label: "My profile",
    path: "/operator/profile",
    icon: <UserOutlined />,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/operator/settings",
    icon: <SettingOutlined />,
  },
];

const OperatorLayout = () => {
  const { theme } = useTheme();
  const { user, signOut } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const fullName =
    [user?.first_name, user?.middle_name, user?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user?.name ||
    "Operator";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const pageTitle =
    navItems.find((item) => item.path === location.pathname)?.label ||
    "Operator overview";
  const isActive = (path) =>
    path === "/operator"
      ? location.pathname === "/operator"
      : location.pathname.startsWith(path);

  const closeMobileSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div
      className="operator-layout"
      style={{ background: isDark ? "#07111f" : "#f4f7f5" }}
    >
      {isMobile && sidebarOpen && (
        <button
          className="operator-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
        />
      )}
      <aside
        className="operator-sidebar"
        style={{
          background: isDark ? "#0c1726" : "#ffffff",
          borderColor: isDark ? "rgba(255,255,255,0.09)" : "#dbe7df",
          transform:
            isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="operator-brand">
          <img src="/logo.png" alt="iShare" />
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={closeMobileSidebar}
              aria-label="Close navigation"
            />
          )}
        </div>
        <div
          className="operator-identity"
          style={{ background: isDark ? "#122238" : "#edf7ef" }}
        >
          <Avatar size={44} style={{ background: "#16803c", fontWeight: 700 }}>
            {initials || "OP"}
          </Avatar>
          <div>
            <Text
              strong
              style={{
                color: isDark ? "#f8fafc" : "#14251a",
                display: "block",
              }}
            >
              {fullName}
            </Text>
            <Text
              style={{ color: isDark ? "#9fb2c7" : "#5e7164", fontSize: 12 }}
            >
              Field operator
            </Text>
          </div>
        </div>
        <nav className="operator-nav" aria-label="Operator navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={closeMobileSidebar}
              className={
                isActive(item.path)
                  ? "operator-nav-link is-active"
                  : "operator-nav-link"
              }
              style={{ color: isDark ? "#c7d4e1" : "#435349" }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="operator-sidebar-footer">
          <div className="operator-availability">
            <CheckCircleOutlined /> Available for work
          </div>
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            Log out
          </Button>
        </div>
      </aside>
      <main className="operator-main">
        <header className="operator-header">
          <div className="operator-header-title">
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              />
            )}
            <div>
              <Text className="operator-kicker">Operator workspace</Text>
              <Title level={2}>{pageTitle}</Title>
            </div>
          </div>
          <Space>
            <Button icon={<BellOutlined />} aria-label="Notifications" />
            <Button
              type="primary"
              onClick={() => navigate("/operator/bookings")}
            >
              View assignments
            </Button>
          </Space>
        </header>
        <div className="operator-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OperatorLayout;

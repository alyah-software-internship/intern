import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Dropdown,
  Space,
  Typography,
  Drawer,
} from "antd";

import {
  BellOutlined,
  HeartOutlined,
  MenuOutlined,
  MoonOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useTranslation } from "./LanguageProvider.jsx";
import { useTheme } from "../context/ThemeProvider.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import ThemeSwitcher from "./ThemeSwitcher.jsx";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#1890ff" : undefined,
  fontWeight: isActive ? 600 : undefined,
});

const createProfileItems = (handleLogout, t) => [
  {
    key: "dashboard",
    label: (
      <NavLink to="/dashboard" style={navLinkStyle}>
        {t.nav.dashboard}
      </NavLink>
    ),
  },
  {
    key: "profile",
    label: (
      <NavLink to="/profile" style={navLinkStyle}>
        {t.nav.profile}
      </NavLink>
    ),
  },
  {
    key: "settings",
    label: (
      <NavLink to="/settings" style={navLinkStyle}>
        {t.nav.settings}
      </NavLink>
    ),
  },
  {
    key: "booking",
    label: (
      <NavLink to="/bookings" style={navLinkStyle}>
        {t.nav.myBookings}
      </NavLink>
    ),
  },
  {
    key: "wishlist",
    label: (
      <NavLink to="/wishlist" style={navLinkStyle}>
        {t.nav.wishlist}
      </NavLink>
    ),
  },
  {
    key: "messages",
    label: (
      <NavLink to="/messages" style={navLinkStyle}>
        {t.nav.messages}
      </NavLink>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "vendor",
    label: <Link to="/vendor">{t.nav.becomeVendor}</Link>,
  },
  {
    key: "logout",
    danger: true,
    label: t.nav.logout,
    onClick: handleLogout,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isWide, setIsWide] = useState(window.innerWidth >= 1300);
  const [langHover, setLangHover] = useState(false);
  const { isSignedIn, setIsSignedIn } = useContext(AppContext);
  const { theme } = useTheme();
  const { setLanguage, translation: t } = useTranslation();

  const handleLogout = () => {
    setIsSignedIn(false);
    setDrawerOpen(false);
    navigate("/");
  };

  const navItems = [
    {
      key: "home",
      label: (
        <NavLink to="/" style={navLinkStyle}>
          {t.nav.home}
        </NavLink>
      ),
    },
    {
      key: "rentals",
      label: (
        <NavLink to="/rentals" style={navLinkStyle}>
          {t.nav.rentals}
        </NavLink>
      ),
    },
    {
      key: "categories",
      label: (
        <NavLink to="/categories" style={navLinkStyle}>
          {t.nav.categories}
        </NavLink>
      ),
    },
    {
      key: "works",
      label: (
        <NavLink to="/how-it-works" style={navLinkStyle}>
          {t.nav.howItWorks}
        </NavLink>
      ),
    },
    {
      key: "pricing",
      label: (
        <NavLink to="/pricing" style={navLinkStyle}>
          {t.nav.pricing}
        </NavLink>
      ),
    },
    {
      key: "about",
      label: (
        <NavLink to="/about" style={navLinkStyle}>
          {t.nav.about}
        </NavLink>
      ),
    },
    {
      key: "contact",
      label: (
        <NavLink to="/contact" style={navLinkStyle}>
          {t.nav.contact}
        </NavLink>
      ),
    },
  ];

  const profileItems = createProfileItems(handleLogout, t);
  const guestItems = [
    {
      key: "signin",
      label: <Link to="/signin">{t.nav.login}</Link>,
    },
    {
      key: "get-started",
      label: <Link to="/signup">{t.nav.register}</Link>,
    },
  ];

  const drawerItems = [
    ...navItems,
    {
      type: "divider",
    },
    ...profileItems,
  ];

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 1300);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AntHeader
      style={{
        background: theme === "dark" ? "#111827" : "#fff",
        height: langHover ? 110 : 80,
        transition: "height 0.2s ease, background 0.2s ease",
        paddingInline: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
          theme === "dark"
            ? "0 2px 16px rgba(0,0,0,0.35)"
            : "0 2px 12px rgba(0,0,0,.05)",
        borderBottom:
          theme === "dark"
            ? "1px solid rgba(148,163,184,0.12)"
            : "1px solid rgba(15,23,42,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left */}
      <Space size={24} align="center">
        {/* logo image */}
        <Link to="/">
          <Space align="center" size={16}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(37, 99, 235, 0.12)",
              }}
            >
              <img
                src="/logo1.png"
                alt="i-Share logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Space>
        </Link>

        {isWide && (
          <>
            <Menu
              mode="horizontal"
              selectable={false}
              style={{
                borderBottom: 0,
                minWidth: 650,
                background: "transparent",
              }}
              items={navItems}
            />
          </>
        )}
      </Space>

      {/* Right */}
      <Space size={18}>
        <LanguageSwitcher />
        <ThemeSwitcher />
        {isSignedIn && (
          <Badge count={2}>
            <Button
              shape="circle"
              icon={<BellOutlined />}
              onClick={() => navigate("/notifications")}
              style={{
                background: theme === "dark" ? "#1f2937" : undefined,
                color: theme === "dark" ? "#f8fafc" : undefined,
              }}
            />
          </Badge>
        )}

        {!isWide && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            onClick={() => setDrawerOpen(true)}
          />
        )}

        {isWide ? (
          isSignedIn ? (
            <>
              <Badge>
                <Button
                  shape="circle"
                  icon={<HeartOutlined />}
                  onClick={() => navigate("/wishlist")}
                />
              </Badge>

              <Dropdown menu={{ items: profileItems }} trigger={["click"]}>
                <Button
                  style={{
                    height: 52,
                    borderRadius: 30,
                  }}
                >
                  <Space>
                    <Avatar
                      style={{
                        background: "#1677ff",
                      }}
                      icon={<UserOutlined />}
                    />

                    <div
                      style={{
                        textAlign: "left",
                        lineHeight: 1.1,
                      }}
                    >
                      <Text strong>Marcus</Text>
                      <br />
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Premium
                      </Text>
                    </div>

                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                type="default"
                shape="round"
                onClick={() => navigate("/signin")}
              >
                {t.nav.login}
              </Button>
              <Button
                type="primary"
                shape="round"
                onClick={() => navigate("/signup")}
              >
                {t.nav.register}
              </Button>
            </>
          )
        ) : null}
      </Space>

      <Drawer
        title={t.nav.menu}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectable={false}
          items={
            isSignedIn
              ? drawerItems
              : [...navItems, { type: "divider" }, ...guestItems]
          }
          style={{ borderRight: 0 }}
          onClick={() => setDrawerOpen(false)}
        />
      </Drawer>
    </AntHeader>
  );
};

export default Header;

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
import {AppContext} from "../context/AppContext.jsx";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

 
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#1890ff" : undefined,
  fontWeight: isActive ? 600 : undefined,
});

const navItems = [
  {
    key: "home",
    label: (
      <NavLink to="/" style={navLinkStyle}>
        Home
      </NavLink>
    ),
  },
  {
    key: "rentals",
    label: (
      <NavLink to="/rentals" style={navLinkStyle}>
        Rentals
      </NavLink>
    ),
  },
  {
    key: "categories",
    label: (
      <NavLink to="/categories" style={navLinkStyle}>
        Categories
      </NavLink>
    ),
  },
  {
    key: "works",
    label: (
      <NavLink to="/how-it-works" style={navLinkStyle}>
        How It Works
      </NavLink>
    ),
  },
  {
    key: "pricing",
    label: (
      <NavLink to="/pricing" style={navLinkStyle}>
        Pricing
      </NavLink>
    ),
  },
  {
    key: "about",
    label: (
      <NavLink to="/about" style={navLinkStyle}>
        About
      </NavLink>
    ),
  },
  {
    key: "contact",
    label: (
      <NavLink to="/contact" style={navLinkStyle}>
        Contact
      </NavLink>
    ),
  },
];

const profileItems = [
  {
    key: "dashboard",
    label: (
      <NavLink to="/dashboard" style={navLinkStyle}>
        My Dashboard
      </NavLink>
    ),
  },
  {
    key: "profile",
    label: (
      <NavLink to="/profile" style={navLinkStyle}>
        Profile
      </NavLink>
    ),
  },
  {
    key: "settings",
    label: (
      <NavLink to="/settings" style={navLinkStyle}>
        Settings
      </NavLink>
    ),
  },
  {
    key: "booking",
    label: (
      <NavLink to="/bookings" style={navLinkStyle}>
        My Bookings
      </NavLink>
    ),
  },
  {
    key: "wishlist",
    label: (
      <NavLink to="/wishlist" style={navLinkStyle}>
        Wishlist
      </NavLink>
    ),
  },
  {
    key: "messages",
    label: (
      <NavLink to="/messages" style={navLinkStyle}>
        Messages
      </NavLink>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "vendor",
    label: <Link to="/vendor">Become a Vendor</Link>,
  },
  {
    key: "logout",
    danger: true,
    label: "Logout",
  },
];

const guestItems = [
  {
    key: "signin",
    label: <Link to="/signin">Sign In</Link>,
  },
  {
    key: "get-started",
    label: <Link to="/signup">Get Started</Link>,
  },
];

const drawerItems = [
  ...navItems,
  {
    type: "divider",
  },
  ...profileItems,
];

const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isWide, setIsWide] = useState(window.innerWidth >= 1300);
  const {isSignedIn} = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 1300);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <AntHeader
      style={{
        background: "#fff",
        height: 80,
        paddingInline: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left */}
      <Space size={24} align="center">
        <Link to="/">
          <Space>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg,#2563EB,#10B981)",
              }}
            />

            <div>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                i-Share
              </Text>

              <br />

              <Text
                type="secondary"
                style={{
                  letterSpacing: 1,
                  fontSize: 11,
                }}
              >
                MARKETPLACE
              </Text>
            </div>
          </Space>
        </Link>

        {isWide && (
          <Menu
            mode="horizontal"
            selectable={false}
            style={{
              borderBottom: 0,
              minWidth: 650,
            }}
            items={navItems}
          />
        )}
      </Space>

      {/* Right */}
      <Space size={18}>
        {isSignedIn && (
          <Badge count={2}>
            <Button shape="circle" icon={<BellOutlined />} />
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
              <Button shape="circle" icon={<MoonOutlined />} />

              <Badge>
                <Button shape="circle" icon={<HeartOutlined />} />
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
                Sign In
              </Button>
              <Button
                type="primary"
                shape="round"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </>
          )
        ) : null}
      </Space>

      <Drawer
        title="Menu"
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

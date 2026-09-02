import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Button,
} from "antd";
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const ControlPanel = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [dashboard, setDashboard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (loadError) {
      messageApi.error("Failed to load dashboard data");
    }
  }, [loadError, messageApi]);

  const fetchDashboard = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/dashboard`,
        authConfig(),
      );
      setDashboard(response.data?.dashboard || response.data?.stats || {});
      setActivities(response.data?.recent_activities || []);
    } catch (error) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [backendUrl]);

  if (loading || !dashboard) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
      {contextHolder}

      <Card
        style={{
          borderRadius: 20,
          background: isDark ? "#0f172a" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.07)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <Text
              style={{ display: "block", letterSpacing: 1.2, fontSize: 12 }}
            >
              PLATFORM OVERVIEW
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              Control Panel
            </Title>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchDashboard}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Total Users"
              value={dashboard.total_users || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Total Vendors"
              value={dashboard.total_vendors || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Total Bookings"
              value={dashboard.total_bookings || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Total Revenue"
              value={dashboard.total_revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#ef4444" }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Customers"
            style={{
              borderRadius: 20,
              background: isDark ? "#0f172a" : "#fff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <Statistic
              value={dashboard.total_customers || 0}
              suffix={`customers`}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Pending Bookings"
            style={{
              borderRadius: 20,
              background: isDark ? "#0f172a" : "#fff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <Statistic
              value={dashboard.pending_bookings || 0}
              valueStyle={{ color: "#ef4444" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ControlPanel;

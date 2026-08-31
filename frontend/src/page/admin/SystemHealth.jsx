import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Space, Tag, Typography, Button, Progress } from "antd";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const SystemHealth = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [systemMetrics, setSystemMetrics] = useState([]);
  const [resourceUsage, setResourceUsage] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/system-health`,
        authConfig(),
      );
      setSystemMetrics(response.data?.metrics || []);
      setResourceUsage(response.data?.resource_usage || []);
      setSummary(response.data?.summary || {});
    } catch (error) {
      setSystemMetrics([
        { name: "Database", status: "warning", uptime: "--" },
        { name: "API Server", status: "healthy", uptime: "--" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
  }, [backendUrl]);

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
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
              SYSTEM MONITORING
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              System Health
            </Title>
            <Text type="secondary">
              Monitor system performance and availability.
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchSystemHealth}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 14 }}>
            Live Summary
          </Text>
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            <Col xs={12} sm={6}>
              <Text type="secondary">Users</Text>
              <br />
              <Text strong>{summary.total_users ?? 0}</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text type="secondary">Vendors</Text>
              <br />
              <Text strong>{summary.total_vendors ?? 0}</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text type="secondary">Bookings</Text>
              <br />
              <Text strong>{summary.total_bookings ?? 0}</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text type="secondary">Revenue</Text>
              <br />
              <Text strong>{summary.total_revenue ?? 0}</Text>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Text strong style={{ fontSize: 14 }}>
            Service Status
          </Text>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {systemMetrics.map((metric) => (
              <div
                key={metric.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 8,
                  background: isDark ? "#0b1726" : "#f0f4f8",
                  border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1",
                }}
              >
                <Space>
                  <CloudServerOutlined style={{ fontSize: 16 }} />
                  <Text>{metric.name}</Text>
                </Space>
                <Space>
                  <Tag
                    color={
                      metric.status === "healthy"
                        ? "green"
                        : metric.status === "warning"
                          ? "orange"
                          : "red"
                    }
                    icon={<CheckCircleOutlined />}
                  >
                    {metric.status?.toUpperCase() || "UNKNOWN"}
                  </Tag>
                  <Text type="secondary">{metric.uptime}</Text>
                </Space>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Text strong style={{ fontSize: 14 }}>
            Resource Usage
          </Text>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {resourceUsage.map((resource) => (
              <Col xs={24} sm={12} lg={6} key={resource.name}>
                <div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text>{resource.name}</Text>
                    <Progress
                      percent={resource.usage}
                      strokeColor={{
                        "0%": "#10b981",
                        "50%": "#f59e0b",
                        "100%": "#ef4444",
                      }}
                    />
                  </Space>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default SystemHealth;

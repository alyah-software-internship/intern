import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  message,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Form,
  DatePicker,
  Select,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import {
  DollarOutlined,
  DownloadOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const AdminFinancialDashboard = () => {
  const { backendUrl, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/admin/financial/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      setDashboard(response.data.dashboard);
    } catch (err) {
      messageApi.error("Failed to load financial dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
      {contextHolder}

      <h1>Financial Dashboard</h1>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Payments"
              value={dashboard?.total_payments || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#0066cc" }}
              icon={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Platform Revenue"
              value={dashboard?.platform_revenue || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#22c55e" }}
              suffix={`(${((dashboard?.platform_revenue / (dashboard?.total_payments || 1)) * 100).toFixed(1)}%)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Vendor Earnings"
              value={dashboard?.total_vendor_earnings || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Pending Earnings"
              value={dashboard?.pending_earnings || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Available Balance"
              value={dashboard?.total_available_balance || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#6366f1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Withdrawals"
              value={dashboard?.total_withdrawals || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#8b5cf6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Pending Withdrawals"
              value={dashboard?.pending_withdrawals || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#ec4899" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Completed Withdrawals"
              value={dashboard?.completed_withdrawals || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#22c55e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Failed Payments"
              value={dashboard?.failed_payment_count || 0}
              suffix={`(${currency} ${dashboard?.failed_payment_amount || 0})`}
              valueStyle={{ color: "#ef4444" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Refunds"
              value={dashboard?.total_refunds || 0}
              prefix={`${currency} `}
              valueStyle={{ color: "#14b8a6" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card style={{ marginBottom: 32 }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => (window.location.href = "/admin/payments")}
          >
            View All Payments
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => (window.location.href = "/admin/withdrawals")}
          >
            Manage Withdrawals
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => (window.location.href = "/admin/refunds")}
          >
            View Refunds
          </Button>
          <Button icon={<DownloadOutlined />}>Export Report</Button>
        </Space>
      </Card>

      {/* Summary Statistics */}
      <Card title="Summary Statistics">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                Average Payment Amount
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {currency}{" "}
                {(
                  (dashboard?.total_payments || 0) /
                  (dashboard?.payment_count || 1)
                ).toFixed(2)}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                Average Withdrawal Amount
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {currency}{" "}
                {(
                  (dashboard?.total_withdrawals || 0) /
                  (dashboard?.withdrawal_count || 1)
                ).toFixed(2)}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                Platform Commission %
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {(
                  ((dashboard?.platform_revenue || 0) /
                    (dashboard?.total_payments || 1)) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                Vendor Commission Paid
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                {currency} {dashboard?.completed_withdrawals || 0}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminFinancialDashboard;

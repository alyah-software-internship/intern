import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Empty, Spin, Tag, Typography, message } from "antd";
import {
  EnvironmentOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date not set";

const statusColor = {
  pending: "gold",
  confirmed: "blue",
  active: "green",
  completed: "default",
  cancelled: "red",
};

const OperatorAssignments = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const isDark = theme === "dark";
  const textColor = isDark ? "#f8fafc" : "#16251b";
  const mutedColor = isDark ? "#9db0c4" : "#617066";

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/operator/assignments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAssignments(response.data?.assignments || []);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load assignments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      Promise.resolve().then(loadAssignments);
    }
  }, [backendUrl]);

  return (
    <div className="operator-assignments-page">
      {contextHolder}
      <div className="operator-assignment-page-heading">
        <div>
          <Text className="operator-kicker">Your work queue</Text>
          <Title level={2} style={{ color: textColor }}>
            Assigned bookings
          </Title>
          <Text style={{ color: mutedColor }}>
            Manage the rental work assigned to you by vendors.
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadAssignments}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      {loading ? (
        <Card>
          <Spin size="large" />
        </Card>
      ) : assignments.length === 0 ? (
        <Card>
          <Empty description="No assignments yet" />
        </Card>
      ) : (
        <div className="operator-assignment-cards">
          {assignments.map((assignment) => {
            const product = assignment.product || {};
            const customer = assignment.customer || {};
            const vendor = assignment.vendor || {};
            return (
              <Card key={assignment.id} className="operator-assignment-card">
                <div className="operator-assignment-card-top">
                  <div>
                    <Text className="operator-assignment-reference">
                      {assignment.booking_reference ||
                        `Assignment #${assignment.id}`}
                    </Text>
                    <Title level={4} style={{ color: textColor }}>
                      {product.name || "Assigned rental"}
                    </Title>
                  </div>
                  <Tag color={statusColor[assignment.status] || "default"}>
                    {assignment.status || "pending"}
                  </Tag>
                </div>
                <div className="operator-assignment-details">
                  <div>
                    <Text type="secondary">Schedule</Text>
                    <Text strong>
                      {formatDate(assignment.start_date)} -{" "}
                      {formatDate(assignment.end_date)}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Customer</Text>
                    <Text strong>
                      {customer.full_name ||
                        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
                        "Customer"}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Vendor</Text>
                    <Text strong>
                      {vendor.business_name || vendor.name || "Vendor"}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Location</Text>
                    <Text strong>
                      <EnvironmentOutlined />{" "}
                      {assignment.delivery_address ||
                        "Location to be confirmed"}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Payment</Text>
                    <Tag
                      color={
                        assignment.payment_status === "paid" ? "green" : "gold"
                      }
                    >
                      {assignment.payment_status || "pending"}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary">Security deposit</Text>
                    <Tag
                      color={
                        assignment.security_deposit_status === "held"
                          ? "blue"
                          : "default"
                      }
                    >
                      {assignment.security_deposit_status ||
                        assignment.securityDeposit?.status ||
                        "pending"}
                    </Tag>
                  </div>
                </div>
                <div className="operator-assignment-card-footer">
                  <Text style={{ color: mutedColor }}>
                    Operator status: {assignment.operator_status || "assigned"}
                  </Text>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      navigate(`/booking-details/${assignment.id}`)
                    }
                  >
                    View assignment
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OperatorAssignments;

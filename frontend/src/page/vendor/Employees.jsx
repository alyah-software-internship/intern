import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Tag,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  message,
} from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;
const { Item } = Form;

const statusMeta = {
  available: { label: "AVAILABLE", color: "#059669", bg: "#ecfdf5" },
  busy: { label: "BUSY", color: "#4f46e5", bg: "#eef2ff" },
  on_leave: { label: "ON LEAVE", color: "#f59e0b", bg: "#fff7ed" },
  unavailable: { label: "UNAVAILABLE", color: "#ef4444", bg: "#fee2e2" },
  inactive: { label: "INACTIVE", color: "#6b7280", bg: "#f3f4f6" },
};

const Employees = () => {
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const [form] = Form.useForm();
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${localStorage.getItem("authToken")}` }),
    [],
  );

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/vendor/operators`, {
        headers: authHeaders,
      });

      const rows =
        response.data?.operators?.data || response.data?.operators || [];
      setOperators(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Failed to load operators:", error);
      messageApi.error(
        error.response?.data?.message || "Unable to load operators.",
      );
      setOperators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      fetchOperators();
    }
  }, [backendUrl]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await axios.post(
        `${backendUrl}/vendor/operators`,
        {
          full_name: values.full_name,
          phone: values.phone,
          email: values.email || null,
          specialization: values.specialization || "General Operator",
          experience_years: Number(values.experience_years || 0),
          hourly_rate: Number(values.hourly_rate || 0),
          daily_rate: Number(values.daily_rate || 0),
          weekly_rate: Number(values.weekly_rate || 0),
          monthly_rate: Number(values.monthly_rate || 0),
          available_status: values.available_status || "available",
        },
        { headers: authHeaders },
      );

      messageApi.success("Operator added successfully.");
      form.resetFields();
      setModalVisible(false);
      fetchOperators();
    } catch (error) {
      console.error("Failed to create operator:", error);
      messageApi.error(
        error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {})[0]?.[0] ||
          "Unable to add operator.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeOperator = async (id) => {
    try {
      await axios.delete(`${backendUrl}/vendor/operators/${id}`, {
        headers: authHeaders,
      });
      messageApi.success("Operator removed successfully.");
      fetchOperators();
    } catch (error) {
      console.error("Failed to delete operator:", error);
      messageApi.error(
        error.response?.data?.message || "Unable to remove operator.",
      );
    }
  };

  const operatorCards = useMemo(
    () =>
      operators.map((operator) => {
        const initials = (operator.full_name || "OP")
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

        const statusKey =
          operator.is_active === false
            ? "inactive"
            : operator.available_status || "available";
        const meta = statusMeta[statusKey] || statusMeta.available;

        return {
          id: operator.id,
          initials,
          name: operator.full_name || "Operator",
          role: operator.specialization || "General Operator",
          phone: operator.phone || "No phone number",
          email: operator.email || "No email",
          status: meta.label,
          statusColor: meta.color,
          statusBg: meta.bg,
          joined: operator.created_at
            ? new Date(operator.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Joined recently",
        };
      }),
    [operators],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      {contextHolder}
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Title
                level={2}
                style={{
                  marginBottom: 4,
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                Authorized Operator Registry
              </Title>
              <Text
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                  fontSize: 16,
                }}
              >
                Assign drivers and hydraulic engineers to handle specific rental
                logistics & safety inspections.
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: 10,
                background: "#4f46e5",
                border: "none",
                fontWeight: 700,
              }}
              onClick={() => setModalVisible(true)}
            >
              + Add Operator
            </Button>
          </div>
        </Col>

        {loading ? (
          <Col xs={24}>
            <Card
              style={{
                borderRadius: 18,
                background: isDark ? "#0f172a" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                Loading operators...
              </Text>
            </Card>
          </Col>
        ) : operatorCards.length === 0 ? (
          <Col xs={24}>
            <Card
              style={{
                borderRadius: 18,
                background: isDark ? "#0f172a" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                No operators found yet. Add your first operator.
              </Text>
            </Card>
          </Col>
        ) : (
          operatorCards.map((operator) => (
            <Col xs={24} sm={12} xl={6} key={operator.id}>
              <Card
                style={{
                  borderRadius: 18,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: isDark
                    ? "0 12px 32px rgba(0,0,0,0.18)"
                    : "0 10px 24px rgba(15,23,42,0.06)",
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Space align="center" size={12}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: "#e5e7eb",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        color: "#1f2937",
                      }}
                    >
                      {operator.initials}
                    </div>

                    <Tag
                      style={{
                        borderRadius: 8,
                        padding: "2px 10px",
                        fontWeight: 700,
                        background: operator.statusBg,
                        color: operator.statusColor,
                        border: "none",
                      }}
                    >
                      {operator.status}
                    </Tag>
                  </Space>

                  <div>
                    <Title
                      level={4}
                      style={{
                        margin: 0,
                        marginBottom: 4,
                        color: isDark ? "#f8fafc" : "#111827",
                      }}
                    >
                      {operator.name}
                    </Title>
                    <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                      {operator.role}
                    </Text>
                  </div>

                  <Space direction="vertical" size={6}>
                    <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                      <PhoneOutlined style={{ marginRight: 6 }} />
                      {operator.phone}
                    </Text>
                    <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                      <MailOutlined style={{ marginRight: 6 }} />
                      {operator.email}
                    </Text>
                  </Space>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                      {operator.joined}
                    </Text>
                    <Button
                      danger
                      size="small"
                      onClick={() => handleRevokeOperator(operator.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </Space>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title="Add Operator"
        open={modalVisible}
        onCancel={() => {
          form.resetFields();
          setModalVisible(false);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Item
            label="Full Name"
            name="full_name"
            rules={[
              { required: true, message: "Please enter the operator name" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Item>
          <Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+256 712 345 678" />
          </Item>
          <Item label="Email" name="email">
            <Input placeholder="john@example.com" />
          </Item>
          <Item label="Specialization" name="specialization">
            <Input placeholder="Heavy Equipment Operator" />
          </Item>
          <Item label="Experience Years" name="experience_years">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Item>
          <Row gutter={12}>
            <Col span={12}>
              <Item label="Hourly Rate" name="hourly_rate">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Item>
            </Col>
            <Col span={12}>
              <Item label="Daily Rate" name="daily_rate">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Item label="Weekly Rate" name="weekly_rate">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Item>
            </Col>
            <Col span={12}>
              <Item label="Monthly Rate" name="monthly_rate">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Item>
            </Col>
          </Row>
          <Item
            label="Availability"
            name="available_status"
            initialValue="available"
          >
            <Select
              options={[
                { value: "available", label: "Available" },
                { value: "busy", label: "Busy" },
                { value: "on_leave", label: "On Leave" },
                { value: "unavailable", label: "Unavailable" },
              ]}
            />
          </Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Save Operator
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;

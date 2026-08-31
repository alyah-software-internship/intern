import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Table,
  Image,
  Button,
  message,
} from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const checkoutStatusColors = {
  working_in_field: "green",
  returned: "blue",
  damaged: "red",
  pending: "gold",
};

const Bookings = () => {
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const normalizeImageUrl = (value) => {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    if (trimmed.startsWith("data:image/")) {
      return trimmed;
    }

    const cleanPath = trimmed.replace(/^\/+/, "");

    if (cleanPath.startsWith("storage/")) {
      return `${backendUrl || "http://127.0.0.1:8000"}/` + cleanPath;
    }

    if (backendUrl) {
      return `${backendUrl}/storage/${cleanPath}`;
    }

    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  useEffect(() => {
    let isCurrent = true;

    axios
      .get(`${backendUrl}/vendor/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (!isCurrent) return;

        const rows = response.data?.bookings || response.data?.data || [];
        setBookingsList(Array.isArray(rows) ? rows : []);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error("Failed to fetch vendor bookings:", error);
        messageApi.error(
          error.response?.data?.message || "Unable to load vendor bookings.",
        );
        setBookingsList([]);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [backendUrl, messageApi]);

  const pendingCount = useMemo(
    () =>
      bookingsList.filter(
        (booking) => String(booking.status).toLowerCase() === "pending",
      ).length,
    [bookingsList],
  );

  const activeRows = useMemo(
    () =>
      bookingsList.map((booking) => {
        const product = booking.product || {};
        const customer = booking.customer || {};
        const startDate = booking.start_date || booking.startDate;
        const endDate = booking.end_date || booking.endDate;
        const productImageValue =
          product.images?.find((image) => image?.is_primary)?.image_url ||
          product.images?.[0]?.image_url ||
          product.images?.[0]?.url ||
          product.image_url ||
          product.image;

        const productImage =
          normalizeImageUrl(productImageValue) || "/logo.png";

        return {
          key: booking.id,
          bookingId: booking.id,
          customerId: customer.id || booking.customer_id || booking.user_id,
          productName: product.name || "Rental Item",
          productImage,
          customerName:
            customer.name ||
            `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
            "Customer",
          startDate: startDate ? new Date(startDate).toLocaleDateString() : "-",
          endDate: endDate ? new Date(endDate).toLocaleDateString() : "-",
          checkoutStatus: booking.status || "pending",
          escrowHolding: booking.security_deposit_amount
            ? `$${Number(booking.security_deposit_amount).toFixed(2)}`
            : "$0.00",
        };
      }),
    [bookingsList, normalizeImageUrl],
  );

  const columns = [
    {
      title: "RENTED PRODUCT",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <Space align="start" size={12}>
          <Image
            width={42}
            height={42}
            src={record.productImage || "/logo.png"}
            preview={false}
            loading="lazy"
            fallback="/logo.png"
            style={{ borderRadius: 10, objectFit: "cover" }}
          />
          <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
            {record.productName}
          </Text>
        </Space>
      ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      key: "customerName",
      render: (customerName) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
          {customerName}
        </Text>
      ),
    },
    {
      title: "DATES",
      dataIndex: "dates",
      key: "dates",
      render: (_, record) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
          {record.startDate} to {record.endDate}
        </Text>
      ),
    },
    {
      title: "CHECKOUT STATUS",
      dataIndex: "checkoutStatus",
      key: "checkoutStatus",
      render: (status) => {
        const normalized = String(status || "pending").toLowerCase();
        const tagColor =
          normalized === "completed"
            ? "green"
            : normalized === "cancelled"
              ? "red"
              : normalized === "active"
                ? "blue"
                : normalized === "pending"
                  ? "gold"
                  : "default";

        return (
          <Tag
            color={tagColor}
            style={{
              borderRadius: 6,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "ESCROW HOLDING",
      dataIndex: "escrowHolding",
      key: "escrowHolding",
      render: (value) => (
        <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "HANDOVERS / DAMAGE LOG",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space size={8} wrap>
          <Button
            type="text"
            size="small"
            icon={<MessageOutlined />}
            title="Chat with customer"
            style={{
              color: "#2563eb",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              background: isDark ? "rgba(59, 130, 246, 0.12)" : "#eff6ff",
            }}
            onClick={() =>
              navigate("/vendor/messages", {
                state: {
                  bookingId: record.bookingId,
                  customerId: record.customerId,
                  customerName: record.customerName,
                  productName: record.productName,
                },
              })
            }
          >
            Message
          </Button>
          <Button
            type="default"
            size="small"
            style={{ borderColor: "#60a5fa" }}
          >
            Returned Clean
          </Button>
          <Button danger size="small">
            Log Damages
          </Button>
        </Space>
      ),
    },
  ];

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
          <Title
            level={2}
            style={{ marginBottom: 4, color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            Reservations Ledger
          </Title>
          <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 16 }}>
            Approve or reject customer booking requests, change checkout states,
            and assess returned damages.
          </Text>
        </Col>

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
            <Space align="center" size={10}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "inline-block",
                }}
              />
              <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                INCOMING PENDING APPROVALS
              </Text>
            </Space>
            <div
              style={{
                marginTop: 18,
                paddingTop: 32,
                textAlign: "center",
                color: isDark ? "#94a3b8" : "#64748b",
                fontStyle: "italic",
              }}
            >
              {pendingCount > 0
                ? `${pendingCount} customer request(s) pending approval.`
                : "No pending customer requests at the moment."}
            </div>
          </Card>
        </Col>

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
            <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
              ACTIVE FIELD LEASES & PICKUPS
            </Text>

            <div style={{ marginTop: 16 }}>
              <Table
                columns={columns}
                dataSource={activeRows}
                loading={loading}
                pagination={false}
                rowKey="key"
                scroll={{ x: 900 }}
                locale={{ emptyText: "No bookings found." }}
                style={{ background: isDark ? "#0f172a" : "#ffffff" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Bookings;

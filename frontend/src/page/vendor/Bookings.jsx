import React, { useMemo } from "react";
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
} from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { bookings, rentalItems, vendors } from "../../assets/dummyAssets.js";

const { Title, Text } = Typography;

const checkoutStatusColors = {
  working_in_field: "green",
  returned: "blue",
  damaged: "red",
  pending: "gold",
};

const Bookings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const activeRows = useMemo(
    () =>
      bookings.slice(0, 1).map((booking) => {
        const product =
          rentalItems.find((item) => item.id === booking.productId) || {};
        const customer =
          vendors.find((item) => item.id === booking.vendorId) || {};

        return {
          key: booking.id,
          productName: product.title || booking.productId,
          productImage: product.images?.[0] || product.image,
          customerName: customer.name || "Marcus Sterling",
          startDate: booking.startDate,
          endDate: booking.endDate,
          checkoutStatus: "WORKING IN FIELD",
          escrowHolding: "$900",
        };
      }),
    [],
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
            src={record.productImage}
            preview={false}
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
      render: (status) => (
        <Tag
          color={checkoutStatusColors.working_in_field || "green"}
          style={{ borderRadius: 6, fontWeight: 700 }}
        >
          {status}
        </Tag>
      ),
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
      render: () => (
        <Space size={8} wrap>
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
              No pending customer requests at the moment.
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
                pagination={false}
                rowKey="key"
                scroll={{ x: 900 }}
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

import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Input,
  Table,
  Button,
  Tag,
} from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { bookings, users } from "../../assets/dummyAssets.js";

const { Title, Text } = Typography;

const Customers = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchValue, setSearchValue] = useState("");

  const customerRows = useMemo(() => {
    return users
      .filter((user) => user.role === "customer")
      .map((user) => {
        const userBookings = bookings.filter(
          (booking) => booking.customerId === user.id,
        );
        const totalRevenue = userBookings.reduce(
          (sum, booking) => sum + booking.totalAmount,
          0,
        );
        const lastActivity = userBookings[0]?.startDate || user.joinDate;

        return {
          key: user.id,
          customerName: user.name,
          email: user.email,
          bookingsDispatched: userBookings.length,
          totalRentalRevenue: `$${totalRevenue}`,
          lastActivity,
          initials: user.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        };
      });
  }, []);

  const filteredRows = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return customerRows;

    return customerRows.filter((row) => {
      return [row.customerName, row.email, row.lastActivity]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [customerRows, searchValue]);

  const columns = [
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <Space size={12}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#e5e7eb",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              color: "#4f46e5",
            }}
          >
            {record.initials}
          </div>
          <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
            {name}
          </Text>
        </Space>
      ),
    },
    {
      title: "EMAIL ADDRESS",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>{email}</Text>
      ),
    },
    {
      title: "BOOKINGS DISPATCHED",
      dataIndex: "bookingsDispatched",
      key: "bookingsDispatched",
      render: (count) => <Text>{count} orders</Text>,
    },
    {
      title: "TOTAL RENTAL REVENUE",
      dataIndex: "totalRentalRevenue",
      key: "totalRentalRevenue",
      render: (value) => (
        <Text strong style={{ color: "#4f46e5" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "LAST ACTIVITY",
      dataIndex: "lastActivity",
      key: "lastActivity",
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: () => (
        <Button type="primary" size="small">
          Message
        </Button>
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
      <Row gutter={[16, 16]}>
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
                Registered Customer Roster
              </Title>
              <Text
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                  fontSize: 16,
                }}
              >
                Track customer spend, active reservations count, and dispatch
                direct encrypted text alerts.
              </Text>
            </div>

            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search customers..."
              style={{
                width: 280,
                borderRadius: 8,
                background: isDark ? "#0f172a" : "#ffffff",
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            />
          </div>
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
            <Table
              columns={columns}
              dataSource={filteredRows}
              pagination={false}
              rowKey="key"
              scroll={{ x: 900 }}
              style={{ background: isDark ? "#0f172a" : "#ffffff" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Customers;

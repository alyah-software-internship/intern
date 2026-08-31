import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const Customers = () => {
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

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
          error.response?.data?.message || "Unable to load vendor customers.",
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

  const customerRows = useMemo(() => {
    // Group bookings by customer to avoid duplicates
    const customerMap = new Map();

    bookingsList.forEach((booking) => {
      const customer = booking.customer || {};
      const customerId = customer.id;

      if (customerId) {
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            id: customerId,
            name:
              customer.name ||
              `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
              "Customer",
            email: customer.email || "No email",
            bookings: [],
          });
        }
        customerMap.get(customerId).bookings.push(booking);
      }
    });

    // Convert map to array and format for table
    return Array.from(customerMap.values()).map((customer) => {
      const totalRevenue = customer.bookings.reduce((sum, booking) => {
        return sum + Number(booking.total_amount || booking.totalAmount || 0);
      }, 0);

      const lastActivity =
        customer.bookings[0]?.start_date ||
        customer.bookings[0]?.startDate ||
        new Date().toLocaleDateString();

      const firstBooking = customer.bookings[0] || {};
      const productName = firstBooking.product?.name || "Rental Item";

      return {
        key: customer.id,
        id: customer.id,
        customerName: customer.name,
        email: customer.email,
        bookingId: firstBooking.id,
        productName,
        bookingsDispatched: customer.bookings.length,
        totalRentalRevenue: `$${totalRevenue.toFixed(2)}`,
        lastActivity:
          typeof lastActivity === "string"
            ? new Date(lastActivity).toLocaleDateString()
            : lastActivity,
        initials: customer.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      };
    });
  }, [bookingsList]);

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
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            navigate("/vendor/messages", {
              state: {
                bookingId: record.bookingId,
                customerId: record.id,
                customerName: record.customerName,
                productName: record.productName,
              },
            })
          }
        >
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
      {contextHolder}
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
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Customers;

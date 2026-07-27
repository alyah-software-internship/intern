import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Image,
} from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { bookings, rentalItems, vendors } from "../../assets/dummyAssets.js";

const { Title, Text } = Typography;

const statusColors = {
  confirmed: "green",
  pending: "gold",
  active: "cyan",
  completed: "blue",
  cancelled: "red",
  rejected: "volcano",
};

const getStatusColor = (status) =>
  statusColors[status?.toLowerCase()] || "default";

const BookingPage = () => {
  const navigate = useNavigate();
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bookingRows = useMemo(
    () =>
      bookings.map((booking) => {
        const product =
          rentalItems.find((item) => item.id === booking.productId) || {};
        const vendor =
          vendors.find((item) => item.id === booking.vendorId) || {};
        const deposit = Math.round(booking.totalAmount * 0.38);

        return {
          key: booking.id,
          ...booking,
          productName: product.title || booking.productId,
          productImage: product.images?.[0] || product.image,
          vendorName: vendor.name || product.vendor || booking.vendorId,
          deposit,
        };
      }),
    [],
  );

  const columns = [
    {
      title: t.booking?.bookingDetails || "Product Details",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <Space align="start">
          <Image
            width={96}
            height={72}
            src={record.productImage}
            preview={false}
            style={{ borderRadius: 16, objectFit: "cover" }}
            fallback="https://via.placeholder.com/96x72?text=No+Image"
          />
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ display: "block" }}>
              {record.productName}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.productId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t.booking?.rentalPeriod || "Rental Period",
      dataIndex: "startDate",
      key: "rentalPeriod",
      render: (_, record) => (
        <div>
          <Text strong style={{ display: "block" }}>
            {record.startDate} to {record.endDate}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {Math.max(
              1,
              Math.ceil(
                (new Date(record.endDate) - new Date(record.startDate)) /
                  (1000 * 60 * 60 * 24),
              ),
            )}{" "}
            Rental Days
          </Text>
        </div>
      ),
    },
    {
      title: t.booking?.vendor || "Vendor",
      dataIndex: "vendorName",
      key: "vendorName",
      render: (vendorName) => <Text>{vendorName}</Text>,
    },
    {
      title: t.booking?.totalAmount || "Financial Holding",
      dataIndex: "totalAmount",
      key: "financial",
      render: (_, record) => (
        <div>
          <Text strong style={{ display: "block" }}>
            ETB {record.totalAmount.toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            (Incl. ETB {record.deposit.toLocaleString()} deposit)
          </Text>
        </div>
      ),
    },
    {
      title: t.booking?.paymentStatus || "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag color={getStatusColor(status)}>
          {t.booking?.[status] || status}
        </Tag>
      ),
    },
    {
      title: t.booking?.actions || "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          {record.status === "pending" && (
            <Button danger size="small">
              {t.booking?.cancelBooking || "Cancel"}
            </Button>
          )}
          {record.status === "completed" && (
            <Button type="default" size="small">
              {t.booking?.modifyBooking || "Modify Booking"}
            </Button>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/rentals/${record.productId}`)}
          >
            {t.booking?.viewDetails || "View Item"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 24px 64px",
        background: isDark ? "#050b16" : "#f4f7ff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 28,
            padding: 32,
            background: isDark ? "#0f172a" : "#ffffff",
            boxShadow: isDark
              ? "0 30px 80px rgba(0,0,0,0.18)"
              : "0 24px 60px rgba(15,23,42,0.08)",
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                {t.booking?.title || "Your Bookings"}
              </Title>
              <Text
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  fontSize: 16,
                }}
              >
                {t.booking?.subtitle || "Manage all your rentals in one place"}
              </Text>
            </Col>
            <Col xs={24} md={8}>
              <Space
                size="middle"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Button type="primary" onClick={() => navigate("/dashboard")}>
                  {t.booking?.viewAllBookings || "View All Bookings"}
                </Button>
              </Space>
            </Col>
          </Row>

          <div style={{ marginTop: 28 }}>
            <Table
              columns={columns}
              dataSource={bookingRows}
              pagination={false}
              rowKey="key"
              scroll={{ x: 900 }}
              style={{ background: isDark ? "#0f172a" : "#ffffff" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;

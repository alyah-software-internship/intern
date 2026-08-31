import { Button, Card, Col, Divider, Row, Steps, Typography } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  CreditCardOutlined,
  MailOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const defaultBooking = {
  productName: "test",
  productType: "car",
  pricePerDay: 67,
  checkInDate: "Jun 02, 2025",
  checkOutDate: "Jun 05, 2025",
  duration: 3,
  deliveryFee: 10,
  refundableDeposit: 500,
  platformFee: 38,
  total: 749,
  paymentMethod: "Paid",
  paymentTime: "Jun 02, 2025, 11:42 AM",
  deliveryMethod: "Delivery",
};

const BookingConfirmationStep = ({
  booking = defaultBooking,
  bookingId = "BK-2025-0602-7859",
}) => {
  const navigate = useNavigate();
  const item = { ...defaultBooking, ...booking };

  const handleContactVendor = () => {
    // Navigate to messages page or open vendor contact modal
    navigate("/messages", { state: { vendorId: booking.vendorId } });
  };

  const stepItems = [
    { title: "Booking Details" },
    { title: "Review & Confirm" },
    { title: "Payment" },
    { title: "Booking Confirmed" },
  ];

  const nextSteps = [
    {
      icon: <CalendarOutlined />,
      title: "Mark your calendar",
      text: "Add the date to your calendar so you don't miss it.",
    },
    {
      icon: <MessageOutlined />,
      title: "Vendor contact",
      text: "The vendor will contact you soon to confirm delivery details.",
    },
    {
      icon: <CheckCircleOutlined />,
      title: "Enjoy your booking",
      text: "We hope you have a great experience!",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "24px 24px 48px",
      }}
    >
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{ color: "#1e293b", paddingLeft: 0, marginBottom: 12 }}
            onClick={() => navigate("/bookings")}
          >
            Back to Item
          </Button>

          <Steps
            current={3}
            items={stepItems}
            size="small"
            style={{ maxWidth: 760 }}
          />
        </div>

        <Row gutter={[28, 28]} align="top">
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{
                borderRadius: 22,
                background: "#ffffff",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                padding: 10,
              }}
            >
              <div style={{ padding: "8px 8px 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "#18b76b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 12px 28px rgba(24, 183, 107, 0.22)",
                    }}
                  >
                    <CheckCircleOutlined
                      style={{ fontSize: 36, color: "#fff" }}
                    />
                  </div>
                </div>

                <Title
                  level={3}
                  style={{
                    marginBottom: 8,
                    textAlign: "center",
                    color: "#0f172a",
                  }}
                >
                  Your booking is confirmed!
                </Title>

                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: 18,
                  }}
                >
                  Thank you! Your booking has been successfully placed.
                </Text>

                <div
                  style={{
                    maxWidth: 420,
                    margin: "0 auto 20px",
                    background: "#f0fdf4",
                    border: "1px solid #cfead5",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <Text strong style={{ color: "#0f172a" }}>
                      Booking ID
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1px solid #dfe7ea",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontWeight: 700,
                      }}
                    >
                      <span>{bookingId}</span>
                      <CopyOutlined
                        style={{ color: "#64748b", fontSize: 14 }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    maxWidth: 420,
                    margin: "0 auto 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "center",
                    color: "#475569",
                  }}
                >
                  <MailOutlined style={{ color: "#2563eb" }} />
                  <Text type="secondary">
                    A confirmation email has been sent to ahmed@example.com
                  </Text>
                </div>

                <Divider style={{ margin: "18px 0 16px" }} />

                <Text strong style={{ display: "block", marginBottom: 14 }}>
                  Next Steps
                </Text>

                <div style={{ display: "grid", gap: 12 }}>
                  {nextSteps.map((step, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "#fafafa",
                        border: "1px solid #ebedf0",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: "#eef4ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.icon}
                      </div>

                      <div>
                        <Text
                          strong
                          style={{ display: "block", marginBottom: 4 }}
                        >
                          {step.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {step.text}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 22,
                    flexWrap: "wrap",
                  }}
                >
                  <Button type="default" icon={<CalendarOutlined />}>
                    View My Bookings
                  </Button>
                  <Button
                    type="default"
                    icon={<MessageOutlined />}
                    onClick={handleContactVendor}
                    style={{ borderColor: "#2563eb", color: "#2563eb" }}
                  >
                    Contact Vendor
                  </Button>
                  <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 22,
                background: "#ffffff",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                padding: 10,
              }}
            >
              <div style={{ padding: "8px 6px 0" }}>
                <Title level={4} style={{ marginBottom: 10 }}>
                  Booking Summary
                </Title>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {item.productName?.slice(0, 2)?.toUpperCase() || "TE"}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 16, display: "block" }}>
                      {item.productName}
                    </Text>
                    <Text type="secondary">{item.productType || "Car"}</Text>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Text strong style={{ fontSize: 18 }}>
                      ${item.pricePerDay || 67} / day
                    </Text>
                  </div>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">Check-in Date</Text>
                    <Text>{item.checkInDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Check-out Date</Text>
                    <Text>{item.checkOutDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Duration</Text>
                    <Text>{item.duration} days</Text>
                  </Row>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">
                      Rent Subtotal ({item.duration} days)
                    </Text>
                    <Text>
                      ${(item.pricePerDay || 67) * (item.duration || 1)}
                    </Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Delivery Fee</Text>
                    <Text>${item.deliveryFee || 10}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Refundable Deposit</Text>
                    <Text>${item.refundableDeposit || 500}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Platform Commission (15%)</Text>
                    <Text>${item.platformFee || 38}</Text>
                  </Row>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <Row
                  justify="space-between"
                  align="middle"
                  style={{ marginBottom: 14 }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    Total Paid
                  </Text>
                  <Text strong style={{ fontSize: 26, color: "#0f172a" }}>
                    ${item.total || 749}
                  </Text>
                </Row>

                <div
                  style={{
                    borderRadius: 12,
                    background: "#f4f8ff",
                    border: "1px solid #dfeaff",
                    padding: "12px 14px",
                    color: "#334155",
                    marginBottom: 12,
                  }}
                >
                  <Text type="secondary">
                    You won&apos;t be charged yet. The escrow holding is
                    authorized only after the booking is approved.
                  </Text>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    padding: "12px 12px",
                    background: "#edfdf5",
                    borderRadius: 12,
                  }}
                >
                  <Row align="middle" style={{ marginBottom: 10 }}>
                    <CheckCircleOutlined style={{ color: "#16a34a" }} />
                    <Text strong style={{ marginLeft: 8, color: "#166534" }}>
                      Secure &amp; Trusted
                    </Text>
                  </Row>
                  <div style={{ display: "grid", gap: 8 }}>
                    <Text type="secondary">✓ Your payment is secure</Text>
                    <Text type="secondary">✓ Escrow protected</Text>
                    <Text type="secondary">✓ 24/7 customer support</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              icon: <ClockCircleOutlined />,
              label: "Free cancellation",
              helper: "Cancel up to 24h before check-in",
            },
            {
              icon: <CreditCardOutlined />,
              label: "Secure payment",
              helper: "Your payment is protected",
            },
            {
              icon: <SafetyCertificateOutlined />,
              label: "Trusted by thousands",
              helper: "4.8/5 from 2,000+ users",
            },
            {
              icon: <UserOutlined />,
              label: "Need help?",
              helper: "Contact support",
            },
          ].map((info, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 14,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "#edf4ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {info.icon}
              </div>
              <div>
                <Text strong style={{ display: "block" }}>
                  {info.label}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {info.helper}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationStep;

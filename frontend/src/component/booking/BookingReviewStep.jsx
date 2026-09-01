import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const defaultBooking = {
  productName: "test",
  productType: "car",
  pricePerDay: 67,
  checkInDate: "Jun 02, 2025",
  checkOutDate: "Jun 05, 2025",
  duration: 3,
  deliveryFee: 10,
  pickupFee: 0,
  returnFee: 10,
  refundableDeposit: 500,
  platformFee: 38,
  total: 749,
  additionalInfo: "Note to vendor\nI will be using it for a photoshoot.",
  deliveryMethod: "Delivery",
  totalDays: 3,
};

const BookingReviewStep = ({
  booking = defaultBooking,
  onBack,
  onContinue,
  isSubmitting = false,
}) => {
  const item = {
    ...defaultBooking,
    ...booking,
  };

  const stepItems = [
    { title: "Booking Details" },
    { title: "Review & Confirm" },
    { title: "Payment" },
    { title: "Booking Confirmed" },
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
            onClick={onBack}
          >
            Back to Item
          </Button>

          <Steps
            current={1}
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
                <Title level={3} style={{ marginBottom: 4 }}>
                  Review &amp; Confirm
                </Title>
                <Text type="secondary">
                  Please review your booking details and confirm.
                </Text>
              </div>

              <Divider style={{ margin: "18px 0 16px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 16 }}>
                  Item Details
                </Text>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, rgba(31,41,55,0.9), rgba(59,130,246,0.7))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>T</span>
                  </div>

                  <div>
                    <Text strong style={{ display: "block", fontSize: 18 }}>
                      {item.productName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {item.productType}
                    </Text>
                  </div>

                  <div style={{ marginLeft: "auto" }}>
                    <Text strong style={{ fontSize: 18, color: "#0f172a" }}>
                      ${item.pricePerDay} / day
                    </Text>
                  </div>
                </div>

                <Row gutter={16}>
                  <Col xs={12} sm={6}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <CalendarOutlined style={{ color: "#2563eb" }} />
                        <Text type="secondary">Check-in Date</Text>
                      </div>
                      <Text strong>{item.checkInDate}</Text>
                      <div
                        style={{ marginTop: 4, color: "#64748b", fontSize: 12 }}
                      >
                        10:00 AM
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <CalendarOutlined style={{ color: "#2563eb" }} />
                        <Text type="secondary">Check-out Date</Text>
                      </div>
                      <Text strong>{item.checkOutDate}</Text>
                      <div
                        style={{ marginTop: 4, color: "#64748b", fontSize: 12 }}
                      >
                        10:00 AM
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <ClockCircleOutlined style={{ color: "#2563eb" }} />
                        <Text type="secondary">Duration</Text>
                      </div>
                      <Text strong>{item.duration} days</Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <CreditCardOutlined style={{ color: "#2563eb" }} />
                        <Text type="secondary">Total Days</Text>
                      </div>
                      <Text strong>{item.totalDays || item.duration} days</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider style={{ margin: "24px 0 18px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>
                  Delivery / Pickup
                </Text>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "#e8f0ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                      }}
                    >
                      <EnvironmentOutlined />
                    </div>
                    <div>
                      <Text strong>{item.deliveryMethod || "Delivery"}</Text>
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        We will deliver the item to you
                      </div>
                    </div>
                  </div>
                  <Text strong style={{ fontSize: 18 }}>
                    ${item.deliveryFee || 10.0}
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: "24px 0 18px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>
                  Additional Information
                </Text>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "#fafafa",
                  }}
                >
                  <InfoCircleOutlined
                    style={{ color: "#2563eb", marginTop: 2 }}
                  />
                  <Text type="secondary" style={{ whiteSpace: "pre-line" }}>
                    {item.additionalInfo ||
                      "Note to vendor\nI will be using it for a photoshoot."}
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: "24px 0 18px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>
                  Payment &amp; Policies
                </Text>

                <Row
                  align="middle"
                  justify="space-between"
                  style={{ marginBottom: 10 }}
                >
                  <Space>
                    <SafetyCertificateOutlined style={{ color: "#f59e0b" }} />
                    <Text>Refundable Escrow Deposit</Text>
                  </Space>
                  <Text strong>${item.refundableDeposit || 500}</Text>
                </Row>

                <Row
                  align="middle"
                  justify="space-between"
                  style={{ marginBottom: 10 }}
                >
                  <Space>
                    <CheckCircleOutlined style={{ color: "#22c55e" }} />
                    <Text>Cancellation Policy</Text>
                  </Space>
                  <Text strong>Free</Text>
                </Row>

                <Row align="middle" justify="space-between">
                  <Space>
                    <ClockCircleOutlined style={{ color: "#3b82f6" }} />
                    <Text>Overdue Fee</Text>
                  </Space>
                  <Text strong>$0 / hour</Text>
                </Row>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 26,
                  padding: "0 8px",
                }}
              >
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                >
                  Back to Edit
                </Button>

                <Button
                  type="primary"
                  size="large"
                  onClick={onContinue}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send Request to Vendor →
                </Button>
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
                    Total
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
              icon: <CheckCircleOutlined />,
              label: "Trusted by thousands",
              helper: "4.8/5 from 2,000+ users",
            },
            {
              icon: <UserOutlined />,
              label: "Need help?",
              helper: "Contact support",
            },
          ].map((item, idx) => (
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
                {item.icon}
              </div>
              <div>
                <Text strong style={{ display: "block" }}>
                  {item.label}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.helper}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingReviewStep;

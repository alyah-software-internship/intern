import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  GiftOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const defaultBooking = {
  productName: "test",
  productType: "car",
  pricePerDay: 67,
  checkInDate: "2025-03-25",
  checkOutDate: "2025-03-28",
  duration: 3,
  deliveryFee: 10,
  operatorCharge: 0,
  pickupFee: 0,
  returnFee: 10,
  refundableDeposit: 500,
  platformFee: 38,
  tax: 0,
  couponCode: "",
  subtotal: 201,
  total: 749,
};

const BookingDetailsStep = ({
  booking = defaultBooking,
  onContinue = () => {},
  onCouponApply = () => {},
  onAdditionalInfoChange = () => {},
}) => {
  const [checkInDate, setCheckInDate] = useState(booking.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(booking.checkOutDate || "");
  const [selectedService, setSelectedService] = useState("delivery");
  const [couponCode, setCouponCode] = useState(booking.couponCode || "");
  const [additionalInfo, setAdditionalInfo] = useState(
    booking.additionalInfo || "",
  );

  const duration = useMemo(() => {
    if (!checkInDate || !checkOutDate) return booking.duration || 1;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffDays = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    );

    return diffDays;
  }, [booking.duration, checkInDate, checkOutDate]);

  const serviceFeeMap = {
    delivery: booking.deliveryFee || 10,
    pickup: booking.pickupFee || 0,
    return: booking.returnFee || 10,
  };

  const subtotal = useMemo(
    () =>
      (booking.pricePerDay || 0) * duration +
      (serviceFeeMap[selectedService] || 0) +
      (booking.operatorCharge || 0) +
      (booking.platformFee || 0) +
      (booking.tax || 0),
    [
      booking.platformFee,
      booking.pricePerDay,
      booking.tax,
      duration,
      selectedService,
    ],
  );

  const total = useMemo(
    () => subtotal + (booking.refundableDeposit || 0),
    [booking.refundableDeposit, subtotal],
  );

  const serviceOptions = [
    {
      key: "delivery",
      label: "Delivery",
      helper: "We will deliver the item to you",
      fee: booking.deliveryFee || 10,
      icon: <CarOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: "pickup",
      label: "Pickup",
      helper: "You will pick up the item",
      fee: booking.pickupFee || 0,
      icon: <ShopOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: "return",
      label: "Return Service",
      helper: "We will pick it up from you",
      fee: booking.returnFee || 10,
      icon: <UserOutlined style={{ fontSize: 20 }} />,
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
        <div style={{ marginBottom: 22 }}>
          <Steps
            current={0}
            items={[
              { title: "Booking Details" },
              { title: "Review & Confirm" },
              { title: "Payment" },
              { title: "Booking Confirmed" },
            ]}
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
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                padding: 8,
              }}
            >
              <div style={{ padding: "8px 8px 0" }}>
                <Title level={3} style={{ marginBottom: 6 }}>
                  Booking Details
                </Title>
                <Text type="secondary">
                  Fill in the details below to continue your booking.
                </Text>
              </div>

              <Divider style={{ margin: "20px 0 16px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>
                  1. Select Dates
                </Text>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <label style={{ display: "block", marginBottom: 8 }}>
                      <Text type="secondary">Check-in Date</Text>
                    </label>
                    <Input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      style={{ height: 42, borderRadius: 10 }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <label style={{ display: "block", marginBottom: 8 }}>
                      <Text type="secondary">Check-out Date</Text>
                    </label>
                    <Input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      style={{ height: 42, borderRadius: 10 }}
                    />
                  </Col>
                </Row>

                <div
                  style={{
                    marginTop: 14,
                    background: "#eafaf1",
                    border: "1px solid #c9eed3",
                    borderRadius: 10,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#0d7a43",
                  }}
                >
                  <CheckCircleOutlined />
                  <Text strong style={{ color: "#0d7a43" }}>
                    {duration} days selected
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: "24px 0 18px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 14 }}>
                  2. Delivery / Pickup Option
                </Text>
                <Row gutter={16}>
                  {serviceOptions.map((option) => {
                    const active = selectedService === option.key;

                    return (
                      <Col xs={24} sm={8} key={option.key}>
                        <div
                          onClick={() => setSelectedService(option.key)}
                          style={{
                            cursor: "pointer",
                            border: active
                              ? "1.5px solid #1677ff"
                              : "1px solid #e5e7eb",
                            borderRadius: 14,
                            background: active ? "#f0f7ff" : "#ffffff",
                            minHeight: 120,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: active ? "#dfeeff" : "#f3f4f6",
                              color: active ? "#0f67ed" : "#475569",
                              marginBottom: 10,
                            }}
                          >
                            {option.icon}
                          </div>
                          <Text strong>{option.label}</Text>
                          <Text
                            type="secondary"
                            style={{ fontSize: 12, marginTop: 6 }}
                          >
                            {option.helper}
                          </Text>
                          <Text strong style={{ marginTop: 12 }}>
                            ${option.fee.toFixed(2)}
                          </Text>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>

              <Divider style={{ margin: "24px 0 18px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 14 }}>
                  3. Additional Information (Optional)
                </Text>
                <Input.TextArea
                  rows={3}
                  placeholder="e.g. I will use this for a photo shoot."
                  value={additionalInfo}
                  onChange={(event) => {
                    const value = event.target.value;
                    setAdditionalInfo(value);
                    onAdditionalInfoChange(value);
                  }}
                  style={{ borderRadius: 10 }}
                />
              </div>

              <Divider style={{ margin: "24px 0 16px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>
                  4. Have a coupon?
                </Text>

                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    prefix={<GiftOutlined />}
                    style={{ height: 42 }}
                  />
                  <Button
                    type="default"
                    style={{ height: 42 }}
                    onClick={() => onCouponApply(couponCode)}
                  >
                    Apply
                  </Button>
                </Space.Compact>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 26,
                  padding: "0 8px",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowLeftOutlined rotate={180} />}
                  onClick={onContinue}
                  style={{ minWidth: 200, borderRadius: 10 }}
                >
                  Continue to Review
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
                padding: 8,
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
                    {booking.productName?.slice(0, 2)?.toUpperCase() || "TE"}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 16, display: "block" }}>
                      {booking.productName}
                    </Text>
                    <Text type="secondary">{booking.productType || "Car"}</Text>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Text strong style={{ fontSize: 18 }}>
                      ${booking.pricePerDay || 67}/day
                    </Text>
                  </div>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">Check-in Date</Text>
                    <Text>{checkInDate || booking.checkInDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Check-out Date</Text>
                    <Text>{checkOutDate || booking.checkOutDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Duration</Text>
                    <Text>{duration} days</Text>
                  </Row>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">Rental Total ({duration} days)</Text>
                    <Text>${(booking.pricePerDay || 67) * duration}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Refundable Deposit (3 days)</Text>
                    <Text>${booking.refundableDeposit || 500}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Platform Commission (15%)</Text>
                    <Text>${booking.platformFee || 38}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Delivery Fee</Text>
                    <Text>${serviceFeeMap[selectedService] || 10}</Text>
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
                    ${total}
                  </Text>
                </Row>

                <Card
                  style={{
                    borderRadius: 14,
                    background: "#f4f7ff",
                    border: "1px solid #e4ebff",
                    marginTop: 12,
                  }}
                >
                  <Text type="secondary">
                    You won&apos;t be charged yet. The amount will be authorized
                    only after the booking is approved.
                  </Text>
                </Card>

                <div
                  style={{
                    marginTop: 18,
                    padding: "10px 12px",
                    background: "#effaf2",
                    borderRadius: 12,
                  }}
                >
                  <Space align="start" size="small">
                    <CheckCircleOutlined style={{ color: "#16a34a" }} />
                    <Text strong style={{ color: "#166534" }}>
                      Secure &amp; Trusted
                    </Text>
                  </Space>
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
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
            marginTop: 22,
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
          ].map((item, index) => (
            <div
              key={index}
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
                  background: "#eef4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
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

export default BookingDetailsStep;

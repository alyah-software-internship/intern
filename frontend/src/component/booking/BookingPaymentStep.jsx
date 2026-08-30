import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
  Radio,
  Upload,
  message,
  Spin,
  Alert,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
  InboxOutlined,
  FileImageOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const BookingPaymentStep = ({
  booking = {},
  onBack = () => {},
  onContinue = () => {},
  onPaymentSubmit = () => {},
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "credit_card"
  );
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const stepItems = [
    { title: "Booking Details" },
    { title: "Review & Confirm" },
    { title: "Payment" },
    { title: "Booking Confirmed" },
  ];

  const paymentMethods = [
    {
      id: "credit_card",
      name: "Credit / Debit Card",
      description: "Visa, Mastercard, etc.",
      icon: "💳",
      requiresScreenshot: false,
      instructions: "Your payment will be processed securely.",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: "🅿",
      requiresScreenshot: false,
      instructions: "You will be redirected to PayPal.",
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      description: "Fast and secure payment",
      icon: "🍎",
      requiresScreenshot: false,
      instructions: "Use your Apple Pay wallet.",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: "🏦",
      requiresScreenshot: false,
      instructions: "Transfer instructions will be provided.",
    },
    {
      id: "cbe",
      name: "CBE (Commercial Bank of Ethiopia)",
      description: "Bank account transfer or ATM",
      icon: "🇪🇹",
      requiresScreenshot: true,
      instructions:
        "Transfer funds and upload payment confirmation screenshot.",
      accountDetails: {
        bankName: "Commercial Bank of Ethiopia",
        accountNumber: "1234567890",
        accountHolder: "Platform Name",
      },
    },
    {
      id: "telebirr",
      name: "Telebirr",
      description: "Mobile money payment",
      icon: "📱",
      requiresScreenshot: true,
      instructions:
        "Complete payment via Telebirr app and upload receipt screenshot.",
      phoneNumber: "9663000000",
    },
  ];

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedPaymentMethod),
    [selectedPaymentMethod]
  );

  const handleScreenshotUpload = (info) => {
    if (info.file.status === "done") {
      setScreenshotFile(info.file);
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setPreviewVisible(true);
    };
    reader.readAsDataURL(file.originFileObj || file);
  };

  const handlePaymentSubmit = async () => {
    if (selectedMethod.requiresScreenshot && !screenshotFile) {
      message.error("Please upload payment screenshot/receipt.");
      return;
    }

    setUploading(true);
    try {
      await onPaymentSubmit({
        paymentMethod: selectedPaymentMethod,
        screenshot: screenshotFile,
        booking,
      });
    } catch (error) {
      message.error(error.message || "Payment submission failed.");
    } finally {
      setUploading(false);
    }
  };

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
            Back to Review
          </Button>

          <Steps
            current={2}
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
                  Payment
                </Title>
                <Text type="secondary">
                  Complete your payment to confirm the booking
                </Text>
              </div>

              <Divider style={{ margin: "18px 0 16px" }} />

              <div style={{ padding: "0 8px" }}>
                <Text strong style={{ display: "block", marginBottom: 16 }}>
                  1. Choose Payment Method
                </Text>

                <Radio.Group
                  value={selectedPaymentMethod}
                  onChange={(e) => {
                    setSelectedPaymentMethod(e.target.value);
                    setScreenshotFile(null);
                  }}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        style={{
                          borderRadius: 12,
                          border:
                            selectedPaymentMethod === method.id
                              ? "2px solid #2563eb"
                              : "1px solid #e5e7eb",
                          padding: 14,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background:
                            selectedPaymentMethod === method.id
                              ? "#f0f9ff"
                              : "#ffffff",
                        }}
                      >
                        <Radio value={method.id}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span style={{ fontSize: 24 }}>
                                {method.icon}
                              </span>
                              <Text strong>{method.name}</Text>
                              {method.requiresScreenshot && (
                                <Tag color="orange">Manual</Tag>
                              )}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {method.description}
                            </Text>
                          </div>
                        </Radio>
                      </div>
                    ))}
                  </div>
                </Radio.Group>

                {selectedMethod && (
                  <>
                    <Divider style={{ margin: "20px 0 16px" }} />

                    <div style={{ marginBottom: 20 }}>
                      <Text strong style={{ display: "block", marginBottom: 8 }}>
                        Payment Instructions
                      </Text>

                      <Alert
                        type="info"
                        message={selectedMethod.instructions}
                        style={{ marginBottom: 12 }}
                        showIcon
                      />

                      {selectedMethod.id === "cbe" && (
                        <Card
                          size="small"
                          style={{
                            background: "#f9fafb",
                            marginBottom: 12,
                          }}
                        >
                          <Text strong style={{ display: "block", marginBottom: 8 }}>
                            Bank Details:
                          </Text>
                          <div
                            style={{
                              display: "grid",
                              gap: 6,
                              fontSize: 13,
                            }}
                          >
                            <div>
                              <Text type="secondary">Bank Name: </Text>
                              <Text>
                                {
                                  selectedMethod.accountDetails.bankName
                                }
                              </Text>
                            </div>
                            <div>
                              <Text type="secondary">Account Number: </Text>
                              <Text code>
                                {
                                  selectedMethod.accountDetails
                                    .accountNumber
                                }
                              </Text>
                            </div>
                            <div>
                              <Text type="secondary">Account Holder: </Text>
                              <Text>
                                {
                                  selectedMethod.accountDetails
                                    .accountHolder
                                }
                              </Text>
                            </div>
                          </div>
                        </Card>
                      )}

                      {selectedMethod.id === "telebirr" && (
                        <Card
                          size="small"
                          style={{
                            background: "#f9fafb",
                            marginBottom: 12,
                          }}
                        >
                          <Text strong style={{ display: "block", marginBottom: 8 }}>
                            Telebirr Phone:
                          </Text>
                          <Text code>{selectedMethod.phoneNumber}</Text>
                        </Card>
                      )}
                    </div>

                    {selectedMethod.requiresScreenshot && (
                      <div>
                        <Divider style={{ margin: "16px 0" }} />
                        <Text strong style={{ display: "block", marginBottom: 12 }}>
                          2. Upload Payment Proof
                        </Text>

                        <div
                          style={{
                            borderRadius: 12,
                            border: "2px dashed #2563eb",
                            padding: 24,
                            textAlign: "center",
                            background: "#f0f9ff",
                            marginBottom: 12,
                          }}
                        >
                          {screenshotFile ? (
                            <div>
                              <div
                                style={{
                                  marginBottom: 12,
                                }}
                              >
                                <FileImageOutlined
                                  style={{
                                    fontSize: 32,
                                    color: "#16a34a",
                                  }}
                                />
                              </div>
                              <Text strong style={{ display: "block" }}>
                                {screenshotFile.name}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {(screenshotFile.size / 1024).toFixed(2)} KB
                              </Text>
                              <div style={{ marginTop: 8 }}>
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() =>
                                    handlePreview(screenshotFile)
                                  }
                                >
                                  Preview
                                </Button>
                                <Divider type="vertical" />
                                <Button
                                  type="link"
                                  danger
                                  size="small"
                                  onClick={() => setScreenshotFile(null)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Upload.Dragger
                              multiple={false}
                              accept="image/*"
                              beforeUpload={(file) => {
                                if (file.size > 5 * 1024 * 1024) {
                                  message.error(
                                    "File size must be less than 5MB"
                                  );
                                  return Upload.LIST_IGNORE;
                                }
                                setScreenshotFile(file);
                                return false;
                              }}
                            >
                              <p style={{ marginTop: 0 }}>
                                <InboxOutlined
                                  style={{
                                    fontSize: 32,
                                    color: "#2563eb",
                                    marginBottom: 8,
                                    display: "block",
                                  }}
                                />
                              </p>
                              <Text strong>
                                Click to upload or drag screenshot here
                              </Text>
                              <p style={{ color: "#6b7280", fontSize: 12 }}>
                                PNG, JPG, GIF (Max 5MB)
                              </p>
                            </Upload.Dragger>
                          )}
                        </div>

                        <Alert
                          type="warning"
                          message="Please ensure the screenshot clearly shows:"
                          description={
                            selectedMethod.id === "cbe"
                              ? "Transfer confirmation, transaction ID, and amount"
                              : "Transaction confirmation, reference number, and payment amount"
                          }
                          style={{ marginBottom: 12 }}
                        />
                      </div>
                    )}
                  </>
                )}
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
                  Back
                </Button>

                <Button
                  type="primary"
                  size="large"
                  onClick={handlePaymentSubmit}
                  loading={uploading}
                  disabled={
                    selectedMethod.requiresScreenshot && !screenshotFile
                  }
                >
                  {uploading ? "Processing..." : "Complete Payment"}
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
                      ${booking.pricePerDay || 67} / day
                    </Text>
                  </div>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">Check-in Date</Text>
                    <Text>{booking.checkInDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Check-out Date</Text>
                    <Text>{booking.checkOutDate}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Duration</Text>
                    <Text>{booking.duration} days</Text>
                  </Row>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <div style={{ display: "grid", gap: 10 }}>
                  <Row justify="space-between">
                    <Text type="secondary">
                      Rent Subtotal ({booking.duration} days)
                    </Text>
                    <Text>
                      ${(booking.pricePerDay || 67) * (booking.duration || 1)}
                    </Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Delivery Fee</Text>
                    <Text>${booking.deliveryFee || 10}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Refundable Deposit</Text>
                    <Text>${booking.refundableDeposit || 500}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text type="secondary">Platform Commission (15%)</Text>
                    <Text>${booking.platformFee || 38}</Text>
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
                    ${booking.total || 749}
                  </Text>
                </Row>

                <div
                  style={{
                    borderRadius: 12,
                    background: "#edfdf5",
                    border: "1px solid #dcfce7",
                    padding: "12px 14px",
                    color: "#166534",
                    marginBottom: 12,
                  }}
                >
                  <Row align="middle" style={{ marginBottom: 8 }}>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    <Text strong>Secure & Trusted</Text>
                  </Row>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ✓ Your payment is secure
                  </Text>
                </div>

                {selectedMethod?.requiresScreenshot && (
                  <Alert
                    type="info"
                    message="Pending Verification"
                    description="Your payment will be verified after submission."
                    style={{ marginBottom: 12 }}
                    showIcon
                  />
                )}
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

      <Modal
        title="Payment Proof Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={600}
      >
        <img
          alt="Preview"
          style={{ width: "100%" }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default BookingPaymentStep;

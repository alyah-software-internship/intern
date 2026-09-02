import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  Spin,
  Typography,
  message,
  Radio,
  Upload,
  Divider,
  Tag,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { InboxOutlined, FileImageOutlined } from "@ant-design/icons";
import BookingPaymentStep from "../../component/booking/BookingPaymentStep";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const PaymentPage = () => {
  const { bookingId, paymentId } = useParams();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(() => !paymentId);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [subscriptionPayment, setSubscriptionPayment] = useState(() =>
    paymentId
      ? {
          id: paymentId,
          amount: location.state?.amount || "",
          payment_status: "processing",
        }
      : null,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cbe");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const isSubscriptionPayment = Boolean(paymentId);

  const paymentMethods = [
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

  const verifySubscription = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/payments/${paymentId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      const payment = response.data.payment;
      setSubscriptionPayment(payment);
      if (payment.payment_status === "paid") {
        messageApi.success(
          "Subscription payment confirmed. You can now post items.",
        );
        navigate("/vendor/products");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to verify payment.",
      );
    }
  };

  const handleScreenshotUpload = (info) => {
    const file = info.file;
    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }
    setScreenshotFile(file);
  };

  const handlePreview = (file) => {
    window.open(URL.createObjectURL(file.originFileObj || file), "_blank");
  };

  const handleSubscriptionPaymentSubmit = async () => {
    const selectedMethod = paymentMethods.find(
      (m) => m.id === selectedPaymentMethod,
    );

    if (selectedMethod.requiresScreenshot && !screenshotFile) {
      messageApi.error("Please upload payment screenshot/receipt.");
      return;
    }

    setUploading(true);
    try {
      await axios.post(
        `${backendUrl}/payments/${paymentId}/submit-manual-proof`,
        {
          payment_method: selectedPaymentMethod,
          proof_file_name: screenshotFile?.name || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      messageApi.success("Payment proof submitted. Awaiting verification...");
      // Verify after submission
      setTimeout(verifySubscription, 2000);
    } catch (requestError) {
      messageApi.error(
        requestError.response?.data?.message || "Payment submission failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isSubscriptionPayment) {
      return;
    }

    let active = true;
    axios
      .get(`${backendUrl}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then(({ data }) => {
        if (!active) return;
        const source = data.booking;
        if (source.status !== "confirmed" || source.payment_status === "paid") {
          setError(
            source.payment_status === "paid"
              ? "This booking has already been paid."
              : "Payment is available after vendor approval.",
          );
          return;
        }
        setBooking({
          productName: source.product?.name || "Rental item",
          productType: source.product?.category?.name || "Rental",
          pricePerDay: Number(source.product?.price_daily || 0),
          checkInDate: source.start_date,
          checkOutDate: source.end_date,
          duration: source.rental_days || 1,
          deliveryFee: Number(source.delivery_charge || 0),
          pickupFee: 0,
          returnFee: 0,
          refundableDeposit: Number(source.security_deposit_amount || 0),
          platformFee: Number(source.platform_fee || 0),
          total: Number(source.total_amount || 0),
          productId: source.product_id,
          bookingId: source.id,
        });
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message ||
              "Unable to load this booking.",
          );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [backendUrl, bookingId, isSubscriptionPayment, location.state, paymentId]);

  if (isSubscriptionPayment) {
    const selectedMethod = paymentMethods.find(
      (m) => m.id === selectedPaymentMethod,
    );

    return (
      <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
        {contextHolder}
        <Card>
          <div style={{ marginBottom: 24 }}>
            <Title level={2}>Pay Subscription</Title>
            <Text type="secondary">
              Complete your subscription payment to unlock vendor item posting.
            </Text>
          </div>

          <Card
            style={{
              background: "#f0fdf4",
              borderColor: "#86efac",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Subscription Amount</Text>
                <Title level={2} style={{ margin: 0 }}>
                  ETB{" "}
                  {subscriptionPayment?.amount || location.state?.amount || "-"}
                </Title>
              </div>
              <div style={{ fontSize: 28 }}>💳</div>
            </div>
          </Card>

          <Divider />

          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
                          <span style={{ fontSize: 24 }}>{method.icon}</span>
                          <Text strong>{method.name}</Text>
                          <Tag color="orange">Manual</Tag>
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
          </div>

          {selectedMethod && (
            <>
              <Divider />

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
                        <Text>{selectedMethod.accountDetails.bankName}</Text>
                      </div>
                      <div>
                        <Text type="secondary">Account Number: </Text>
                        <Text code>
                          {selectedMethod.accountDetails.accountNumber}
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary">Account Holder: </Text>
                        <Text>
                          {selectedMethod.accountDetails.accountHolder}
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

              <Divider />

              <div style={{ marginBottom: 20 }}>
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
                      <div style={{ marginBottom: 12 }}>
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
                          onClick={() => handlePreview(screenshotFile)}
                        >
                          Preview
                        </Button>
                        <Divider orientation="vertical" />
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
                        handleScreenshotUpload({ file });
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
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <Button
              type="default"
              onClick={() => navigate("/vendor/subscription")}
            >
              Back
            </Button>

            <Button
              type="primary"
              size="large"
              onClick={handleSubscriptionPaymentSubmit}
              loading={uploading}
              disabled={!screenshotFile}
            >
              {uploading ? "Submitting..." : "Complete Payment"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const submitPayment = async ({ paymentMethod, screenshot }) => {
    await axios.post(
      `${backendUrl}/bookings/${bookingId}/pay`,
      {
        payment_method: paymentMethod,
        payment_data: {
          initiated_from: "customer_payment_page",
          proof_file_name: screenshot?.name || null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    messageApi.success("Payment received by iShare.");
    navigate("/bookings");
  };

  if (loading)
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
        {contextHolder}
        <Alert
          type="info"
          showIcon
          message={error}
          action={
            <button onClick={() => navigate("/bookings")}>
              Back to bookings
            </button>
          }
        />
      </div>
    );
  if (!booking) return null;

  return (
    <>
      {contextHolder}
      <BookingPaymentStep
        booking={booking}
        onBack={() => navigate("/bookings")}
        onPaymentSubmit={submitPayment}
        onContinue={() => navigate(`/booking-details/${bookingId}`)}
      />
    </>
  );
};

export default PaymentPage;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Select,
  Spin,
  Alert,
  message,
  Steps,
  Space,
  Result,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const PaymentFlowPage = () => {
  const { bookingId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // Poll for payment status every 3 seconds when waiting for webhook
  useEffect(() => {
    if (paymentId && currentStep === 1) {
      const interval = setInterval(() => {
        verifyPayment();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [paymentId, currentStep]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`${backendUrl}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const source = response.data.booking;
      if (source.status !== "confirmed" || source.payment_status === "paid") {
        setError(
          source.payment_status === "paid"
            ? "This booking has already been paid."
            : "Payment is available after vendor approval.",
        );
        setLoading(false);
        return;
      }

      setBooking(source);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booking");
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (values) => {
    try {
      setProcessing(true);
      const response = await axios.post(
        `${backendUrl}/payments/initiate`,
        {
          booking_id: bookingId,
          provider: values.provider || "mock",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        setPaymentId(response.data.payment_id);
        setPaymentUrl(response.data.payment_url);
        setCurrentStep(1);
        messageApi.info("Redirecting to payment gateway...");

        // If mock provider, redirect to mock URL
        if (values.provider === "mock" && response.data.payment_url) {
          setTimeout(() => {
            window.location.href = response.data.payment_url;
          }, 1500);
        }
      } else {
        messageApi.error(response.data.message || "Failed to initiate payment");
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to initiate payment",
      );
    } finally {
      setProcessing(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentId) return;

    try {
      const response = await axios.get(
        `${backendUrl}/payments/${paymentId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        const payment = response.data.payment;
        setPaymentStatus(payment.payment_status);

        if (payment.payment_status === "paid") {
          setCurrentStep(2);
          messageApi.success("Payment confirmed successfully!");

          setTimeout(() => {
            navigate(`/booking-details/${bookingId}`);
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Payment verification error:", err);
    }
  };

  const handleRetry = () => {
    setCurrentStep(0);
    setPaymentUrl(null);
    setPaymentId(null);
    setPaymentStatus(null);
    setError("");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error && currentStep === 0) {
    return (
      <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
        {contextHolder}
        <Alert type="error" showIcon message={error} />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: 960, margin: "0 auto" }}>
      {contextHolder}

      {/* Payment Steps */}
      <Card
        style={{ marginBottom: 32 }}
        title="Payment Process"
        bordered={false}
      >
        <Steps
          current={currentStep}
          items={[
            { title: "Choose Payment Method", icon: <CreditCardOutlined /> },
            { title: "Complete Payment", icon: <LoadingOutlined /> },
            { title: "Confirm Booking", icon: <CheckCircleOutlined /> },
          ]}
        />
      </Card>

      {/* Booking Summary */}
      {booking && (
        <Card style={{ marginBottom: 32 }} title="Booking Summary">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Product"
                value={booking.product?.name}
                suffix=""
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Duration"
                value={booking.rental_days}
                suffix="days"
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Rental Amount"
                value={booking.rental_amount}
                prefix="ETB "
                valueStyle={{ color: "#0066cc" }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Delivery Fee"
                value={booking.delivery_charge}
                prefix="ETB "
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Platform Fee"
                value={booking.platform_fee}
                prefix="ETB "
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Security Deposit"
                value={booking.security_deposit_amount}
                prefix="ETB "
              />
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={24}>
              <Statistic
                title="Total Amount Due"
                value={booking.total_amount}
                prefix="ETB "
                valueStyle={{ color: "#22c55e", fontSize: 24 }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Step 0: Choose Payment Method */}
      {currentStep === 0 && (
        <Card title="Choose Payment Method">
          <Form form={form} layout="vertical" onFinish={handleInitiatePayment}>
            <Form.Item
              name="provider"
              label="Payment Provider"
              rules={[
                { required: true, message: "Please select a payment provider" },
              ]}
              initialValue="mock"
            >
              <Select placeholder="Select payment provider">
                <Select.Option value="mock">
                  Mock Payment (Testing)
                </Select.Option>
                <Select.Option value="stripe">Stripe</Select.Option>
                <Select.Option value="chapa">Chapa</Select.Option>
                <Select.Option value="telebirr">Telebirr</Select.Option>
              </Select>
            </Form.Item>

            <Alert
              style={{ marginBottom: 16 }}
              message="Important"
              description="After clicking 'Pay Now', you will be redirected to the payment provider's secure payment page. Your payment must be completed there."
              type="info"
              showIcon
            />

            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={processing}
              >
                Pay Now (ETB {booking?.total_amount})
              </Button>
              <Button onClick={() => navigate(`/booking-details/${bookingId}`)}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Card>
      )}

      {/* Step 1: Processing Payment */}
      {currentStep === 1 && (
        <Card>
          <Result
            icon={
              <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            }
            title="Processing Payment"
            subTitle="Please wait while we verify your payment. Do not refresh this page."
            extra={[
              <Button
                key="back"
                onClick={() => navigate(`/booking-details/${bookingId}`)}
              >
                Return to Booking
              </Button>,
            ]}
          />
          <Alert
            style={{ marginTop: 16 }}
            message="Payment Timeout"
            description="If payment verification takes longer than 2 minutes, please contact support."
            type="warning"
          />
        </Card>
      )}

      {/* Step 2: Payment Confirmed */}
      {currentStep === 2 && (
        <Card>
          <Result
            status="success"
            title="Payment Successful!"
            subTitle="Your booking has been confirmed and payment received."
            extra={[
              <Button
                type="primary"
                key="view"
                onClick={() => navigate(`/booking-details/${bookingId}`)}
              >
                View Booking Details
              </Button>,
            ]}
          />
        </Card>
      )}

      {/* Error State */}
      {currentStep === 3 && (
        <Card>
          <Result
            status="error"
            title="Payment Failed"
            subTitle="Your payment could not be completed. Please try again or contact support."
            extra={[
              <Button type="primary" key="retry" onClick={handleRetry}>
                Try Again
              </Button>,
              <Button
                key="back"
                onClick={() => navigate(`/booking-details/${bookingId}`)}
              >
                Return to Booking
              </Button>,
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default PaymentFlowPage;

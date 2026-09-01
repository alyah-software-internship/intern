import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Alert, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BookingPaymentStep from "../../component/booking/BookingPaymentStep";
import { AppContext } from "../../context/AppContext.jsx";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
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
  }, [backendUrl, bookingId]);

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
    navigate(`/booking-details/${bookingId}`);
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

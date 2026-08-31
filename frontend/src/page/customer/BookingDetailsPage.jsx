import { useMemo, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import BookingDetailsStep from "../../component/booking/BookingDetailsStep";
import BookingReviewStep from "../../component/booking/BookingReviewStep";
import BookingPaymentStep from "../../component/booking/BookingPaymentStep";
import BookingConfirmationStep from "../../component/booking/BookingConfirmationStep";

const BookingDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { backendUrl } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const item = state?.item || {};
  const startDate = state?.startDate || "";
  const endDate = state?.endDate || "";

  const booking = useMemo(
    () => ({
      productName: item.title || item.name || "Selected Item",
      productType: item.category || "Rental Item",
      pricePerDay: Number(
        item.price ?? item.pricing?.daily?.amount ?? item.dailyRate ?? 67,
      ),
      checkInDate: startDate,
      checkOutDate: endDate,
      duration: 1,
      deliveryFee: 10,
      pickupFee: 0,
      returnFee: 10,
      refundableDeposit: Number(item.deposit ?? item.refundableDeposit ?? 500),
      platformFee: Number(item.platformFee ?? 38),
      tax: 0,
      couponCode: "",
      total: 0,
      additionalInfo: "",
      deliveryMethod: "Delivery",
      totalDays: 1,
      productId: item.id || null,
    }),
    [endDate, item, startDate],
  );

  const handlePaymentSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        messageApi.error("Not authenticated. Please sign in.");
        return;
      }

      if (!booking.productId) {
        messageApi.error("Product information missing. Please try again.");
        return;
      }

      console.log("Submitting booking to backend...", {
        product_id: booking.productId,
        start_date: startDate,
        end_date: endDate,
        delivery_address: "Default delivery address",
        special_requests: booking.additionalInfo || "",
        delivery_charge: booking.deliveryFee,
      });

      const response = await axios.post(
        `${backendUrl}/bookings`,
        {
          product_id: booking.productId,
          start_date: startDate,
          end_date: endDate,
          delivery_address: "Default delivery address",
          special_requests: booking.additionalInfo || "",
          delivery_charge: booking.deliveryFee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Booking created successfully:", response.data);

      if (response.data.booking?.id) {
        setBookingId(response.data.booking.id);
        messageApi.success("Booking created successfully!");
      }

      setCurrentStep(3);
    } catch (error) {
      console.error("Booking creation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create booking";
      messageApi.error(errorMessage);
    }
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <BookingDetailsStep
          booking={booking}
          onBack={() => navigate(-1)}
          onContinue={() => setCurrentStep(1)}
          onCouponApply={(couponCode) => {
            booking.couponCode = couponCode;
          }}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <BookingReviewStep
          booking={booking}
          onBack={() => setCurrentStep(0)}
          onContinue={() => setCurrentStep(2)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <BookingPaymentStep
          booking={booking}
          onBack={() => setCurrentStep(1)}
          onContinue={() => setCurrentStep(3)}
          onPaymentSubmit={handlePaymentSubmit}
        />
      );
    }

    return (
      <>
        {contextHolder}
        <BookingConfirmationStep
          booking={booking}
          bookingId={bookingId || "BK-2025-0602-7859"}
          onBack={() => navigate("/bookings")}
          onContinue={() => navigate("/bookings")}
        />
      </>
    );
  };

  return renderStep();
};

export default BookingDetailsPage;

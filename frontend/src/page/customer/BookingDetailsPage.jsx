import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDetailsStep from "../../component/booking/BookingDetailsStep";
import BookingReviewStep from "../../component/booking/BookingReviewStep";
import BookingPaymentStep from "../../component/booking/BookingPaymentStep";
import BookingConfirmationStep from "../../component/booking/BookingConfirmationStep";

const BookingDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

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
    }),
    [endDate, item, startDate],
  );

  const handlePaymentSubmit = async () => {
    setCurrentStep(3);
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
      <BookingConfirmationStep
        booking={booking}
        onBack={() => navigate("/bookings")}
        onContinue={() => navigate("/bookings")}
      />
    );
  };

  return renderStep();
};

export default BookingDetailsPage;

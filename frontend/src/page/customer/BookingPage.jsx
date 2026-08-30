import { useContext, useMemo } from "react";
import { Button, Card, Col, Row, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import {
  bookings as allBookings,
  getProductById,
} from "../../assets/dummyAssets.js";

const { Title, Text } = Typography;

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const bookings = useMemo(() => {
    const authUser =
      user ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("authUser") || "null");
        } catch {
          return null;
        }
      })();

    const customerId =
      authUser?.id ||
      authUser?.user_id ||
      authUser?.customer_id ||
      authUser?._id ||
      "user-1";

    return allBookings
      .filter(
        (booking) =>
          booking.customerId === customerId ||
          booking.userId === customerId ||
          booking.customer_id === customerId,
      )
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [user]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#2563eb",
                marginBottom: 8,
              }}
            >
              Customer
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              My Bookings
            </Title>
          </div>

          <Button type="primary" onClick={() => navigate("/rentals")}>
            Browse Rentals
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <Text>No bookings found yet.</Text>
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {bookings.map((booking) => {
              const product = getProductById(booking.productId) || {};
              const durationDays = Math.max(
                1,
                Math.ceil(
                  (new Date(booking.endDate) - new Date(booking.startDate)) /
                    (1000 * 60 * 60 * 24),
                ),
              );

              const statusColors = {
                confirmed: "green",
                pending: "gold",
                completed: "blue",
                cancelled: "red",
              };

              return (
                <Col xs={24} md={12} key={booking.id}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 18,
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Booking ID
                        </Text>
                        <div style={{ fontWeight: 700 }}>{booking.id}</div>
                      </div>

                      <Tag color={statusColors[booking.status] || "default"}>
                        {booking.status}
                      </Tag>
                    </div>

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
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          background:
                            "linear-gradient(135deg, #334155, #2563eb)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {(product.name || "Item").slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <Text strong style={{ display: "block", fontSize: 18 }}>
                          {product.name || "Rental Item"}
                        </Text>
                        <Text type="secondary">
                          {booking.items || 1} item
                          {booking.items > 1 ? "s" : ""}
                        </Text>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Dates</Text>
                        <Text>
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Duration</Text>
                        <Text>
                          {durationDays} day{durationDays > 1 ? "s" : ""}
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Payment</Text>
                        <Text>{booking.paymentStatus || "paid"}</Text>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Total</Text>
                        <Text strong>
                          $
                          {booking.totalAmount ??
                            product.pricing?.daily?.amount ??
                            0}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

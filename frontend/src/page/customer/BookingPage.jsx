import { useContext, useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Tag,
  Typography,
  Spin,
  message,
  Badge,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, MessageOutlined } from "@ant-design/icons";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (dateValue) =>
  new Date(dateValue).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const normalizeStatus = (status) => String(status || "pending").toLowerCase();

const getFilterStatus = (status) => {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "confirmed" || normalizedStatus === "active") {
    return "active";
  }

  if (normalizedStatus === "rejected") return "cancelled";
  return normalizedStatus;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { user, backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const authUser = localStorage.getItem("authUser");

        console.log("Fetching bookings...");
        console.log("Token:", token ? "✓ Present" : "✗ Missing");
        console.log(
          "Auth User:",
          authUser ? JSON.parse(authUser) : "✗ Missing",
        );
        console.log("Backend URL:", backendUrl);

        if (!token) {
          messageApi.error("Not authenticated. Please sign in first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/user/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        // Handle different response formats from backend
        let bookingsData = [];
        if (response.data.bookings) {
          bookingsData = response.data.bookings;
          console.log(
            "✓ Found bookings in response.data.bookings:",
            bookingsData.length,
          );
        } else if (response.data.data) {
          bookingsData = response.data.data;
          console.log(
            "✓ Found bookings in response.data.data:",
            bookingsData.length,
          );
        } else if (Array.isArray(response.data)) {
          bookingsData = response.data;
          console.log("✓ Response is array:", bookingsData.length);
        }

        console.log("Final bookings data:", bookingsData);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        console.error("Error details:", error.response?.data);
        messageApi.error(
          "Failed to load bookings: " +
            (error.response?.data?.message || error.message),
        );
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    } else {
      console.log("No user context available yet");
    }
  }, [user, backendUrl, messageApi]);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "all") {
      return bookings;
    }
    return bookings.filter(
      (booking) => getFilterStatus(booking.status) === filterStatus,
    );
  }, [bookings, filterStatus]);

  const bookingCounts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => getFilterStatus(b.status) === "pending")
        .length,
      active: bookings.filter((b) => getFilterStatus(b.status) === "active")
        .length,
      completed: bookings.filter(
        (b) => getFilterStatus(b.status) === "completed",
      ).length,
      cancelled: bookings.filter(
        (b) => getFilterStatus(b.status) === "cancelled",
      ).length,
    };
  }, [bookings]);

  // Pagination
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  const statusColors = {
    pending: "gold",
    confirmed: "blue",
    active: "orange",
    completed: "green",
    cancelled: "red",
    paid: "green",
    unpaid: "orange",
  };

  const handleManualRefresh = () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    axios
      .get(`${backendUrl}/user/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Manual refresh - API Response:", response.data);
        let bookingsData = [];
        if (response.data.bookings) {
          bookingsData = response.data.bookings;
        } else if (response.data.data) {
          bookingsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        messageApi.success("Bookings refreshed successfully");
      })
      .catch((error) => {
        console.error("Manual refresh error:", error);
        messageApi.error("Failed to refresh bookings");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Define filter tabs
  const filterTabs = [
    { key: "all", label: "All Bookings", count: bookingCounts.all },
    { key: "pending", label: "Pending", count: bookingCounts.pending },
    { key: "active", label: "Active", count: bookingCounts.active },
    { key: "completed", label: "Completed", count: bookingCounts.completed },
    { key: "cancelled", label: "Cancelled", count: bookingCounts.cancelled },
  ];

  return (
    <div className="customer-bookings-page">
      {contextHolder}
      <div className="customer-bookings-content">
        {/* Header */}
        <div className="customer-bookings-heading">
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
            Rentals
          </Text>
          <Title level={2} style={{ margin: "0 0 8px 0" }}>
            My Bookings
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            View and manage your all bookings in one place.
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24}>
            {/* Filter Tabs */}
            <div className="customer-bookings-filters">
              {filterTabs.map((tab) => (
                <Badge key={tab.key} count={tab.count} color="#1890ff">
                  <Button
                    type={filterStatus === tab.key ? "primary" : "default"}
                    onClick={() => {
                      setFilterStatus(tab.key);
                      setCurrentPage(1);
                    }}
                  >
                    {tab.label}
                  </Button>
                </Badge>
              ))}
              <Button onClick={handleManualRefresh} loading={loading}>
                Refresh
              </Button>
            </div>

            {/* Bookings List */}
            {loading ? (
              <Card style={{ textAlign: "center", padding: 60 }}>
                <Spin size="large" />
              </Card>
            ) : filteredBookings.length === 0 ? (
              <Card style={{ padding: 40 }}>
                <div style={{ textAlign: "center" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 16, display: "block", marginBottom: 16 }}
                  >
                    No {filterStatus !== "all" ? `${filterStatus} ` : ""}
                    bookings found yet.
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 20 }}
                  >
                    Total bookings in system: {bookings.length}
                  </Text>
                  <Button
                    type="primary"
                    onClick={() => navigate("/rentals")}
                    style={{ marginRight: 8 }}
                  >
                    Browse Rentals
                  </Button>
                  <Button onClick={handleManualRefresh}>
                    Refresh Bookings
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Table Header */}
                <div className="customer-bookings-table-header">
                  <div>Item</div>
                  <div>Dates</div>
                  <div>Status</div>
                  <div>Payment</div>
                  <div>Total</div>
                  <div></div>
                </div>

                {/* Booking Rows */}
                {paginatedBookings.map((booking) => {
                  const product = booking.product || {};
                  const startDate = booking.start_date || booking.startDate;
                  const endDate = booking.end_date || booking.endDate;
                  const durationDays = Math.max(
                    1,
                    Math.ceil(
                      (new Date(endDate) - new Date(startDate)) /
                        (1000 * 60 * 60 * 24),
                    ),
                  );

                  return (
                    <div key={booking.id} className="customer-booking-row">
                      {/* Item */}
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            background:
                              "linear-gradient(135deg, #334155, #2563eb)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {(product.name || "Item").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: 14 }}
                          >
                            {product.name || "Rental Item"}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Rental, Addis Ababa
                          </Text>
                        </div>
                      </div>

                      {/* Dates */}
                      <div>
                        <Text style={{ display: "block", fontSize: 13 }}>
                          {formatDate(startDate)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(startDate)}
                        </Text>
                        <Text
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 13,
                          }}
                        >
                          {formatDate(endDate)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(endDate)}
                        </Text>
                        <Text
                          type="secondary"
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: 11,
                          }}
                        >
                          ({durationDays} day{durationDays > 1 ? "s" : ""})
                        </Text>
                      </div>

                      {/* Status */}
                      <div>
                        <Tag
                          color={
                            statusColors[getFilterStatus(booking.status)] ||
                            statusColors[normalizeStatus(booking.status)] ||
                            "default"
                          }
                        >
                          {normalizeStatus(booking.status)}
                        </Tag>
                      </div>

                      {/* Payment */}
                      <div>
                        <Tag
                          color={
                            booking.payment_status === "paid" ||
                            booking.paymentStatus === "paid"
                              ? "green"
                              : "orange"
                          }
                        >
                          {booking.payment_status ||
                            booking.paymentStatus ||
                            "unpaid"}
                        </Tag>
                      </div>

                      {/* Total */}
                      <div style={{ textAlign: "right" }}>
                        <Text strong style={{ fontSize: 14 }}>
                          $
                          {booking.total_amount ??
                            booking.totalAmount ??
                            product.pricing?.daily?.amount ??
                            0}
                        </Text>
                      </div>

                      {/* Action */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          type="default"
                          size="small"
                          icon={<MessageOutlined />}
                          onClick={() =>
                            navigate("/messages", {
                              state: {
                                vendorId:
                                  booking.vendor_id ||
                                  booking.vendorId ||
                                  product.vendor_id ||
                                  product.vendorId,
                                vendorName:
                                  product.vendor?.name ||
                                  booking.vendor_name ||
                                  product.vendor_name ||
                                  "Vendor",
                                bookingId: booking.id,
                                productName: product.name || "Rental Item",
                              },
                            })
                          }
                        >
                          Contact Vendor
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            navigate(`/booking-details/${booking.id}`)
                          }
                        >
                          View Details
                        </Button>
                        {booking.status === "confirmed" &&
                          booking.payment_status !== "paid" && (
                            <Button
                              type="primary"
                              onClick={() =>
                                navigate(`/payments/${booking.id}`)
                              }
                            >
                              Pay Now
                            </Button>
                          )}
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {filteredBookings.length > pageSize && (
                  <div className="customer-bookings-pagination">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredBookings.length}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BookingPage;

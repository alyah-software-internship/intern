import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Table,
  Image,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  CheckOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  DollarOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  MessageOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { formatVendorMoney, VENDOR_CURRENCY } from "../../utils/currency.js";

const { Title, Text } = Typography;

const Bookings = () => {
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingBookingId, setApprovingBookingId] = useState(null);
  const [returningBookingId, setReturningBookingId] = useState(null);
  const [damageBooking, setDamageBooking] = useState(null);
  const [damageSubmitting, setDamageSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageApi, contextHolder] = message.useMessage();
  const [damageForm] = Form.useForm();

  const normalizeImageUrl = (value) => {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    if (trimmed.startsWith("data:image/")) {
      return trimmed;
    }

    const backendOrigin = backendUrl
      .replace(/\/api\/?$/i, "")
      .replace(/\/$/, "");
    const cleanPath = trimmed
      .replace(/^public\//i, "")
      .replace(/^\/?storage\//i, "")
      .replace(/^\/+/, "");

    return `${backendOrigin || "http://127.0.0.1:8000"}/storage/${cleanPath}`;
  };

  const fetchBookings = useCallback(
    async (showError = true) => {
      try {
        const response = await axios.get(`${backendUrl}/vendor/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const rows = response.data?.bookings || response.data?.data || [];
        setBookingsList(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Failed to fetch vendor bookings:", error);
        if (showError) {
          messageApi.error(
            error.response?.data?.message || "Unable to load vendor bookings.",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, messageApi],
  );

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => fetchBookings(), 0);
    const refreshTimer = window.setInterval(() => fetchBookings(false), 30000);
    const handleFocus = () => fetchBookings(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchBookings]);

  const pendingCount = useMemo(
    () =>
      bookingsList.filter(
        (booking) => String(booking.status).toLowerCase() === "pending",
      ).length,
    [bookingsList],
  );

  const bookingStats = useMemo(() => {
    const confirmed = bookingsList.filter(
      (booking) => String(booking.status).toLowerCase() === "confirmed",
    ).length;
    const cancelled = bookingsList.filter(
      (booking) => String(booking.status).toLowerCase() === "cancelled",
    ).length;
    const revenue = bookingsList.reduce(
      (total, booking) => total + Number(booking.total_amount || 0),
      0,
    );

    return { confirmed, cancelled, revenue };
  }, [bookingsList]);

  const handleApprove = async (bookingId) => {
    if (approvingBookingId) return;

    setApprovingBookingId(bookingId);

    try {
      await axios.put(
        `${backendUrl}/vendor/bookings/${bookingId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      setBookingsList((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "confirmed" }
            : booking,
        ),
      );
      messageApi.success("Booking approved successfully.");
    } catch (error) {
      console.error("Failed to approve booking:", error);
      messageApi.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to approve booking.",
      );
    } finally {
      setApprovingBookingId(null);
    }
  };

  const handleReturnedClean = async (bookingId) => {
    if (returningBookingId) return;

    setReturningBookingId(bookingId);
    try {
      await axios.put(
        `${backendUrl}/vendor/bookings/${bookingId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setBookingsList((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "completed",
                completed_at: new Date().toISOString(),
              }
            : booking,
        ),
      );
      messageApi.success("Return recorded as clean.");
    } catch (error) {
      messageApi.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to record the clean return.",
      );
    } finally {
      setReturningBookingId(null);
    }
  };

  const handleDamageSubmit = async (values) => {
    if (!damageBooking) return;

    setDamageSubmitting(true);
    try {
      await axios.post(
        `${backendUrl}/vendor/bookings/${damageBooking.bookingId}/damage`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setBookingsList((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === damageBooking.bookingId
            ? { ...booking, status: "completed" }
            : booking,
        ),
      );
      messageApi.success("Damage report logged successfully.");
      setDamageBooking(null);
      damageForm.resetFields();
    } catch (error) {
      messageApi.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to log damage report.",
      );
    } finally {
      setDamageSubmitting(false);
    }
  };

  const activeRows = useMemo(
    () =>
      bookingsList.map((booking) => {
        const product = booking.product || {};
        const customer = booking.customer || {};
        const startDate = booking.start_date || booking.startDate;
        const endDate = booking.end_date || booking.endDate;
        const productImageValue =
          product.images?.find((image) => image?.is_primary)?.image_url ||
          product.images?.[0]?.image_url ||
          product.images?.[0]?.url ||
          product.image_url ||
          product.image;

        const productImage =
          normalizeImageUrl(productImageValue) || "/logo.png";

        return {
          key: booking.id,
          bookingId: booking.id,
          customerId: customer.id || booking.customer_id || booking.user_id,
          productName: product.name || "Rental Item",
          productImage,
          customerName:
            customer.name ||
            `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
            "Customer",
          startDate: startDate ? new Date(startDate).toLocaleDateString() : "-",
          endDate: endDate ? new Date(endDate).toLocaleDateString() : "-",
          checkoutStatus: booking.status || "pending",
          paymentStatus:
            booking.payment_status || booking.paymentStatus || "pending",
          bookingReference:
            booking.booking_reference ||
            `BK-${String(booking.id).padStart(5, "0")}`,
          amount: Number(booking.total_amount || booking.amount || 0),
          escrowHolding: formatVendorMoney(booking.security_deposit_amount),
        };
      }),
    [bookingsList, normalizeImageUrl],
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return activeRows.filter((row) => {
      const matchesSearch =
        !query ||
        [row.bookingReference, row.productName, row.customerName, row.bookingId]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        String(row.checkoutStatus).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [activeRows, searchTerm, statusFilter]);

  const handleExport = () => {
    const header = [
      "Booking ID",
      "Product",
      "Customer",
      "Status",
      "Payment",
      "Amount",
    ];
    const rows = filteredRows.map((row) => [
      row.bookingReference,
      row.productName,
      row.customerName,
      row.checkoutStatus,
      row.paymentStatus,
      row.amount.toFixed(2),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "BOOKING ID",
      dataIndex: "bookingReference",
      key: "bookingReference",
      render: (value) => <Text className="vendor-booking-id">#{value}</Text>,
    },
    {
      title: "RENTED PRODUCT",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <Space align="start" size={12}>
          <Image
            width={42}
            height={42}
            src={record.productImage || "/logo.png"}
            preview={false}
            loading="lazy"
            fallback="/logo.png"
            className="vendor-booking-product-image"
          />
          <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
            {record.productName}
          </Text>
        </Space>
      ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      key: "customerName",
      render: (customerName) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
          {customerName}
        </Text>
      ),
    },
    {
      title: "DATES",
      dataIndex: "dates",
      key: "dates",
      render: (_, record) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
          {record.startDate} to {record.endDate}
        </Text>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      render: (value) => (
        <Text strong style={{ color: isDark ? "#f8fafc" : "#16213b" }}>
          {VENDOR_CURRENCY}{" "}
          {Number(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: "CHECKOUT STATUS",
      dataIndex: "checkoutStatus",
      key: "checkoutStatus",
      render: (status) => {
        const normalized = String(status || "pending").toLowerCase();
        const tagColor =
          normalized === "completed"
            ? "green"
            : normalized === "cancelled"
              ? "red"
              : normalized === "active"
                ? "blue"
                : normalized === "pending"
                  ? "gold"
                  : "default";

        return (
          <Tag
            color={tagColor}
            style={{
              borderRadius: 6,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "PAYMENT STATUS",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const normalized = String(status || "pending").toLowerCase();
        const tagColor =
          normalized === "paid"
            ? "green"
            : normalized === "failed" || normalized === "rejected"
              ? "red"
              : normalized === "processing"
                ? "blue"
                : "gold";

        return (
          <Tag
            color={tagColor}
            style={{
              borderRadius: 6,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {normalized === "failed" ? "REJECTED" : normalized}
          </Tag>
        );
      },
    },
    {
      title: "ESCROW HOLDING",
      dataIndex: "escrowHolding",
      key: "escrowHolding",
      render: (value) => (
        <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "HANDOVERS / DAMAGE LOG",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        const isCompleted =
          String(record.checkoutStatus).toLowerCase() === "completed";
        const isPaid = String(record.paymentStatus).toLowerCase() === "paid";

        return (
          <Space className="vendor-booking-actions" size={8} wrap>
            {String(record.checkoutStatus).toLowerCase() === "pending" && (
              <Button
                type="primary"
                size="small"
                className="vendor-booking-action vendor-booking-action--approve"
                icon={<CheckOutlined />}
                loading={approvingBookingId === record.bookingId}
                disabled={Boolean(approvingBookingId)}
                onClick={() => handleApprove(record.bookingId)}
              >
                Approve
              </Button>
            )}
            <Button
              type="text"
              size="small"
              className="vendor-booking-action vendor-booking-action--message"
              icon={<MessageOutlined />}
              title="Chat with customer"
              onClick={() =>
                navigate("/vendor/messages", {
                  state: {
                    bookingId: record.bookingId,
                    customerId: record.customerId,
                    customerName: record.customerName,
                    productName: record.productName,
                  },
                })
              }
            >
              Message
            </Button>
            {isCompleted ? (
              <Button
                type="primary"
                size="small"
                className="vendor-booking-action vendor-booking-action--completed"
                icon={<CheckCircleFilled />}
                disabled
              >
                Completed
              </Button>
            ) : isPaid ? (
              <>
                <Button
                  type="default"
                  size="small"
                  className="vendor-booking-action vendor-booking-action--returned"
                  loading={returningBookingId === record.bookingId}
                  disabled={Boolean(approvingBookingId || returningBookingId)}
                  onClick={() => handleReturnedClean(record.bookingId)}
                >
                  Returned Clean
                </Button>
                <Button
                  danger
                  size="small"
                  className="vendor-booking-action vendor-booking-action--damage"
                  icon={<FileProtectOutlined />}
                  disabled={Boolean(approvingBookingId || returningBookingId)}
                  onClick={() => setDamageBooking(record)}
                >
                  Log Damages
                </Button>
              </>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="vendor-booking-page">
      {contextHolder}
      <Row className="vendor-booking-shell" gutter={[20, 20]}>
        <Col xs={24}>
          <div className="vendor-booking-hero">
            <div className="vendor-booking-hero-icon">
              <CalendarOutlined />
            </div>
            <div>
              <Title level={2}>Bookings</Title>
              <Text>
                Manage and track all reservations across your listings.
              </Text>
            </div>
            <Button
              className="vendor-booking-export"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </Col>

        <Col xs={24}>
          <div className="vendor-booking-stat-grid">
            <div className="vendor-booking-stat stat-blue">
              <span>
                <CalendarOutlined />
              </span>
              <small>Total Bookings</small>
              <strong>{bookingsList.length}</strong>
            </div>
            <div className="vendor-booking-stat stat-green">
              <span>
                <CheckCircleFilled />
              </span>
              <small>Confirmed</small>
              <strong>{bookingStats.confirmed}</strong>
            </div>
            <div className="vendor-booking-stat stat-orange">
              <span>
                <ClockCircleOutlined />
              </span>
              <small>Pending</small>
              <strong>{pendingCount}</strong>
            </div>
            <div className="vendor-booking-stat stat-red">
              <span>
                <CloseCircleFilled />
              </span>
              <small>Cancelled</small>
              <strong>{bookingStats.cancelled}</strong>
            </div>
            <div className="vendor-booking-stat stat-purple">
              <span>
                <DollarOutlined />
              </span>
              <small>Total Revenue</small>
              <strong>
                {VENDOR_CURRENCY}{" "}
                {bookingStats.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </Col>

        <Col xs={24}>
          <Card className="vendor-booking-ledger-card">
            <div className="vendor-booking-ledger-heading">
              <div>
                <Title level={4}>Reservations Ledger</Title>
                <Text>
                  A detailed record of all reservations, status, and payment
                  information.
                </Text>
              </div>
              <Text className="vendor-booking-pending-note">
                {pendingCount} pending approval{pendingCount === 1 ? "" : "s"}
              </Text>
            </div>
            <div className="vendor-booking-toolbar">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search by product, customer, or booking ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter booking status"
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="vendor-booking-table-wrap">
              <Table
                columns={columns}
                dataSource={filteredRows}
                loading={loading}
                pagination={false}
                rowKey="key"
                scroll={{ x: 900 }}
                locale={{ emptyText: "No bookings found." }}
              />
            </div>
            <div className="vendor-booking-ledger-footer">
              Showing {filteredRows.length} of {bookingsList.length} bookings
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        title={`Log damage for ${damageBooking?.productName || "booking"}`}
        open={Boolean(damageBooking)}
        okText="Submit Damage Report"
        confirmLoading={damageSubmitting}
        onOk={() => damageForm.submit()}
        onCancel={() => {
          setDamageBooking(null);
          damageForm.resetFields();
        }}
        destroyOnHidden
      >
        <Form form={damageForm} layout="vertical" onFinish={handleDamageSubmit}>
          <Form.Item
            name="description"
            label="Damage description"
            rules={[{ required: true, message: "Describe the damage found." }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Describe the damage, affected parts, and any evidence."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bookings;

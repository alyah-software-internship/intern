import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, message, Tag, DatePicker, Select } from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  FileImageOutlined,
  ReloadOutlined,
  SearchOutlined,
  UndoOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const AdminPaymentsPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
    payment_method: null,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate)
        params.start_date = filters.startDate.format("YYYY-MM-DD");
      if (filters.endDate)
        params.end_date = filters.endDate.format("YYYY-MM-DD");
      if (filters.payment_method)
        params.payment_method = filters.payment_method;

      const response = await axios.get(`${backendUrl}/admin/payments`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const nextPayments = response.data.payments?.data || [];
      setPayments(nextPayments);
      setSelectedPayment(
        (current) =>
          current ||
          nextPayments.find((payment) => payment.payment_proof_path) ||
          nextPayments[0] ||
          null,
      );
    } catch {
      messageApi.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filters, messageApi]);

  useEffect(() => {
    const timer = window.setTimeout(fetchPayments, 0);
    return () => window.clearTimeout(timer);
  }, [fetchPayments]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const handleInitiateRefund = async (paymentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/admin/payments/${paymentId}/refund`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Refund initiated successfully");
        fetchPayments();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to initiate refund",
      );
    }
  };

  const handleVerifyPayment = async (paymentId, approved) => {
    try {
      const reason = approved
        ? undefined
        : window.prompt("Rejection reason (optional)");
      if (!approved && reason === null) return;

      const response = await axios.post(
        `${backendUrl}/admin/payments/${paymentId}/${approved ? "approve" : "reject"}`,
        approved ? {} : { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success(
          approved
            ? "Payment approved and both parties notified"
            : "Payment rejected",
        );
        await fetchPayments();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Unable to update payment verification",
      );
    }
  };

  const money = (value) =>
    `ETB ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const customerName = (payment) =>
    payment.customer?.name ||
    payment.customer?.full_name ||
    [payment.customer?.first_name, payment.customer?.last_name]
      .filter(Boolean)
      .join(" ") ||
    "Unknown customer";
  const vendorName = (payment) =>
    payment.vendor?.name ||
    payment.vendor?.business_name ||
    payment.vendor?.user?.full_name ||
    "Unknown vendor";
  const proofUrl = selectedPayment?.payment_proof_path
    ? `${backendUrl.replace(/\/api\/?$/i, "")}/storage/${selectedPayment.payment_proof_path}`
    : null;
  const pendingCount = payments.filter(
    (payment) =>
      payment.payment_status === "pending" ||
      payment.status === "pending_verification",
  ).length;
  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );
  const vendorTotal = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.vendor_amount || payment.amount || 0),
    0,
  );
  const platformRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.platform_fee || 0),
    0,
  );
  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  return (
    <div className="admin-payment-page">
      {contextHolder}
      <div className="admin-payment-heading">
        <div>
          <div className="admin-payment-eyebrow">FINANCE OPERATIONS</div>
          <h1>Payment Proof</h1>
          <p>Review, verify and manage customer payment transactions.</p>
        </div>
        <Button
          className="admin-payment-refresh"
          icon={<ReloadOutlined />}
          onClick={fetchPayments}
          loading={loading}
        >
          Refresh data
        </Button>
      </div>

      <div className="admin-payment-stats">
        <div className="admin-payment-stat stat-blue">
          <span className="stat-icon">
            <WalletOutlined />
          </span>
          <span>
            <small>Total Payments</small>
            <strong>{money(totalAmount)}</strong>
            <em>vs. last 30 days</em>
          </span>
        </div>
        <div className="admin-payment-stat stat-purple">
          <span className="stat-icon">
            <DollarOutlined />
          </span>
          <span>
            <small>Platform Revenue</small>
            <strong>{money(platformRevenue)}</strong>
            <em>Commission collected</em>
          </span>
        </div>
        <div className="admin-payment-stat stat-green">
          <span className="stat-icon">
            <WalletOutlined />
          </span>
          <span>
            <small>Vendor Amount</small>
            <strong>{money(vendorTotal)}</strong>
            <em>Pending and released</em>
          </span>
        </div>
        <div className="admin-payment-stat stat-orange">
          <span className="stat-icon">
            <ClockCircleOutlined />
          </span>
          <span>
            <small>Pending Verification</small>
            <strong>{pendingCount}</strong>
            <em>Needs your attention</em>
          </span>
        </div>
      </div>

      <div className="admin-payment-filters">
        <label>
          Payment Status
          <Select
            value={filters.status}
            placeholder="All statuses"
            allowClear
            onChange={(status) => setFilters({ ...filters, status })}
            options={[
              { label: "All statuses", value: null },
              { label: "Pending", value: "pending" },
              { label: "Paid", value: "paid" },
              { label: "Failed", value: "failed" },
            ]}
          />
        </label>
        <label>
          Date Range
          <span className="admin-payment-date-range">
            <DatePicker
              placeholder="Start date"
              value={filters.startDate}
              onChange={(startDate) => setFilters({ ...filters, startDate })}
            />
            <span>to</span>
            <DatePicker
              placeholder="End date"
              value={filters.endDate}
              onChange={(endDate) => setFilters({ ...filters, endDate })}
            />
          </span>
        </label>
        <label>
          Provider
          <Select
            value={filters.payment_method}
            placeholder="All providers"
            allowClear
            options={[
              { label: "CBE", value: "cbe" },
              { label: "Telebirr", value: "telebirr" },
            ]}
            onChange={(payment_method) =>
              setFilters({ ...filters, payment_method })
            }
          />
        </label>
        <Button
          className="admin-payment-reset"
          icon={<ReloadOutlined />}
          onClick={() =>
            setFilters({
              status: null,
              startDate: null,
              endDate: null,
              payment_method: null,
            })
          }
        >
          Reset
        </Button>
      </div>

      <div className="admin-payment-content">
        <section className="admin-payment-list-panel">
          <div className="admin-payment-list-heading">
            <div>
              <h2>
                Payment Verifications <span>{payments.length}</span>
              </h2>
              <p>
                Review customer-submitted payment proofs before releasing the
                booking.
              </p>
            </div>
            <SearchOutlined />
          </div>
          <div className="admin-payment-table-wrap">
            <div className="admin-payment-table-head">
              <span>Payment ID</span>
              <span>Booking</span>
              <span>Customer</span>
              <span>Vendor</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Provider</span>
              <span>Date</span>
              <span>Action</span>
            </div>
            {loading ? (
              <div className="admin-payment-empty">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="admin-payment-empty">No payments found.</div>
            ) : (
              payments.map((payment) => {
                const status =
                  payment.payment_status || payment.status || "pending";
                const active = selectedPayment?.id === payment.id;
                return (
                  <button
                    className={`admin-payment-row ${active ? "is-selected" : ""}`}
                    key={payment.id}
                    onClick={() => handleViewDetails(payment)}
                  >
                    <span className="payment-id">#{payment.id}</span>
                    <span>
                      #{payment.booking_id || payment.booking?.id || "-"}
                    </span>
                    <span>
                      <strong>{customerName(payment)}</strong>
                      <small>{payment.customer?.email || ""}</small>
                    </span>
                    <span>{vendorName(payment)}</span>
                    <span className="payment-amount">
                      {money(payment.amount)}
                    </span>
                    <span>
                      <Tag
                        className={`payment-status status-${status}`}
                        bordered={false}
                      >
                        {status.replace("_", " ").toUpperCase()}
                      </Tag>
                    </span>
                    <span className="payment-provider">
                      {String(payment.payment_method || "-").toUpperCase()}
                    </span>
                    <span className="payment-date">
                      {formatDate(payment.created_at)}
                    </span>
                    <span className="payment-actions">
                      <EyeOutlined />
                      {payment.payment_proof_path ? "Review" : "View"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          <div className="admin-payment-list-footer">
            Showing {payments.length} payment{payments.length === 1 ? "" : "s"}
          </div>
        </section>

        {selectedPayment && (
          <aside className="admin-payment-detail-panel">
            <div className="detail-panel-heading">
              <div>
                <span className="detail-icon">
                  <FileImageOutlined />
                </span>
                <div>
                  <h2>Payment Proof Details</h2>
                  <Tag
                    className={`payment-status status-${selectedPayment.payment_status || "pending"}`}
                    bordered={false}
                  >
                    {(
                      selectedPayment.payment_status || "pending"
                    ).toUpperCase()}
                  </Tag>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                aria-label="Close payment details"
              >
                ×
              </button>
            </div>
            <div className="detail-proof-summary">
              <div className="proof-placeholder">
                <FileImageOutlined />
              </div>
              <div>
                <small>Payment ID</small>
                <strong>#{selectedPayment.id}</strong>
                <small>Booking ID</small>
                <strong>
                  #{selectedPayment.booking_id || selectedPayment.booking?.id}
                </strong>
                <small>Transaction Reference</small>
                <strong>
                  {selectedPayment.transaction_id || "Pending verification"}
                </strong>
              </div>
            </div>
            <div className="detail-section">
              <h3>Transaction Information</h3>
              <div className="detail-lines">
                <span>
                  Amount <b>{money(selectedPayment.amount)}</b>
                </span>
                <span>
                  Platform Fee <b>{money(selectedPayment.platform_fee)}</b>
                </span>
                <span>
                  Vendor Amount{" "}
                  <b>
                    {money(
                      selectedPayment.vendor_amount || selectedPayment.amount,
                    )}
                  </b>
                </span>
                <span>
                  Payment Date{" "}
                  <b>
                    {selectedPayment.created_at
                      ? new Date(selectedPayment.created_at).toLocaleString()
                      : "-"}
                  </b>
                </span>
                <span>
                  Provider{" "}
                  <b>
                    {String(
                      selectedPayment.payment_method || "-",
                    ).toUpperCase()}
                  </b>
                </span>
              </div>
            </div>
            <div className="detail-section">
              <h3>Customer & Vendor</h3>
              <div className="detail-person">
                <span className="person-avatar">
                  {customerName(selectedPayment).slice(0, 1)}
                </span>
                <span>
                  <small>Customer</small>
                  <strong>{customerName(selectedPayment)}</strong>
                  <small>{selectedPayment.customer?.email || "-"}</small>
                </span>
              </div>
              <div className="detail-person">
                <span className="person-avatar vendor-avatar">
                  <WalletOutlined />
                </span>
                <span>
                  <small>Vendor</small>
                  <strong>{vendorName(selectedPayment)}</strong>
                  <small>{selectedPayment.vendor?.user?.email || "-"}</small>
                </span>
              </div>
            </div>
            <div className="detail-section">
              <h3>Uploaded Payment Proof</h3>
              {proofUrl ? (
                <>
                  <img
                    className="payment-proof-image"
                    src={proofUrl}
                    alt="Uploaded customer payment proof"
                  />
                  <a
                    className="proof-image-link"
                    href={proofUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <EyeOutlined /> View Full Image
                  </a>
                  {selectedPayment.payment_status !== "paid" &&
                  selectedPayment.proof_verification_status !== "rejected" ? (
                    <div className="detail-actions proof-card-actions">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() =>
                          handleVerifyPayment(selectedPayment.id, true)
                        }
                      >
                        Approve Payment
                      </Button>
                      <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() =>
                          handleVerifyPayment(selectedPayment.id, false)
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="proof-missing">
                  No screenshot uploaded for this payment.
                </div>
              )}
            </div>
            <div className="detail-actions">
              {selectedPayment.payment_status === "paid" ? (
                <Button
                  danger
                  icon={<UndoOutlined />}
                  onClick={() => handleInitiateRefund(selectedPayment.id)}
                >
                  Initiate Refund
                </Button>
              ) : null}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;

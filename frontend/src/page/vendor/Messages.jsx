import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Input,
  Button,
  Badge,
  message,
  Empty,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Text, Title } = Typography;

const formatMessage = (message, currentUserId) => ({
  id: message.id,
  type:
    Number(message.sender_id) === Number(currentUserId)
      ? "outbound"
      : "inbound",
  text: message.text || message.message || "",
  time: new Date(message.created_at || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

const Messages = () => {
  const { theme } = useTheme();
  const { backendUrl, user } = useContext(AppContext);
  const location = useLocation();
  const isDark = theme === "dark";
  const [bookingsList, setBookingsList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [messageMap, setMessageMap] = useState({});
  const preselectedBookingId = location.state?.bookingId;
  const preselectedCustomerId = location.state?.customerId;
  const currentUserId = user?.id;
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  const fetchMessagesForBooking = async (bookingId) => {
    if (!bookingId || !backendUrl) return [];

    try {
      const response = await axios.get(
        `${backendUrl}/bookings/${bookingId}/messages`,
        { headers: authHeaders },
      );

      const list = (response.data?.messages || []).map((item) =>
        formatMessage(item, currentUserId),
      );

      setMessageMap((prev) => ({ ...prev, [bookingId]: list }));
      return list;
    } catch (error) {
      console.error("Failed to fetch booking messages:", error);
      return [];
    }
  };

  useEffect(() => {
    let isCurrent = true;

    axios
      .get(`${backendUrl}/vendor/bookings`, { headers: authHeaders })
      .then((response) => {
        if (!isCurrent) return;

        const rows = response.data?.bookings || response.data?.data || [];
        const normalizedRows = Array.isArray(rows) ? rows : [];
        setBookingsList(normalizedRows);

        if (normalizedRows.length === 0) {
          setSelectedConversation(null);
          return;
        }

        if (preselectedBookingId || preselectedCustomerId) {
          const nextIndex = normalizedRows.findIndex((booking) => {
            const customer = booking.customer || {};
            return (
              String(booking.id) === String(preselectedBookingId) ||
              String(customer.id) === String(preselectedCustomerId) ||
              String(booking.customer_id) === String(preselectedCustomerId) ||
              String(booking.user_id) === String(preselectedCustomerId)
            );
          });

          setSelectedConversation(nextIndex >= 0 ? nextIndex : 0);
          return;
        }

        setSelectedConversation((prev) => prev ?? 0);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error("Failed to fetch bookings:", error);
        messageApi.error(
          error.response?.data?.message || "Unable to load messages.",
        );
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [backendUrl, messageApi, preselectedBookingId, preselectedCustomerId]);

  const conversations = useMemo(() => {
    return bookingsList.map((booking, index) => {
      const customer = booking.customer || {};
      const product = booking.product || {};
      const customerName =
        customer.name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        "Customer";
      const productName = product.name || "Rental Item";
      const list = messageMap[booking.id] || [];
      const lastMessage = list[list.length - 1];

      return {
        id: String(booking.id),
        bookingId: booking.id,
        customerId:
          customer.id || booking.customer_id || booking.user_id || "customer",
        productName,
        customerName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=1d4ed8&color=fff`,
        lastMessage:
          lastMessage?.text ||
          `Booking for ${productName} from ${booking.start_date ? new Date(booking.start_date).toLocaleDateString() : "TBD"}`,
        lastTime: lastMessage?.time || "Now",
        unread: 0,
        status: booking.status?.toUpperCase() || "PENDING",
        messages: list,
        index,
      };
    });
  }, [bookingsList, messageMap]);

  const currentConversation =
    selectedConversation !== null ? conversations[selectedConversation] : null;

  useEffect(() => {
    if (!currentConversation?.bookingId || !backendUrl) return;

    fetchMessagesForBooking(currentConversation.bookingId);

    const timer = setInterval(() => {
      fetchMessagesForBooking(currentConversation.bookingId);
    }, 15000);

    return () => clearInterval(timer);
  }, [backendUrl, currentConversation?.bookingId]);

  const handleSendMessage = async () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      messageApi.warning("Please type a message.");
      return;
    }

    if (!currentConversation || !currentConversation.bookingId) {
      messageApi.warning("Please select a conversation.");
      return;
    }

    try {
      setIsSending(true);

      const response = await axios.post(
        `${backendUrl}/bookings/${currentConversation.bookingId}/messages`,
        { message: trimmedMessage },
        { headers: authHeaders },
      );

      const savedMessage = response.data?.data;
      if (savedMessage) {
        const nextMessage = formatMessage(savedMessage, currentUserId);
        setMessageMap((prev) => ({
          ...prev,
          [currentConversation.bookingId]: [
            ...(prev[currentConversation.bookingId] || []),
            nextMessage,
          ],
        }));
      }

      setMessageText("");
      messageApi.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send booking message:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to send message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      {contextHolder}

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Title
            level={2}
            style={{ marginBottom: 4, color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            Messages
          </Title>
          <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 16 }}>
            Communicate with customers about their bookings
          </Text>
        </Col>

        <Col xs={24}>
          <Row gutter={16} style={{ height: "calc(100vh - 200px)" }}>
            {/* Conversations List */}
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 18,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 250px)",
                }}
              >
                {loading ? (
                  <Empty description="Loading conversations..." />
                ) : conversations.length === 0 ? (
                  <Empty description="No conversations yet" />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {conversations.map((conv, index) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(index)}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          cursor: "pointer",
                          background:
                            selectedConversation === index
                              ? isDark
                                ? "#1e293b"
                                : "#f0f4f8"
                              : "transparent",
                          border:
                            selectedConversation === index
                              ? `2px solid ${isDark ? "#3b82f6" : "#1d4ed8"}`
                              : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                          }}
                        >
                          <Badge
                            count={conv.unread}
                            style={{ backgroundColor: "#ff4d4f" }}
                          >
                            <Avatar size={40} src={conv.avatar} />
                          </Badge>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                strong
                                style={{
                                  color: isDark ? "#f8fafc" : "#111827",
                                }}
                              >
                                {conv.customerName}
                              </Text>
                              <Text
                                style={{
                                  color: isDark ? "#94a3b8" : "#94a3b8",
                                  fontSize: 12,
                                }}
                              >
                                {conv.lastTime}
                              </Text>
                            </div>

                            <Text
                              style={{
                                color: isDark ? "#cbd5e1" : "#6b7280",
                                fontSize: 12,
                              }}
                            >
                              {conv.productName}
                            </Text>

                            <div
                              style={{
                                marginTop: 4,
                                display: "flex",
                                gap: 6,
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                ellipsis
                                style={{
                                  color: isDark ? "#94a3b8" : "#6b7280",
                                  fontSize: 12,
                                  flex: 1,
                                }}
                              >
                                {conv.lastMessage}
                              </Text>
                              <Badge
                                color={
                                  conv.status === "PENDING"
                                    ? "#faad14"
                                    : "#1890ff"
                                }
                                text={
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: isDark ? "#cbd5e1" : "#6b7280",
                                    }}
                                  >
                                    {conv.status}
                                  </span>
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </Col>

            {/* Chat Area */}
            <Col xs={24} md={16}>
              {currentConversation ? (
                <Card
                  style={{
                    borderRadius: 18,
                    background: isDark ? "#0f172a" : "#ffffff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Chat Header */}
                  <div
                    style={{
                      borderBottom: isDark
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(15,23,42,0.08)",
                      paddingBottom: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <Avatar size={40} src={currentConversation.avatar} />
                      <div>
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            color: isDark ? "#f8fafc" : "#111827",
                          }}
                        >
                          {currentConversation.customerName}
                        </Title>
                        <Text
                          style={{
                            color: isDark ? "#cbd5e1" : "#6b7280",
                            fontSize: 12,
                          }}
                        >
                          {currentConversation.productName}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      marginBottom: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {currentConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.type === "outbound" ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background:
                              msg.type === "outbound"
                                ? isDark
                                  ? "#3b82f6"
                                  : "#dbeafe"
                                : isDark
                                  ? "#1e293b"
                                  : "#f3f4f6",
                          }}
                        >
                          <Text
                            style={{
                              color:
                                msg.type === "outbound"
                                  ? isDark
                                    ? "#f8fafc"
                                    : "#111827"
                                  : isDark
                                    ? "#cbd5e1"
                                    : "#6b7280",
                            }}
                          >
                            {msg.text}
                          </Text>
                          <div style={{ marginTop: 4 }}>
                            <Text
                              style={{
                                fontSize: 10,
                                color:
                                  msg.type === "outbound"
                                    ? isDark
                                      ? "#d1d5db"
                                      : "#9ca3af"
                                    : isDark
                                      ? "#6b7280"
                                      : "#9ca3af",
                              }}
                            >
                              {msg.time}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onPressEnter={handleSendMessage}
                      placeholder="Type your message..."
                      style={{
                        borderRadius: 8,
                        background: isDark ? "#1e293b" : "#f9fafb",
                        color: isDark ? "#f8fafc" : "#111827",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(15,23,42,0.08)",
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      loading={isSending}
                      disabled={isSending}
                      style={{ borderRadius: 8 }}
                    >
                      Send
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card
                  style={{
                    borderRadius: 18,
                    background: isDark ? "#0f172a" : "#ffffff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Empty description="Select a conversation to start messaging" />
                </Card>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Messages;

import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Typography, Input, Button, Badge } from "antd";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
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

const Messagespage = () => {
  const location = useLocation();
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl, user } = useContext(AppContext);
  const isDark = theme === "dark";
  const { vendorId, vendorName, productName, bookingId, customerId } =
    location.state || {};

  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUserId = user?.id;

  useEffect(() => {
    if (!bookingId) {
      setConversation(null);
      setSelectedId("");
      return;
    }

    const nextConversation = {
      id: String(bookingId),
      key: String(bookingId),
      vendorId,
      customerId: customerId || currentUserId || "customer-current",
      bookingId,
      vendor: vendorName || "Vendor",
      subject: productName || "Rental Item",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(vendorName || "Vendor")}&background=2563eb&color=fff`,
      lastMessage: "Loading messages...",
      lastTime: "Now",
      unread: 0,
      status: "VENDOR CHAT",
      productName: productName || "Rental Item",
      messages: [],
    };

    setConversation(nextConversation);
    setSelectedId(String(bookingId));
  }, [bookingId, customerId, currentUserId, productName, vendorId, vendorName]);

  useEffect(() => {
    if (!conversation?.bookingId || !backendUrl) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/bookings/${conversation.bookingId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const nextMessages = (response.data?.messages || []).map((message) =>
          formatMessage(message, currentUserId),
        );

        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: nextMessages,
                lastMessage:
                  nextMessages[nextMessages.length - 1]?.text ||
                  prev.lastMessage,
                lastTime:
                  nextMessages[nextMessages.length - 1]?.time || prev.lastTime,
              }
            : prev,
        );
      } catch (error) {
        console.error("Failed to load chat messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const timer = setInterval(fetchMessages, 5000);
    return () => clearInterval(timer);
  }, [backendUrl, conversation?.bookingId, currentUserId]);

  const filteredConversations = useMemo(
    () => (conversation ? [conversation] : []),
    [conversation],
  );

  const selectedConversation = useMemo(
    () =>
      filteredConversations.find((item) => item.id === selectedId) ||
      filteredConversations[0] ||
      null,
    [filteredConversations, selectedId],
  );

  const hasConversations = filteredConversations.length > 0;

  const handleSend = async () => {
    if (!draft.trim() || !selectedConversation || !backendUrl) return;

    try {
      const response = await axios.post(
        `${backendUrl}/bookings/${selectedConversation.bookingId}/messages`,
        { message: draft.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const savedMessage = response.data?.data;
      if (!savedMessage) {
        setDraft("");
        return;
      }

      const nextMessage = formatMessage(savedMessage, currentUserId);

      setConversation((prev) => {
        if (!prev) return prev;

        const updatedMessages = [...(prev.messages || []), nextMessage];
        return {
          ...prev,
          messages: updatedMessages,
          lastMessage: nextMessage.text,
          lastTime: nextMessage.time,
        };
      });

      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: isDark ? "#050b16" : "#f4f7ff",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {!hasConversations ? (
          <Card
            style={{
              borderRadius: 20,
              background: isDark ? "#0b1220" : "#ffffff",
              minHeight: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
              No conversations yet.
            </Text>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                style={{
                  borderRadius: 20,
                  minHeight: 720,
                  background: isDark ? "#0b1220" : "#ffffff",
                }}
                styles={{ body: { padding: 0 } }}
              >
                <div
                  style={{
                    borderBottom: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0",
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <Title
                        level={4}
                        style={{
                          margin: 0,
                          color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                      >
                        {selectedConversation?.vendor || "Vendor"}
                      </Title>
                      <Text style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
                        {t.messagesPage?.subjectLabel || "Subject"}:{" "}
                        {selectedConversation?.subject || "Rental Item"}
                      </Text>
                    </div>
                    {selectedConversation?.status && (
                      <Badge
                        style={{
                          padding: "0 14px",
                          height: 28,
                          borderRadius: 999,
                          background: selectedConversation.status.includes(
                            "ESCROW",
                          )
                            ? "rgba(34,197,94,0.14)"
                            : "rgba(37,99,235,0.12)",
                          color: selectedConversation.status.includes("ESCROW")
                            ? "#16a34a"
                            : "#2563eb",
                          alignSelf: "center",
                        }}
                        count={selectedConversation.status}
                      />
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    minHeight: 520,
                    maxHeight: 520,
                    overflowY: "auto",
                    background: isDark ? "#071025" : "#f8fbff",
                  }}
                >
                  {loading && selectedConversation?.messages?.length === 0 ? (
                    <Text style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
                      Loading messages...
                    </Text>
                  ) : (
                    (selectedConversation?.messages || []).map((message) => (
                      <div
                        key={message.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            message.type === "outbound"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "72%",
                            borderRadius: 20,
                            padding: "16px 18px",
                            background:
                              message.type === "outbound"
                                ? isDark
                                  ? "#1d4ed8"
                                  : "#2563eb"
                                : isDark
                                  ? "rgba(255,255,255,0.06)"
                                  : "#ffffff",
                            color:
                              message.type === "outbound"
                                ? "#fff"
                                : isDark
                                  ? "#f8fafc"
                                  : "#0f172a",
                            boxShadow: isDark
                              ? "0 18px 30px rgba(0,0,0,0.18)"
                              : "0 8px 18px rgba(15,23,42,0.08)",
                          }}
                        >
                          <Text
                            style={{ display: "block", whiteSpace: "pre-wrap" }}
                          >
                            {message.text}
                          </Text>
                          <Text
                            type="secondary"
                            style={{
                              display: "block",
                              marginTop: 8,
                              fontSize: 12,
                              textAlign: "right",
                            }}
                          >
                            {message.time}
                          </Text>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  style={{
                    borderTop: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0",
                    padding: 20,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Input.TextArea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={
                        t.messagesPage?.replyPlaceholder ||
                        "Reply to the vendor about delivery, scheduling, or booking details"
                      }
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      style={{
                        flex: 1,
                        borderRadius: 16,
                        borderColor: isDark
                          ? "rgba(255,255,255,0.12)"
                          : "#d9d9d9",
                        background: isDark ? "#0f172a" : "#ffffff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                      }}
                    />
                    <Button
                      type="primary"
                      onClick={handleSend}
                      style={{ borderRadius: 16, minWidth: 140 }}
                    >
                      {t.messagesPage?.send || "Send"}
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Messagespage;

import React, { useMemo, useState } from "react";
import { Row, Col, Card, Avatar, Typography, Input, Button, Badge } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text, Title } = Typography;

const conversations = [
  {
    id: "conv-1",
    vendor: "Titan Heavy Rentals",
    subject: "CAT 320D Excavator",
    avatar:
      "https://ui-avatars.com/api/?name=Titan+Heavy+Rentals&background=1d4ed8&color=fff",
    lastMessage:
      "Yes, it is fully fueled. Please ensure the site clearance is ready so we can offload it safely.",
    lastTime: "10:45 AM",
    unread: 1,
    status: "VERIFIED ESCROW CHAT",
    messages: [
      {
        id: "msg-1",
        type: "inbound",
        text: "Hello Marcus, we received your rental request for the CAT 320D Excavator. The driver will deliver it to your Addis Ababa site tomorrow at 9 AM.",
        time: "9:30 AM",
      },
      {
        id: "msg-2",
        type: "outbound",
        text: "Thanks! Is the fuel tank full upon delivery?",
        time: "10:15 AM",
      },
      {
        id: "msg-3",
        type: "inbound",
        text: "Yes, it is fully fueled. Please ensure the site clearance is ready so we can offload it safely.",
        time: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    vendor: "GlowTech Suppliers",
    subject: "HydraFacial MD Elite",
    avatar:
      "https://ui-avatars.com/api/?name=GlowTech+Suppliers&background=059669&color=fff",
    lastMessage:
      "Awesome, I will bring the printed document and insurance certificate before dispatch.",
    lastTime: "Yesterday",
    unread: 0,
    status: "ESCROW CONFIRMED",
    messages: [
      {
        id: "msg-4",
        type: "inbound",
        text: "Your booking for the HydraFacial MD Elite is confirmed for July 30th.",
        time: "Yesterday",
      },
      {
        id: "msg-5",
        type: "outbound",
        text: "Awesome, I will bring the printed document and insurance certificate before dispatch.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "conv-3",
    vendor: "GreenField Agri Services",
    subject: "John Deere 1025R Tractor",
    avatar:
      "https://ui-avatars.com/api/?name=GreenField+Agri+Services&background=0ea5e9&color=fff",
    lastMessage:
      "The John Deere Tractor is ready for dispatch and will arrive tomorrow morning.",
    lastTime: "2 days ago",
    unread: 0,
    status: "CONFIRMED",
    messages: [
      {
        id: "msg-6",
        type: "inbound",
        text: "The John Deere Tractor is ready for dispatch and will arrive tomorrow morning.",
        time: "2 days ago",
      },
    ],
  },
];

const Messagespage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId),
    [selectedId],
  );

  const handleSend = () => {
    if (!draft.trim()) return;
    selectedConversation.messages.push({
      id: `msg-out-${Date.now()}`,
      type: "outbound",
      text: draft.trim(),
      time: "Now",
    });
    setDraft("");
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
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              title={
                <div>
                  <Title
                    level={4}
                    style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
                  >
                    {t.messagesPage?.vendorMessages || "Vendor Messages"}
                  </Title>
                  <Text
                    type={isDark ? undefined : "secondary"}
                    style={{ fontSize: 14 }}
                  >
                    {t.messagesPage?.messagesSubtitle ||
                      "Real-time negotiations & agreements"}
                  </Text>
                </div>
              }
              bodyStyle={{ padding: 0 }}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                background: isDark ? "#0b1220" : "#ffffff",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                {conversations.map((conversation) => {
                  const isSelected = conversation.id === selectedId;
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedId(conversation.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 18,
                        cursor: "pointer",
                        borderBottom: "1px solid",
                        borderColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "#f0f0f0",
                        background: isSelected
                          ? isDark
                            ? "rgba(255,255,255,0.04)"
                            : "#f5f7ff"
                          : "transparent",
                      }}
                    >
                      <Avatar size={48} src={conversation.avatar} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <Text
                            strong
                            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                          >
                            {conversation.vendor}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {conversation.lastTime}
                          </Text>
                        </div>
                        <Text
                          style={{
                            display: "block",
                            color: isDark ? "#94a3b8" : "#6b7280",
                          }}
                        >
                          {conversation.subject}
                        </Text>
                        <Text
                          style={{
                            display: "block",
                            marginTop: 6,
                            color: isDark ? "#94a3b8" : "#6b7280",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {conversation.lastMessage}
                        </Text>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge count={conversation.unread} color="#22c55e" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 20,
                minHeight: 720,
                background: isDark ? "#0b1220" : "#ffffff",
              }}
              bodyStyle={{ padding: 0 }}
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
                      {selectedConversation.vendor}
                    </Title>
                    <Text style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
                      {t.messagesPage?.subjectLabel || "Subject"}:{" "}
                      {selectedConversation.subject}
                    </Text>
                  </div>
                  <Badge
                    style={{
                      padding: "0 14px",
                      height: 28,
                      borderRadius: 999,
                      background: selectedConversation.status.includes("ESCROW")
                        ? "rgba(34,197,94,0.14)"
                        : "rgba(37,99,235,0.12)",
                      color: selectedConversation.status.includes("ESCROW")
                        ? "#16a34a"
                        : "#2563eb",
                      alignSelf: "center",
                    }}
                    count={selectedConversation.status}
                  />
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
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        message.type === "outbound" ? "flex-end" : "flex-start",
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
                ))}
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
                      "Reply to Titan Heavy Rentals about delivery, inspection, fuel..."
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
      </div>
    </div>
  );
};

export default Messagespage;

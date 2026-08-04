import React, { useState } from "react";
import { Row, Col, Card, Typography, Space, Button, Select } from "antd";
import { FilePdfOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const Reports = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reportCycle, setReportCycle] = useState(
    "February 2026 (Current Active Period)",
  );
  const [format, setFormat] = useState("PDF");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <div>
            <Title
              level={2}
              style={{
                marginBottom: 4,
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            >
              Audited Financial Reports
            </Title>
            <Text
              style={{
                color: isDark ? "#94a3b8" : "#64748b",
                fontSize: 16,
              }}
            >
              Download official monthly rental transactions, tax spreadsheets,
              and compliance logs.
            </Text>
          </div>
        </Col>

        <Col xs={24}>
          <Card
            style={{
              borderRadius: 18,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.08)",
              padding: 8,
            }}
          >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <div>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Select Reporting Statement Cycle
                </Text>
                <Select
                  value={reportCycle}
                  onChange={setReportCycle}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                  options={[
                    {
                      value: "February 2026 (Current Active Period)",
                      label: "February 2026 (Current Active Period)",
                    },
                    {
                      value: "January 2026 (Prior Period)",
                      label: "January 2026 (Prior Period)",
                    },
                  ]}
                />
              </div>

              <div>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Download File Specification Format
                </Text>
                <Space size={12} style={{ marginTop: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "PDF", value: "PDF" },
                    { label: "CSV (Excel)", value: "CSV" },
                    { label: "JSON Ledger", value: "JSON" },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      type={format === item.value ? "primary" : "default"}
                      style={{
                        minWidth: 130,
                        borderRadius: 8,
                        fontWeight: 700,
                        background:
                          format === item.value
                            ? "#e0e7ff"
                            : isDark
                              ? "#0f172a"
                              : "#ffffff",
                        color:
                          format === item.value
                            ? "#1d4ed8"
                            : isDark
                              ? "#f8fafc"
                              : "#111827",
                        borderColor:
                          format === item.value
                            ? "#60a5fa"
                            : isDark
                              ? "rgba(255,255,255,0.12)"
                              : "#cbd5e1",
                      }}
                      onClick={() => setFormat(item.value)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Space>
              </div>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                  border: "none",
                  fontWeight: 800,
                }}
              >
                Request Compiled Report
              </Button>

              <Card
                style={{
                  borderRadius: 12,
                  background: isDark ? "#08111f" : "#f8fafc",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <Space align="center" size={10}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#0ea5e9",
                      display: "inline-block",
                    }}
                  />
                  <Text
                    strong
                    style={{ color: isDark ? "#f8fafc" : "#111827" }}
                  >
                    SECURE DISPATCH PROTOCOL
                  </Text>
                </Space>
                <Text
                  style={{
                    display: "block",
                    marginTop: 10,
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  All downloadable spreadsheets generated inside i-Share conform
                  strictly to escrow standards. Internal tax tokens are
                  automatically injected into the footer metadata black.
                </Text>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;

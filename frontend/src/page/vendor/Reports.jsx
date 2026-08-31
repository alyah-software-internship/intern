import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Select,
  message,
} from "antd";
import { FilePdfOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const escapePdfText = (value) =>
  String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "")
    .replace(/\n/g, " ");

const buildCsvReport = (cycle, generatedAt) => {
  const rows = [
    ["Report Cycle", cycle],
    ["Generated At", generatedAt],
    ["Statement Type", "Official Monthly Rental Transactions"],
    ["Document", "i-Share Audited Financial Report"],
    ["Status", "Approved"],
    [""],
    ["Category", "Value"],
    ["Total Revenue", "$0.00"],
    ["Platform Fees", "$0.00"],
    ["Vendor Payout", "$0.00"],
    ["Bookings Count", "0"],
  ];

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
};

const buildJsonReport = (cycle, generatedAt) => ({
  reportType: "audited_financial_report",
  cycle,
  generatedAt,
  status: "approved",
  vendor: "i-Share Vendor",
  summary: {
    totalRevenue: 0,
    platformFees: 0,
    vendorPayout: 0,
    bookingCount: 0,
  },
  meta: {
    document: "official_monthly_rental_transactions",
    format: "JSON",
    generatedBy: "i-Share",
  },
});

const buildPdfReport = (cycle, generatedAt) => {
  const lineText = [
    "i-Share Audited Financial Report",
    `Cycle: ${cycle}`,
    `Generated At: ${generatedAt}`,
    "Statement Type: Official Monthly Rental Transactions",
    "Status: Approved",
    "Total Revenue: $0.00",
    "Platform Fees: $0.00",
    "Vendor Payout: $0.00",
    "Bookings Count: 0",
  ];

  const contentStream = lineText
    .map(
      (line, index) =>
        `BT /F1 12 Tf 50 ${760 - index * 20} Td (${escapePdfText(line)}) Tj ET`,
    )
    .join("\n");

  const contentLength = contentStream.length;

  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${contentLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000127 00000 n 
0000000432 00000 n 
0000000902 00000 n 
trailer
<< /Root 1 0 R /Size 6 >>
startxref
978
%%EOF`;
};

const Reports = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reportCycle, setReportCycle] = useState(
    "February 2026 (Current Active Period)",
  );
  const [format, setFormat] = useState("PDF");

  const handleDownloadReport = () => {
    const generatedAt = new Date().toISOString();

    let content = "";
    let mimeType = "application/json";
    let extension = "json";

    if (format === "CSV") {
      content = buildCsvReport(reportCycle, generatedAt);
      mimeType = "text/csv;charset=utf-8";
      extension = "csv";
    } else if (format === "JSON") {
      content = JSON.stringify(
        buildJsonReport(reportCycle, generatedAt),
        null,
        2,
      );
      mimeType = "application/json;charset=utf-8";
      extension = "json";
    } else {
      content = buildPdfReport(reportCycle, generatedAt);
      mimeType = "application/pdf;charset=utf-8";
      extension = "pdf";
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const fileUrl = URL.createObjectURL(blob);

    link.href = fileUrl;
    link.download = `i-share-report-${reportCycle.replace(/\s+/g, "-").toLowerCase()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);

    message.success(`Report downloaded as ${format}.`);
  };

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
                onClick={handleDownloadReport}
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

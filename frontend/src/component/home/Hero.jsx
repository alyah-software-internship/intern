import { Col, Row, Typography, Space } from "antd";
import Button from "../Button.jsx";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import Searchbar from "./Searchbar.jsx";

const { Title, Paragraph } = Typography;

const Hero = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";


  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 24px 80px",
        background: isDark
          ? "#0f172a"
          : "linear-gradient(180deg, #f7fbff 0%, #eef6ff 45%, #f8fbff 100%)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Row justify="center">
          <Col xs={24} lg={18}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Title
                style={{
                  fontSize: 56,
                  lineHeight: 1.05,
                  marginBottom: 16,
                  fontWeight: 900,
                  color: isDark ? "#f8fafc" : undefined,
                }}
              >
                {t.home.heroTitle}
              </Title>
              <Paragraph
                style={{
                  margin: "0 auto",
                  maxWidth: 760,
                  fontSize: 18,
                  color: isDark ? "#cbd5e1" : "#475569",
                  lineHeight: 1.8,
                }}
              >
                {t.home.heroSubtitle}
              </Paragraph>
            </div>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: 32 }}>
          <Col xs={24} xl={22}>
            <Searchbar />
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 40 }}>
          <Col xs={24} sm={20} md={18}>
            <Space size={16} wrap style={{ justifyContent: "center" }}>
              <Button
                type="default"
                style={{
                  minWidth: 180,
                  borderRadius: 999,
                  padding: "12px 24px",
                  fontWeight: 700,
                }}
              >
                {t.home.search.browseCategories}
              </Button>
              <Button
                type="default"
                style={{
                  minWidth: 180,
                  borderRadius: 999,
                  padding: "12px 24px",
                  fontWeight: 700,
                  background: "#d5f7ec",
                  borderColor: "#d5f7ec",
                  color: "#0f766e",
                }}
              >
                {t.home.search.viewCatalog}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Hero;

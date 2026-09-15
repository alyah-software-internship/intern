import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row, Space, Tag, Typography, message } from "antd";
import axios from "axios";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Subscription = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const { backendUrl, currency } = useContext(AppContext);
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState("premium");
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [saving, setSaving] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const isDark = theme === "dark";
  const subscriptionText = t?.subscriptionPage || {};

  useEffect(() => {
    axios
      .get(`${backendUrl}/vendor/subscription`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const plan = response.data.subscription?.subscription_plan;
        if (plan) setActivePlan(plan);
      })
      .catch(() => {});
  }, [backendUrl]);

  const handleSubscribe = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        `${backendUrl}/vendor/subscription`,
        { plan: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setPaymentId(response.data.payment_id);
      setPaymentUrl(response.data.payment_url || "");
      messageApi.info("Subscription payment started. Confirming payment...");
      navigate(`/payments/subscription/${response.data.payment_id}`, {
        state: {
          plan: selectedPlan,
          amount: selectedPackage?.price,
        },
      });
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to activate subscription.",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!paymentId) return undefined;

    const verifySubscriptionPayment = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/payments/${paymentId}/verify`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        if (response.data.payment?.payment_status === "paid") {
          const subscription = await axios.get(
            `${backendUrl}/vendor/subscription`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          );
          setActivePlan(
            subscription.data.subscription?.subscription_plan || activePlan,
          );
          setPaymentId(null);
          setPaymentUrl("");
          messageApi.success(
            "Subscription paid and activated. You can now post items.",
          );
        }
      } catch (error) {
        messageApi.error(
          error.response?.data?.message ||
            "Unable to verify subscription payment.",
        );
        setPaymentId(null);
        setPaymentUrl("");
      }
    };

    verifySubscriptionPayment();
    const interval = setInterval(verifySubscriptionPayment, 3000);
    return () => clearInterval(interval);
  }, [backendUrl, paymentId]);

  const packageOptions = useMemo(
    () => [
      {
        key: "basic",
        label: subscriptionText.basicLabel || "STARTER SHOP",
        name: subscriptionText.basicPlan || "Basic Fleet Plan",
        price: subscriptionText.basicPrice || `${currency} 2,900`,
        duration: subscriptionText.monthSuffix || "/month",
        features: subscriptionText.basicFeatures || [
          "Up to 3 product listings",
          "5% standard platform fee",
          "Secure Escrow pre-auth",
        ],
        cta: subscriptionText.switchToBasic || "Switch to Basic",
        accent: "#0f172a",
      },
      {
        key: "premium",
        label: subscriptionText.premiumLabel || "STANDARD GROWTH",
        name: subscriptionText.premiumPlan || "Pro Premium Builder",
        price: subscriptionText.premiumPrice || `${currency} 9,900`,
        duration: subscriptionText.monthSuffix || "/month",
        features: subscriptionText.premiumFeatures || [
          "Up to 25 product listings",
          "3% reduced platform fee",
          "Priority support & damage dispute assistance",
        ],
        cta:
          subscriptionText.currentActivePlan || "Current Billing Cycle Active",
        accent: "#10b981",
        highlight: true,
      },
      {
        key: "enterprise",
        label: subscriptionText.enterpriseLabel || "CORPORATE DEALERSHIPS",
        name: subscriptionText.enterprisePlan || "Enterprise Network",
        price: subscriptionText.enterprisePrice || `${currency} 24,900`,
        duration: subscriptionText.monthSuffix || "/month",
        features: subscriptionText.enterpriseFeatures || [
          "Unlimited product listings",
          "1.5% minimum platform fee",
          "Custom API webhooks & GPS logs",
        ],
        cta: subscriptionText.upgradeToEnterprise || "Upgrade to Enterprise",
        accent: "#111827",
      },
    ],
    [subscriptionText],
  );

  const activePackage = useMemo(
    () =>
      packageOptions.find((item) => item.key === activePlan) ||
      packageOptions[1],
    [activePlan, packageOptions],
  );

  const selectedPackage = useMemo(
    () =>
      packageOptions.find((item) => item.key === selectedPlan) ||
      packageOptions[0],
    [selectedPlan, packageOptions],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#06101d" : "#f4f7fb",
        padding: 20,
        color: isDark ? "#f8fafc" : "#0f172a",
      }}
    >
      {contextHolder}
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Card
          style={{
            marginBottom: 28,
            borderRadius: 20,
            background: "linear-gradient(90deg, #0db16a, #0b9c78)",
            border: "none",
          }}
          styles={{ body: { padding: "30px 36px" } }}
        >
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Space orientation="vertical" size={8}>
                <Text
                  strong
                  style={{ color: "#eefcf7", textTransform: "uppercase" }}
                >
                  {subscriptionText.activePackage || "Active Package"}
                </Text>
                <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
                  {activePackage.name}
                </Title>
                <Text style={{ color: "#e9fff6", fontSize: 16 }}>
                  {subscriptionText.autoRenewText ||
                    "Renewing automatically on 2026-08-15 · Billing card ··· 9812"}
                </Text>
              </Space>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: "right" }}>
              <Text
                style={{
                  color: "#e9fff6",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                {subscriptionText.pricingAgreement || "Pricing Agreement"}
              </Text>
              <Text style={{ color: "#ffffff", fontSize: 36, fontWeight: 800 }}>
                {activePackage.price}
                <span style={{ fontSize: 24, fontWeight: 700 }}>
                  {activePackage.duration}
                </span>
              </Text>
            </Col>
          </Row>
        </Card>

        <Title level={3} style={{ marginBottom: 12 }}>
          {subscriptionText.title || "Compare SaaS Subscription Packages"}
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
          {subscriptionText.subtitle ||
            "Scale your fleet count and unlock custom API integrations and CRM logs"}
        </Text>

        {paymentId && (
          <Card
            size="small"
            style={{ marginBottom: 24, borderColor: "#16a34a" }}
          >
            <Space wrap>
              <Text strong>
                Complete the subscription payment to unlock item posting.
              </Text>
              {paymentUrl && (
                <Button
                  type="primary"
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Payment Page
                </Button>
              )}
            </Space>
          </Card>
        )}

        {!paymentId && (
          <Card
            size="small"
            style={{ marginBottom: 24, borderColor: "#16a34a" }}
          >
            <Space wrap>
              <Text strong>
                Selected: {selectedPackage.name} ({selectedPackage.price}/month)
              </Text>
              <Button type="primary" loading={saving} onClick={handleSubscribe}>
                Pay for Selected Plan
              </Button>
            </Space>
          </Card>
        )}

        <Row gutter={[24, 24]} align="stretch">
          {packageOptions.map((plan) => {
            const isActive = activePlan === plan.key;
            const isSelected = selectedPlan === plan.key;

            return (
              <Col xs={24} lg={8} key={plan.key}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 18,
                    border: isSelected
                      ? "2px solid #10b981"
                      : "1px solid #dbe4f0",
                    boxShadow: isSelected
                      ? "0 0 0 4px rgba(16, 185, 129, 0.08)"
                      : "none",
                    background: isDark ? "#071321" : "#ffffff",
                    position: "relative",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  {isActive && (
                    <Tag
                      color="green"
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.4,
                      }}
                    >
                      {subscriptionText.currentActivePlan ||
                        "CURRENT ACTIVE PLAN"}
                    </Tag>
                  )}

                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 18,
                      color: isDark ? "#cbd5e1" : "#64748b",
                      textTransform: "uppercase",
                    }}
                  >
                    {plan.label}
                  </Text>

                  <Title level={3} style={{ marginBottom: 8 }}>
                    {plan.name}
                  </Title>

                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: isDark ? "#f8fafc" : "#0f172a",
                    }}
                  >
                    {plan.price}
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: isDark ? "#cbd5e1" : "#64748b",
                      }}
                    >
                      {plan.duration}
                    </span>
                  </Text>

                  <Space
                    orientation="vertical"
                    size={16}
                    style={{ marginTop: 28 }}
                  >
                    {plan.features.map((feature) => (
                      <Space key={feature} align="start">
                        <CheckCircleOutlined
                          style={{ color: "#16a34a", fontSize: 18 }}
                        />
                        <Text style={{ color: isDark ? "#e2e8f0" : "#334155" }}>
                          {feature}
                        </Text>
                      </Space>
                    ))}
                  </Space>

                  <Button
                    type={isActive ? "default" : "primary"}
                    size="large"
                    style={{
                      marginTop: 36,
                      width: "100%",
                      borderRadius: 12,
                      fontWeight: 700,
                      height: 48,
                      background: isActive
                        ? "#dcfce7"
                        : plan.key === "enterprise"
                          ? "#0f172a"
                          : "#ffffff",
                      color: isActive
                        ? "#166534"
                        : plan.key === "enterprise"
                          ? "#ffffff"
                          : "#0f172a",
                      borderColor: isActive
                        ? "#86efac"
                        : plan.key === "enterprise"
                          ? "#0f172a"
                          : "#dbe4f0",
                    }}
                    onClick={() => setSelectedPlan(plan.key)}
                    loading={false}
                    disabled={Boolean(paymentId)}
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Subscription;

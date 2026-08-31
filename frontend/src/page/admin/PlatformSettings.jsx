import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Space,
  Typography,
  message,
  Divider,
  Row,
  Col,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const PlatformSettings = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadSettings = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/platform-settings`,
        authConfig(),
      );
      const settings = response.data?.settings || {};
      form.setFieldsValue({
        platform_name: settings.platform_name || "i-Share",
        commission_type: settings.commission_type || "percentage",
        commission_value: settings.commission_value ?? 10,
        min_commission: settings.min_commission ?? 0,
        max_commission: settings.max_commission ?? 0,
        applies_to: settings.applies_to || "all",
        is_active: settings.is_active ?? true,
        currency: settings.currency || "USD",
        platform_fee: settings.platform_fee ?? 10,
        max_booking_days: settings.max_booking_days ?? 30,
        allow_vendors: settings.allow_vendors ?? true,
        allow_customers: settings.allow_customers ?? true,
        maintenance_mode: settings.maintenance_mode ?? false,
      });
    } catch (error) {
      form.setFieldsValue({
        platform_name: "i-Share",
        commission_type: "percentage",
        commission_value: 10,
        min_commission: 0,
        max_commission: 0,
        applies_to: "all",
        is_active: true,
        currency: "USD",
        platform_fee: 10,
        max_booking_days: 30,
        allow_vendors: true,
        allow_customers: true,
        maintenance_mode: false,
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, [backendUrl, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        commission_type: values.commission_type,
        commission_value: values.commission_value,
        min_commission: values.min_commission,
        max_commission: values.max_commission,
        applies_to: values.applies_to,
        is_active: values.is_active,
      };

      const response = await axios.put(
        `${backendUrl}/admin/platform-settings`,
        payload,
        authConfig(),
      );

      form.setFieldsValue(response.data?.settings || values);
      messageApi.success("Platform settings updated successfully");
    } catch (error) {
      messageApi.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
      {contextHolder}
      <Card
        style={{
          borderRadius: 20,
          background: isDark ? "#0f172a" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Text style={{ display: "block", letterSpacing: 1.2, fontSize: 12 }}>
            CONFIGURATION
          </Text>
          <Title level={2} style={{ margin: 0 }}>
            Platform Settings
          </Title>
          <Text type="secondary">
            Configure global platform behavior and preferences.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            platform_name: "i-Share",
            commission_type: "percentage",
            commission_value: 10,
            min_commission: 0,
            max_commission: 0,
            applies_to: "all",
            is_active: true,
            platform_fee: 10,
            max_booking_days: 30,
            allow_vendors: true,
            allow_customers: true,
            currency: "USD",
            maintenance_mode: false,
          }}
        >
          <Divider>General Settings</Divider>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Platform Name"
                name="platform_name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Platform name" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Currency" name="currency">
                <Select
                  options={[
                    { label: "USD", value: "USD" },
                    { label: "EUR", value: "EUR" },
                    { label: "ETB", value: "ETB" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Payment & Booking</Divider>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Commission Type" name="commission_type">
                <Select
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed", value: "fixed" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Commission Value" name="commission_value">
                <InputNumber min={0} max={100} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Min Commission" name="min_commission">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Max Commission" name="max_commission">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Applies To" name="applies_to">
                <Select
                  options={[
                    { label: "All", value: "all" },
                    { label: "Hourly", value: "hourly" },
                    { label: "Daily", value: "daily" },
                    { label: "Weekly", value: "weekly" },
                    { label: "Monthly", value: "monthly" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Platform Fee (%)" name="platform_fee">
                <InputNumber min={0} max={100} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Max Booking Days" name="max_booking_days">
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Commission Active"
                name="is_active"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Access Control</Divider>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Allow Vendor Registration"
                name="allow_vendors"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Allow Customer Registration"
                name="allow_customers"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>System</Divider>

          <Form.Item
            label="Maintenance Mode"
            name="maintenance_mode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Settings
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PlatformSettings;

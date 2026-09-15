import { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/forgot-password`, {
        email,
      });
      messageApi.success(response.data.message);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message ||
          "Unable to send the password reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      {contextHolder}
      <Card className="auth-form-card">
        <Title level={2}>Forgot password?</Title>
        <Text>Enter your email and we will send a password reset link.</Text>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 28 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Enter a valid email.",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              placeholder="you@example.com"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Send reset link
          </Button>
        </Form>
        <Link to="/signin" className="auth-secondary-link">
          Back to sign in
        </Link>
      </Card>
    </div>
  );
};

export default ForgotPassword;

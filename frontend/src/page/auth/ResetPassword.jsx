import { useContext, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async ({ password, password_confirmation }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/reset-password`, {
        token: searchParams.get("token"),
        email: searchParams.get("email"),
        password,
        password_confirmation,
      });
      setComplete(true);
      messageApi.success(response.data.message);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "This reset link is invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      {contextHolder}
      <Card className="auth-form-card">
        <Title level={2}>Create a new password</Title>
        {complete ? (
          <>
            <Text>Your password has been changed successfully.</Text>
            <Link to="/signin" className="auth-secondary-link">Go to sign in</Link>
          </>
        ) : (
          <>
            <Text>Choose a new password for your account.</Text>
            <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 28 }}>
              <Form.Item
                label="New password"
                name="password"
                rules={[{ required: true, min: 8, message: "Use at least 8 characters." }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="password_confirmation"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm your password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      return !value || getFieldValue("password") === value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Passwords do not match."));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Reset password
              </Button>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;

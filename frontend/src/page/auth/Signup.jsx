import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import {
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Segmented,
  Typography,
} from "antd";
import carImage from "../../assets/signup.png";

const { Title, Paragraph, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("customer");
  const { lang, setLanguage, translation: t } = useTranslation();
  const { backendUrl, signIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);

    const nameParts = values.name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "N/A";
    const middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "N/A";

    try {
      const response = await axios.post(backendUrl + "/register", {
        email: values.email,
        password: values.password,
        password_confirmation: values.confirm,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone: values.phone,
        role,
      });

      signIn(response.data.user, response.data.token);
      messageApi.success(
        response.data.message || "Account created successfully",
      );
      if (role === "vendor") {
        navigate("/vendor/profile");
      } else if (role === "operator") {
        navigate("/operator");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;
      messageApi.error(
        firstValidationError ||
          error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="min-h-screen bg-[#eef4fb] px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden rounded-[32px] border-0 shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
            <div className="grid min-h-[calc(100vh_-_80px)] gap-6 lg:grid-cols-[1.2fr_0.95fr]">
              <div className="relative overflow-hidden bg-slate-900 text-white hidden lg:block">
                <img
                  src={carImage}
                  alt={t.backgroundImageAlt}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-slate-950/60" />
                <div className="relative flex h-full flex-col justify-between p-8 sm:p-10 lg:p-14">
                  <div>
                    <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-slate-800/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white">
                        i
                      </span>
                      {t.brand}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300 shadow-sm shadow-sky-500/10">
                      {t.heroSignupHeroBadge}
                    </div>

                    <Title
                      level={1}
                      className="!mt-8 !max-w-lg !text-[2.75rem] !leading-tight !text-white sm:!text-[3rem]"
                    >
                      {t.heroSignupTitle}
                    </Title>

                    <Paragraph className="!mt-6 !max-w-xl !text-base !text-slate-200/90 sm:!text-lg">
                      {t.heroSignupSubtitle}
                    </Paragraph>
                  </div>

                  <div className="rounded-[26px] border border-slate-200/10 bg-slate-950/80 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-sky-300">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-sky-200">
                        <span className="text-base font-bold">★</span>
                      </span>
                      {t.heroSignupProductName}
                    </div>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                          {t.heroSignupProductDescription}
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {t.heroSignupProductRate}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
                        {t.heroSignupProductLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between gap-4">
                    <Text className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {t.language}
                    </Text>
                    <Segmented
                      options={[
                        { label: t.languageEnglish, value: "en" },
                        { label: t.languageAmharic, value: "am" },
                      ]}
                      value={lang}
                      onChange={setLanguage}
                      className="!w-[180px]"
                    />
                  </div>
                  <Text className="mt-5 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {t.brand}
                  </Text>
                  <Title level={2} className="!mt-4 !text-slate-950">
                    {t.signupTitle}
                  </Title>
                  <Paragraph className="!mt-1 !text-base !text-slate-500">
                    {t.signupSubtitle}
                  </Paragraph>

                  <Form
                    layout="vertical"
                    name="signup"
                    onFinish={onFinish}
                    size="large"
                    className="mt-8"
                  >
                    <Form.Item
                      label={t.fullName}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: t.fullNameRequired,
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-slate-400" />}
                        placeholder={t.placeholderName}
                        className="rounded-[18px] border-slate-200 bg-slate-50"
                      />
                    </Form.Item>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <Form.Item
                        label={t.email}
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: t.emailRequired,
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-slate-400" />}
                          placeholder={t.placeholderEmail}
                          className="rounded-[18px] border-slate-200 bg-slate-50"
                        />
                      </Form.Item>

                      <Form.Item
                        label={t.phone}
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: t.phoneRequired,
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-slate-400" />}
                          placeholder={t.placeholderPhone}
                          className="rounded-[18px] border-slate-200 bg-slate-50"
                        />
                      </Form.Item>
                    </div>

                    <div className="mb-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <label className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {t.roleLabel}
                        </label>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          {role}
                        </span>
                      </div>

                      <div className="rounded-[22px] border border-sky-200 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 p-2 shadow-inner shadow-sky-100/80">
                        <Segmented
                          size="large"
                          options={[
                            {
                              label: (
                                <span className="font-bold text-blue-700">
                                  {t.roleRenter}
                                </span>
                              ),
                              value: "customer",
                            },
                            {
                              label: (
                                <span className="font-bold text-blue-700">
                                  {t.roleVendor}
                                </span>
                              ),
                              value: "vendor",
                            },
                            {
                              label: (
                                <span className="font-bold text-blue-700">
                                  {t.roleOperator}
                                </span>
                              ),
                              value: "operator",
                            },
                          ]}
                          value={role}
                          onChange={setRole}
                          className="w-full rounded-[18px]"
                          style={{
                            background: "transparent",
                          }}
                        />
                      </div>

                      <Text className="mt-3 block rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-600">
                        {role === "customer"
                          ? t.customerText
                          : role === "vendor"
                            ? t.vendorText
                            : t.operatorText}
                      </Text>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <Form.Item
                        label={t.password}
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: t.passwordRequired,
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-slate-400" />}
                          placeholder={t.placeholderPassword}
                          className="rounded-[18px] border-slate-200 bg-slate-50"
                        />
                      </Form.Item>

                      <Form.Item
                        label={t.confirmPassword}
                        name="confirm"
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: t.confirmPasswordRequired,
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(t.passwordsNotMatch),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-slate-400" />}
                          placeholder={t.placeholderPassword}
                          className="rounded-[18px] border-slate-200 bg-slate-50"
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(t.agreementValidation),
                                ),
                        },
                      ]}
                      className="!mb-6"
                    >
                      <Checkbox className="text-slate-600">
                        {t.agreement}{" "}
                        <Text className="text-emerald-600">
                          {t.agreementLink}
                        </Text>
                      </Checkbox>
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className="h-14 rounded-[18px] bg-gradient-to-r from-blue-600 to-emerald-500 text-base font-semibold shadow-[0_15px_30px_rgba(59,130,246,0.25)]"
                    >
                      {t.submitSignup}
                    </Button>
                  </Form>

                  <Divider className="!my-8 !text-slate-300">
                    {t.orContinue}
                  </Divider>

                  <div className="relative">
                    <span className="absolute -top-2.5 right-5 z-10 rounded-full bg-sky-500 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
                      Recommended
                    </span>
                    <Button
                      icon={<GoogleOutlined />}
                      className="h-14 rounded-[18px] border border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow"
                      block
                    >
                      {t.continueWithGoogle}
                    </Button>
                  </div>

                  <Paragraph className="mt-8 text-center text-sm text-slate-500">
                    {t.haveAccount}{" "}
                    <Link className="font-semibold text-sky-600" to="/signin">
                      {t.signIn}
                    </Link>
                  </Paragraph>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;

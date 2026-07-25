// Ant Design Theme Configuration
export const lightTheme = {
  token: {
    // Brand Colors
    colorPrimary: "#1890ff",
    colorPrimaryHover: "#40a9ff",
    colorPrimaryActive: "#096dd9",

    // Background Colors
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f9fafb",
    colorBgSpotlight: "#f3f4f6",

    // Text Colors
    colorTextBase: "#111827",
    colorText: "#4b5563",
    colorTextSecondary: "#6b7280",
    colorTextTertiary: "#9ca3af",

    // Border Colors
    colorBorder: "#e5e7eb",
    colorBorderSecondary: "#d1d5db",

    // Success/Error/Warning
    colorSuccess: "#10b981",
    colorError: "#ef4444",
    colorWarning: "#f59e0b",
    colorInfo: "#3b82f6",

    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    // Shadow
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

    // Font
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Control
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Motion
    motionDurationFast: "0.2s",
    motionDurationMid: "0.4s",
    motionDurationSlow: "0.6s",
  },
  components: {
    Button: {
      colorPrimary: "#1890ff",
      colorPrimaryHover: "#40a9ff",
      colorPrimaryActive: "#096dd9",
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e5e7eb",
      borderRadiusLG: 12,
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e5e7eb",
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e5e7eb",
      borderRadius: 8,
      controlHeight: 40,
    },
    Table: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e5e7eb",
      borderRadius: 8,
    },
    Modal: {
      colorBgContainer: "#ffffff",
      borderRadiusLG: 12,
    },
    Drawer: {
      colorBgContainer: "#ffffff",
    },
    Menu: {
      colorBgContainer: "#ffffff",
      colorText: "#4b5563",
      colorPrimary: "#1890ff",
    },
  },
};

export const darkTheme = {
  token: {
    // Brand Colors (Slightly brighter for dark mode)
    colorPrimary: "#1890ff",
    colorPrimaryHover: "#40a9ff",
    colorPrimaryActive: "#096dd9",

    // Background Colors
    colorBgBase: "#0f0f1a",
    colorBgContainer: "#1a1a2e",
    colorBgElevated: "#1e1e32",
    colorBgLayout: "#0f0f1a",
    colorBgSpotlight: "#252540",

    // Text Colors
    colorTextBase: "#f3f4f6",
    colorText: "#d1d5db",
    colorTextSecondary: "#9ca3af",
    colorTextTertiary: "#6b7280",

    // Border Colors
    colorBorder: "#374151",
    colorBorderSecondary: "#4b5563",

    // Success/Error/Warning (Brighter for dark mode)
    colorSuccess: "#34d399",
    colorError: "#f87171",
    colorWarning: "#fbbf24",
    colorInfo: "#60a5fa",

    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    // Shadow
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    boxShadowSecondary:
      "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)",

    // Font
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Control
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Motion
    motionDurationFast: "0.2s",
    motionDurationMid: "0.4s",
    motionDurationSlow: "0.6s",
  },
  components: {
    Button: {
      colorPrimary: "#1890ff",
      colorPrimaryHover: "#40a9ff",
      colorPrimaryActive: "#096dd9",
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      colorBgContainer: "#1a1a2e",
      colorBorder: "#374151",
      borderRadiusLG: 12,
    },
    Input: {
      colorBgContainer: "#1a1a2e",
      colorBorder: "#374151",
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      colorBgContainer: "#1a1a2e",
      colorBorder: "#374151",
      borderRadius: 8,
      controlHeight: 40,
    },
    Table: {
      colorBgContainer: "#1a1a2e",
      colorBorder: "#374151",
      borderRadius: 8,
    },
    Modal: {
      colorBgContainer: "#1e1e32",
      borderRadiusLG: 12,
    },
    Drawer: {
      colorBgContainer: "#1e1e32",
    },
    Menu: {
      colorBgContainer: "#1a1a2e",
      colorText: "#d1d5db",
      colorPrimary: "#1890ff",
    },
  },
};

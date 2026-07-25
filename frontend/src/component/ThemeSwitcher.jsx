import React from "react";
import { Button, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeProvider";

const ThemeSwitcher = ({ size = "default" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <Button
        type="text"
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        size={size}
        className="flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;

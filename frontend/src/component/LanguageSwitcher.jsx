import React from "react";
import { Dropdown, Button, Space, Typography } from "antd";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "./LanguageProvider.jsx";

const { Text } = Typography;

const LanguageSwitcher = ({ className = "" }) => {
  const { lang, setLanguage, languages } = useTranslation();
  const currentLang = languages[lang] || { flag: "", name: "Language" };

  const menu = {
    selectable: true,
    selectedKeys: [lang],
    onClick: ({ key }) => setLanguage(key),
    items: Object.entries(languages).map(([code, langData]) => ({
      key: code,
      label: (
        <Space>
          <Text>{langData.flag}</Text>
          <div>
            <div>{langData.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {langData.nameAm}
            </Text>
          </div>
        </Space>
      ),
    })),
  };

  return (
    <div className={className}>
      <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
        <Button type="default" icon={<GlobalOutlined />}>
          <Space>
            <span>{currentLang?.flag || ""}</span>
            <span className="hidden sm:inline">
              {currentLang?.name || "Language"}
            </span>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;

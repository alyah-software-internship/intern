import React, { forwardRef } from "react";
import { Button as AntDButton } from "antd";

const Button = forwardRef(
  (
    {
      type = "default",
      onClick,
      children,
      style,
      className,
      icon,
      block = false,
      htmlType = "button",
      size = "middle",
      disabled = false,
      loading = false,
      danger = false,
      ghost = false,
      shape,
      title,
      ...rest
    },
    ref,
  ) => {
    return (
      <AntDButton
        ref={ref}
        type={type}
        onClick={onClick}
        style={style}
        className={className}
        icon={icon}
        block={block}
        htmlType={htmlType}
        size={size}
        disabled={disabled}
        loading={loading}
        danger={danger}
        ghost={ghost}
        shape={shape}
        title={title}
        {...rest}
      >
        {children}
      </AntDButton>
    );
  },
);

export default Button;

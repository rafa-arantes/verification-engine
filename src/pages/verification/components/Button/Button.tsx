import { ReactNode } from "react";

import s from "./styles/button.module.css";

type Props = {
  children?: ReactNode;
  disabled?: boolean;
  removeBorder?: "left" | "right" | "both";
  role?: string;
  squareBorder?: "left" | "right" | "both";
  type?: "primary" | "secondary";
  onClick: () => void;
};

const Button = ({
  children,
  disabled,
  onClick,
  removeBorder,
  role,
  squareBorder,
  type = "primary",
}: Props) => {
  const removeBorderClass = removeBorder
    ? s[`remove-${removeBorder}-border`]
    : "";
  const squareBorderClass = squareBorder
    ? s[`${squareBorder}-squared-border`]
    : "";

  return (
    <button
      role={role}
      onClick={onClick}
      data-testid={`${role}${disabled ? "-disabled" : ""}`}
      className={`${s.button} ${removeBorderClass} ${squareBorderClass} ${s[type]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

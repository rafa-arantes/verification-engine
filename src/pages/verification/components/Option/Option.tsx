import React, { FC } from "react";
import { NO_OPTION, YES_OPTION } from "~/pages/verification/contants";

import { Button } from "../Button";

import s from "./styles/option.module.css";

interface IProps {
  focused: boolean;
  currentOption: boolean | undefined;
  description: string;
  disabled: boolean;
  handleOptionYesClick: () => void;
  handleOptionNoClick: () => void;
}

const Option: FC<IProps> = ({
  currentOption,
  description,
  disabled,
  focused,
  handleOptionYesClick,
  handleOptionNoClick,
}) => {
  const isFocused = focused ? "option-focused" : "option-available";
  const dataTestid = disabled ? "option-disabled" : isFocused;

  return (
    <div
      role="option"
      data-testid={dataTestid}
      className={`${disabled && s.disabled} ${focused && s.focused} ${
        s["option-container"]
      }`}
    >
      <p>{description}</p>
      <br />
      <Button
        role="select-button-yes"
        squareBorder="right"
        type={currentOption === YES_OPTION ? "primary" : "secondary"}
        disabled={disabled}
        onClick={handleOptionYesClick}
      >
        YES
      </Button>
      <Button
        role="select-button-no"
        removeBorder="left"
        squareBorder="left"
        type={currentOption === NO_OPTION ? "primary" : "secondary"}
        disabled={disabled}
        onClick={handleOptionNoClick}
      >
        NO
      </Button>
    </div>
  );
};

export default Option;

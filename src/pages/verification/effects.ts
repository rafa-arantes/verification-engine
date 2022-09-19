import { SetStateAction, useEffect, useState } from "react";
import { ChecksResponse } from "~/services/api";

import { SelectedOptions } from ".";

import { YES_OPTION, NO_OPTION } from "./contants";

const [ARROW_DOWN, ARROW_UP, DIGIT_ONE, DIGIT_TWO] = [
  "ArrowDown",
  "ArrowUp",
  "1",
  "2",
];

export const useKeyboardNavigation = (
  options: ChecksResponse[] | undefined,
  currentOptions: SelectedOptions,
  setOptions: React.Dispatch<SetStateAction<SelectedOptions>>
) => {
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);

  const handleKeyNavigation = ({ key }: KeyboardEvent) => {
    if (!options) return;

    const mapKeyToEffect = {
      [ARROW_UP]: () =>
        focusedOptionIndex > 0 && setFocusedOptionIndex(focusedOptionIndex - 1),
      [ARROW_DOWN]: () =>
        focusedOptionIndex < options.length - 1 &&
        setFocusedOptionIndex(focusedOptionIndex + 1),
      [DIGIT_ONE]: () => {
        setOptions({
          ...currentOptions,
          [options[focusedOptionIndex].id]: YES_OPTION,
        });
      },
      [DIGIT_TWO]: () => {
        setOptions({
          ...currentOptions,
          [options[focusedOptionIndex].id]: NO_OPTION,
        });
      },
    }[key];

    mapKeyToEffect?.();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [options, handleKeyNavigation]);

  return { focusedOptionIndex, setFocusedOptionIndex };
};

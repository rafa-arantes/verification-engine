import { act, fireEvent, renderHook } from "@testing-library/react";
import { useKeyboardNavigation } from "../effects";
import { vi } from "vitest";

const setState = vi.fn();
const options = [
  {
    id: "aaa",
    priority: 10,
    description: "Face on the picture matches face on the document",
  },
  { id: "ccc", priority: 7, description: "Face is clearly visible" },
  { id: "bbb", priority: 5, description: "Veriff supports presented document" },
];
const currentOptions = { aaa: true, ccc: false };

describe("Keyboard Navigation Tests:", () => {
  it("[BASE]: Should return 0 as focusedOptionIndex", () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, setState)
    );

    expect(result.current.focusedOptionIndex).toBe(0);
  });

  it("[KEYUP]: Shouldn't do anything when focusedOption = 0", () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, setState)
    );
    expect(result.current.focusedOptionIndex).toBe(0);

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowUp",
        code: "ArrowUp",
        charCode: 0,
      });
    });
    expect(result.current.focusedOptionIndex).toBe(0);
  });

  it("[KEYUP]: Should subtract 1 from focusedOptionIndex when it is > than 0", () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, setState)
    );
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    expect(result.current.focusedOptionIndex).toBe(1);

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowUp",
        code: "ArrowUp",
        charCode: 0,
      });
    });

    expect(result.current.focusedOptionIndex).toBe(0);
  });

  it("[KEYDOWN]: Should increase when focusedOption < (options.length - 1)", () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, setState)
    );

    expect(result.current.focusedOptionIndex < options.length - 1).toBeTruthy();

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    expect(result.current.focusedOptionIndex).toBe(options.length - 1);
  });

  it("[KEYDOWN]: Shouldn't do anything when focusedOption == (options.length - 1)", () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, setState)
    );
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    expect(result.current.focusedOptionIndex).toBe(options.length - 1);

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    expect(result.current.focusedOptionIndex).toBe(options.length - 1);
  });

  it("[DIGIT1]: Call selectOption with value truthy value selected", () => {
    const selectOption = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, selectOption)
    );

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "1",
        code: "Digit1",
        charCode: 0,
      });
    });

    expect(selectOption).toBeCalledWith({
      ...currentOptions,
      [options[result.current.focusedOptionIndex].id]: true,
    });
  });

  it("[DIGIT1]: Call selectOption with value truthy value selected", () => {
    const selectOption = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardNavigation(options, currentOptions, selectOption)
    );

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowDown",
        code: "ArrowDown",
        charCode: 0,
      });
    });

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "2",
        code: "Digit2",
        charCode: 0,
      });
    });

    expect(selectOption).toBeCalledWith({
      ...currentOptions,
      [options[result.current.focusedOptionIndex].id]: false,
    });
  });
});

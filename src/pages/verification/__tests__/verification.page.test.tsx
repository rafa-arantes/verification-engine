import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
  getByRole,
  fireEvent,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { describe, it, vi, expect } from "vitest";
import * as API from "~/services/api";
import VerificationPage from "..";
import { fetchChecksPayload } from "./__mocks__";

afterEach(cleanup);
const queryClient = new QueryClient();

vi.spyOn(API, "fetchChecks").mockImplementation(
  (): Promise<API.ChecksResponse[]> =>
    new Promise((resolve) =>
      resolve(fetchChecksPayload as API.ChecksResponse[])
    )
);

describe("Renders verification page", async () => {
  it("Should render loading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );
    expect(screen.getByAltText("Loading")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByAltText("Loading"), {
      timeout: 12000,
    });
  });
  it("Should render one option focused and three disabled", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );
    const focusedOption = await screen.findAllByTestId("option-focused");
    const disabledOptions = await screen.findAllByTestId("option-disabled");

    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();
    expect(disabledOptions).toHaveLength(3);
    expect(focusedOption).toHaveLength(1);
  });

  it("Should enable next option after selecting the previous option", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );
    const container = await screen.findByTestId("option-focused");
    const button = getByRole(container, "select-button-yes");
    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();

    act(() => button.click());

    const availableOptionContainer = screen.queryByTestId("option-available");
    expect(availableOptionContainer).toBeInTheDocument();
    const availableOptionButton = getByRole(
      availableOptionContainer!,
      "select-button-yes"
    );

    act(() => availableOptionButton.click());

    const availableOptionContainerArray = await screen.findAllByTestId(
      "option-available"
    );

    expect(availableOptionContainerArray).toHaveLength(2);
  });

  it("Should disable next options after selecting the previous option as false", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );
    const container = await screen.findByTestId("option-focused");
    const button = getByRole(container, "select-button-yes");

    act(() => button.click());

    const availableOptionContainer = screen.queryByTestId("option-available");
    const availableOptionButton = getByRole(
      availableOptionContainer!,
      "select-button-yes"
    );

    act(() => availableOptionButton.click());

    const availableOptionContainerArray = await screen.findAllByTestId(
      "option-available"
    );

    expect(availableOptionContainerArray).toHaveLength(2);

    const [firstAvailableOption] = availableOptionContainerArray;
    const firstAvailableOptionNoButton = getByRole(
      firstAvailableOption!,
      "select-button-no"
    );

    act(() => firstAvailableOptionNoButton.click());

    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();
  });

  it("Should disable next options after selecting the previous option as false", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );

    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "1",
        code: "Digit1",
        charCode: 0,
      });
    });

    const availableOptionContainer = screen.queryByTestId("option-available");
    const availableOptionButton = getByRole(
      availableOptionContainer!,
      "select-button-yes"
    );

    act(() => availableOptionButton.click());

    expect(screen.queryAllByTestId("option-available")).toHaveLength(2);

    const [firstAvailableOption] = screen.queryAllByTestId("option-available");
    const firstAvailableOptionNoButton = getByRole(
      firstAvailableOption!,
      "select-button-no"
    );

    act(() => firstAvailableOptionNoButton.click());

    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();
  });

  it("Should be able to perform selections and navigate options with keyboard", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );

    expect(screen.queryByTestId("option-available")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("option-disabled")).toHaveLength(3);

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "1",
        code: "Digit1",
        charCode: 0,
      });
    });

    expect(screen.queryByTestId("option-available")).toBeInTheDocument();

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

    expect(screen.queryAllByTestId("option-disabled")).toHaveLength(1);

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowUp",
        code: "ArrowUp",
        charCode: 0,
      });
    });
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "ArrowUp",
        code: "ArrowUp",
        charCode: 0,
      });
    });
    // Should disable all options under the selected
    act(() => {
      fireEvent.keyDown(document.body, {
        key: "2",
        code: "Digit2",
        charCode: 0,
      });
    });
    expect(screen.queryAllByTestId("option-disabled")).toHaveLength(3);
  });

  it("Should disable submit button if theres no 'NO' option selected or if theres still options missing to be selected", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VerificationPage />
      </QueryClientProvider>
    );

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "1",
        code: "Digit1",
        charCode: 0,
      });
    });

    expect(screen.getByTestId("submit-button-disabled")).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "2",
        code: "Digit2",
        charCode: 0,
      });
    });

    expect(
      screen.queryByTestId("submit-button-disabled")
    ).not.toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document.body, {
        key: "1",
        code: "Digit2",
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

    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });
});

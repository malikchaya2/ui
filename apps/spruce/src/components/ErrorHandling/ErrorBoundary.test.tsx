import * as Sentry from "@sentry/react";
import { render, screen } from "test_utils";
import { mockEnvironmentVariables } from "test_utils/utils";
import { ErrorBoundary } from "./ErrorBoundary";

const { cleanup } = mockEnvironmentVariables();

describe("default error boundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Sentry, "captureException");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render the passed in component", () => {
    const TestComponent = () => <div>Hello</div>;
    const TestErrorBoundary = () => (
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );
    render(<TestErrorBoundary />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should display the fallback when an error occurs", () => {
    const err = new Error("Test error");

    const TestComponent = () => {
      throw err;
    };
    const TestErrorBoundary = () => (
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );
    render(<TestErrorBoundary />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith({
      error: err,
      errorInfo: expect.objectContaining({
        componentStack: expect.any(String),
      }),
    });
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});

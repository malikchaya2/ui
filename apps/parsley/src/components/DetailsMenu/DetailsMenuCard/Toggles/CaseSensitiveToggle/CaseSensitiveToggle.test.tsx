import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import CaseSensitiveToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("case sensitivity toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");

    await user.click(caseSensitiveToggle);
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});

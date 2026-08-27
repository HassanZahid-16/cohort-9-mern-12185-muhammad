import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../src/app/ProtectedRoute";
import useAuth from "../../src/context/useAuth";

jest.mock("../../src/context/useAuth");

function renderProtectedRoute(authState) {
  useAuth.mockReturnValue(authState);

  return render(
    <MemoryRouter initialEntries={["/notes"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/notes" element={<div>Notes page</div>} />
        </Route>

        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing while authentication is still loading", () => {
    const { container } = renderProtectedRoute({
      isAuthenticated: false,
      isLoading: true,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("sends unauthenticated users to the login page", () => {
    const { getByText } = renderProtectedRoute({
      isAuthenticated: false,
      isLoading: false,
    });
    expect(getByText("Login page")).toBeInTheDocument();
  });

  it("renders the protected page for an authenticated user", () => {
    const { getByText } = renderProtectedRoute({
      isAuthenticated: true,
      isLoading: false,
    });
    expect(getByText("Notes page")).toBeInTheDocument();
  });
});
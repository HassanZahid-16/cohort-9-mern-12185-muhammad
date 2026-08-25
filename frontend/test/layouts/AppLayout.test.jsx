import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../../src/layouts/AppLayout";
import useAuth from "../../src/context/useAuth";

jest.mock("../../src/context/useAuth");

function renderAppLayout(authState) {
  useAuth.mockReturnValue(authState);

  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<p>Notes home</p>} />
          <Route path="/login" element={<p>Login page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AppLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows the logged-in user's name", () => {
    renderAppLayout({
      user: {
        fullName: "Muhammad Hassan",
      },
      logout: jest.fn(),
    });
    expect(screen.getByText("Hello, Muhammad Hassan")).toBeInTheDocument();
    expect(screen.getByText("Notes home")).toBeInTheDocument();
  });

  it("logs the user out and navigates to login", async () => {
    const logout = jest.fn().mockResolvedValue();
    renderAppLayout({
      user: {
        fullName: "Muhammad Hassan",
      },
      logout,
    });
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("shows an error when logout fails", async () => {
    const logout = jest.fn().mockRejectedValue(
      new Error("Unable to log out. Please try again.")
    );
    renderAppLayout({
      user: {
        fullName: "Muhammad Hassan",
      },
      logout,
    });
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Unable to log out. Please try again.");
  });
});
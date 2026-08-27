import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../../src/pages/LoginPage";
import { loginUser } from "../../src/services/authService";
import useAuth from "../../src/context/useAuth";

jest.mock("../../src/services/authService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../../src/context/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

function renderLogin(initialEntries = ["/login"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<p>Notes home</p>} />
        <Route path="/notes" element={<p>Notes home</p>} />
        <Route path="/signup" element={<p>Signup page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  const login = jest.fn();

  beforeEach(() => {
    loginUser.mockReset();
    login.mockReset();
    useAuth.mockReturnValue({
      login,
    });
  });

  it("shows a validation message when the form is submitted empty", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Please enter your email and password.");
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("logs the user in and returns to the page they came from", async () => {
    const result = {
      message: "Login successful.",
      user: {
        id: "user-123",
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
      },
    };
    loginUser.mockResolvedValue(result);
    renderLogin([
      {
        pathname: "/login",
        state: {
          from: {
            pathname: "/notes",
          },
        },
      },
    ]);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "hassan@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "password123",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    try {
      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith({
          email: "hassan@example.com",
          password: "password123",
        });
      });
      expect(login).toHaveBeenCalledWith(result);
      expect(await screen.findByText("Notes home")).toBeInTheDocument();
    } catch (error) {
      throw new Error("Failed during successful login and navigation flow.", {
        cause: error,
      });
    }
  });

  it("shows the server error when login is rejected", async () => {
    loginUser.mockRejectedValue(
      new Error("Invalid email or password.")
    );
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "hassan@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "wrong-password",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    try {
      expect(
        await screen.findByRole("alert")
      ).toHaveTextContent("Invalid email or password.");
      expect(login).not.toHaveBeenCalled();
    } catch (error) {
      throw new Error("Failed during rejected login error flow.", {
        cause: error,
      });
    }
  });

  it("toggles the password field between hidden and visible", () => {
    renderLogin();
    const passwordInput = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", {
      name: "Show password",
    });
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggle);
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "text"
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();
  });
});
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignupPage from "../../src/pages/SignupPage";
import { registerUser } from "../../src/services/authService";

jest.mock("../../src/services/authService", () => ({
  registerUser: jest.fn(),
}));

function renderSignup() {
  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("SignupPage", () => {
  beforeEach(() => {
    registerUser.mockReset();
  });

  it("asks for all fields before submitting", () => {
    renderSignup();
    fireEvent.click(
      screen.getByRole("button", { name: "Create account" })
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fill in all fields."
    );
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("rejects passwords shorter than eight characters", () => {
    renderSignup();
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: {
        value: "Muhammad Hassan",
      },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "hassan@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "1234567",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Create account" })
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Password must contain at least 8 characters."
    );
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("registers the user and moves to the login page", async () => {
    registerUser.mockResolvedValue({
      message: "User registered successfully.",
    });
    renderSignup();
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: {
        value: " Muhammad Hassan ",
      },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: " hassan@example.com ",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "password123",
      },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Create account" })
    );
    try {
      await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith({
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
          password: "password123",
        });
      });
      expect(await screen.findByText("Login page")).toBeInTheDocument();
    } catch (error) {
      throw new Error("Failed during registration and navigation flow.", {
        cause: error,
      });
    }
  });

  it("shows the server error when registration fails", async () => {
    registerUser.mockRejectedValue(
      new Error("Email is already registered.")
    );
    renderSignup();
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: {
        value: "Muhammad Hassan",
      },
    });
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
    fireEvent.click(
      screen.getByRole("button", { name: "Create account" })
    );
    try {
      expect(
        await screen.findByRole("alert")
      ).toHaveTextContent("Email is already registered.");
    } catch (error) {
      throw new Error("Failed during registration error flow.", {
        cause: error,
      });
    }
  });
});
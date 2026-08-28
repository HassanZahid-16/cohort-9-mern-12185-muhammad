import { act, renderHook, waitFor } from "@testing-library/react";
import { getCurrentUser, logoutUser } from "../../src/services/authService";
import AuthProvider from "../../src/context/AuthProvider";
import useAuth from "../../src/context/useAuth";

jest.mock("../../src/services/authService", () => ({
  getCurrentUser: jest.fn(),
  logoutUser: jest.fn(),
}));

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    getCurrentUser.mockResolvedValue(null);
    logoutUser.mockResolvedValue({
      message: "Logout successful.",
    });
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("starts as unauthenticated when there is no active session", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });
    try {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    } catch (error) {
      throw new Error("Failed while waiting for authentication state.", {
        cause: error,
      });
    }

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("stores the logged-in user in the authentication state", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });
    try {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    } catch (error) {
      throw new Error("Failed while waiting for authentication state.", {
        cause: error,
      });
    }

    const user = {
      id: "user-123",
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
    };
    try {
      act(() => {
        result.current.login({ user });
      });
    } catch (error) {
      throw new Error("Failed while logging in the test user.", {
        cause: error,
      });
    }
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("clears the user after a successful logout", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });
    try {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    } catch (error) {
      throw new Error("Failed while waiting for authentication state.", {
        cause: error,
      });
    }
    const user = {
      id: "user-123",
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
    };
    try {
      act(() => {
        result.current.login({ user });
      });
    } catch (error) {
      throw new Error("Failed while logging in the test user.", {
        cause: error,
      });
    }
    try {
      await act(async () => {
        await result.current.logout();
      });
    } catch (error) {
      throw new Error("Failed while completing logout.", {
        cause: error,
      });
    }
    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("keeps the user unauthenticated when session validation fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getCurrentUser.mockRejectedValue(
      new Error("Unable to validate the session.")
    );
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });
    try {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    } catch (error) {
      throw new Error("Failed while waiting for authentication state.", {
        cause: error,
      });
    }
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
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

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.authError).toBeNull();
  });

  it("stores the logged-in user in the authentication state", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const user = {
      id: "user-123",
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
    };

    act(() => {
      result.current.login({ user });
    });
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.authError).toBeNull();
    expect(JSON.parse(localStorage.getItem("notes_app_user"))).toEqual(user);
  });

  it("clears the user after a successful logout", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const user = {
      id: "user-123",
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
    };

    act(() => {
      result.current.login({ user });
    });

    await act(async () => {
      await result.current.logout();
    });
    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
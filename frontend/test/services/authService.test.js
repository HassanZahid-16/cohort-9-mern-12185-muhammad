import {getCurrentUser,loginUser,logoutUser,registerUser,} from "../../src/services/authService";

describe("authService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("loginUser", () => {
    it("returns the backend response when login succeeds", async () => {
      const responseData = {
        message: "Login successful.",
        user: {
          id: "user-123",
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
        },
      };
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => responseData,
      });
      await expect(
        loginUser({
          email: "hassan@example.com",
          password: "password123",
        })
      ).resolves.toEqual(responseData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });

    it("uses the backend message when login is rejected", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Invalid email or password.",
        }),
      });
      await expect(
        loginUser({
          email: "hassan@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Invalid email or password.");
    });

    it("throws a connection error when the backend cannot be reached", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(
        new TypeError("Failed to fetch")
      );
      await expect(
        loginUser({
          email: "hassan@example.com",
          password: "password123",
        })
      ).rejects.toThrow(
        "Unable to reach the server. Make sure the backend is running."
      );
    });
  });

  describe("registerUser", () => {
    it("sends the registration details to the register endpoint", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "User registered successfully.",
        }),
      });
      await registerUser({
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "password123",
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/register"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });

    it("uses the backend message when registration is rejected", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Email is already registered.",
        }),
      });
      await expect(
        registerUser({
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email is already registered.");
    });
  });

  describe("getCurrentUser", () => {
    it("returns null when there is no active session", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 401,
        ok: false,
        json: async () => ({}),
      });
      await expect(getCurrentUser()).resolves.toBeNull();
    });

    it("returns the current user when the session is valid", async () => {
      const user = {
        id: "user-123",
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
      };
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({ user }),
      });
      await expect(getCurrentUser()).resolves.toEqual(user);
    });

    it("throws a validation error when the session check returns a non-ok response", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 500,
        ok: false,
        json: async () => ({
          message: "Session lookup failed.",
        }),
      });
      await expect(getCurrentUser()).rejects.toThrow(
        "Unable to validate the session."
      );
    });

    it("throws a validation error when the session check fails unexpectedly", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(
        new Error("Network down")
      );
      await expect(getCurrentUser()).rejects.toThrow(
        "Unable to validate the session."
      );
    });
  });

  describe("logoutUser", () => {
    it("logs out successfully when the request is accepted", async () => {
      document.cookie = "notes_app_csrf=test-csrf-token";
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Logout successful.",
        }),
      });
      await expect(logoutUser()).resolves.toEqual({
        message: "Logout successful.",
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-Token": "test-csrf-token",
          },
        })
      );
    });

    it("sends an empty csrf header when there is no csrf cookie", async () => {
      document.cookie =
        "notes_app_csrf=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Logout successful.",
        }),
      });
      await logoutUser();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        expect.objectContaining({
          headers: {
            "X-CSRF-Token": "",
          },
        })
      );
    });

    it("throws a helpful message when logout is rejected by the backend", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Session already expired.",
        }),
      });
      await expect(logoutUser()).rejects.toThrow(
        "Unable to log out. Please try again."
      );
    });

    it("throws a helpful message when logout fails unexpectedly", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(
        new TypeError("Failed to fetch")
      );
      await expect(logoutUser()).rejects.toThrow(
        "Unable to log out. Please try again."
      );
    });
  });
});
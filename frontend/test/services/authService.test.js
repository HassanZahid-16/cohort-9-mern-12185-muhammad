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
      try {
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
      } catch (error) {
        throw new Error("Failed during successful login flow.", {
          cause: error,
        });
      }
    });

    it("uses the backend message when login is rejected", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Invalid email or password.",
        }),
      });
      try {
        await expect(
          loginUser({
            email: "hassan@example.com",
            password: "wrong-password",
          })
        ).rejects.toThrow("Invalid email or password.");
      } catch (error) {
        throw new Error("Failed during rejected login flow.", {
          cause: error,
        });
      }
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
      try {
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
      } catch (error) {
        throw new Error("Failed during user registration flow.", {
          cause: error,
        });
      }
    });
  });

  describe("getCurrentUser", () => {
    it("returns null when there is no active session", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 401,
        ok: false,
        json: async () => ({}),
      });
      try {
        await expect(getCurrentUser()).resolves.toBeNull();
      } catch (error) {
        throw new Error("Failed during unauthenticated session check.", {
          cause: error,
        });
      }
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
      try {
        await expect(getCurrentUser()).resolves.toEqual(user);
      } catch (error) {
        throw new Error("Failed during authenticated session check.", {
          cause: error,
        });
      }
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
      try {
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
      } catch (error) {
        throw new Error("Failed during logout flow.", {
          cause: error,
        });
      }
    });
  });
});
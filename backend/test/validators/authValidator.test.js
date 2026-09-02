const { expect } = require("chai");

const {
  validateRegistration,
  validateLogin,
} = require("../../src/validators/authValidator");

describe("Auth Validator", () => {
  describe("validateRegistration", () => {
    it("should return null for valid registration data", () => {
      const result = validateRegistration({
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "password123",
      });
      expect(result).to.be.null;
    });

    it("should reject missing request data", () => {
      const result = validateRegistration();
      expect(result).to.equal("Invalid request data.");
    });

    it("should reject full name shorter than 3 characters", () => {
      const result = validateRegistration({
        fullName: "Ab",
        email: "hassan@example.com",
        password: "password123",
      });
      expect(result).to.equal(
        "Full name must contain between 3 and 60 characters."
      );
    });

    it("should reject full name longer than 60 characters", () => {
      const result = validateRegistration({
        fullName: "A".repeat(61),
        email: "hassan@example.com",
        password: "password123",
      });
      expect(result).to.equal(
        "Full name must contain between 3 and 60 characters."
      );
    });

    it("should reject invalid email", () => {
      const result = validateRegistration({
        fullName: "Muhammad Hassan",
        email: "invalid-email",
        password: "password123",
      });
      expect(result).to.equal(
        "Please provide a valid email address."
      );
    });

    it("should reject password shorter than 8 characters", () => {
      const result = validateRegistration({
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "pass12",
      });
      expect(result).to.equal(
        "Password must be at least 8 characters long."
      );
    });
  });

  describe("validateLogin", () => {
    it("should return null for valid login data", () => {
      const result = validateLogin({
        email: "hassan@example.com",
        password: "password123",
      });
      expect(result).to.be.null;
    });

    it("should reject missing request data", () => {
      const result = validateLogin();
      expect(result).to.equal("Invalid request data.");
    });

    it("should reject invalid email", () => {
      const result = validateLogin({
        email: "invalid-email",
        password: "password123",
      });
      expect(result).to.equal(
        "Please provide a valid email address."
      );
    });

    it("should reject empty password", () => {
      const result = validateLogin({
        email: "hassan@example.com",
        password: "",
      });
      expect(result).to.equal("Password is required.");
    });
  });
});
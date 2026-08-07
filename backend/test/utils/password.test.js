const { expect } = require("chai");
const AppError = require("../../src/utils/AppError");
const {
  hashPassword,
  comparePassword,
} = require("../../src/utils/password");

describe("Password Utility", () => {
  describe("hashPassword", () => {
    it("should hash a plain password", async () => {
      const password = "Password123";
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).to.be.a("string");
      expect(hashedPassword).to.not.equal(password);
    });

    it("should generate different hashes for the same password", async () => {
      const password = "Password123";
      const firstHash = await hashPassword(password);
      const secondHash = await hashPassword(password);
      expect(firstHash).to.not.equal(secondHash);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching passwords", async () => {
      const password = "Password123";
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(
        password,
        hashedPassword
      );
      expect(result).to.equal(true);
    });

    it("should return false for incorrect password", async () => {
      const hashedPassword = await hashPassword("Password123");
      const result = await comparePassword(
        "WrongPassword",
        hashedPassword
      );
      expect(result).to.equal(false);
    });

    it("should throw AppError when hashing fails", async () => {
      try {
        await hashPassword(undefined);
        throw new Error("Expected AppError was not thrown.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal(
          "Unable to process password."
        );
      }
    });

    it("should throw AppError when comparison fails", async () => {
      try {
        await comparePassword("Password123", undefined);
        throw new Error("Expected AppError was not thrown.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal(
          "Unable to process password."
        );
      }
    });
  });
});
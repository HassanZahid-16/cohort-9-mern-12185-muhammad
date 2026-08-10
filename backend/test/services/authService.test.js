const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../src/models/User");
const AppError = require("../../src/utils/AppError");
const {
  registerUser,
  loginUser,
} = require("../../src/services/authService");

describe("Auth Service", () => {
  afterEach(() => {
    sinon.restore();
  });
  
  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        fullName: "Muhammad Hassan",
        email: "[hassan@example.com](mailto:hassan@example.com)",
        password: "password123",
      };
      const hashedPassword = "hashed-password";
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves(hashedPassword);
      sinon.stub(User, "create").resolves({
        _id: "user-123",
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
      });
      try {
        const result = await registerUser(userData);
        expect(result).to.deep.equal({
          id: "user-123",
          fullName: "Muhammad Hassan",
          email: "[hassan@example.com](mailto:hassan@example.com)",
        });
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should reject registration when the email is already registered", async () => {
      sinon.stub(User, "findOne").resolves({
        _id: "existing-user",
        email: "[hassan@example.com](mailto:hassan@example.com)",
      });
      try {
        await registerUser({
          fullName: "Muhammad Hassan",
          email: "[hassan@example.com](mailto:hassan@example.com)",
          password: "password123",
        });
        expect.fail("Expected registerUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(409);
        expect(error.message).to.equal("Email is already registered.");
      }
    });

    it("should convert a duplicate key error into an AppError", async () => {
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves("hashed-password");
      const duplicateError = new Error("Duplicate email");
      duplicateError.code = 11000;
      sinon.stub(User, "create").rejects(duplicateError);
      try {
        await registerUser({
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
          password: "password123",
        });
        expect.fail("Expected registerUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(409);
        expect(error.message).to.equal("Email is already registered.");
      }
    });

    it("should return an internal error when registration fails unexpectedly", async () => {
      sinon.stub(User, "findOne").rejects(new Error("Database unavailable"));
      try {
        await registerUser({
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
          password: "password123",
        });
        expect.fail("Expected registerUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(500);
        expect(error.message).to.equal("Internal server error.");
      }
    });
  });

  describe("loginUser", () => {
    it("should login a user successfully", async () => {
      const user = {
        _id: "user-123",
        fullName: "Muhammad Hassan",
        email: "[hassan@example.com](mailto:hassan@example.com)",
        password: "hashed-password",
      };
      const selectStub = sinon.stub().resolves(user);
      sinon.stub(User, "findOne").returns({
        select: selectStub,
      });
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("jwt-token");
      try {
        const result = await loginUser({
          email: "[hassan@example.com](mailto:hassan@example.com)",
          password: "password123",
        });
        expect(result).to.deep.equal({
          token: "jwt-token",
          user: {
            id: "user-123",
            fullName: "Muhammad Hassan",
            email: "[hassan@example.com](mailto:hassan@example.com)",
          },
        });
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should reject login when the user does not exist", async () => {
      const selectStub = sinon.stub().resolves(null);
      sinon.stub(User, "findOne").returns({
        select: selectStub,
      });
      try {
        await loginUser({
          email: "unknown@example.com",
          password: "password123",
        });
        expect.fail("Expected loginUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(401);
        expect(error.message).to.equal("Invalid email or password.");
      }
    });

    it("should reject login when the password is incorrect", async () => {
      const user = {
        _id: "user-123",
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "hashed-password",
      };
      const selectStub = sinon.stub().resolves(user);
      sinon.stub(User, "findOne").returns({
        select: selectStub,
      });
      sinon.stub(bcrypt, "compare").resolves(false);
      try {
        await loginUser({
          email: "hassan@example.com",
          password: "wrong-password",
        });
        expect.fail("Expected loginUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(401);
        expect(error.message).to.equal("Invalid email or password.");
      }
    });

    it("should return an internal error when login fails unexpectedly", async () => {
      sinon.stub(User, "findOne").throws(new Error("Database unavailable"));
      try {
        await loginUser({
          email: "hassan@example.com",
          password: "password123",
        });
        expect.fail("Expected loginUser to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(500);
        expect(error.message).to.equal("Internal server error.");
      }
    });
  });
});
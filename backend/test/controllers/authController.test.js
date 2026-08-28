const { expect } = require("chai");
const sinon = require("sinon");

const authController = require("../../src/controllers/authController");
const authService = require("../../src/services/authService");

describe("Auth Controller", () => {
  let sandbox;
  let req;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      log: {
        info: sandbox.stub(),
      },
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis(),
      cookie: sandbox.stub().returnsThis(),
    };
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      req.body = {
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "password123",
      };
      const user = {
        id: "user123",
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
      };
      sandbox.stub(authService, "registerUser").resolves(user);
      await authController.register(req, res, next);
      expect(authService.registerUser.calledOnceWith(req.body)).to.equal(
        true
      );
      expect(res.status.calledOnceWith(201)).to.equal(true);
      expect(
        res.json.calledOnceWith({
          message: "User registered successfully.",
          user,
        })
      ).to.equal(true);
      expect(next.notCalled).to.equal(true);
    });

    it("should reject invalid registration data", async () => {
      req.body = {
        fullName: "Mu",
        email: "invalid-email",
        password: "123",
      };
      await authController.register(req, res, next);
      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(
        res.json.calledOnceWith({
          message: "Full name must contain between 3 and 60 characters.",
        })
      ).to.equal(true);
      expect(next.notCalled).to.equal(true);
    });

    it("should pass service errors to the error handler", async () => {
      req.body = {
        fullName: "Muhammad Hassan",
        email: "hassan@example.com",
        password: "password123",
      };
      const error = new Error("Registration failed.");
      sandbox.stub(authService, "registerUser").rejects(error);
      await authController.register(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
      expect(res.status.notCalled).to.equal(true);
      expect(res.json.notCalled).to.equal(true);
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      req.body = {
        email: "hassan@example.com",
        password: "password123",
      };
      const result = {
        token: "access-token",
        user: {
          id: "user123",
          fullName: "Muhammad Hassan",
          email: "hassan@example.com",
        },
      };
      sandbox.stub(authService, "loginUser").resolves(result);
      await authController.login(req, res, next);
      expect(authService.loginUser.calledOnceWith(req.body)).to.equal(
        true
      );
      expect(res.status.calledOnceWith(200)).to.equal(true);
      expect(
        res.json.calledOnceWith({
          message: "Login successful.",
          user: result.user,
        })
      ).to.equal(true);
      expect(res.cookie.calledTwice).to.equal(true);
      expect(
        res.cookie.firstCall.calledWith(
          "notes_app_token",
          result.token
        )
      ).to.equal(true);
      expect(
        res.cookie.secondCall.calledWith(
          "notes_app_csrf"
        )
      ).to.equal(true);
      expect(next.notCalled).to.equal(true);
    });

    it("should reject invalid login data", async () => {
      req.body = {
        email: "invalid-email",
        password: "",
      };
      await authController.login(req, res, next);
      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(
        res.json.calledOnceWith({
          message: "Please provide a valid email address.",
        })
      ).to.equal(true);
      expect(next.notCalled).to.equal(true);
    });

    it("should pass service errors to the error handler", async () => {
      req.body = {
        email: "hassan@example.com",
        password: "password123",
      };
      const error = new Error("Login failed.");
      sandbox.stub(authService, "loginUser").rejects(error);
      await authController.login(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
      expect(res.status.notCalled).to.equal(true);
      expect(res.json.notCalled).to.equal(true);
    });
  });
});
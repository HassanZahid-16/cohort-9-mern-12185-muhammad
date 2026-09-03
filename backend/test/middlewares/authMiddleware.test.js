const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authenticate = require("../../src/middlewares/authMiddleware");
const logger = require("../../src/config/logger");

describe("Auth Middleware", () => {
  let sandbox;
  let req;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      cookies: {},
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis(),
    };
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should reject a request with no token", () => {
    authenticate(req, res, next);
    expect(res.status.calledOnceWith(401)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "Authentication token is required.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });

  it("should attach the user and call next when the token is valid", () => {
    req.cookies.notes_app_token = "valid-token";
    sandbox.stub(jwt, "verify").returns({ userId: "user-123" });
    authenticate(req, res, next);
    expect(req.user).to.deep.equal({ id: "user-123" });
    expect(next.calledOnce).to.equal(true);
    expect(res.status.notCalled).to.equal(true);
  });

  it("should reject and log when the token is invalid or expired", () => {
    req.cookies.notes_app_token = "bad-token";
    const verifyError = new Error("jwt malformed");
    sandbox.stub(jwt, "verify").throws(verifyError);
    sandbox.stub(logger, "error");
    authenticate(req, res, next);
    expect(
      logger.error.calledOnceWith(
        { err: verifyError },
        "Authentication token verification failed"
      )
    ).to.equal(true);
    expect(res.status.calledOnceWith(401)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "Authentication token is invalid or expired.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });
});
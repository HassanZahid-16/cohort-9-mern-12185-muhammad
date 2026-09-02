const { expect } = require("chai");
const sinon = require("sinon");

const {
  csrfMiddleware,
  CSRF_COOKIE_NAME,
} = require("../../src/middlewares/csrfMiddleware");

describe("Csrf Middleware", () => {
  let sandbox;
  let req;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      cookies: {},
      get: sandbox.stub(),
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

  it("should reject a request with no csrf cookie", () => {
    csrfMiddleware(req, res, next);
    expect(res.status.calledOnceWith(403)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "CSRF token is required.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });

  it("should reject a request with no csrf header", () => {
    req.cookies[CSRF_COOKIE_NAME] = "cookie-token";
    req.get.returns(undefined);
    csrfMiddleware(req, res, next);
    expect(res.status.calledOnceWith(403)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "CSRF token is required.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });

  it("should reject a request when the tokens are different lengths", () => {
    req.cookies[CSRF_COOKIE_NAME] = "short-token";
    req.get.returns("a-much-longer-token-value");
    csrfMiddleware(req, res, next);
    expect(res.status.calledOnceWith(403)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "Invalid CSRF token.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });

  it("should reject a request when the tokens are the same length but do not match", () => {
    req.cookies[CSRF_COOKIE_NAME] = "aaaaaaaaaaaaaaaa";
    req.get.returns("bbbbbbbbbbbbbbbb");
    csrfMiddleware(req, res, next);
    expect(res.status.calledOnceWith(403)).to.equal(true);
    expect(
      res.json.calledOnceWith({
        message: "Invalid CSRF token.",
      })
    ).to.equal(true);
    expect(next.notCalled).to.equal(true);
  });

  it("should call next when the tokens match", () => {
    req.cookies[CSRF_COOKIE_NAME] = "matching-token-value";
    req.get.returns("matching-token-value");
    csrfMiddleware(req, res, next);
    expect(next.calledOnce).to.equal(true);
    expect(res.status.notCalled).to.equal(true);
  });
});
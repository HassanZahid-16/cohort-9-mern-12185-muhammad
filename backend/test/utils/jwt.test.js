const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../../src/utils/jwt");

describe("JWT Utility", () => {
  const originalSecret = process.env.JWT_SECRET;

  before(() => {
    process.env.JWT_SECRET = "test_secret_key";
  });

  after(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it("should generate a valid JWT token", () => {
    const token = generateAccessToken("user123");
    expect(token).to.be.a("string");
  });

  it("should contain the correct user id", () => {
    const token = generateAccessToken("user123");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    expect(decoded.userId).to.equal("user123");
  });

  it("should expire in seven days", () => {
    const token = generateAccessToken("user123");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const validityPeriod = decoded.exp - decoded.iat;
    expect(validityPeriod).to.equal(7 * 24 * 60 * 60);
  });
});
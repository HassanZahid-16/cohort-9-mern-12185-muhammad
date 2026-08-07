const { expect } = require("chai");

const User = require("../../src/models/User");

describe("User Model", () => {
  it("should create a valid user document", async () => {
    const user = new User({
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
      password: "password123",
    });
    const error = await user.validate().catch((error) => error);
    expect(error).to.be.undefined;
  });

  it("should require full name", async () => {
    const user = new User({
      email: "hassan@example.com",
      password: "password123",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.fullName).to.exist;
    expect(error.errors.fullName.message).to.equal(
      "Full name is required."
    );
  });

  it("should reject a full name shorter than 3 characters", async () => {
    const user = new User({
      fullName: "Hi",
      email: "hassan@example.com",
      password: "password123",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.fullName).to.exist;
  });

  it("should reject a full name longer than 60 characters", async () => {
    const user = new User({
      fullName: "A".repeat(61),
      email: "hassan@example.com",
      password: "password123",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.fullName).to.exist;
  });

  it("should require email", async () => {
    const user = new User({
      fullName: "Muhammad Hassan",
      password: "password123",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.email).to.exist;
    expect(error.errors.email.message).to.equal(
      "Email address is required."
    );
  });

  it("should require password", async () => {
    const user = new User({
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.password).to.exist;
    expect(error.errors.password.message).to.equal(
      "Password is required."
    );
  });

  it("should reject a password shorter than 8 characters", async () => {
    const user = new User({
      fullName: "Muhammad Hassan",
      email: "hassan@example.com",
      password: "1234567",
    });
    const error = await user.validate().catch((error) => error);
    expect(error.errors.password).to.exist;
  });

  it("should trim the full name and email", () => {
    const user = new User({
      fullName: "  Muhammad Hassan  ",
      email: "  hassan@example.com  ",
      password: "password123",
    });
    expect(user.fullName).to.equal("Muhammad Hassan");
    expect(user.email).to.equal("hassan@example.com");
  });

  it("should convert email to lowercase", () => {
    const user = new User({
      fullName: "Muhammad Hassan",
      email: "HASSAN@EXAMPLE.COM",
      password: "password123",
    });
    expect(user.email).to.equal("hassan@example.com");
  });

  it("should not select password by default", () => {
    const passwordPath = User.schema.path("password");
    expect(passwordPath.options.select).to.equal(false);
  });

  it("should enable timestamps", () => {
    expect(User.schema.options.timestamps).to.equal(true);
  });
});
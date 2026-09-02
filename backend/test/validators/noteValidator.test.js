const { expect } = require("chai");

const {
  validateNote,
} = require("../../src/validators/noteValidator");

describe("Note Validator", () => {
  it("should return null for a valid note", () => {
    const result = validateNote({
      title: "Shopping List",
      content: "Milk, Eggs, Bread",
    });
    expect(result).to.be.null;
  });

  it("should reject an empty title", () => {
    const result = validateNote({
      title: "",
      content: "Sample content",
    });
    expect(result).to.equal("Title is required.");
  });

  it("should reject a title longer than 120 characters", () => {
    const result = validateNote({
      title: "A".repeat(121),
      content: "Sample content",
    });
    expect(result).to.equal(
      "Title cannot exceed 120 characters."
    );
  });

  it("should reject an empty content", () => {
    const result = validateNote({
      title: "Shopping",
      content: "",
    });
    expect(result).to.equal("Content is required.");
  });

  it("should reject content longer than 10000 characters", () => {
    const result = validateNote({
      title: "Shopping",
      content: "A".repeat(10001),
    });
    expect(result).to.equal(
      "Content cannot exceed 10000 characters."
    );
  });

  it("should trim whitespace before validation", () => {
  const validResult = validateNote({
    title: "   Shopping   ",
    content: "   Buy milk   ",
  });
  expect(validResult).to.be.null;
  const whitespaceTitleResult = validateNote({
    title: "      ",
    content: "Sample content",
  });
  expect(whitespaceTitleResult).to.equal(
    "Title is required."
  );
  const boundaryTitleResult = validateNote({
    title: `${" ".repeat(5)}${"A".repeat(120)}${" ".repeat(5)}`,
    content: "Sample content",
  });
  expect(boundaryTitleResult).to.be.null;
});
});
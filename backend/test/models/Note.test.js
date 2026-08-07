const { expect } = require("chai");
const mongoose = require("mongoose");
const Note = require("../../src/models/Note");

describe("Note Model", () => {
  it("should create a valid note document", async () => {
    const note = new Note({
      title: "Test Note",
      content: "This is a test note.",
      owner: new mongoose.Types.ObjectId(),
    });
    const error = await note.validate().catch((error) => error);
    expect(error).to.be.undefined;
  });

  it("should require title", async () => {
    const note = new Note({
      content: "This is a test note.",
      owner: new mongoose.Types.ObjectId(),
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.title).to.exist;
    expect(error.errors.title.message).to.equal(
      "Title is required."
    );
  });

  it("should reject a title longer than 120 characters", async () => {
    const note = new Note({
      title: "A".repeat(121),
      content: "This is a test note.",
      owner: new mongoose.Types.ObjectId(),
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.title).to.exist;
  });

  it("should require content", async () => {
    const note = new Note({
      title: "Test Note",
      owner: new mongoose.Types.ObjectId(),
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.content).to.exist;
    expect(error.errors.content.message).to.equal(
      "Content is required."
    );
  });

  it("should reject content longer than 10000 characters", async () => {
    const note = new Note({
      title: "Test Note",
      content: "A".repeat(10001),
      owner: new mongoose.Types.ObjectId(),
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.content).to.exist;
  });

  it("should require owner", async () => {
    const note = new Note({
      title: "Test Note",
      content: "This is a test note.",
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.owner).to.exist;
  });

  it("should require owner to be an ObjectId", async () => {
    const note = new Note({
      title: "Test Note",
      content: "This is a test note.",
      owner: "invalid-owner-id",
    });
    const error = await note.validate().catch((error) => error);
    expect(error.errors.owner).to.exist;
  });

  it("should trim title and content", () => {
    const note = new Note({
      title: "  Test Note  ",
      content: "  This is a test note.  ",
      owner: new mongoose.Types.ObjectId(),
    });
    expect(note.title).to.equal("Test Note");
    expect(note.content).to.equal("This is a test note.");
  });

  it("should reference the User model through owner", () => {
    const ownerPath = Note.schema.path("owner");
    expect(ownerPath.options.ref).to.equal("User");
  });

  it("should enable timestamps", () => {
    expect(Note.schema.options.timestamps).to.equal(true);
  });

  it("should enable optimistic concurrency", () => {
    expect(Note.schema.options.optimisticConcurrency).to.equal(true);
  });
});
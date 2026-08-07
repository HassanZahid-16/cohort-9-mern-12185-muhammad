const { expect } = require("chai");
const sinon = require("sinon");

const Note = require("../../src/models/Note");
const AppError = require("../../src/utils/AppError");
const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../../src/services/noteService");

describe("Note Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createNote", () => {
    it("should create and return a note successfully", async () => {
      const note = {
        _id: "note-123",
        title: "First Note",
        content: "This is my first note.",
        owner: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      sinon.stub(Note, "create").resolves(note);
      const result = await createNote({
        title: note.title,
        content: note.content,
        owner: note.owner,
      });
      expect(result).to.deep.equal({
        id: note._id,
        title: note.title,
        content: note.content,
        owner: note.owner,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
    });

    it("should return an AppError when note validation fails", async () => {
      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";
      sinon.stub(Note, "create").rejects(validationError);
      try {
        await createNote({
          title: "",
          content: "Testing",
          owner: "user-123",
        });
        expect.fail("Expected createNote to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal("Unable to create note.");
      }
    });
  });

  describe("getUserNotes", () => {
    it("should return notes belonging to the user", async () => {
      const notes = [
        {
          _id: "note-1",
          title: "First Note",
          content: "First content",
          owner: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "note-2",
          title: "Second Note",
          content: "Second content",
          owner: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const leanStub = sinon.stub().resolves(notes);
      const sortStub = sinon.stub().returns({
        lean: leanStub,
      });
      sinon.stub(Note, "find").returns({
        sort: sortStub,
      });
      const result = await getUserNotes("user-123");
      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal("note-1");
      expect(result[1].id).to.equal("note-2");
      expect(sortStub.calledWith({ updatedAt: -1 })).to.equal(true);
    });

    it("should convert a cast error into an AppError", async () => {
      const castError = new Error("Invalid owner");
      castError.name = "CastError";
      const leanStub = sinon.stub().rejects(castError);
      const sortStub = sinon.stub().returns({
        lean: leanStub,
      });
      sinon.stub(Note, "find").returns({
        sort: sortStub,
      });
      try {
        await getUserNotes("invalid-owner");
        expect.fail("Expected getUserNotes to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal(
          "Invalid user information."
        );
      }
    });
  });

  describe("getNoteById", () => {
    it("should return a note when the id and owner match", async () => {
      const note = {
        _id: "note-123",
        title: "First Note",
        content: "Note content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const leanStub = sinon.stub().resolves(note);
      sinon.stub(Note, "findOne").returns({
        lean: leanStub,
      });
      const result = await getNoteById({
        noteId: "507f1f77bcf86cd799439011",
        owner: "507f1f77bcf86cd799439012",
      });
      expect(result.id).to.equal("note-123");
      expect(result.title).to.equal("First Note");
      expect(result.content).to.equal("Note content");
    });

    it("should reject an invalid note id", async () => {
      try {
        await getNoteById({
          noteId: "invalid-id",
          owner: "507f1f77bcf86cd799439012",
        });
        expect.fail("Expected getNoteById to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(400);
        expect(error.message).to.equal("Invalid note id.");
      }
    });

    it("should return an error when the note does not exist", async () => {
      const leanStub = sinon.stub().resolves(null);
      sinon.stub(Note, "findOne").returns({
        lean: leanStub,
      });
      try {
        await getNoteById({
          noteId: "507f1f77bcf86cd799439011",
          owner: "507f1f77bcf86cd799439012",
        });
        expect.fail("Expected getNoteById to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(404);
        expect(error.message).to.equal("Note not found.");
      }
    });
  });

  describe("updateNote", () => {
    it("should update a note successfully", async () => {
      const note = {
        _id: "note-123",
        title: "Old title",
        content: "Old content",
        createdAt: new Date(),
        updatedAt: new Date(),
        save: sinon.stub().resolves(),
      };
      sinon.stub(Note, "findOne").resolves(note);
      const result = await updateNote({
        noteId: "507f1f77bcf86cd799439011",
        owner: "507f1f77bcf86cd799439012",
        title: "Updated title",
        content: "Updated content",
      });
      expect(note.title).to.equal("Updated title");
      expect(note.content).to.equal("Updated content");
      expect(note.save.calledOnce).to.equal(true);
      expect(result.id).to.equal("note-123");
      expect(result.title).to.equal("Updated title");
      expect(result.content).to.equal("Updated content");
    });

    it("should return an error when the note to update does not exist", async () => {
      sinon.stub(Note, "findOne").resolves(null);
      try {
        await updateNote({
          noteId: "507f1f77bcf86cd799439011",
          owner: "507f1f77bcf86cd799439012",
          title: "Updated title",
          content: "Updated content",
        });
        expect.fail("Expected updateNote to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(404);
        expect(error.message).to.equal("Note not found.");
      }
    });

    it("should handle a concurrent update conflict", async () => {
      const note = {
        _id: "note-123",
        title: "Old title",
        content: "Old content",
        save: sinon.stub().rejects({
          name: "VersionError",
        }),
      };
      sinon.stub(Note, "findOne").resolves(note);
      try {
        await updateNote({
          noteId: "507f1f77bcf86cd799439011",
          owner: "507f1f77bcf86cd799439012",
          title: "Updated title",
          content: "Updated content",
        });
        expect.fail("Expected updateNote to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(409);
        expect(error.message).to.equal(
          "The note was modified by another request."
        );
      }
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", async () => {
      const note = {
        _id: "note-123",
        deleteOne: sinon.stub().resolves(),
      };
      sinon.stub(Note, "findOne").resolves(note);
      const result = await deleteNote({
        noteId: "507f1f77bcf86cd799439011",
        owner: "507f1f77bcf86cd799439012",
      });
      expect(note.deleteOne.calledOnce).to.equal(true);
      expect(result).to.deep.equal({
        message: "Note deleted successfully.",
      });
    });

    it("should return an error when the note to delete does not exist", async () => {
      sinon.stub(Note, "findOne").resolves(null);
      try {
        await deleteNote({
          noteId: "507f1f77bcf86cd799439011",
          owner: "507f1f77bcf86cd799439012",
        });
        expect.fail("Expected deleteNote to throw an error.");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(404);
        expect(error.message).to.equal("Note not found.");
      }
    });
  });
});
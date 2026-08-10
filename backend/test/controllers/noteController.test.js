const { expect } = require("chai");
const sinon = require("sinon");

const noteController = require("../../src/controllers/noteController");
const noteService = require("../../src/services/noteService");

describe("Note Controller", () => {
  let sandbox;
  let req;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      user: {
        id: "user123",
      },
      log: {
        info: sandbox.stub(),
      },
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

  describe("create", () => {
    it("should create a note successfully", async () => {
      req.body = {
        title: "  Test Note  ",
        content: "  Note content  ",
      };
      const note = {
        id: "note123",
        title: "Test Note",
        content: "Note content",
        owner: "user123",
      };
      sandbox.stub(noteService, "createNote").resolves(note);
      try {
        await noteController.create(req, res, next);
        expect(
          noteService.createNote.calledOnceWith({
            title: "Test Note",
            content: "Note content",
            owner: "user123",
          })
        ).to.equal(true);
        expect(res.status.calledOnceWith(201)).to.equal(true);
        expect(
          res.json.calledOnceWith({
            message: "Note created successfully.",
            note,
          })
        ).to.equal(true);
        expect(next.notCalled).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should reject invalid note data", async () => {
      req.body = {
        title: "",
        content: "Some content",
      };
      await noteController.create(req, res, next);
      expect(next.calledOnce).to.equal(true);
      const error = next.firstCall.args[0];
      expect(error.message).to.equal("Title is required.");
      expect(error.statusCode).to.equal(400);
      expect(next.calledOnce).to.equal(true);
    });

    it("should pass service errors to the error handler", async () => {
      req.body = {
        title: "Test Note",
        content: "Note content",
      };
      const error = new Error("Note creation failed.");
      sandbox.stub(noteService, "createNote").rejects(error);
      await noteController.create(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
      expect(res.status.notCalled).to.equal(true);
      expect(res.json.notCalled).to.equal(true);
    });
  });

  describe("getAll", () => {
    it("should return all notes belonging to the user", async () => {
      const notes = [
        {
          id: "note123",
          title: "First Note",
          content: "First content",
        },
        {
          id: "note456",
          title: "Second Note",
          content: "Second content",
        },
      ];
      sandbox.stub(noteService, "getUserNotes").resolves(notes);
      try {
        await noteController.getAll(req, res, next);
        expect(noteService.getUserNotes.calledOnceWith("user123")).to.equal(
          true
        );
        expect(res.status.calledOnceWith(200)).to.equal(true);
        expect(res.json.calledOnceWith({ notes })).to.equal(true);
        expect(next.notCalled).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should pass service errors to the error handler", async () => {
      const error = new Error("Unable to fetch notes.");
      sandbox.stub(noteService, "getUserNotes").rejects(error);
      await noteController.getAll(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
    });
  });

  describe("getById", () => {
    it("should return a note by id", async () => {
      req.params.id = "note123";
      const note = {
        id: "note123",
        title: "Test Note",
        content: "Note content",
      };
      sandbox.stub(noteService, "getNoteById").resolves(note);
      try {
        await noteController.getById(req, res, next);
        expect(
          noteService.getNoteById.calledOnceWith({
            noteId: "note123",
            owner: "user123",
          })
        ).to.equal(true);
        expect(res.status.calledOnceWith(200)).to.equal(true);
        expect(res.json.calledOnceWith({ note })).to.equal(true);
        expect(next.notCalled).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should pass service errors to the error handler", async () => {
      req.params.id = "invalid-id";
      const error = new Error("Invalid note id.");
      sandbox.stub(noteService, "getNoteById").rejects(error);
      await noteController.getById(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
    });
  });

  describe("update", () => {
    it("should update a note successfully", async () => {
      req.params.id = "note123";
      req.body = {
        title: "  Updated Note  ",
        content: "  Updated content  ",
      };
      const note = {
        id: "note123",
        title: "Updated Note",
        content: "Updated content",
      };
      sandbox.stub(noteService, "updateNote").resolves(note);
      try {
        await noteController.update(req, res, next);
        expect(
          noteService.updateNote.calledOnceWith({
            noteId: "note123",
            owner: "user123",
            title: "Updated Note",
            content: "Updated content",
          })
        ).to.equal(true);
        expect(res.status.calledOnceWith(200)).to.equal(true);
        expect(
          res.json.calledOnceWith({
            message: "Note updated successfully.",
            note,
          })
        ).to.equal(true);
        expect(next.notCalled).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should reject invalid note data", async () => {
      req.params.id = "note123";
      req.body = {
        title: "",
        content: "Updated content",
      };
      await noteController.update(req, res, next);
      expect(next.calledOnce).to.equal(true);
      const error = next.firstCall.args[0];
      expect(error.message).to.equal("Title is required.");
      expect(error.statusCode).to.equal(400);
    });

    it("should pass service errors to the error handler", async () => {
      req.params.id = "note123";
      req.body = {
        title: "Updated Note",
        content: "Updated content",
      };
      const error = new Error("Note update failed.");
      sandbox.stub(noteService, "updateNote").rejects(error);
      await noteController.update(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
    });
  });

  describe("remove", () => {
    it("should delete a note successfully", async () => {
      req.params.id = "note123";
      const result = {
        message: "Note deleted successfully.",
      };
      sandbox.stub(noteService, "deleteNote").resolves(result);
      try {
        await noteController.remove(req, res, next);
        expect(
          noteService.deleteNote.calledOnceWith({
            noteId: "note123",
            owner: "user123",
          })
        ).to.equal(true);
        expect(res.status.calledOnceWith(200)).to.equal(true);
        expect(res.json.calledOnceWith(result)).to.equal(true);
        expect(next.notCalled).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });

    it("should pass service errors to the error handler", async () => {
      req.params.id = "note123";
      const error = new Error("Note deletion failed.");
      sandbox.stub(noteService, "deleteNote").rejects(error);
      await noteController.remove(req, res, next);
      expect(next.calledOnceWith(error)).to.equal(true);
    });
  });
});